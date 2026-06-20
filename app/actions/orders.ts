"use server"

import { headers } from "next/headers"
import { eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { getBaseURL } from "@/lib/base-url"
import {
  orders as ordersTable,
  products as productsTable,
  user as userTable,
} from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { initializePaystackTransaction, verifyPaystackTransaction } from "@/lib/paystack"
import {
  maxRedeemablePoints,
  pointsToCedis,
  pointsForSpend,
} from "@/lib/golden-acres/loyalty"
import { createNotification } from "@/app/actions/notifications"
import type { GhanaRegion, Order, OrderItem, PaymentMethod } from "@/lib/golden-acres/types"

/* ----------------------------- input contract ----------------------------- */

export interface PlaceOrderItem {
  productId: string
  qty: number
}

export interface PlaceOrderInput {
  customerName: string
  customerPhone: string
  items: PlaceOrderItem[]
  address: {
    ghanaPostGPS: string
    area: string
    region?: string
    lat: number
    lng: number
  }
  slot: { date: string; window: string }
  method: PaymentMethod
  deliveryFee: number
  /** Whether the customer chose to redeem loyalty points. */
  redeemPoints?: boolean
}

export interface PlaceOrderResult {
  ok: boolean
  reference?: string
  error?: string
  /** Present only for the card path (Stripe hosted checkout redirect URL). */
  checkoutUrl?: string
  /** Present only for the Paystack path (MoMo / GHS card). */
  authorizationUrl?: string
  /** The persisted order, returned so the client store can ingest it. */
  order?: Order
}

const nowISO = () => new Date().toISOString()
const round2 = (n: number) => Math.round(n * 100) / 100

// Stripe test mode can't settle GHS, so the card rail is charged in USD using a
// fixed display rate. Order totals remain authoritative in cedis.
const GHS_PER_USD = 15
const formatGHS = (n: number) => `GH\u20B5${n.toFixed(2)}`

function genReference(): string {
  return "GA-" + Math.floor(10000 + Math.random() * 89999).toString()
}

/* --------------------------- server-side pricing -------------------------- */

/**
 * Recompute the order from authoritative DB prices. The client only sends
 * product ids + quantities — never prices — so totals cannot be tampered with.
 */
async function priceOrder(items: PlaceOrderItem[]) {
  const ids = items.map((i) => i.productId)
  if (ids.length === 0) throw new Error("Your basket is empty.")

  const rows = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, ids))

  const byId = new Map(rows.map((r) => [r.id, r]))
  const orderItems: OrderItem[] = []
  let subtotal = 0

  for (const { productId, qty } of items) {
    const p = byId.get(productId)
    if (!p) throw new Error(`A product in your basket is no longer available.`)
    if (qty <= 0) continue

    const priceEstimate = p.variableWeight
      ? round2(p.estWeightKg * p.pricePerKg * qty)
      : round2(p.priceMin * qty)

    subtotal += priceEstimate

    orderItems.push({
      productId: p.id,
      name: p.name,
      image: p.image ?? undefined,
      farmerId: p.farmerId,
      qty,
      unit: p.unit as OrderItem["unit"],
      estWeightKg: p.estWeightKg,
      priceEstimate,
      refrigerationRequired: p.refrigerationRequired,
    })
  }

  return { orderItems, subtotal: round2(subtotal), rows }
}

/* --------------------------- order construction --------------------------- */

function buildOrder(args: {
  reference: string
  input: PlaceOrderInput
  orderItems: OrderItem[]
  subtotal: number
  total: number
  paymentStatus: "paid" | "pending"
}): Order {
  const refrigerated = args.orderItems.some((i) => i.refrigerationRequired)
  return {
    id: "o-" + Date.now(),
    reference: args.reference,
    customerName: args.input.customerName,
    customerPhone: args.input.customerPhone,
    items: args.orderItems,
    status: "placed",
    placedAt: nowISO(),
    payment: { method: args.input.method, status: args.paymentStatus },
    address: {
      ghanaPostGPS: args.input.address.ghanaPostGPS,
      area: args.input.address.area,
      region: (args.input.address.region as GhanaRegion) ?? "Greater Accra",
      lat: args.input.address.lat,
      lng: args.input.address.lng,
    },
    slot: args.input.slot,
    subtotalEstimate: args.subtotal,
    deliveryFee: round2(args.input.deliveryFee),
    total: args.total,
    threePL: {
      trackingNumber: null,
      driverId: null,
      driverName: null,
      vehicle: null,
      refrigeration: refrigerated,
      status: "placed",
      events: [
        {
          ts: nowISO(),
          status: "placed",
          note: "Order received and routed to the aggregation hub.",
        },
      ],
    },
    fault: "None",
    refunds: [],
  }
}

async function persistOrder(
  order: Order,
  userId: string | null,
  stripeSessionId: string | null,
) {
  await db.insert(ordersTable).values({
    id: order.id,
    reference: order.reference,
    userId,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    items: order.items,
    status: order.status,
    placedAt: order.placedAt,
    payment: order.payment,
    address: order.address,
    slot: order.slot,
    subtotalEstimate: order.subtotalEstimate,
    deliveryFee: order.deliveryFee,
    total: order.total,
    threePL: order.threePL,
    fault: order.fault,
    refunds: order.refunds,
    stripeSessionId,
  })

  // Confirmation notification (in-app + SMS), idempotent on reference so a
  // retried persist never double-notifies.
  await createNotification({
    forPhone: order.customerPhone,
    userId: userId ?? undefined,
    kind: "order",
    title: `${order.reference} · Order confirmed`,
    body: "We received your order and routed it to the aggregation hub.",
    href: `/orders/${order.reference}`,
    dedupeKey: `${order.reference}:placed`,
    sms: true,
  })
}

/** Decrement on-hand stock and recompute the stock status for each line. */
async function decrementStock(
  orderItems: OrderItem[],
  rows: { id: string; stockKg: number | null; lowStockThreshold: number | null }[],
) {
  const byId = new Map(rows.map((r) => [r.id, r]))
  for (const item of orderItems) {
    const p = byId.get(item.productId)
    if (!p) continue
    const usedKg = item.estWeightKg * item.qty
    const nextStock = Math.max(0, round2((p.stockKg ?? 0) - usedKg))
    const status =
      nextStock <= 0
        ? "out-of-stock"
        : nextStock <= (p.lowStockThreshold ?? 0)
          ? "low-stock"
          : "in-stock"
    await db
      .update(productsTable)
      .set({ stockKg: nextStock, status })
      .where(eq(productsTable.id, item.productId))
  }
}

/* ------------------------------ loyalty helper ----------------------------- */

/**
 * Resolve the authenticated customer (if any) and how many points they may
 * redeem against this order — derived from their real DB balance, never trusted
 * from the client.
 */
async function resolveLoyalty(
  redeemPoints: boolean | undefined,
  preDiscountTotal: number,
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return { userId: null as string | null, pointsUsed: 0, balance: 0 }
  }
  const u = session.user as typeof session.user & {
    role?: string
    loyaltyPoints?: number
  }
  const balance = u.role === "customer" ? (u.loyaltyPoints ?? 0) : 0
  const pointsUsed = redeemPoints
    ? maxRedeemablePoints(balance, preDiscountTotal)
    : 0
  return { userId: u.id, pointsUsed, balance }
}

async function applyLoyalty(
  userId: string,
  balance: number,
  pointsUsed: number,
  total: number,
) {
  // Spend redeemed points and award new points on the net spend. The order↔user
  // link (which drives orderRefs) is established by persistOrder via userId, so
  // only the points balance needs updating here.
  const earned = pointsForSpend(total, balance)
  const nextPoints = Math.max(0, balance - pointsUsed + earned)
  await db
    .update(userTable)
    .set({ loyaltyPoints: nextPoints, updatedAt: new Date() })
    .where(eq(userTable.id, userId))
}

/* ------------------------------- MoMo path -------------------------------- */

/** Simulated mobile-money charge (MTN / Telecel). Always succeeds in demo. */
export async function placeMomoOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  try {
    if (input.method === "card") {
      return { ok: false, error: "Use the card checkout for card payments." }
    }
    const { orderItems, subtotal, rows } = await priceOrder(input.items)
    const preDiscountTotal = round2(subtotal + input.deliveryFee)
    const { userId, pointsUsed, balance } = await resolveLoyalty(
      input.redeemPoints,
      preDiscountTotal,
    )
    const discount = pointsToCedis(pointsUsed)
    const total = Math.max(0, round2(preDiscountTotal - discount))

    const reference = genReference()
    const order = buildOrder({
      reference,
      input,
      orderItems,
      subtotal,
      total,
      paymentStatus: "paid",
    })

    await persistOrder(order, userId, null)
    await decrementStock(orderItems, rows)
    if (userId) await applyLoyalty(userId, balance, pointsUsed, total)

    return { ok: true, reference, order }
  } catch (e) {
    console.log("[v0] placeMomoOrder failed:", e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not place your order.",
    }
  }
}

/* ------------------------------- Card path -------------------------------- */

/**
 * Create a Stripe HOSTED Checkout session and persist the order in an
 * awaiting-payment state. We use hosted (redirect) checkout rather than the
 * embedded form so the flow needs only the server-side secret key — no
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required in the browser. The order is
 * finalized (stock + loyalty) only after Stripe confirms payment, via the
 * webhook or confirmCardOrder when the shopper returns to the success URL.
 *
 * `returnUrls` are built on the client (it knows the real origin) and Stripe
 * appends the session id to successUrl via the {CHECKOUT_SESSION_ID} template.
 */
export async function startCardCheckout(
  input: PlaceOrderInput,
  returnUrls: { successUrl: string; cancelUrl: string },
): Promise<PlaceOrderResult> {
  try {
    const { orderItems, subtotal } = await priceOrder(input.items)
    const preDiscountTotal = round2(subtotal + input.deliveryFee)
    const { userId, pointsUsed } = await resolveLoyalty(
      input.redeemPoints,
      preDiscountTotal,
    )
    const discount = pointsToCedis(pointsUsed)
    const total = Math.max(0, round2(preDiscountTotal - discount))

    const reference = genReference()

    // Stripe test accounts don't support GHS, so the card rail is charged in USD
    // using a fixed conversion rate. The authoritative order total stays in
    // cedis on the order record; only the Stripe charge is converted.
    const usdAmount = Math.max(50, Math.round((total / GHS_PER_USD) * 100))

    // Single consolidated line item priced from server totals.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: returnUrls.successUrl,
      cancel_url: returnUrls.cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AgriVil order ${reference}`,
              description: `${orderItems.length} item(s) · ${formatGHS(total)} (charged in USD)`,
            },
            unit_amount: usdAmount,
          },
          quantity: 1,
        },
      ],
      metadata: { reference, ghsTotal: String(total) },
    })

    const order = buildOrder({
      reference,
      input,
      orderItems,
      subtotal,
      total,
      paymentStatus: "pending",
    })
    await persistOrder(order, userId, session.id)

    return {
      ok: true,
      reference,
      checkoutUrl: session.url ?? undefined,
    }
  } catch (e) {
    console.log("[v0] startCardCheckout failed:", e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not start card checkout.",
    }
  }
}

/**
 * Finalize a card order once Stripe reports the session as paid. Idempotent:
 * re-confirming an already-paid order is a no-op.
 */
export async function confirmCardOrder(
  reference: string,
): Promise<PlaceOrderResult> {
  try {
    const [row] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.reference, reference))
    if (!row) return { ok: false, error: "Order not found." }

    const payment = row.payment as Order["payment"]

    const rowToOrder = (paymentStatus: Order["payment"]["status"]): Order => ({
      id: row.id,
      reference: row.reference,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      items: row.items as OrderItem[],
      status: row.status as Order["status"],
      placedAt: row.placedAt,
      payment: { ...payment, status: paymentStatus },
      address: row.address as Order["address"],
      slot: row.slot as Order["slot"],
      subtotalEstimate: row.subtotalEstimate,
      deliveryFee: row.deliveryFee,
      total: row.total,
      threePL: row.threePL as Order["threePL"],
      fault: row.fault as Order["fault"],
      refunds: (row.refunds ?? []) as Order["refunds"],
      orderRating: row.orderRating ?? null,
      riderRating: row.riderRating ?? null,
      tip: row.tip != null ? Number(row.tip) : 0,
      feedbackComment: row.feedbackComment ?? null,
      feedbackAt: row.feedbackAt ?? null,
    })

    if (payment.status === "paid") {
      return { ok: true, reference, order: rowToOrder("paid") }
    }

    if (!row.stripeSessionId) {
      return { ok: false, error: "No payment session for this order." }
    }

    const session = await stripe.checkout.sessions.retrieve(row.stripeSessionId)
    if (session.payment_status !== "paid") {
      return { ok: false, error: "Payment not completed yet." }
    }

    // Mark paid.
    await db
      .update(ordersTable)
      .set({ payment: { ...payment, status: "paid" }, updatedAt: new Date() })
      .where(eq(ordersTable.reference, reference))

    // Decrement stock from the persisted line items.
    const items = row.items as OrderItem[]
    const ids = items.map((i) => i.productId)
    const rows = ids.length
      ? await db
          .select()
          .from(productsTable)
          .where(inArray(productsTable.id, ids))
      : []
    await decrementStock(items, rows)

    // Award loyalty for the authenticated owner.
    if (row.userId) {
      const session2 = await auth.api.getSession({ headers: await headers() })
      const u = session2?.user as
        | ({ id: string; loyaltyPoints?: number })
        | undefined
      if (u && u.id === row.userId) {
        await applyLoyalty(row.userId, u.loyaltyPoints ?? 0, 0, row.total)
      }
    }

    return { ok: true, reference, order: rowToOrder("paid") }
  } catch (e) {
    console.log("[v0] confirmCardOrder failed:", e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not confirm payment.",
    }
  }
}

/**
 * Persist an order status transition (and its enriched threePL block) computed
 * optimistically by the client store. Used for the hub-side lifecycle steps
 * (placed → picking → packed). The out-for-delivery → delivered leg is owned by
 * the 3PL webhook, so this refuses to regress an order the carrier already moved.
 */
export async function persistOrderStatus(
  reference: string,
  status: Order["status"],
  threePL: Order["threePL"],
): Promise<{ ok: boolean; error?: string }> {
  try {
    const [row] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.reference, reference))
    if (!row) return { ok: false, error: "Order not found" }

    // Don't let an in-memory step clobber a further-along carrier state.
    const order = ["placed", "picking", "packed", "out-for-delivery", "delivered"]
    const currentIdx = order.indexOf(row.status)
    const nextIdx = order.indexOf(status)
    if (nextIdx >= 0 && currentIdx > nextIdx) {
      return { ok: true } // already past this point; no-op
    }

    await db
      .update(ordersTable)
      .set({ status, threePL, updatedAt: new Date() })
      .where(eq(ordersTable.reference, reference))
    return { ok: true }
  } catch (e) {
    console.log("[v0] persistOrderStatus failed:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Persist failed" }
  }
}

/** Initialize a Paystack MoMo / GHS card payment (real Ghana payments). */
export async function startPaystackCheckout(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult & { authorizationUrl?: string }> {
  try {
    const { orderItems, subtotal } = await priceOrder(input.items)
    const preDiscountTotal = round2(subtotal + input.deliveryFee)
    const { userId, pointsUsed } = await resolveLoyalty(
      input.redeemPoints,
      preDiscountTotal,
    )
    const discount = pointsToCedis(pointsUsed)
    const total = Math.max(0, round2(preDiscountTotal - discount))

    const reference = genReference()

    // Paystack uses pesewas (GHS * 100) as the unit
    const amountInPesewas = Math.round(total * 100)

    // Initialize Paystack transaction
    const isMoMo = (input.method as string).includes("momo")
    const paystackResult = await initializePaystackTransaction({
      amount: amountInPesewas,
      email: `customer-${Date.now()}@agrivil.local`, // Paystack requires email
      currency: "GHS",
      reference,
      metadata: {
        orderReference: reference,
        items: String(orderItems.length),
        total: String(total),
      },
      channels: isMoMo ? ["mobile_money", "card"] : ["card"],
      callback_url: `${getBaseURL()}/checkout?reference=${reference}`,
    })

    if (!paystackResult.success || !paystackResult.data?.authorization_url) {
      return {
        ok: false,
        error: paystackResult.error || "Could not initialize Paystack payment.",
      }
    }

    // Create the order in pending state
    const order = buildOrder({
      reference,
      input,
      orderItems,
      subtotal,
      total,
      paymentStatus: "pending",
    })

    await persistOrder(order, userId, null) // No stripeSessionId for Paystack

    return {
      ok: true,
      reference,
      authorizationUrl: paystackResult.data.authorization_url,
      order,
    }
  } catch (e) {
    console.log("[v0] startPaystackCheckout failed:", e)
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not start Paystack checkout.",
    }
  }
}

/**
 * Verify a Paystack transaction by reference. This wraps the server-only
 * Paystack lib so the client checkout component never imports secret-key code.
 * Returns the normalized payment status for the polling UI.
 */
export async function verifyPaystackOrder(
  reference: string,
): Promise<{ ok: boolean; status?: "success" | "pending" | "failed" | "abandoned"; error?: string }> {
  const result = await verifyPaystackTransaction(reference)
  if (!result.success || !result.data) {
    return { ok: false, error: result.error ?? "Verification failed." }
  }
  return { ok: true, status: result.data.status }
}

/**
 * Update an order's payment and status.
 * Called by the Paystack webhook after payment succeeds.
 */
export async function updateOrderStatus(
  reference: string,
  paymentStatus: "paid" | "failed" | "pending",
  metadata?: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const [row] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.reference, reference))

    if (!row) return { ok: false, error: "Order not found" }

    // Update payment status
    const updatedPayment = {
      ...(row.payment as Record<string, unknown>),
      status: paymentStatus,
      ...(metadata || {}),
    }

    await db
      .update(ordersTable)
      .set({
        payment: updatedPayment,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.reference, reference))

    // Send notification if paid
    if (paymentStatus === "paid") {
      await createNotification({
        forPhone: row.customerPhone,
        userId: row.userId ?? undefined,
        kind: "order",
        title: `${reference} · Payment received`,
        body: "Your payment was successful. Preparing your order for delivery.",
        href: `/orders/${reference}`,
        dedupeKey: `${reference}:paid`,
        sms: true,
      })
    }

    return { ok: true }
  } catch (e) {
    console.log("[v0] updateOrderStatus failed:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" }
  }
}

