import { verifyPaystackWebhookSignature, type PaystackWebhookEvent } from "@/lib/paystack"
import { updateOrderStatus } from "@/app/actions/orders"

/**
 * Paystack webhook: reconciles MoMo + card payments with orders.
 * Paystack delivers a JSON POST to this endpoint when a transaction completes.
 * We verify the signature, extract the reference (our order ID), and mark the order paid.
 */

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("x-paystack-signature") || ""

  // Verify the webhook came from Paystack (not a spoof)
  if (!verifyPaystackWebhookSignature(payload, signature)) {
    console.warn("[Paystack] Invalid webhook signature — rejecting")
    return new Response("Unauthorized", { status: 401 })
  }

  let event: PaystackWebhookEvent
  try {
    event = JSON.parse(payload)
  } catch {
    console.error("[Paystack] Failed to parse webhook payload")
    return new Response("Bad request", { status: 400 })
  }

  console.log(`[Paystack] Webhook: ${event.event}`, event.data.reference)

  // Only process successful charges
  if (event.event === "charge.success" && event.data.status === "success") {
    const orderId = event.data.reference // we set this to the order ID during init
    const amount = event.data.amount // in pesewas

    try {
      // Mark the order as paid in the database
      await updateOrderStatus(orderId, "paid", {
        paymentRef: event.data.reference,
        amount,
        gateway: "paystack",
      })

      console.log(`[Paystack] Order ${orderId} marked paid`)
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (error) {
      console.error(`[Paystack] Failed to update order ${orderId}:`, error)
      // Return 200 anyway so Paystack stops retrying
      // The order will be manually reconciled later if needed
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }
  }

  // Log other events for debugging (failed charges, disputes, etc.)
  if (event.event === "charge.failed") {
    console.warn(`[Paystack] Payment failed for ref ${event.data.reference}`)
  }

  // Always return 200 to acknowledge receipt
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
