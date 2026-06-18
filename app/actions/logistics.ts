"use server"

// Simulated 3PL carrier service.
// -----------------------------------------------------------------------------
// In production these calls would hit SwiftChain GH's REST API. Here they model
// the same contract: `dispatchToThreePL` hands a packed order to the carrier
// (which assigns a driver + tracking number and persists it), and `tickDelivery`
// acts as the driver's device — it computes the next position along the route
// and POSTs it to our own inbound webhook (the real /api/3pl/webhook endpoint),
// exactly as a third-party carrier would. The webhook is the single writer of
// delivery state, so the map/ops/BI always read one persisted source of truth.

import { headers } from "next/headers"
import { eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { orders as ordersTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { getInternalBaseURL } from "@/lib/base-url"
import { HUB } from "@/lib/golden-acres/data"
import { lerpPoint, haversineKm } from "@/lib/golden-acres/geo"
import {
  THREE_PL_WEBHOOK_SECRET,
  THREE_PL_CARRIER,
  THREE_PL_DRIVERS,
  ROUTE_STEP,
  type ThreePLWebhookEvent,
} from "@/lib/golden-acres/logistics-config"
import type { Order, GeoPoint } from "@/lib/golden-acres/types"

export interface LogisticsResult {
  ok: boolean
  error?: string
  order?: Order
}

const nowISO = () => new Date().toISOString()

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToOrder(r: any): Order {
  return {
    id: r.id,
    reference: r.reference,
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    items: (r.items ?? []) as Order["items"],
    status: r.status as Order["status"],
    placedAt: r.placedAt,
    payment: r.payment as Order["payment"],
    address: r.address as Order["address"],
    slot: r.slot as Order["slot"],
    subtotalEstimate: Number(r.subtotalEstimate),
    subtotalFinal: r.subtotalFinal != null ? Number(r.subtotalFinal) : undefined,
    deliveryFee: Number(r.deliveryFee),
    total: Number(r.total),
    threePL: r.threePL as Order["threePL"],
    fault: r.fault as Order["fault"],
    refunds: (r.refunds ?? []) as Order["refunds"],
    orderRating: r.orderRating ?? null,
    riderRating: r.riderRating ?? null,
    tip: r.tip != null ? Number(r.tip) : 0,
    feedbackComment: r.feedbackComment ?? null,
    feedbackAt: r.feedbackAt ?? null,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function loadOrder(reference: string): Promise<Order | null> {
  const [row] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.reference, reference))
    .limit(1)
  return row ? rowToOrder(row) : null
}

/** Post an event to our own inbound carrier webhook (as the carrier would). */
async function postWebhook(event: ThreePLWebhookEvent): Promise<void> {
  const res = await fetch(`${getInternalBaseURL()}/api/3pl/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-3pl-secret": THREE_PL_WEBHOOK_SECRET,
    },
    body: JSON.stringify(event),
    cache: "no-store",
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(`3PL webhook ${res.status}: ${txt}`)
  }
}

/** Estimated whole-minute ETA from a route-progress fraction. */
function etaFromProgress(origin: GeoPoint, dest: GeoPoint, progress: number): number {
  const remainingKm = haversineKm(origin, dest) * (1 - progress)
  const avgKmh = 22 // dense Accra traffic
  return Math.max(1, Math.round((remainingKm / avgKmh) * 60))
}

/**
 * Hand a packed/ready order to the 3PL. Assigns a driver + tracking number and
 * persists the dispatch (status stays until the first position ping flips it to
 * out-for-delivery). Staff-only.
 */
export async function dispatchToThreePL(reference: string): Promise<LogisticsResult> {
  const user = await getSessionUser()
  if (!user || (user as { role?: string }).role !== "staff") {
    return { ok: false, error: "Staff access required" }
  }

  const order = await loadOrder(reference)
  if (!order) return { ok: false, error: "Order not found" }
  if (order.status === "delivered" || order.status === "cancelled") {
    return { ok: false, error: `Cannot dispatch a ${order.status} order` }
  }
  if (order.threePL.trackingNumber) {
    return { ok: true, order } // already dispatched — idempotent
  }

  const driver = THREE_PL_DRIVERS[Math.floor(Math.random() * THREE_PL_DRIVERS.length)]
  const origin = HUB.location
  const dest: GeoPoint = { lat: order.address.lat, lng: order.address.lng }

  const threePL: Order["threePL"] = {
    ...order.threePL,
    carrier: THREE_PL_CARRIER,
    trackingNumber: "GA3PL-" + Math.floor(100000 + Math.random() * 900000).toString(),
    driverId: driver.id,
    driverName: driver.name,
    driverPhone: driver.phone,
    vehicle: driver.vehicle,
    status: order.status,
    dispatchedAt: nowISO(),
    originHub: origin,
    driverLocation: origin,
    routeProgress: 0,
    etaMinutes: etaFromProgress(origin, dest, 0),
    events: [
      ...order.threePL.events,
      {
        ts: nowISO(),
        status: "tracking-assigned",
        note: `${THREE_PL_CARRIER} assigned ${driver.name} (${driver.vehicle}).`,
        location: HUB.name,
      },
    ],
  }

  await db
    .update(ordersTable)
    .set({ threePL, updatedAt: new Date() })
    .where(eq(ordersTable.reference, reference))

  return { ok: true, order: { ...order, threePL } }
}

/**
 * Advance the driver one step along the route and report it to the webhook (the
 * carrier device's heartbeat). Returns the freshly persisted order. The map
 * calls this on a poll; once delivered it becomes a no-op read.
 */
export async function tickDelivery(reference: string): Promise<LogisticsResult> {
  const order = await loadOrder(reference)
  if (!order) return { ok: false, error: "Order not found" }

  const t = order.threePL
  // Nothing to do if not yet dispatched or already finished.
  if (!t.trackingNumber || order.status === "delivered" || order.status === "cancelled") {
    return { ok: true, order }
  }

  const origin = t.originHub ?? HUB.location
  const dest: GeoPoint = { lat: order.address.lat, lng: order.address.lng }
  const progress = Math.min(1, (t.routeProgress ?? 0) + ROUTE_STEP)
  const pos = lerpPoint(origin, dest, progress)

  if (progress >= 1) {
    await postWebhook({
      type: "delivered",
      reference,
      lat: dest.lat,
      lng: dest.lng,
      signature: order.customerName,
    })
  } else {
    await postWebhook({
      type: "position",
      reference,
      lat: pos.lat,
      lng: pos.lng,
      progress,
      etaMinutes: etaFromProgress(origin, dest, progress),
    })
  }

  // Return the post-webhook persisted state.
  const updated = await loadOrder(reference)
  return { ok: true, order: updated ?? order }
}

/** Read the latest persisted order (used by the map's initial load). */
export async function getOrderTracking(reference: string): Promise<LogisticsResult> {
  const order = await loadOrder(reference)
  if (!order) return { ok: false, error: "Order not found" }
  return { ok: true, order }
}

// ---- fleet (all active deliveries) -----------------------------------------

export interface ActiveDelivery {
  reference: string
  customerName: string
  area: string
  status: Order["status"]
  driverName: string | null
  driverPhone: string | null
  vehicle: string | null
  trackingNumber: string | null
  origin: GeoPoint
  dest: GeoPoint
  driverLocation: GeoPoint
  routeProgress: number
  etaMinutes: number | null
  refrigeration: boolean
  total: number
}

function toActiveDelivery(o: Order): ActiveDelivery {
  const t = o.threePL
  const origin = t.originHub ?? HUB.location
  const dest: GeoPoint = { lat: o.address.lat, lng: o.address.lng }
  return {
    reference: o.reference,
    customerName: o.customerName,
    area: o.address.area,
    status: o.status,
    driverName: t.driverName ?? null,
    driverPhone: t.driverPhone ?? null,
    vehicle: t.vehicle ?? null,
    trackingNumber: t.trackingNumber ?? null,
    origin,
    dest,
    driverLocation: t.driverLocation ?? origin,
    routeProgress: t.routeProgress ?? 0,
    etaMinutes: t.etaMinutes ?? null,
    refrigeration: !!t.refrigeration,
    total: o.total,
  }
}

/**
 * Every delivery the carrier currently holds — dispatched (has a tracking
 * number) and not yet delivered/cancelled. Powers the Ops fleet map. Staff-only.
 */
export async function getActiveDeliveries(): Promise<{
  ok: boolean
  error?: string
  deliveries: ActiveDelivery[]
}> {
  const user = await getSessionUser()
  if (!user || (user as { role?: string }).role !== "staff") {
    return { ok: false, error: "Staff access required", deliveries: [] }
  }

  // Pull the in-flight statuses, then keep only those actually handed to the
  // carrier (tracking number assigned).
  const rows = await db
    .select()
    .from(ordersTable)
    .where(inArray(ordersTable.status, ["packed", "out-for-delivery"]))
  const deliveries = rows
    .map(rowToOrder)
    .filter((o) => !!o.threePL?.trackingNumber)
    .map(toActiveDelivery)
    // Closest to the customer first.
    .sort((a, b) => b.routeProgress - a.routeProgress)

  return { ok: true, deliveries }
}

/**
 * Advance every in-flight delivery one step (fleet-wide heartbeat for the Ops
 * map). Each leg is ticked through the same webhook contract as the customer
 * map, so state stays single-sourced. Returns the refreshed fleet. Staff-only.
 */
export async function tickAllDeliveries(): Promise<{
  ok: boolean
  error?: string
  deliveries: ActiveDelivery[]
}> {
  const user = await getSessionUser()
  if (!user || (user as { role?: string }).role !== "staff") {
    return { ok: false, error: "Staff access required", deliveries: [] }
  }

  const { deliveries } = await getActiveDeliveries()
  // Tick each leg; tickDelivery is idempotent/safe and posts via the webhook.
  await Promise.allSettled(deliveries.map((d) => tickDelivery(d.reference)))

  return getActiveDeliveries()
}
