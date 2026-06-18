// Inbound 3PL carrier webhook.
// -----------------------------------------------------------------------------
// The carrier (here, our simulated SwiftChain GH device) POSTs live telemetry
// here: driver position updates while en route, and a proof-of-delivery event
// on completion. Every event is authenticated with a shared secret and
// persisted to the order's `threePL` jsonb (and `status` on delivery) in Neon,
// so the customer tracking map, ops console and BI all read real state that
// survives a reload. This is the single source of truth for the delivery leg.

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders as ordersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  THREE_PL_WEBHOOK_SECRET,
  type ThreePLWebhookEvent,
} from "@/lib/golden-acres/logistics-config"
import { createNotification } from "@/app/actions/notifications"
import { accrueLedgerForOrder } from "@/app/actions/payouts"
import type { Order, TrackingEvent } from "@/lib/golden-acres/types"

export async function POST(req: Request) {
  // 1. Authenticate the carrier callback with the shared secret header.
  const secret = req.headers.get("x-3pl-secret")
  if (secret !== THREE_PL_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  let event: ThreePLWebhookEvent
  try {
    event = (await req.json()) as ThreePLWebhookEvent
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  if (!event?.reference || !event?.type) {
    return NextResponse.json(
      { ok: false, error: "Missing reference or type" },
      { status: 400 },
    )
  }

  // 2. Load the order row.
  const [row] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.reference, event.reference))
    .limit(1)

  if (!row) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 })
  }

  const threePL = (row.threePL ?? {}) as Order["threePL"]
  const now = new Date().toISOString()

  if (event.type === "position") {
    // Live driver coordinate + route progress. Only append a tracking event the
    // first time we go out for delivery to avoid flooding the timeline.
    const goingLive = row.status !== "out-for-delivery"
    const events: TrackingEvent[] = goingLive
      ? [
          ...threePL.events,
          {
            ts: now,
            status: "out-for-delivery",
            note: "Driver collected the order and is en route.",
            location: "En route",
          },
        ]
      : threePL.events

    const nextThreePL: Order["threePL"] = {
      ...threePL,
      status: "out-for-delivery",
      events,
      driverLocation: { lat: event.lat, lng: event.lng },
      routeProgress: clamp01(event.progress),
      etaMinutes: Math.max(0, Math.round(event.etaMinutes)),
    }

    await db
      .update(ordersTable)
      .set({
        status: "out-for-delivery",
        threePL: nextThreePL,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.reference, event.reference))

    // Fan out a notification once, the first time the order goes live. The
    // dedupeKey makes this idempotent across webhook retries / overlapping polls.
    if (goingLive) {
      const driver = nextThreePL.driverName
      await createNotification({
        forPhone: row.customerPhone,
        userId: row.userId ?? undefined,
        kind: "order",
        title: `${row.reference} · Out for delivery`,
        body: driver
          ? `${driver} has collected your order and is on the way.`
          : "Your rider has collected your order and is on the way.",
        href: `/orders/${row.reference}`,
        dedupeKey: `${row.reference}:out-for-delivery`,
        sms: true,
      })
    }

    return NextResponse.json({ ok: true, status: "out-for-delivery" })
  }

  if (event.type === "delivered") {
    const alreadyDelivered = row.status === "delivered"
    const nextThreePL: Order["threePL"] = {
      ...threePL,
      status: "delivered",
      driverLocation: { lat: event.lat, lng: event.lng },
      routeProgress: 1,
      etaMinutes: 0,
      events: [
        ...threePL.events,
        {
          ts: now,
          status: "delivered",
          note: "Delivered. Proof of delivery captured at the door.",
        },
      ],
      pod: {
        photo: event.photo ?? "/golden-acres/produce/placeholder.png",
        signature: event.signature,
        geo: { lat: event.lat, lng: event.lng },
        capturedAt: now,
      },
    }

    await db
      .update(ordersTable)
      .set({
        status: "delivered",
        threePL: nextThreePL,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.reference, event.reference))

    // Delivery confirmation — fire once (dedupeKey + alreadyDelivered guard).
    if (!alreadyDelivered) {
      await createNotification({
        forPhone: row.customerPhone,
        userId: row.userId ?? undefined,
        kind: "order",
        title: `${row.reference} · Delivered`,
        body: "Your order was delivered. Tap to rate your experience and leave a tip.",
        href: `/orders/${row.reference}`,
        dedupeKey: `${row.reference}:delivered`,
        sms: true,
      })

      // Accrue farmer payouts for this delivered order (idempotent per
      // order+farmer, so webhook retries never double-book the ledger).
      try {
        await accrueLedgerForOrder({
          reference: row.reference,
          items: (row.items ?? []) as Order["items"],
          fault: row.fault as Order["fault"],
        } as Order)
      } catch (e) {
        // Never fail the carrier callback on an accrual hiccup; settlement can
        // still be reconciled later from the order record.
        console.log("[v0] ledger accrual failed:", e instanceof Error ? e.message : e)
      }
    }

    return NextResponse.json({ ok: true, status: "delivered" })
  }

  return NextResponse.json({ ok: false, error: "Unknown event type" }, { status: 400 })
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
