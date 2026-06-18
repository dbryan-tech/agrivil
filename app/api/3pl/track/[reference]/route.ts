// Public read-only tracking endpoint.
// -----------------------------------------------------------------------------
// The customer tracking map polls this for the latest persisted delivery state
// (status, driver, live coordinate, route progress, ETA, POD). It reads the
// same Neon row the carrier webhook writes to, so the map reflects real state
// and survives reloads. No auth: a tracking reference is the bearer token,
// and only non-sensitive delivery fields are returned.

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders as ordersTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { Order } from "@/lib/golden-acres/types"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params

  const [row] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.reference, reference))
    .limit(1)

  if (!row) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  }

  const threePL = (row.threePL ?? {}) as Order["threePL"]

  return NextResponse.json({
    ok: true,
    reference: row.reference,
    status: row.status,
    address: row.address,
    threePL: {
      carrier: threePL.carrier ?? null,
      trackingNumber: threePL.trackingNumber ?? null,
      driverName: threePL.driverName ?? null,
      driverPhone: threePL.driverPhone ?? null,
      vehicle: threePL.vehicle ?? null,
      refrigeration: threePL.refrigeration ?? false,
      dispatchedAt: threePL.dispatchedAt ?? null,
      etaMinutes: threePL.etaMinutes ?? null,
      originHub: threePL.originHub ?? null,
      driverLocation: threePL.driverLocation ?? null,
      routeProgress: threePL.routeProgress ?? 0,
      events: threePL.events ?? [],
      pod: threePL.pod ?? null,
    },
  })
}
