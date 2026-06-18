"use server"

// -----------------------------------------------------------------------------
// Admin dashboard aggregates — all numbers are computed live from Neon Postgres.
// Staff-gated. Read-only except for the moderation helpers (approve/reject
// listing), which reuse the catalog review status already in the schema.
// -----------------------------------------------------------------------------

import { headers } from "next/headers"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  orders as ordersTable,
  products as productsTable,
  farmers as farmersTable,
  ledgerEntries as ledgerTable,
  supportTickets as ticketsTable,
  user as userTable,
} from "@/lib/db/schema"
import { auth } from "@/lib/auth"

async function requireStaff() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user as { role?: string } | undefined
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    throw new Error("Staff access required")
  }
  return user
}

const round2 = (n: number) => Math.round(n * 100) / 100

// "Realised" orders contribute to GMV / revenue. Cancelled orders never count.
const REALISED = sql`status <> 'cancelled'`

export interface AdminKpis {
  gmv: number
  orders: number
  activeCustomers: number
  onTimeRate: number // 0..1
  avgOrderValue: number
  payoutsDue: number
  openTickets: number
  pendingListings: number
}

export interface RevenuePoint {
  label: string // e.g. "Mar"
  value: number
}

export interface TopFarmer {
  farmerId: string
  name: string
  farmName: string
  gross: number
  orders: number
}

export interface TopProduct {
  productId: string
  name: string
  category: string
  units: number
  revenue: number
}

export interface StatusSlice {
  status: string
  count: number
}

export interface PendingListing {
  id: string
  name: string
  category: string
  image: string
  priceMin: number
  unit: string
  farmerName: string
}

export interface RecentOrder {
  reference: string
  customerName: string
  total: number
  status: string
  placedAt: string
}

export interface AdminOverview {
  kpis: AdminKpis
  revenueSeries: RevenuePoint[]
  ordersByStatus: StatusSlice[]
  topFarmers: TopFarmer[]
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
}

/** Month label helper, e.g. 2026-03 -> "Mar". */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export async function getAdminOverview(): Promise<AdminOverview> {
  await requireStaff()

  // --- KPI scalars (one round trip each; small + indexed) -------------------
  const [gmvRow] = await db
    .select({
      gmv: sql<number>`coalesce(sum(${ordersTable.total}), 0)`,
      orders: sql<number>`count(*)`,
      // Count distinct buyers: logged-in users by id, guest orders by phone/name.
      customers: sql<number>`count(distinct coalesce(${ordersTable.userId}, ${ordersTable.customerPhone}, ${ordersTable.customerName}))`,
    })
    .from(ordersTable)
    .where(REALISED)

  const [otRow] = await db
    .select({ rate: sql<number>`coalesce(avg(${farmersTable.onTimeRate}), 0)` })
    .from(farmersTable)

  const [payoutRow] = await db
    .select({ due: sql<number>`coalesce(sum(${ledgerTable.netPayout}), 0)` })
    .from(ledgerTable)
    .where(eq(ledgerTable.payoutStatus, "scheduled"))

  const [ticketRow] = await db
    .select({ open: sql<number>`count(*)` })
    .from(ticketsTable)
    .where(sql`status <> 'resolved'`)

  const [listingRow] = await db
    .select({ pending: sql<number>`count(*)` })
    .from(productsTable)
    .where(eq(productsTable.reviewStatus, "pending"))

  const gmv = round2(Number(gmvRow?.gmv ?? 0))
  const orderCount = Number(gmvRow?.orders ?? 0)

  const kpis: AdminKpis = {
    gmv,
    orders: orderCount,
    activeCustomers: Number(gmvRow?.customers ?? 0),
    onTimeRate: Number(otRow?.rate ?? 0),
    avgOrderValue: orderCount > 0 ? round2(gmv / orderCount) : 0,
    payoutsDue: round2(Number(payoutRow?.due ?? 0)),
    openTickets: Number(ticketRow?.open ?? 0),
    pendingListings: Number(listingRow?.pending ?? 0),
  }

  // --- Revenue series (last 6 months, grouped by placedAt month) ------------
  // placedAt is an ISO string column; substring the YYYY-MM prefix to bucket.
  const revRows = await db
    .select({
      ym: sql<string>`substring(${ordersTable.placedAt} from 1 for 7)`,
      value: sql<number>`coalesce(sum(${ordersTable.total}), 0)`,
    })
    .from(ordersTable)
    .where(REALISED)
    .groupBy(sql`substring(${ordersTable.placedAt} from 1 for 7)`)
    .orderBy(sql`substring(${ordersTable.placedAt} from 1 for 7)`)

  const revenueSeries: RevenuePoint[] = revRows
    .filter((r) => r.ym && /^\d{4}-\d{2}$/.test(r.ym))
    .slice(-6)
    .map((r) => {
      const month = Number(r.ym.slice(5, 7))
      return { label: MONTHS[month - 1] ?? r.ym, value: round2(Number(r.value)) }
    })

  // --- Orders by status -----------------------------------------------------
  const statusRows = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`count(*)`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status)
    .orderBy(desc(sql`count(*)`))
  const ordersByStatus: StatusSlice[] = statusRows.map((r) => ({
    status: r.status,
    count: Number(r.count),
  }))

  // --- Top farmers by gross sales (from the settlement ledger) --------------
  const farmerRows = await db
    .select({
      farmerId: ledgerTable.farmerId,
      gross: sql<number>`coalesce(sum(${ledgerTable.grossSales}), 0)`,
      orders: sql<number>`count(distinct ${ledgerTable.orderRef})`,
      name: farmersTable.name,
      farmName: farmersTable.farmName,
    })
    .from(ledgerTable)
    .leftJoin(farmersTable, eq(farmersTable.id, ledgerTable.farmerId))
    .groupBy(ledgerTable.farmerId, farmersTable.name, farmersTable.farmName)
    .orderBy(desc(sql`sum(${ledgerTable.grossSales})`))
    .limit(6)
  const topFarmers: TopFarmer[] = farmerRows.map((r) => ({
    farmerId: r.farmerId,
    name: r.name ?? "Unknown",
    farmName: r.farmName ?? "—",
    gross: round2(Number(r.gross)),
    orders: Number(r.orders),
  }))

  // --- Top products by units sold (unnest the jsonb order items) ------------
  // Each order.items entry looks like { productId, name, qty, priceFinal, priceEstimate }.
  const productRows = await db.execute<{
    productId: string
    name: string
    units: number
    revenue: number
  }>(sql`
    select
      item->>'productId' as "productId",
      coalesce(max(item->>'name'), 'Item') as name,
      coalesce(sum((item->>'qty')::numeric), 0) as units,
      coalesce(sum(coalesce((item->>'priceFinal')::numeric, (item->>'priceEstimate')::numeric, 0)), 0) as revenue
    from ${ordersTable}, jsonb_array_elements(items) as item
    where status <> 'cancelled' and item->>'productId' is not null
    group by item->>'productId'
    order by units desc
    limit 6
  `)
  // node-postgres returns a QueryResult whose `.rows` holds the records.
  const prodArr = ((productRows as { rows?: unknown[] }).rows ?? []) as Array<{
    productId: string
    name: string
    units: number
    revenue: number
  }>
  // Resolve category names from the products table for the top ids.
  const topIds = prodArr.map((r) => r.productId)
  const catMap = new Map<string, string>()
  if (topIds.length > 0) {
    const cats = await db
      .select({ id: productsTable.id, category: productsTable.category })
      .from(productsTable)
      .where(inArray(productsTable.id, topIds))
    for (const c of cats) catMap.set(c.id, c.category)
  }
  const topProducts: TopProduct[] = prodArr.map((r) => ({
    productId: r.productId,
    name: r.name,
    category: catMap.get(r.productId) ?? "Produce",
    units: Math.round(Number(r.units)),
    revenue: round2(Number(r.revenue)),
  }))

  // --- Recent orders --------------------------------------------------------
  const recentRows = await db
    .select({
      reference: ordersTable.reference,
      customerName: ordersTable.customerName,
      total: ordersTable.total,
      status: ordersTable.status,
      placedAt: ordersTable.placedAt,
    })
    .from(ordersTable)
    .orderBy(desc(ordersTable.placedAt))
    .limit(8)
  const recentOrders: RecentOrder[] = recentRows.map((r) => ({
    reference: r.reference,
    customerName: r.customerName,
    total: round2(Number(r.total)),
    status: r.status,
    placedAt: r.placedAt,
  }))

  return {
    kpis,
    revenueSeries,
    ordersByStatus,
    topFarmers,
    topProducts,
    recentOrders,
  }
}

/** The listing-approval queue (pending farmer-submitted products). */
export async function getPendingListings(): Promise<PendingListing[]> {
  await requireStaff()
  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      category: productsTable.category,
      image: productsTable.image,
      priceMin: productsTable.priceMin,
      unit: productsTable.unit,
      farmerName: farmersTable.name,
    })
    .from(productsTable)
    .leftJoin(farmersTable, eq(farmersTable.id, productsTable.farmerId))
    .where(eq(productsTable.reviewStatus, "pending"))
    .orderBy(desc(productsTable.createdAt))
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    image: r.image,
    priceMin: round2(Number(r.priceMin)),
    unit: r.unit,
    farmerName: r.farmerName ?? "Unknown farm",
  }))
}

/** Approve or reject a pending product listing. */
export async function reviewListing(
  productId: string,
  decision: "live" | "rejected",
): Promise<{ ok: boolean }> {
  await requireStaff()
  await db
    .update(productsTable)
    .set({ reviewStatus: decision, updatedAt: new Date() })
    .where(and(eq(productsTable.id, productId), eq(productsTable.reviewStatus, "pending")))
  return { ok: true }
}
