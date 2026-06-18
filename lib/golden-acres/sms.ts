// SMS provider seam — simulated, provider-ready.
// -----------------------------------------------------------------------------
// Customer delivery notifications fan out over two channels: the DB-backed
// in-app bell feed (always written) and SMS. Ghana's common transactional SMS
// providers (Arkesel, Hubtel) share the same shape: POST a {to, message, sender}
// payload with an API key and get back a message id / status. We model that
// behind a single `sendSms()` function so a real provider can be dropped in by
// setting env vars — no call-site changes.
//
// In dev / demo (no credentials) we "send" by logging and returning a synthetic
// id, so the whole notification pipeline is exercisable end to end without a
// real gateway or spending SMS credits.

export type SmsSendResult =
  | { ok: true; status: "sent"; id: string; provider: string }
  | { ok: false; status: "failed"; error: string; provider: string }

const SENDER_ID = process.env.SMS_SENDER_ID ?? "AgriVil"

// Which provider is configured. Defaults to the simulator until real
// credentials are present, at which point the matching branch in `sendSms`
// activates automatically.
function activeProvider(): "arkesel" | "hubtel" | "simulated" {
  if (process.env.ARKESEL_API_KEY) return "arkesel"
  if (process.env.HUBTEL_CLIENT_ID && process.env.HUBTEL_CLIENT_SECRET) return "hubtel"
  return "simulated"
}

/**
 * Normalise a Ghana phone number to E.164 (e.g. "+233 24 555 0142" ->
 * "+233245550142", "024 555 0142" -> "+233245550142"). Returns null if it
 * can't be coerced into a plausible MSISDN.
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
  if (d.length === 9) return "+233" + d // bare 9-digit subscriber number
  return null
}

/**
 * Send a transactional SMS. Always resolves (never throws) so notification
 * fan-out is resilient — a failed SMS still leaves the in-app notification.
 */
export async function sendSms(toRaw: string, message: string): Promise<SmsSendResult> {
  const provider = activeProvider()
  const to = toE164Ghana(toRaw)

  if (!to) {
    return { ok: false, status: "failed", error: "Invalid phone number", provider }
  }

  try {
    if (provider === "arkesel") {
      const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
        method: "POST",
        headers: {
          "api-key": process.env.ARKESEL_API_KEY as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: SENDER_ID, message, recipients: [to.replace("+", "")] }),
      })
      if (!res.ok) {
        return { ok: false, status: "failed", error: `Arkesel ${res.status}`, provider }
      }
      const data = (await res.json().catch(() => ({}))) as { data?: { id?: string } }
      return { ok: true, status: "sent", id: data?.data?.id ?? crypto.randomUUID(), provider }
    }

    if (provider === "hubtel") {
      const auth = Buffer.from(
        `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`,
      ).toString("base64")
      const res = await fetch("https://sms.hubtel.com/v1/messages/send", {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({ From: SENDER_ID, To: to, Content: message }),
      })
      if (!res.ok) {
        return { ok: false, status: "failed", error: `Hubtel ${res.status}`, provider }
      }
      const data = (await res.json().catch(() => ({}))) as { MessageId?: string }
      return { ok: true, status: "sent", id: data?.MessageId ?? crypto.randomUUID(), provider }
    }

    // Simulated provider — log and succeed so the pipeline is fully testable.
    console.log(`[v0] SMS (simulated → ${to}) [${SENDER_ID}]: ${message}`)
    return { ok: true, status: "sent", id: `sim_${crypto.randomUUID()}`, provider }
  } catch (e) {
    return {
      ok: false,
      status: "failed",
      error: e instanceof Error ? e.message : "SMS dispatch error",
      provider,
    }
  }
}
