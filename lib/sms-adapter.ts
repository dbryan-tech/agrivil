/**
 * Multi-provider SMS adapter: try Arkesel first, fallback to Hubtel.
 * Both providers support Ghana mobile money networks (MTN, Telecel, Airtel).
 * This ensures SMS delivery is reliable even if one provider has issues.
 */

export interface SendSMSOptions {
  phone: string // E.164 format or Ghana number (0244..., 0244..., 024...)
  message: string
}

export interface SendSMSResult {
  success: boolean
  messageId?: string
  provider?: "arkesel" | "hubtel" | "dev"
  error?: string
}

/** Normalize to E.164 format for consistency. */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "")
  // Ghana numbers: if it starts with 0, replace with 233; if not, prepend 233
  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.slice(1)
  } else if (!cleaned.startsWith("233")) {
    cleaned = "233" + cleaned
  }
  return "+" + cleaned
}

/** Send via Arkesel (primary). */
async function sendViaArkesel(opts: SendSMSOptions): Promise<SendSMSResult> {
  if (!process.env.ARKESEL_API_KEY || !process.env.ARKESEL_SENDER_ID) {
    return { success: false, error: "Arkesel credentials not configured" }
  }

  try {
    const phone = normalizePhone(opts.phone)
    const response = await fetch("https://api.arkesel.com/api/v1/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ARKESEL_API_KEY}`,
      },
      body: JSON.stringify({
        recipients: [phone],
        sender_id: process.env.ARKESEL_SENDER_ID,
        message: opts.message,
      }),
    })

    const data = (await response.json()) as { success?: boolean; message?: string; status?: string }
    if (!response.ok || data.status === "failed") {
      throw new Error(data.message || `HTTP ${response.status}`)
    }

    return {
      success: true,
      messageId: String(data.message || ""),
      provider: "arkesel",
    }
  } catch (error) {
    console.error("[SMS] Arkesel failed:", error instanceof Error ? error.message : String(error))
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/** Send via Hubtel (fallback). */
async function sendViaHubtel(opts: SendSMSOptions): Promise<SendSMSResult> {
  if (!process.env.HUBTEL_CLIENT_ID || !process.env.HUBTEL_CLIENT_SECRET) {
    return { success: false, error: "Hubtel credentials not configured" }
  }

  try {
    const phone = normalizePhone(opts.phone)

    // Hubtel uses HTTP Basic Auth
    const credentials = btoa(`${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`)

    const response = await fetch("https://smpp-http-api.hubtel.com/v1/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        To: phone,
        From: process.env.HUBTEL_SENDER_ID || "AgriVil",
        Content: opts.message,
        // DLR = delivery receipt; we don't handle them here but they're useful for monitoring
        ClientReference: `otp-${Date.now()}`,
      }),
    })

    const data = (await response.json()) as {
      Status?: string
      MessageId?: string
      Message?: string
    }

    if (!response.ok || data.Status !== "0") {
      throw new Error(data.Message || `HTTP ${response.status}`)
    }

    return {
      success: true,
      messageId: data.MessageId,
      provider: "hubtel",
    }
  } catch (error) {
    console.error("[SMS] Hubtel failed:", error instanceof Error ? error.message : String(error))
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Try Arkesel first, fallback to Hubtel.
 * Returns success only if at least one provider succeeded.
 */
export async function sendSMS(opts: SendSMSOptions): Promise<SendSMSResult> {
  if (!opts.phone || !opts.message) {
    return { success: false, error: "Missing phone or message" }
  }

  // Try Arkesel first
  const arkeselResult = await sendViaArkesel(opts)
  if (arkeselResult.success) {
    return arkeselResult
  }

  console.warn("[SMS] Arkesel failed, trying Hubtel...")

  // Fallback to Hubtel
  const hubtelResult = await sendViaHubtel(opts)
  if (hubtelResult.success) {
    return hubtelResult
  }

  // Both failed
  return {
    success: false,
    error: `All SMS providers failed: Arkesel (${arkeselResult.error}), Hubtel (${hubtelResult.error})`,
  }
}

/** Development/test fallback: log instead of sending (when creds are absent). */
export async function sendSMSDev(opts: SendSMSOptions): Promise<SendSMSResult> {
  console.log(
    `[SMS] DEV MODE: To ${opts.phone}\n${opts.message}\n---`,
  )
  return {
    success: true,
    messageId: `dev-${Date.now()}`,
    provider: "dev",
  }
}
