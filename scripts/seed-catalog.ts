// One-time catalog seed: pushes the static seed arrays from
// lib/golden-acres/data.ts into Neon so the storefront, farmer portal and ops
// console all read live data. Idempotent via onConflictDoUpdate.
//
//   DATABASE_URL=... pnpm exec tsx scripts/seed-catalog.ts

import { db } from "@/lib/db"
import {
  farmers as farmersTable,
  products as productsTable,
  bundles as bundlesTable,
  recipes as recipesTable,
} from "@/lib/db/schema"
import {
  farmers as seedFarmers,
  products as seedProducts,
  bundles as seedBundles,
  recipes as seedRecipes,
} from "@/lib/golden-acres/data"

async function main() {
  console.log(`[seed-catalog] farmers=${seedFarmers.length} products=${seedProducts.length} bundles=${seedBundles.length} recipes=${seedRecipes.length}`)

  for (const f of seedFarmers) {
    await db
      .insert(farmersTable)
      .values({
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
      })
      .onConflictDoUpdate({
        target: farmersTable.id,
        set: { name: f.name, farmName: f.farmName, bio: f.bio, story: f.story, rating: f.rating, reviewCount: f.reviewCount },
      })
  }
  console.log("[seed-catalog] farmers upserted")

  for (const p of seedProducts) {
    await db
      .insert(productsTable)
      .values({
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
        // Seed catalog is already curated → live.
        reviewStatus: p.reviewStatus ?? "live",
      })
      .onConflictDoUpdate({
        target: productsTable.id,
        set: { stockKg: p.stockKg, status: p.status, priceMin: p.priceMin, priceMax: p.priceMax, reviewStatus: p.reviewStatus ?? "live" },
      })
  }
  console.log("[seed-catalog] products upserted")

  for (const b of seedBundles) {
    await db
      .insert(bundlesTable)
      .values({
        id: b.id,
        slug: b.slug,
        name: b.name,
        description: b.description,
        image: b.image,
        type: b.type,
        items: b.items,
        price: b.price,
        frequency: b.frequency,
        serves: b.serves,
        popular: b.popular ?? false,
      })
      .onConflictDoUpdate({ target: bundlesTable.id, set: { price: b.price, name: b.name } })
  }
  console.log("[seed-catalog] bundles upserted")

  for (const r of seedRecipes) {
    await db
      .insert(recipesTable)
      .values({
        id: r.id,
        name: r.name,
        image: r.image,
        time: r.time,
        productIds: r.productIds,
      })
      .onConflictDoUpdate({ target: recipesTable.id, set: { name: r.name } })
  }
  console.log("[seed-catalog] recipes upserted")

  console.log("[seed-catalog] done ✓")
  process.exit(0)
}

main().catch((e) => {
  console.error("[seed-catalog] failed:", e)
  process.exit(1)
})
