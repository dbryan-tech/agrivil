import "dotenv/config"
import { Pool } from "pg"
import {
  farmers,
  products,
  bundles,
  recipes,
  orders,
  ledger,
  supportTickets as seedTickets,
} from "../lib/golden-acres/data"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const c = await pool.connect()
  try {
    console.log("Seeding farmers...")
    for (const f of farmers) {
      await c.query(
        `INSERT INTO farmers (id, slug, name, "farmName", photo, cover, bio, story, methods, certifications, region, town, "pickupGPS", location, "farmToHubRadiusKm", rating, "reviewCount", "baselineRating", "baselineReviewCount", "joinedYear", "onTimeRate")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         ON CONFLICT (id) DO NOTHING`,
        [
          f.id, f.slug, f.name, f.farmName, f.photo, (f as any).cover ?? null,
          f.bio, f.story, JSON.stringify(f.methods ?? []), JSON.stringify(f.certifications ?? []),
          f.region, f.town, f.pickupGPS, JSON.stringify(f.location),
          f.farmToHubRadiusKm ?? 0, f.rating ?? 0, f.reviewCount ?? 0, f.rating ?? 0, f.reviewCount ?? 0, f.joinedYear, f.onTimeRate ?? 0,
        ],
      )
    }

    console.log("Seeding products...")
    for (const p of products) {
      await c.query(
        `INSERT INTO products (id, slug, name, category, "farmerId", image, unit, "variableWeight", "estWeightKg", "pricePerKg", "priceMin", "priceMax", "refrigerationRequired", "shelfLifeDays", "expiryDate", "stockKg", "lowStockThreshold", status, organic, season, tags, description, "reviewStatus")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
         ON CONFLICT (id) DO NOTHING`,
        [
          p.id, p.slug, p.name, p.category, p.farmerId, p.image, p.unit,
          p.variableWeight ?? false, p.estWeightKg ?? 0, p.pricePerKg ?? 0,
          p.priceMin ?? 0, p.priceMax ?? 0, p.refrigerationRequired ?? false,
          p.shelfLifeDays ?? 0, p.expiryDate, p.stockKg ?? 0, p.lowStockThreshold ?? 0,
          p.status ?? "in-stock", p.organic ?? false, (p as any).season ?? "",
          JSON.stringify(p.tags ?? []), (p as any).description ?? "", (p as any).reviewStatus ?? "live",
        ],
      )
    }

    console.log("Seeding bundles...")
    for (const b of bundles) {
      await c.query(
        `INSERT INTO bundles (id, slug, name, description, image, type, items, price, frequency, serves, popular)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
        [
          b.id, b.slug, b.name, (b as any).description ?? "", b.image, b.type,
          JSON.stringify(b.items ?? []), b.price ?? 0, (b as any).frequency ?? "one-time",
          (b as any).serves ?? "", (b as any).popular ?? false,
        ],
      )
    }

    console.log("Seeding recipes...")
    for (const r of recipes) {
      await c.query(
        `INSERT INTO recipes (id, name, image, time, "productIds")
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
        [r.id, r.name, r.image, (r as any).time ?? "", JSON.stringify((r as any).productIds ?? [])],
      )
    }

    console.log("Seeding orders...")
    for (const o of orders) {
      await c.query(
        `INSERT INTO orders (id, reference, "customerName", "customerPhone", items, status, "placedAt", payment, address, slot, "subtotalEstimate", "subtotalFinal", "deliveryFee", total, "threePL", fault, refunds)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (id) DO NOTHING`,
        [
          o.id, o.reference ?? o.id, (o as any).customerName ?? "Customer",
          (o as any).customerPhone ?? "", JSON.stringify(o.items ?? []), o.status,
          (o as any).placedAt ?? new Date().toISOString(), JSON.stringify((o as any).payment ?? {}),
          JSON.stringify((o as any).address ?? {}), JSON.stringify((o as any).slot ?? {}),
          (o as any).subtotalEstimate ?? 0, (o as any).subtotalFinal ?? null,
          (o as any).deliveryFee ?? 0, (o as any).total ?? 0,
          JSON.stringify((o as any).threePL ?? {}), (o as any).fault ?? "None",
          JSON.stringify((o as any).refunds ?? []),
        ],
      )
    }

    console.log("Seeding ledger...")
    for (const l of ledger) {
      await c.query(
        `INSERT INTO ledger_entries (id, "farmerId", date, "orderRef", "grossSales", commission, "sopPenalty", "netPayout", "payoutStatus", "payoutTimestamp")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id) DO NOTHING`,
        [
          l.id, (l as any).farmerId ?? "f1", (l as any).date ?? "", (l as any).orderRef ?? "",
          (l as any).grossSales ?? 0, (l as any).commission ?? 0, (l as any).sopPenalty ?? 0,
          (l as any).netPayout ?? 0, (l as any).payoutStatus ?? "scheduled",
          (l as any).payoutTimestamp ?? "",
        ],
      )
    }

    if (Array.isArray(seedTickets)) {
      console.log("Seeding support tickets...")
      for (const t of seedTickets as any[]) {
        await c.query(
          `INSERT INTO support_tickets (id, reference, "customerName", "customerPhone", "customerEmail", "orderRef", category, subject, status, priority, messages)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
          [
            t.id, t.reference ?? t.id, t.customerName ?? "Customer", t.customerPhone ?? null,
            t.customerEmail ?? null, t.orderRef ?? null, t.category ?? "general",
            t.subject ?? "", t.status ?? "open", t.priority ?? "normal",
            JSON.stringify(t.messages ?? []),
          ],
        )
      }
    }

    const counts = await c.query(
      `SELECT 'farmers' t, count(*) c FROM farmers
       UNION ALL SELECT 'products', count(*) FROM products
       UNION ALL SELECT 'bundles', count(*) FROM bundles
       UNION ALL SELECT 'recipes', count(*) FROM recipes
       UNION ALL SELECT 'orders', count(*) FROM orders
       UNION ALL SELECT 'ledger', count(*) FROM ledger_entries`,
    )
    console.log("Seed complete:", counts.rows)
  } finally {
    c.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
