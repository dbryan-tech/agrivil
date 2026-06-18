// Mobile Money (MoMo) payout seam — simulated, provider-ready.
// -----------------------------------------------------------------------------
// Farmer settlements are disbursed to Mobile Money wallets. Ghana's MoMo
// disbursement APIs (MTN MoMo Disbursements, Hubtel, Paystack Transfers) share
// the same shape: POST a {amount, recipient, reference} payload with an API key
// and get back a transaction id / status. We model that behind a single
// `sendMomoPayout()` function so a real provider can be dropped in by setting
// env vars — no call-site changes.
//
// In dev / demo (no credentials) we "disburse" by logging and returning a
// synthetic transaction id, with a tiny deterministic failure simulation so the
// payout pipeline's failure handling is exercisable without a real gateway.

import type { MomoProvider } from "@/lib/golden-acres/types"

export type MomoPayoutResult =
  | { ok: true; status: "paid"; transactionId: string; provider: string }
  | { ok: false; status: "failed"; error: string; provider: string }

function activeProvider(): "mtn" | "hubtel" | "simulated" {
  if (process.env.MTN_MOMO_SUBSCRIPTION_KEY && process.env.MTN_MOMO_API_USER) return "mtn"
  if (process.env.HUBTEL_CLIENT_ID && process.env.HUBTEL_CLIENT_SECRET) return "hubtel"
  return "simulated"
}

/** Mask a MoMo number for display/storage, e.g. "0241234567" -> "024•••4567". */
export function maskMomoNumber(raw: string): string {
  const d = (raw || "").replace(/\D/g, "")
  if (d.length < 7) return raw
  return `${d.slice(0, 3)}•••${d.slice(-4)}`
}

// ---- payout policy + math ---------------------------------------------------
// Lives here (a plain module) rather than the "use server" payouts file, which
// may only export async functions.
export const COMMISSION_RATE = 0.15 // platform commission on gross produce value
export const FARMER_FAULT_PENALTY_RATE = 0.05 // SOP penalty when fault === 'Farmer'
export const PAYOUT_GUARANTEE_HOURS = 48 // farmers are paid within 48h of delivery

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Net payout math for a farmer's slice of an order.
 * net = gross − commission(15%) − sopPenalty(5% of gross when farmer at fault).
 */
export function computePayout(gross: number, farmerAtFault: boolean) {
  const commission = round2(gross * COMMISSION_RATE)
  const sopPenalty = farmerAtFault ? round2(gross * FARMER_FAULT_PENALTY_RATE) : 0
  const netPayout = round2(gross - commission - sopPenalty)
  return { commission, sopPenalty, netPayout }
}

export interface MomoPayoutInput {
  amount: number // GH₵
  provider: MomoProvider
  number: string // destination MoMo number (raw)
  reference: string // our payout reference (ledger/batch derived)
  recipientName?: string
}

/**
 * Disburse a MoMo payout. Always resolves (never throws) so a settlement run
 * can record per-entry success/failure and keep processing the rest.
 */
export async function sendMomoPayout(input: MomoPayoutInput): Promise<MomoPayoutResult> {
  const provider = activeProvider()
  const number = (input.number || "").replace(/\D/g, "")

  if (!number || number.length < 9) {
    return { ok: false, status: "failed", error: "Invalid MoMo number", provider }
  }
  if (!(input.amount > 0)) {
    return { ok: false, status: "failed", error: "Non-positive payout amount", provider }
  }

  try {
    if (provider === "mtn") {
      const res = await fetch(
        `${process.env.MTN_MOMO_BASE_URL ?? "https://proxy.momoapi.mtn.com"}/disbursement/v1_0/transfer`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUBSCRIPTION_KEY as string,
            "X-Reference-Id": input.reference,
            "X-Target-Environment": process.env.MTN_MOMO_ENV ?? "mtnghana",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: input.amount.toFixed(2),
            currency: "GHS",
            externalId: input.reference,
            payee: { partyIdType: "MSISDN", partyId: number },
            payerMessage: "AgriVil farmer payout",
            payeeNote: "AgriVil farmer payout",
          }),
        },
      )
      if (!res.ok) return { ok: false, status: "failed", error: `MTN ${res.status}`, provider }
      return { ok: true, status: "paid", transactionId: input.reference, provider }
    }

    if (provider === "hubtel") {
      const auth = Buffer.from(
        `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`,
      ).toString("base64")
      const res = await fetch("https://api.hubtel.com/v1/merchantaccount/send/mobilemoney", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          RecipientName: input.recipientName ?? "AgriVil Farmer",
          RecipientMsisdn: number,
          CustomerEmail: "payouts@agrivil.app",
          Channel: input.provider.toLowerCase().includes("mtn") ? "mtn-gh" : "vodafone-gh",
          Amount: input.amount,
          PrimaryCallbackUrl: process.env.HUBTEL_PAYOUT_CALLBACK ?? "https://agrivil.app/api/momo/callback",
          ClientReference: input.reference,
        }),
      })
      if (!res.ok) return { ok: false, status: "failed", error: `Hubtel ${res.status}`, provider }
      const data = (await res.json().catch(() => ({}))) as { Data?: { TransactionId?: string } }
      return {
        ok: true,
        status: "paid",
        transactionId: data?.Data?.TransactionId ?? input.reference,
        provider,
      }
    }

    // Simulated provider. Deterministically fail numbers ending in "0000" so the
    // failure path stays demoable; everything else "settles" successfully.
    if (number.endsWith("0000")) {
      return {
        ok: false,
        status: "failed",
        error: "Recipient wallet unreachable (simulated)",
        provider,
      }
    }
    console.log(
      `[v0] MoMo payout (simulated → ${maskMomoNumber(number)} / ${input.provider}): GH₵${input.amount.toFixed(2)} ref ${input.reference}`,
    )
    return { ok: true, status: "paid", transactionId: `sim_${crypto.randomUUID()}`, provider }
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      error: e instanceof Error ? e.message : "MoMo dispatch error",
      provider,
    }
  }
}
