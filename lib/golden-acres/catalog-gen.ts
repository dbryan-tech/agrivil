// Golden Acres — deterministic multi-farmer catalog generator.
// ---------------------------------------------------------------------------
// Produces additional farmer "offers" for a set of canonical catalog items so
// the same product (e.g. Red Onions) is sold by several farmers competing on
// price, freshness and image — an Amazon-style "other sellers" experience.
//
// Determinism matters: the seed script (Node) and the runtime must agree on the
// exact same listings, so everything is derived from a seeded PRNG keyed by the
// catalog slug. No Math.random, no Date — expiry is computed from a fixed epoch.
import type { Product, ProduceCategory, ProductUnit } from './types'

/* ----------------------------- canonical items ---------------------------- */

interface CatalogItem {
  slug: string
  name: string
  category: ProduceCategory
  unit: ProductUnit
  variable: boolean
  estWeightKg: number
  basePrice: number // GH₵ baseline for one unit (priceMin anchor)
  refrigeration: boolean
  shelfLifeDays: number
  season: string
  organicCommon: boolean
  tags: string[]
  description: string
  /** farmer id of the hand-authored anchor offer to exclude (existing items). */
  anchorFarmer?: string
  /** optional per-offer image variants (besides the canonical image). */
  variants?: number
}

// The 18 hand-authored products are also catalog items so generated offers
// group with them. `anchorFarmer` excludes the authored farmer from the pool.
const EXISTING: CatalogItem[] = [
  { slug: 'roma-tomatoes', name: 'Roma Tomatoes', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 11, refrigeration: true, shelfLifeDays: 6, season: 'Year-round', organicCommon: false, tags: ['Bestseller'], description: 'Firm, sweet Roma tomatoes — ideal for stews, jollof and shito.', anchorFarmer: 'f1', variants: 2 },
  { slug: 'scotch-bonnet', name: 'Scotch Bonnet Peppers', category: 'Herbs & Spices', unit: 'kg', variable: true, estWeightKg: 0.5, basePrice: 13, refrigeration: true, shelfLifeDays: 8, season: 'Year-round', organicCommon: false, tags: ['Hot'], description: 'Blazing-hot, fragrant scotch bonnets — the soul of Ghanaian cooking.', anchorFarmer: 'f1' },
  { slug: 'garden-eggs', name: 'Garden Eggs', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 9, refrigeration: true, shelfLifeDays: 7, season: 'Year-round', organicCommon: false, tags: [], description: 'Tender white garden eggs, perfect for abomu and stews.', anchorFarmer: 'f1' },
  { slug: 'ripe-plantain', name: 'Ripe Plantain', category: 'Fruits', unit: 'bunch', variable: false, estWeightKg: 2.5, basePrice: 18, refrigeration: false, shelfLifeDays: 7, season: 'Year-round', organicCommon: false, tags: ['Bestseller'], description: 'Shade-cured plantain ripening evenly — for kelewele and red-red.', anchorFarmer: 'f2', variants: 2 },
  { slug: 'white-yam', name: 'White Yam Tuber', category: 'Roots & Tubers', unit: 'each', variable: true, estWeightKg: 2.5, basePrice: 18, refrigeration: false, shelfLifeDays: 21, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Hand-graded puna yam — fluffy when boiled or pounded.', anchorFarmer: 'f2' },
  { slug: 'cassava', name: 'Cassava', category: 'Roots & Tubers', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 6, refrigeration: false, shelfLifeDays: 5, season: 'Year-round', organicCommon: false, tags: [], description: 'Freshly dug cassava for fufu, banku and gari.', anchorFarmer: 'f2' },
  { slug: 'crisphead-lettuce', name: 'Crisphead Lettuce', category: 'Leafy Greens', unit: 'each', variable: false, estWeightKg: 0.4, basePrice: 10, refrigeration: true, shelfLifeDays: 5, season: 'Year-round', organicCommon: true, tags: ['Cold-chain'], description: 'Crisp, same-day-harvested lettuce heads.', anchorFarmer: 'f3' },
  { slug: 'green-cabbage', name: 'Green Cabbage', category: 'Leafy Greens', unit: 'each', variable: true, estWeightKg: 1.2, basePrice: 8, refrigeration: true, shelfLifeDays: 10, season: 'Year-round', organicCommon: true, tags: [], description: 'Dense, sweet cabbage heads — raw, steamed or in slaw.', anchorFarmer: 'f3' },
  { slug: 'kontomire', name: 'Kontomire (Cocoyam Leaves)', category: 'Leafy Greens', unit: 'bunch', variable: false, estWeightKg: 0.5, basePrice: 6, refrigeration: true, shelfLifeDays: 3, season: 'Year-round', organicCommon: true, tags: ['Very perishable'], description: 'Tender cocoyam leaves for palava sauce.', anchorFarmer: 'f3' },
  { slug: 'okra', name: 'Okra', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 0.5, basePrice: 7, refrigeration: true, shelfLifeDays: 5, season: 'Year-round', organicCommon: true, tags: [], description: 'Young, tender okra — for okro stew and soups.', anchorFarmer: 'f4' },
  { slug: 'aubergine', name: 'Aubergine', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 10, refrigeration: true, shelfLifeDays: 7, season: 'Year-round', organicCommon: true, tags: [], description: 'Glossy purple aubergines from the Volta hills.', anchorFarmer: 'f4' },
  { slug: 'red-onions', name: 'Red Onions', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 10, refrigeration: false, shelfLifeDays: 30, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Pungent red onions — the base of every Ghanaian pot.', anchorFarmer: 'f5', variants: 2 },
  { slug: 'fresh-maize', name: 'Fresh Maize (Corn)', category: 'Grains & Legumes', unit: 'each', variable: false, estWeightKg: 0.4, basePrice: 3, refrigeration: true, shelfLifeDays: 4, season: 'Jun – Sep', organicCommon: false, tags: ['Seasonal'], description: 'Sweet, milky maize cobs — roast or boil.', anchorFarmer: 'f5' },
  { slug: 'cowpeas', name: 'Cowpeas (Beans)', category: 'Grains & Legumes', unit: 'kg', variable: false, estWeightKg: 1, basePrice: 16, refrigeration: false, shelfLifeDays: 180, season: 'Year-round', organicCommon: false, tags: ['Protein'], description: 'Dried cowpeas for red-red, waakye and gari-and-beans.', anchorFarmer: 'f5' },
  { slug: 'sweet-pineapple', name: 'Sweet Pineapple', category: 'Fruits', unit: 'each', variable: true, estWeightKg: 1.5, basePrice: 12, refrigeration: false, shelfLifeDays: 7, season: 'Year-round', organicCommon: false, tags: ['Bestseller'], description: 'Coastal-grown sugarloaf pineapple at peak ripeness.', anchorFarmer: 'f6', variants: 2 },
  { slug: 'watermelon', name: 'Watermelon', category: 'Fruits', unit: 'each', variable: true, estWeightKg: 4, basePrice: 18, refrigeration: false, shelfLifeDays: 12, season: 'Year-round', organicCommon: false, tags: [], description: 'Juicy, deep-red watermelons sweetened by the coastal breeze.', anchorFarmer: 'f6' },
  { slug: 'fresh-ginger', name: 'Fresh Ginger', category: 'Herbs & Spices', unit: 'kg', variable: true, estWeightKg: 0.3, basePrice: 6, refrigeration: false, shelfLifeDays: 21, season: 'Year-round', organicCommon: false, tags: [], description: 'Knobbly, aromatic ginger root for teas, marinades and shito.', anchorFarmer: 'f6' },
  { slug: 'green-chilli', name: 'Green Chilli', category: 'Herbs & Spices', unit: 'kg', variable: true, estWeightKg: 0.3, basePrice: 7, refrigeration: true, shelfLifeDays: 6, season: 'Year-round', organicCommon: true, tags: [], description: 'Fresh green chillies with a clean, bright heat.', anchorFarmer: 'f4' },
]

// 27 brand-new catalog items (each needs one canonical image).
const NEW: CatalogItem[] = [
  // Vegetables
  { slug: 'carrots', name: 'Carrots', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 12, refrigeration: true, shelfLifeDays: 14, season: 'Year-round', organicCommon: true, tags: [], description: 'Sweet, crunchy carrots — great for salads, stews and juicing.' },
  { slug: 'cucumber', name: 'Cucumber', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 10, refrigeration: true, shelfLifeDays: 7, season: 'Year-round', organicCommon: true, tags: [], description: 'Cool, crisp cucumbers picked young and seedless.' },
  { slug: 'green-bell-pepper', name: 'Green Bell Pepper', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 0.6, basePrice: 16, refrigeration: true, shelfLifeDays: 8, season: 'Year-round', organicCommon: true, tags: [], description: 'Glossy green bell peppers for stir-fries, stews and salads.' },
  { slug: 'shallots', name: 'Shallots', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 15, refrigeration: false, shelfLifeDays: 25, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Pungent Anloga shallots — the prized base for light soup.' },
  { slug: 'green-beans', name: 'Green Beans', category: 'Vegetables', unit: 'kg', variable: true, estWeightKg: 0.5, basePrice: 14, refrigeration: true, shelfLifeDays: 6, season: 'Year-round', organicCommon: true, tags: [], description: 'Tender, snappy green beans harvested young.' },
  // Fruits
  { slug: 'ripe-mango', name: 'Ripe Mango', category: 'Fruits', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 10, refrigeration: false, shelfLifeDays: 6, season: 'Mar – Jul', organicCommon: false, tags: ['Seasonal'], description: 'Honey-sweet mangoes ripened on the tree.' },
  { slug: 'pawpaw', name: 'Pawpaw (Papaya)', category: 'Fruits', unit: 'each', variable: true, estWeightKg: 1.5, basePrice: 12, refrigeration: false, shelfLifeDays: 6, season: 'Year-round', organicCommon: false, tags: [], description: 'Smooth, sweet pawpaw — golden flesh, full of vitamin C.' },
  { slug: 'avocado', name: 'Avocado (Pear)', category: 'Fruits', unit: 'each', variable: true, estWeightKg: 0.4, basePrice: 6, refrigeration: false, shelfLifeDays: 6, season: 'Jun – Oct', organicCommon: false, tags: ['Seasonal'], description: 'Buttery, creamy avocado pears at perfect ripeness.' },
  { slug: 'banana', name: 'Banana', category: 'Fruits', unit: 'bunch', variable: false, estWeightKg: 1.5, basePrice: 14, refrigeration: false, shelfLifeDays: 7, season: 'Year-round', organicCommon: false, tags: [], description: 'Sweet apem bananas — a wholesome everyday snack.' },
  { slug: 'sweet-orange', name: 'Sweet Oranges', category: 'Fruits', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 9, refrigeration: false, shelfLifeDays: 12, season: 'Year-round', organicCommon: false, tags: [], description: 'Juicy, thin-skinned sweet oranges for fresh juice.' },
  { slug: 'coconut', name: 'Fresh Coconut', category: 'Fruits', unit: 'each', variable: false, estWeightKg: 1.2, basePrice: 8, refrigeration: false, shelfLifeDays: 14, season: 'Year-round', organicCommon: false, tags: [], description: 'Young drinking coconuts full of refreshing water.' },
  // Roots & Tubers
  { slug: 'cocoyam', name: 'Cocoyam', category: 'Roots & Tubers', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 9, refrigeration: false, shelfLifeDays: 14, season: 'Year-round', organicCommon: false, tags: [], description: 'Smooth cocoyam corms for boiling, mpotompoto and fufu.' },
  { slug: 'sweet-potato', name: 'Sweet Potato', category: 'Roots & Tubers', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 10, refrigeration: false, shelfLifeDays: 18, season: 'Year-round', organicCommon: true, tags: ['Stores well'], description: 'Orange-fleshed sweet potatoes — roast, boil or fry.' },
  { slug: 'taro', name: 'Taro (Mankani)', category: 'Roots & Tubers', unit: 'kg', variable: true, estWeightKg: 1, basePrice: 11, refrigeration: false, shelfLifeDays: 14, season: 'Year-round', organicCommon: false, tags: [], description: 'Earthy taro roots — a hearty staple for stews.' },
  { slug: 'water-yam', name: 'Water Yam', category: 'Roots & Tubers', unit: 'each', variable: true, estWeightKg: 2, basePrice: 15, refrigeration: false, shelfLifeDays: 18, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Moist water yam, excellent for pounded yam and ampesi.' },
  // Leafy Greens
  { slug: 'spinach', name: 'Spinach (Aleefu)', category: 'Leafy Greens', unit: 'bunch', variable: false, estWeightKg: 0.4, basePrice: 6, refrigeration: true, shelfLifeDays: 4, season: 'Year-round', organicCommon: true, tags: ['Very perishable'], description: 'Tender spinach leaves, harvested the morning we pack.' },
  { slug: 'jute-leaves', name: 'Ayoyo (Jute Leaves)', category: 'Leafy Greens', unit: 'bunch', variable: false, estWeightKg: 0.4, basePrice: 6, refrigeration: true, shelfLifeDays: 3, season: 'Year-round', organicCommon: true, tags: ['Very perishable'], description: 'Fresh ayoyo leaves for a silky northern soup.' },
  { slug: 'curly-kale', name: 'Curly Kale', category: 'Leafy Greens', unit: 'bunch', variable: false, estWeightKg: 0.5, basePrice: 8, refrigeration: true, shelfLifeDays: 5, season: 'Year-round', organicCommon: true, tags: [], description: 'Crinkly, nutrient-dense kale for sautés and smoothies.' },
  { slug: 'spring-greens', name: 'Spring Greens (Alefu)', category: 'Leafy Greens', unit: 'bunch', variable: false, estWeightKg: 0.5, basePrice: 6, refrigeration: true, shelfLifeDays: 4, season: 'Year-round', organicCommon: true, tags: ['Very perishable'], description: 'Soft green leaves for quick, healthy side dishes.' },
  // Grains & Legumes
  { slug: 'brown-rice', name: 'Brown Rice', category: 'Grains & Legumes', unit: 'kg', variable: false, estWeightKg: 1, basePrice: 18, refrigeration: false, shelfLifeDays: 240, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Wholegrain brown rice, milled in small batches.' },
  { slug: 'aromatic-rice', name: 'Local Aromatic Rice', category: 'Grains & Legumes', unit: 'kg', variable: false, estWeightKg: 1, basePrice: 16, refrigeration: false, shelfLifeDays: 240, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Fragrant local rice — perfect for jollof and waakye.' },
  { slug: 'groundnuts', name: 'Groundnuts', category: 'Grains & Legumes', unit: 'kg', variable: false, estWeightKg: 1, basePrice: 20, refrigeration: false, shelfLifeDays: 120, season: 'Year-round', organicCommon: false, tags: ['Protein'], description: 'Raw groundnuts for paste, soup and roasting.' },
  { slug: 'soya-beans', name: 'Soya Beans', category: 'Grains & Legumes', unit: 'kg', variable: false, estWeightKg: 1, basePrice: 17, refrigeration: false, shelfLifeDays: 180, season: 'Year-round', organicCommon: false, tags: ['Protein'], description: 'Protein-rich soya beans for kosua, dawadawa and flour.' },
  { slug: 'millet', name: 'Millet', category: 'Grains & Legumes', unit: 'kg', variable: false, estWeightKg: 1, basePrice: 14, refrigeration: false, shelfLifeDays: 180, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Wholesome millet grain for porridge and koko.' },
  // Herbs & Spices
  { slug: 'lemongrass', name: 'Lemongrass', category: 'Herbs & Spices', unit: 'bunch', variable: false, estWeightKg: 0.2, basePrice: 5, refrigeration: false, shelfLifeDays: 10, season: 'Year-round', organicCommon: true, tags: [], description: 'Aromatic lemongrass stalks for teas and marinades.' },
  { slug: 'garlic', name: 'Garlic', category: 'Herbs & Spices', unit: 'kg', variable: true, estWeightKg: 0.3, basePrice: 30, refrigeration: false, shelfLifeDays: 60, season: 'Year-round', organicCommon: false, tags: ['Stores well'], description: 'Pungent garlic bulbs — a kitchen essential.' },
  { slug: 'turmeric', name: 'Fresh Turmeric', category: 'Herbs & Spices', unit: 'kg', variable: true, estWeightKg: 0.3, basePrice: 24, refrigeration: false, shelfLifeDays: 21, season: 'Year-round', organicCommon: true, tags: [], description: 'Vivid turmeric root for teas, curries and wellness shots.' },
]

export const CATALOG_ITEMS: CatalogItem[] = [...EXISTING, ...NEW]

/* ------------------------------ seller pool -------------------------------- */
// All ten farmers sell in the marketplace so each product can show real
// competition. Farmers known to be certified-organic are flagged for organic.
const SELLERS = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
const ORGANIC_FARMERS = new Set(['f3', 'f4', 'f8'])

const FARMER_SLUGS: Record<string, string> = {
  f1: 'auntie-ama', f2: 'kwame-mensah', f3: 'esi-boateng', f4: 'yaw-darko',
  f5: 'adwoa-sarpong', f6: 'kojo-asante', f7: 'mahama-sulemana', f8: 'hawa-issah',
  f9: 'fati-abukari', f10: 'adzaho-brothers',
}

/* ------------------------------- PRNG utils -------------------------------- */

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Fixed epoch so expiry dates are deterministic across Node + runtime.
const EPOCH = new Date('2026-06-18T00:00:00Z')
function inDaysFixed(n: number): string {
  const d = new Date(EPOCH)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

/* ------------------------------- generator --------------------------------- */

export function generateOffers(): Product[] {
  const out: Product[] = []

  for (const item of CATALOG_ITEMS) {
    const rand = mulberry32(hashString('ga-' + item.slug))
    // 3–6 generated offers per item (in addition to any hand-authored anchor).
    const offerCount = 3 + Math.floor(rand() * 4)

    // Shuffle the seller pool deterministically, excluding the anchor farmer.
    const pool = SELLERS.filter((f) => f !== item.anchorFarmer)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const chosen = pool.slice(0, Math.min(offerCount, pool.length))

    // For existing items the clean slug is taken by the anchor; for new items
    // the first chosen farmer gets the clean canonical slug.
    let cleanSlugUsed = Boolean(item.anchorFarmer)

    chosen.forEach((farmerId, idx) => {
      const r = mulberry32(hashString(item.slug + ':' + farmerId))
      // price variance ±18%
      const factor = 0.82 + r() * 0.36
      const priceMid = round2(item.basePrice * factor)
      const priceMin = round2(priceMid * 0.95)
      const priceMax = round2(priceMid * 1.08)
      const pricePerKg = item.variable
        ? round2(priceMid / Math.max(0.1, item.estWeightKg))
        : 0

      const organic =
        ORGANIC_FARMERS.has(farmerId) && (item.organicCommon || r() < 0.5)

      // stock + status (avoid delisted so generated offers stay visible)
      const stockKg = Math.round(20 + r() * 240)
      const lowStockThreshold = Math.max(8, Math.round(stockKg * 0.15))
      const low = r() < 0.18
      const stock = low ? Math.round(lowStockThreshold * 0.6) : stockKg
      const status: Product['status'] = stock <= lowStockThreshold ? 'low' : 'in-stock'

      const shelf = Math.max(2, item.shelfLifeDays - Math.floor(r() * 3))
      const freshOffset = 1 + Math.floor(r() * Math.min(shelf, 6))

      // image: canonical or a variant (for marquee items with variants)
      let image = `/golden-acres/produce/${item.slug}.png`
      if (item.variants && item.variants > 0) {
        const pick = Math.floor(r() * (item.variants + 1)) // 0 = canonical
        if (pick > 0) image = `/golden-acres/produce/${item.slug}-${pick}.png`
      }

      // slug: clean canonical for the first new-item offer, suffixed otherwise
      let slug = `${item.slug}-${FARMER_SLUGS[farmerId] ?? farmerId}`
      if (!cleanSlugUsed) {
        slug = item.slug
        cleanSlugUsed = true
      }

      const tags = [...item.tags]
      if (organic && !tags.includes('Organic')) tags.unshift('Organic')
      if (status === 'low' && !tags.includes('Low stock')) tags.push('Low stock')

      out.push({
        id: `g-${item.slug}-${farmerId}`,
        slug,
        name: item.name,
        category: item.category,
        farmerId,
        image,
        unit: item.unit,
        variableWeight: item.variable,
        estWeightKg: item.estWeightKg,
        pricePerKg,
        priceMin,
        priceMax,
        refrigerationRequired: item.refrigeration,
        shelfLifeDays: shelf,
        expiryDate: inDaysFixed(freshOffset),
        stockKg: stock,
        lowStockThreshold,
        status,
        organic,
        season: item.season,
        tags,
        description: item.description,
        reviewStatus: 'live',
      })
      void idx
    })
  }

  return out
}

// A flat list of all canonical catalog images that the generator references,
// so an image-availability check / seed audit can confirm coverage.
export function referencedImages(): string[] {
  const set = new Set<string>()
  for (const item of CATALOG_ITEMS) {
    set.add(`/golden-acres/produce/${item.slug}.png`)
    if (item.variants) {
      for (let i = 1; i <= item.variants; i++) {
        set.add(`/golden-acres/produce/${item.slug}-${i}.png`)
      }
    }
  }
  return [...set]
}
