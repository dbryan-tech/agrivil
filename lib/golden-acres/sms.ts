import { sendSMS, sendSMSDev, type SendSMSResult as AdapterResult } from "@/lib/sms-adapter"

/**
 * SMS provider seam — real multi-provider (Arkesel → Hubtel fallback) or simulated.
 * Customer delivery notifications fan out over two channels: the DB-backed
 * in-app bell feed (always written) and SMS. Ghana's common transactional SMS
 * providers (Arkesel, Hubtel) are tried in sequence, with automatic fallback.
 * In dev/demo (no credentials) we "send" by logging and returning a synthetic id.
 */

export type SmsSendResult =
  | { ok: boolean; status: "sent" | "failed"; id: string; provider?: string; error?: string }

/**
 * Normalise a Ghana phone number to E.164 format.
 * Handles local format (024..., 0244..., etc.) and international.
 */
export function toE164Ghana(raw: string): string | null {
  if (!raw) return null
  let d = raw.replace(/[^\d+]/g, "")
  if (d.startsWith("+")) {
    d = "+" + d.slice(1).replace(/\D/g, "")
    return /^\+\d{8,15}$/.test(d) ? d : null
  }
  d = d.replace(/\D/g, "")
  if (d.startsWith("233")) return "+" + d
  if (d.startsWith("0")) return "+233" + d.slice(1) // local 0XX… -> +233XX…
  if (d.length === 9) return "+233" + d // bare 9-digit
  return null
}

/**
 * Send a transactional SMS with automatic Arkesel → Hubtel fallback.
 * Always resolves (never throws) so notification fan-out is resilient.
 */
export async function sendSms(toRaw: string, message: string): Promise<SmsSendResult> {
  const to = toE164Ghana(toRaw)
  if (!to) {
    return {
      ok: false,
      status: "failed",
      error: "Invalid phone number",
      provider: "none",
      id: "err-" + crypto.randomUUID(),
    }
  }

  // Check if any real provider is configured
  const hasArkesel = !!(process.env.ARKESEL_API_KEY && process.env.ARKESEL_SENDER_ID)
  const hasHubtel = !!(process.env.HUBTEL_CLIENT_ID && process.env.HUBTEL_CLIENT_SECRET)

  if (!hasArkesel && !hasHubtel) {
    // No credentials — use dev mode
    const result = await sendSMSDev({ phone: to, message })
    return {
      ok: result.success,
      status: result.success ? ("sent" as const) : ("failed" as const),
      id: result.messageId || "dev-" + crypto.randomUUID(),
      provider: "dev" as unknown as string,
    }
  }

  // Try real providers with fallback
  const result = await sendSMS({ phone: to, message })
  return {
    ok: result.success,
    status: result.success ? ("sent" as const) : ("failed" as const),
    id: result.messageId || crypto.randomUUID(),
    provider: (result.provider || "unknown") as unknown as string,
  }
}
