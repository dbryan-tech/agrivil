import { stripe } from "@/lib/stripe"
import { updateOrderStatus } from "@/app/actions/orders"

/**
 * Stripe webhook: confirms card payments with order reconciliation.
 * Stripe delivers a JSON POST to this endpoint when a checkout session completes.
 * We verify the signature, extract the order reference, and mark the order as paid.
 */

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  let event
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    )
  } catch (error) {
    console.warn("[Stripe] Invalid webhook signature — rejecting")
    return new Response("Unauthorized", { status: 401 })
  }

  console.log(`[Stripe] Webhook: ${event.type}`)

  // Only process completed checkout sessions
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string
      payment_status: string
      amount_total?: number
      metadata?: Record<string, string>
    }

    if (session.payment_status !== "paid") {
      console.warn(`[Stripe] Checkout session ${session.id} not paid yet`)
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    const reference = session.metadata?.reference
    if (!reference) {
      console.error(`[Stripe] No order reference in session ${session.id}`)
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    try {
      // Mark the order as paid
      await updateOrderStatus(reference, "paid", {
        paymentRef: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0, // convert cents to dollars
        gateway: "stripe",
      })

      console.log(`[Stripe] Order ${reference} marked paid`)
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (error) {
      console.error(`[Stripe] Failed to update order ${reference}:`, error)
      // Return 200 anyway so Stripe stops retrying
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }
  }

  // Log other events for debugging
  if (event.type === "checkout.session.expired") {
    console.warn(`[Stripe] Checkout expired: ${event.data.object?.id}`)
  }

  // Always return 200 to acknowledge receipt
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
