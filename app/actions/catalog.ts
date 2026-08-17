"use server"

// Golden Acres — catalog & farmer persistence actions (DB-backed)
// -----------------------------------------------------------------------------
// The client data-store stays the source of truth for the optimistic UI and
// computes new records locally (ids, price ranges, status). These actions
// persist those exact records to Neon so every surface — storefront, farmer
// portal, ops console — reads the same live data after a reload. Reads are
// public; writes require a session, moderation requires staff.

import { db } from "@/lib/db"
import {
  products as productsTable,
  farmers as farmersTable,
  bundles as bundlesTable,
  recipes as recipesTable,
  orders as ordersTable,
} from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, desc } from "drizzle-orm"
import type {
  Product,
  Farmer,
  Bundle,
  Recipe,
  Order,
  ProductReviewStatus,
  StockStatus,
  GhanaRegion,
  ProduceCategory,
  ProductUnit,
} from "@/lib/golden-acres/types"

/* ----------------------------- session helpers ---------------------------- */

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw new Error("Sign in required")
  return user
}

async function requireStaff() {
  const user = await getSessionUser()
  if (!user || (user as { role?: string }).role !== "staff") {
    throw new Error("Staff access required")
  }
  return user
}

/* ------------------------------- row mappers ------------------------------- */
/* eslint-disable @typescript-eslint/no-explicit-any */
function toProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category as ProduceCategory,
    farmerId: r.farmerId,
    image: r.image,
    unit: r.unit as ProductUnit,
    variableWeight: r.variableWeight,
    estWeightKg: Number(r.estWeightKg),
    pricePerKg: Number(r.pricePerKg),
    priceMin: Number(r.priceMin),
    priceMax: Number(r.priceMax),
    refrigerationRequired: r.refrigerationRequired,
    shelfLifeDays: r.shelfLifeDays,
    expiryDate: r.expiryDate,
    stockKg: Number(r.stockKg),
    lowStockThreshold: Number(r.lowStockThreshold),
    status: r.status as StockStatus,
    organic: r.organic,
    season: r.season,
    tags: (r.tags ?? []) as string[],
    description: r.description,
    reviewStatus: r.reviewStatus as ProductReviewStatus,
  }
}

function toFarmer(r: any): Farmer {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    farmName: r.farmName,
    photo: r.photo,
    cover: r.cover ?? undefined,
    bio: r.bio,
    story: r.story,
    methods: (r.methods ?? []) as string[],
    certifications: (r.certifications ?? []) as string[],
    region: r.region as GhanaRegion,
    town: r.town,
    pickupGPS: r.pickupGPS,
    location: r.location as Farmer["location"],
    farmToHubRadiusKm: Number(r.farmToHubRadiusKm),
    rating: Number(r.rating),
    reviewCount: r.reviewCount,
    joinedYear: r.joinedYear,
    onTimeRate: Number(r.onTimeRate),
  }
}

function toBundle(r: any): Bundle {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    image: r.image,
    type: r.type,
    items: (r.items ?? []) as Bundle["items"],
    price: Number(r.price),
    frequency: r.frequency,
    serves: r.serves,
    popular: r.popular,
  }
}

function toRecipe(r: any): Recipe {
  return {
    id: r.id,
    name: r.name,
    image: r.image,
    time: r.time,
    productIds: (r.productIds ?? []) as string[],
    description: r.description || undefined,
    category: r.category || undefined,
    serves: r.serves || undefined,
    difficulty: r.difficulty || undefined,
    ingredients: (r.ingredients ?? []) as Recipe["ingredients"],
    steps: (r.steps ?? []) as string[],
    tip: r.tip || undefined,
  }
}

function toOrder(r: any): Order {
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

/* --------------------------------- reads ----------------------------------- */

export interface CatalogSnapshot {
  products: Product[]
  farmers: Farmer[]
  bundles: Bundle[]
  recipes: Recipe[]
  orders: Order[]
}

/** Full catalog snapshot used to hydrate the client data-store at boot. */
export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  const [pRows, fRows, bRows, rRows, oRows] = await Promise.all([
    db.select().from(productsTable),
    db.select().from(farmersTable),
    db.select().from(bundlesTable),
    db.select().from(recipesTable),
    db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)),
  ])
  // Only verified sellers (and their produce) appear on the storefront.
  // Pending/rejected KYC applicants live solely in the admin queue.
  const verifiedFarmers = fRows.filter(
    (f) => (f.kycStatus ?? "verified") === "verified",
  )
  const verifiedFarmerIds = new Set(verifiedFarmers.map((f) => f.id))
  return {
    products: pRows
      .filter((p) => verifiedFarmerIds.has(p.farmerId))
      .map(toProduct),
    farmers: verifiedFarmers.map(toFarmer),
    bundles: bRows.map(toBundle),
    recipes: rRows.map(toRecipe),
    orders: oRows.map(toOrder),
  }
}

/* -------------------------- product persistence ---------------------------- */

/**
 * Persist a full product record (insert or update). The client computes the
 * record optimistically; this mirrors it to the database. Any signed-in user
 * may call it (a farmer adding produce); staff approval still gates visibility
 * via reviewStatus.
 */
export async function persistProduct(p: Product): Promise<void> {
  await requireUser()
  const row = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    farmerId: p.farmerId,
    image: p.image,
    unit: p.unit,
    variableWeight: p.variableWeight,
    estWeightKg: p.estWeightKg,
    pricePerKg: p.pricePerKg,
    priceMin: p.priceMin,
    priceMax: p.priceMax,
    refrigerationRequired: p.refrigerationRequired,
    shelfLifeDays: p.shelfLifeDays,
    expiryDate: p.expiryDate,
    stockKg: p.stockKg,
    lowStockThreshold: p.lowStockThreshold,
    status: p.status,
    organic: p.organic,
    season: p.season,
    tags: p.tags,
    description: p.description,
    reviewStatus: p.reviewStatus ?? "pending",
    updatedAt: new Date(),
  }
  await db
    .insert(productsTable)
    .values(row)
    .onConflictDoUpdate({ target: productsTable.id, set: row })
}

/** Update stock + derived status for a product. */
export async function persistProductStock(
  productId: string,
  stockKg: number,
  status: StockStatus,
): Promise<void> {
  await requireUser()
  await db
    .update(productsTable)
    .set({ stockKg, status, updatedAt: new Date() })
    .where(eq(productsTable.id, productId))
}

/** Staff moderation decision on a pending listing. */
export async function persistProductReview(
  productId: string,
  review: ProductReviewStatus,
): Promise<void> {
  await requireStaff()
  await db
    .update(productsTable)
    .set({ reviewStatus: review, updatedAt: new Date() })
    .where(eq(productsTable.id, productId))
}

/* --------------------------- farmer persistence ---------------------------- */

/** Persist a full farmer record (insert or update). */
export async function persistFarmer(f: Farmer, ownerUserId?: string): Promise<void> {
  await requireUser()
  const row = {
    id: f.id,
    slug: f.slug,
    name: f.name,
    farmName: f.farmName,
    photo: f.photo,
    cover: f.cover ?? null,
    bio: f.bio,
    story: f.story,
    methods: f.methods,
    certifications: f.certifications,
    region: f.region,
    town: f.town,
    pickupGPS: f.pickupGPS,
    location: f.location,
    farmToHubRadiusKm: f.farmToHubRadiusKm,
    rating: f.rating,
    reviewCount: f.reviewCount,
    joinedYear: f.joinedYear,
    onTimeRate: f.onTimeRate,
    ownerUserId: ownerUserId ?? null,
    updatedAt: new Date(),
  }
  await db
    .insert(farmersTable)
    .values(row)
    .onConflictDoUpdate({ target: farmersTable.id, set: row })
}

/** Patch fields on an existing farmer (e.g. photo, cover, bio). */
export async function persistFarmerPatch(
  farmerId: string,
  patch: Partial<Farmer>,
): Promise<void> {
  await requireUser()
  // Only persist known columns.
  const allowed: Record<string, unknown> = {}
  for (const k of [
    "name",
    "farmName",
    "photo",
    "cover",
    "bio",
    "story",
    "methods",
    "certifications",
    "region",
    "town",
    "pickupGPS",
  ] as const) {
    if (k in patch && (patch as Record<string, unknown>)[k] !== undefined) {
      allowed[k] = (patch as Record<string, unknown>)[k]
    }
  }
  if (Object.keys(allowed).length === 0) return
  allowed.updatedAt = new Date()
  await db.update(farmersTable).set(allowed).where(eq(farmersTable.id, farmerId))
}
