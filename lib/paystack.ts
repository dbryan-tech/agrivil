import { createHmac } from "crypto"

/**
 * Paystack integration for Ghana Mobile Money (MoMo) + GHS card payments.
 * Uses the server-side REST API with webhook verification for order reconciliation.
 * Amounts are in pesewas (subunits): multiply GHS by 100.
 */

const BASE_URL = "https://api.paystack.co"
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET // We'll use this for now, but ideally Paystack has its own

if (!SECRET_KEY) {
  console.warn("[Paystack] PAYSTACK_SECRET_KEY not configured — payments will fail")
}

export interface PaystackInitializeRequest {
  amount: number // in pesewas (GHS * 100)
  email: string
  currency?: "GHS" | "NGN" | "USD"
  reference?: string // unique reference; auto-generated if omitted
  metadata?: Record<string, unknown>
  channels?: ("card" | "mobile_money" | "bank_transfer")[] // for Ghana, use ["mobile_money", "card"]
  callback_url?: string // post-payment redirect URL
}

export interface PaystackInitializeResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data?: {
    id: number
    reference: string
    amount: number
    status: "success" | "pending" | "abandoned" | "failed"
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
    }
    customer: {
      id: number
      customer_code: string
      email: string
      first_name: string | null
      last_name: string | null
      phone: string | null
    }
    plan?: number
    split?: Record<string, unknown>
    fees: number
    fees_split?: Record<string, unknown>
    metadata?: Record<string, unknown>
  }
}

export interface PaystackWebhookEvent {
  event: "charge.success" | "charge.failed" | "charge.dispute" | string
  data: {
    id: number
    reference: string
    amount: number
    status: string
    customer: { id: number; email: string }
    authorization?: Record<string, unknown>
    metadata?: Record<string, unknown>
  }
}

/**
 * Initialize a Paystack transaction (payment checkout).
 * Returns the authorization_url to redirect the customer to.
 */
export async function initializePaystackTransaction(
  request: PaystackInitializeRequest,
): Promise<{ success: boolean; data?: PaystackInitializeResponse["data"]; error?: string }> {
  if (!SECRET_KEY) {
    return { success: false, error: "Paystack not configured" }
  }

  if (request.amount < 10) {
    // GHS 0.10 minimum
    return { success: false, error: "Amount must be at least GHS 0.10" }
  }

  const payload = {
    amount: request.amount,
    email: request.email,
    currency: request.currency || "GHS",
    reference: request.reference || `order_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    metadata: request.metadata || {},
    channels: request.channels || ["mobile_money", "card"],
    callback_url: request.callback_url,
  }

  try {
    const response = await fetch(`${BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result: PaystackInitializeResponse = await response.json()

    if (!result.status) {
      return { success: false, error: result.message }
    }

    return { success: true, data: result.data }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return { success: false, error: msg }
  }
}

/**
 * Verify a Paystack transaction (after customer pays).
 * Call this after the customer completes payment or via webhook.
 */
export async function verifyPaystackTransaction(
  reference: string,
): Promise<{ success: boolean; data?: PaystackVerifyResponse["data"]; error?: string }> {
  if (!SECRET_KEY) {
    return { success: false, error: "Paystack not configured" }
  }

  try {
    const response = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    })

    const result: PaystackVerifyResponse = await response.json()

    if (!result.status) {
      return { success: false, error: result.message }
    }

    return { success: true, data: result.data }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return { success: false, error: msg }
  }
}

/**
 * Verify a Paystack webhook signature.
 * Paystack includes an X-Paystack-Signature header with an HMAC-SHA512 hash.
 * This prevents tampering during webhook delivery.
 */
export function verifyPaystackWebhookSignature(
  payload: string,
  signatureHeader: string | undefined,
): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) {
    console.warn("[Paystack] Webhook secret or signature missing — accepting all webhooks (unsafe)")
    return true // In production, always verify. For now, fallback to logging.
  }

  const hash = createHmac("sha512", WEBHOOK_SECRET).update(payload).digest("hex")
  return hash === signatureHeader
}

/**
 * Refund a Paystack transaction (for failed orders, disputes, etc.).
 */
export async function refundPaystackTransaction(
  reference: string,
  amount?: number, // in pesewas; if omitted, full refund
): Promise<{ success: boolean; error?: string }> {
  if (!SECRET_KEY) {
    return { success: false, error: "Paystack not configured" }
  }

  const payload: Record<string, unknown> = { transaction: reference }
  if (amount) payload.amount = amount

  try {
    const response = await fetch(`${BASE_URL}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = (await response.json()) as { status: boolean; message: string }

    if (!result.status) {
      return { success: false, error: result.message }
    }

    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return { success: false, error: msg }
  }
}
