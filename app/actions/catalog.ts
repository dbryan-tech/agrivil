"use server"

import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  products as productsTable,
  farmers as farmersTable,
  reviews as reviewsTable,
} from "@/lib/db/schema"
import {
  products as seedProducts,
  farmers as seedFarmers,
} from "@/lib/golden-acres/data"
import type {
  Product,
  Farmer,
  StockStatus,
  ProductReviewStatus,
} from "@/lib/golden-acres/types"

/* eslint-disable @typescript-eslint/no-explicit-any */
function dbToProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    farmerId: r.farmerId,
    image: r.image,
    unit: r.unit,
    variableWeight: Boolean(r.variableWeight),
    estWeightKg: Number(r.estWeightKg ?? 0),
    pricePerKg: Number(r.pricePerKg ?? 0),
    priceMin: Number(r.priceMin ?? 0),
    priceMax: Number(r.priceMax ?? 0),
    refrigerationRequired: Boolean(r.refrigerationRequired),
    shelfLifeDays: Number(r.shelfLifeDays ?? 0),
    expiryDate: r.expiryDate,
    stockKg: Number(r.stockKg ?? 0),
    lowStockThreshold: Number(r.lowStockThreshold ?? 0),
    status: (r.status as StockStatus) ?? "in-stock",
    organic: Boolean(r.organic),
    season: r.season ?? "",
    tags: Array.isArray(r.tags) ? r.tags : [],
    description: r.description ?? "",
    reviewStatus: (r.reviewStatus as ProductReviewStatus) ?? "live",
  }
}

function dbToFarmer(r: any): Farmer {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    farmName: r.farmName,
    photo: r.photo,
    cover: r.cover ?? undefined,
    bio: r.bio,
    story: r.story,
    methods: Array.isArray(r.methods) ? r.methods : [],
    certifications: Array.isArray(r.certifications) ? r.certifications : [],
    region: r.region,
    town: r.town,
    pickupGPS: r.pickupGPS,
    location: r.location ?? { lat: 5.6037, lng: -0.187 },
    farmToHubRadiusKm: Number(r.farmToHubRadiusKm ?? 0),
    rating: Number(r.rating ?? 5.0),
    reviewCount: Number(r.reviewCount ?? 0),
    joinedYear: Number(r.joinedYear ?? 2024),
    onTimeRate: Number(r.onTimeRate ?? 1.0),
    momoProvider: r.momoProvider ?? undefined,
    momoNumber: r.momoNumber ?? undefined,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Returns the live catalog snapshot from DB, or falls back to seed data.
 */
export async function getCatalogSnapshot(): Promise<{
  products: Product[]
  farmers: Farmer[]
}> {
  try {
    const [dbProducts, dbFarmers] = await Promise.all([
      db.select().from(productsTable),
      db.select().from(farmersTable),
    ])

    const pList =
      dbProducts.length > 0
        ? dbProducts.map(dbToProduct)
        : seedProducts

    const fList =
      dbFarmers.length > 0
        ? dbFarmers.map(dbToFarmer)
        : seedFarmers

    return { products: pList, farmers: fList }
  } catch (err) {
    console.warn("[Catalog] DB fetch failed, returning seed:", err)
    return { products: seedProducts, farmers: seedFarmers }
  }
}

export async function persistProduct(
  product: Product,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db
      .insert(productsTable)
      .values({
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        farmerId: product.farmerId,
        image: product.image,
        unit: product.unit,
        variableWeight: product.variableWeight,
        estWeightKg: product.estWeightKg,
        pricePerKg: product.pricePerKg,
        priceMin: product.priceMin,
        priceMax: product.priceMax,
        refrigerationRequired: product.refrigerationRequired,
        shelfLifeDays: product.shelfLifeDays,
        expiryDate: product.expiryDate,
        stockKg: product.stockKg,
        lowStockThreshold: product.lowStockThreshold,
        status: product.status,
        organic: product.organic,
        season: product.season,
        tags: product.tags,
        description: product.description,
        reviewStatus: product.reviewStatus ?? "live",
      })
      .onConflictDoUpdate({
        target: productsTable.id,
        set: {
          name: product.name,
          category: product.category,
          pricePerKg: product.pricePerKg,
          priceMin: product.priceMin,
          priceMax: product.priceMax,
          stockKg: product.stockKg,
          status: product.status,
          expiryDate: product.expiryDate,
          shelfLifeDays: product.shelfLifeDays,
          refrigerationRequired: product.refrigerationRequired,
          organic: product.organic,
          season: product.season,
          tags: product.tags,
          description: product.description,
          reviewStatus: product.reviewStatus ?? "live",
          updatedAt: new Date(),
        },
      })

    return { ok: true }
  } catch (err) {
    console.error("[Catalog] persistProduct error:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to persist product",
    }
  }
}

export async function persistProductStock(
  productId: string,
  stockKg: number,
  status: StockStatus,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db
      .update(productsTable)
      .set({
        stockKg,
        status,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, productId))

    return { ok: true }
  } catch (err) {
    console.error("[Catalog] persistProductStock error:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update stock",
    }
  }
}

export async function persistProductReview(
  productId: string,
  review: {
    userId: string
    authorName: string
    rating: number
    title?: string
    body?: string
    verifiedPurchase?: boolean
  },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    await db.insert(reviewsTable).values({
      id,
      userId: review.userId,
      authorName: review.authorName,
      productId,
      rating: review.rating,
      title: review.title || null,
      body: review.body || "",
      verifiedPurchase: Boolean(review.verifiedPurchase),
      status: "live",
    })

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to save review",
    }
  }
}

export async function persistFarmer(
  farmer: Farmer,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db
      .insert(farmersTable)
      .values({
        id: farmer.id,
        slug: farmer.slug,
        name: farmer.name,
        farmName: farmer.farmName,
        photo: farmer.photo,
        cover: farmer.cover || null,
        bio: farmer.bio,
        story: farmer.story,
        methods: farmer.methods,
        certifications: farmer.certifications,
        region: farmer.region,
        town: farmer.town,
        pickupGPS: farmer.pickupGPS,
        location: farmer.location,
        farmToHubRadiusKm: farmer.farmToHubRadiusKm,
        rating: farmer.rating,
        reviewCount: farmer.reviewCount,
        baselineRating: farmer.rating,
        baselineReviewCount: farmer.reviewCount,
        joinedYear: farmer.joinedYear,
        onTimeRate: farmer.onTimeRate,
        momoProvider: farmer.momoProvider || null,
        momoNumber: farmer.momoNumber || null,
        kycStatus: "verified",
      })
      .onConflictDoUpdate({
        target: farmersTable.id,
        set: {
          name: farmer.name,
          farmName: farmer.farmName,
          photo: farmer.photo,
          cover: farmer.cover || null,
          bio: farmer.bio,
          story: farmer.story,
          methods: farmer.methods,
          certifications: farmer.certifications,
          region: farmer.region,
          town: farmer.town,
          pickupGPS: farmer.pickupGPS,
          location: farmer.location,
          farmToHubRadiusKm: farmer.farmToHubRadiusKm,
          momoProvider: farmer.momoProvider || null,
          momoNumber: farmer.momoNumber || null,
          updatedAt: new Date(),
        },
      })

    return { ok: true }
  } catch (err) {
    console.error("[Catalog] persistFarmer error:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to persist farmer",
    }
  }
}

export async function persistFarmerPatch(
  farmerId: string,
  patch: Partial<Farmer>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }
    if (patch.name !== undefined) updateData.name = patch.name
    if (patch.farmName !== undefined) updateData.farmName = patch.farmName
    if (patch.bio !== undefined) updateData.bio = patch.bio
    if (patch.story !== undefined) updateData.story = patch.story
    if (patch.methods !== undefined) updateData.methods = patch.methods
    if (patch.certifications !== undefined)
      updateData.certifications = patch.certifications
    if (patch.photo !== undefined) updateData.photo = patch.photo
    if (patch.cover !== undefined) updateData.cover = patch.cover
    if (patch.momoProvider !== undefined)
      updateData.momoProvider = patch.momoProvider
    if (patch.momoNumber !== undefined) updateData.momoNumber = patch.momoNumber
    if (patch.pickupGPS !== undefined) updateData.pickupGPS = patch.pickupGPS

    await db
      .update(farmersTable)
      .set(updateData)
      .where(eq(farmersTable.id, farmerId))

    return { ok: true }
  } catch (err) {
    console.error("[Catalog] persistFarmerPatch error:", err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update farmer",
    }
  }
}
