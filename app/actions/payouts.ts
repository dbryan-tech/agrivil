"use server"

// Farmer settlement / payouts.
// -----------------------------------------------------------------------------
// Two halves of the money flow:
//   1. ACCRUAL — when an order is delivered, we split its produce value per
//      farmer and write one `scheduled` ledger entry per farmer for that order
//      (gross − 15% commission − any farmer-fault SOP penalty = net payout).
//      This is idempotent per (orderRef, farmerId) so webhook retries are safe.
//   2. SETTLEMENT — staff trigger a payout run from the Ops console. We gather
//      every `scheduled` entry, disburse each through the simulated MoMo seam,
//      and mark it `paid` (with provider/ref/batch metadata) or `failed`. A
//      `payout_batches` row records the run summary.
//
// Money math lives in one place (computePayout) so accrual and any re-quote
// stay consistent.

import { headers } from "next/headers"
import { and, desc, eq, inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  ledgerEntries as ledgerTable,
  payoutBatches as batchTable,
  farmers as farmersTable,
  orders as ordersTable,
} from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import {
  sendMomoPayout,
  maskMomoNumber,
  computePayout,
  PAYOUT_GUARANTEE_HOURS,
} from "@/lib/golden-acres/momo"
import { createNotification } from "@/app/actions/notifications"
import type {
  Order,
  OrderItem,
  LedgerEntry,
  PayoutBatch,
  MomoProvider,
} from "@/lib/golden-acres/types"

const nowISO = () => new Date().toISOString()
const round2 = (n: number) => Math.round(n * 100) / 100

/** Best available per-item value: final reconciled price if present, else estimate. */
function itemValue(it: OrderItem): number {
  return it.priceFinal ?? it.priceEstimate ?? 0
}

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

async function requireStaff() {
  const user = await getSessionUser()
  if (!user || (user as { role?: string }).role !== "staff") {
    throw new Error("Staff access required")
  }
  return user
}

// ---- accrual ----------------------------------------------------------------

/**
 * Accrue scheduled ledger entries for a delivered order — one per farmer whose
 * produce is in the order. Idempotent: skips any (orderRef, farmerId) pair that
 * already has a ledger row, so webhook retries never double-pay.
 */
export async function accrueLedgerForOrder(order: Order): Promise<void> {
  if (!order?.items?.length) return

  // Sum gross produce value per farmer (delivery fee is platform revenue, not
  // farmer income, so it is excluded).
  const grossByFarmer = new Map<string, number>()
  for (const it of order.items) {
    if (!it.farmerId) continue
    grossByFarmer.set(it.farmerId, (grossByFarmer.get(it.farmerId) ?? 0) + itemValue(it) * it.qty)
  }
  if (grossByFarmer.size === 0) return

  // Which farmers already have an entry for this order? (idempotency guard)
  const existing = await db
    .select({ farmerId: ledgerTable.farmerId })
    .from(ledgerTable)
    .where(eq(ledgerTable.orderRef, order.reference))
  const already = new Set(existing.map((e) => e.farmerId))

  const farmerAtFault = order.fault === "Farmer"
  const deliveredAt = nowISO()
  const guaranteeTs = new Date(Date.now() + PAYOUT_GUARANTEE_HOURS * 3600_000).toISOString()

  const rows = [...grossByFarmer.entries()]
    .filter(([farmerId]) => !already.has(farmerId))
    .map(([farmerId, grossRaw]) => {
      const gross = round2(grossRaw)
      const { commission, sopPenalty, netPayout } = computePayout(gross, farmerAtFault)
      return {
        id: `led_${order.reference}_${farmerId}`,
        farmerId,
        date: deliveredAt,
        orderRef: order.reference,
        grossSales: gross,
        commission,
        sopPenalty,
        netPayout,
        payoutStatus: "scheduled" as const,
        payoutTimestamp: guaranteeTs,
      }
    })

  if (rows.length === 0) return
  // onConflictDoNothing double-guards against a race between the check above
  // and insert (the id is deterministic per order+farmer).
  await db.insert(ledgerTable).values(rows).onConflictDoNothing({ target: ledgerTable.id })
}

// ---- settlement -------------------------------------------------------------

export interface RunPayoutResult {
  ok: boolean
  error?: string
  batch?: PayoutBatch
}

/**
 * Settle all due (scheduled) ledger entries through the simulated MoMo seam.
 * Staff-only. Each entry is disbursed to its farmer's MoMo wallet and marked
 * paid/failed; a payout_batches row summarises the run.
 */
export async function runPayoutBatch(): Promise<RunPayoutResult> {
  let staffId: string | undefined
  try {
    const staff = await requireStaff()
    staffId = staff.id
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unauthorized" }
  }

  // Gather due entries.
  const due = await db
    .select()
    .from(ledgerTable)
    .where(eq(ledgerTable.payoutStatus, "scheduled"))

  const batchId = `batch_${Date.now().toString(36)}`

  if (due.length === 0) {
    const empty: PayoutBatch = {
      id: batchId,
      runBy: staffId ?? null,
      status: "completed",
      entryCount: 0,
      paidCount: 0,
      failedCount: 0,
      totalPaid: 0,
      createdAt: nowISO(),
    }
    return { ok: true, batch: empty }
  }

  // Resolve MoMo destinations for the farmers in this run.
  const farmerIds = [...new Set(due.map((d) => d.farmerId))]
  const farmerRows = await db
    .select({
      id: farmersTable.id,
      name: farmersTable.name,
      momoProvider: farmersTable.momoProvider,
      momoNumber: farmersTable.momoNumber,
      ownerUserId: farmersTable.ownerUserId,
    })
    .from(farmersTable)
    .where(inArray(farmersTable.id, farmerIds))
  const farmerById = new Map(farmerRows.map((f) => [f.id, f]))

  let paidCount = 0
  let failedCount = 0
  let totalPaid = 0
  const settledAt = nowISO()

  for (const entry of due) {
    const farmer = farmerById.get(entry.farmerId)
    const reference = `${batchId}_${entry.id}`

    // Missing payout destination is a hard fail for this entry.
    if (!farmer?.momoNumber || !farmer?.momoProvider) {
      failedCount++
      await db
        .update(ledgerTable)
        .set({ payoutStatus: "failed", batchId, failureReason: "No MoMo account on file" })
        .where(eq(ledgerTable.id, entry.id))
      continue
    }

    const result = await sendMomoPayout({
      amount: entry.netPayout,
      provider: farmer.momoProvider as MomoProvider,
      number: farmer.momoNumber,
      reference,
      recipientName: farmer.name,
    })

    if (result.ok) {
      paidCount++
      totalPaid = round2(totalPaid + entry.netPayout)
      await db
        .update(ledgerTable)
        .set({
          payoutStatus: "paid",
          payoutProvider: farmer.momoProvider,
          payoutNumber: maskMomoNumber(farmer.momoNumber),
          payoutRef: result.transactionId,
          batchId,
          paidAt: settledAt,
          failureReason: null,
        })
        .where(eq(ledgerTable.id, entry.id))

      // Notify the farmer's owner account (in-app + SMS) of the settled payout.
      if (farmer.ownerUserId) {
        await createNotification({
          forPhone: farmer.momoNumber,
          userId: farmer.ownerUserId,
          kind: "payout",
          title: `Payout sent · GH\u20B5${entry.netPayout.toFixed(2)}`,
          body: `Your payout for order ${entry.orderRef} was sent to ${maskMomoNumber(farmer.momoNumber)} (${farmer.momoProvider}).`,
          href: `/farmer?tab=earnings`,
          dedupeKey: `${entry.id}:paid`,
          sms: true,
        })
      }
    } else {
      failedCount++
      await db
        .update(ledgerTable)
        .set({
          payoutStatus: "failed",
          payoutProvider: farmer.momoProvider,
          payoutNumber: maskMomoNumber(farmer.momoNumber),
          batchId,
          failureReason: result.error,
        })
        .where(eq(ledgerTable.id, entry.id))
    }
  }

  const batch: PayoutBatch = {
    id: batchId,
    runBy: staffId ?? null,
    status: failedCount > 0 ? "partial" : "completed",
    entryCount: due.length,
    paidCount,
    failedCount,
    totalPaid,
    createdAt: settledAt,
  }
  await db.insert(batchTable).values({
    id: batch.id,
    runBy: batch.runBy ?? null,
    status: batch.status,
    entryCount: batch.entryCount,
    paidCount: batch.paidCount,
    failedCount: batch.failedCount,
    totalPaid: batch.totalPaid,
  })

  return { ok: true, batch }
}

// ---- reads ------------------------------------------------------------------

function rowToLedger(r: typeof ledgerTable.$inferSelect): LedgerEntry {
  return {
    id: r.id,
    farmerId: r.farmerId,
    date: r.date,
    orderRef: r.orderRef,
    grossSales: r.grossSales,
    commission: r.commission,
    sopPenalty: r.sopPenalty,
    netPayout: r.netPayout,
    payoutStatus: r.payoutStatus as LedgerEntry["payoutStatus"],
    payoutTimestamp: r.payoutTimestamp,
    payoutProvider: (r.payoutProvider as MomoProvider | null) ?? null,
    payoutNumber: r.payoutNumber ?? null,
    payoutRef: r.payoutRef ?? null,
    batchId: r.batchId ?? null,
    paidAt: r.paidAt ?? null,
    failureReason: r.failureReason ?? null,
  }
}

/** Ledger for a single farmer (newest first) — powers the farmer Earnings tab. */
export async function getFarmerLedger(farmerId: string): Promise<LedgerEntry[]> {
  const rows = await db
    .select()
    .from(ledgerTable)
    .where(eq(ledgerTable.farmerId, farmerId))
    .orderBy(desc(ledgerTable.date))
  return rows.map(rowToLedger)
}

export interface PayoutQueueFarmerGroup {
  farmerId: string
  farmerName: string
  momoProvider: MomoProvider | null
  momoNumberMasked: string | null
  entryCount: number
  net: number
}

export interface PayoutQueueSummary {
  dueCount: number
  dueTotal: number
  farmerCount: number
  entries: LedgerEntry[]
  byFarmer: PayoutQueueFarmerGroup[]
}

/** Pending settlement queue (scheduled entries) — powers the Ops payout panel. */
export async function getPayoutQueue(): Promise<PayoutQueueSummary> {
  const rows = await db
    .select()
    .from(ledgerTable)
    .where(eq(ledgerTable.payoutStatus, "scheduled"))
    .orderBy(desc(ledgerTable.date))
  const entries = rows.map(rowToLedger)
  const dueTotal = round2(entries.reduce((s, e) => s + e.netPayout, 0))

  // Group by farmer + attach MoMo destination so Ops sees exactly who gets paid.
  const farmerIds = [...new Set(entries.map((e) => e.farmerId))]
  const farmerRows = farmerIds.length
    ? await db
        .select({
          id: farmersTable.id,
          name: farmersTable.name,
          momoProvider: farmersTable.momoProvider,
          momoNumber: farmersTable.momoNumber,
        })
        .from(farmersTable)
        .where(inArray(farmersTable.id, farmerIds))
    : []
  const fById = new Map(farmerRows.map((f) => [f.id, f]))

  const groupMap = new Map<string, PayoutQueueFarmerGroup>()
  for (const e of entries) {
    const f = fById.get(e.farmerId)
    const g = groupMap.get(e.farmerId) ?? {
      farmerId: e.farmerId,
      farmerName: f?.name ?? e.farmerId,
      momoProvider: (f?.momoProvider as MomoProvider | null) ?? null,
      momoNumberMasked: f?.momoNumber ? maskMomoNumber(f.momoNumber) : null,
      entryCount: 0,
      net: 0,
    }
    g.entryCount += 1
    g.net = round2(g.net + e.netPayout)
    groupMap.set(e.farmerId, g)
  }
  const byFarmer = [...groupMap.values()].sort((a, b) => b.net - a.net)

  return { dueCount: entries.length, dueTotal, farmerCount: byFarmer.length, entries, byFarmer }
}

/** Recent settlement runs (newest first). */
export async function getPayoutBatches(limit = 10): Promise<PayoutBatch[]> {
  const rows = await db
    .select()
    .from(batchTable)
    .orderBy(desc(batchTable.createdAt))
    .limit(limit)
  return rows.map((r) => ({
    id: r.id,
    runBy: r.runBy ?? null,
    status: r.status as PayoutBatch["status"],
    entryCount: r.entryCount,
    paidCount: r.paidCount,
    failedCount: r.failedCount,
    totalPaid: r.totalPaid,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }))
}
