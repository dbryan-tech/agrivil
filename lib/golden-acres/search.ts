// Lightweight client-side search suggestion engine.
// Builds typeahead suggestions (products, categories, farms) from the live
// catalog. Products are grouped by canonical name so duplicate multi-farmer
// listings collapse into a single suggestion.

import { groupOffers } from '@/lib/golden-acres/grouping'
import type { Product, Farmer } from '@/lib/golden-acres/types'

export type Suggestion =
  | { kind: 'product'; label: string; sublabel: string; image: string; slug: string; priceFrom: number }
  | { kind: 'category'; label: string; count: number }
  | { kind: 'farm'; label: string; sublabel: string; slug: string; image: string }

function norm(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, '').trim()
}

/** Score a haystack against a query: prefix > word-boundary > substring. */
function score(haystack: string, q: string): number {
  const h = norm(haystack)
  if (!h) return 0
  if (h.startsWith(q)) return 100 - h.length * 0.01
  if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(h)) return 70
  if (h.includes(q)) return 40
  return 0
}

export interface SuggestOptions {
  products: Product[]
  farmers: Farmer[]
  limitProducts?: number
  limitFarms?: number
}

export function buildSuggestions(rawQuery: string, opts: SuggestOptions): Suggestion[] {
  const q = norm(rawQuery)
  if (q.length < 2) return []

  const { products, farmers, limitProducts = 6, limitFarms = 3 } = opts
  const out: Suggestion[] = []

  // ---- Products (grouped by canonical name) ----
  const groups = groupOffers(products)
  const scoredProducts = groups
    .map((g) => {
      const s = Math.max(
        score(g.name, q),
        ...g.offers.map((o) => Math.max(...o.tags.map((t) => score(t, q)), 0)),
      )
      return { g, s }
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limitProducts)

  for (const { g } of scoredProducts) {
    out.push({
      kind: 'product',
      label: g.name,
      sublabel: g.count > 1 ? `${g.count} farms · from` : g.lead.category,
      image: g.lead.image,
      slug: g.lead.slug,
      priceFrom: g.minPrice,
    })
  }

  // ---- Categories ----
  const catCounts = new Map<string, number>()
  for (const p of products) catCounts.set(p.category, (catCounts.get(p.category) ?? 0) + 1)
  for (const [cat, count] of catCounts) {
    if (score(cat, q) > 0) out.push({ kind: 'category', label: cat, count })
  }

  // ---- Farms ----
  const scoredFarms = farmers
    .map((f) => ({ f, s: Math.max(score(f.farmName, q), score(f.name, q), score(f.region, q)) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limitFarms)

  for (const { f } of scoredFarms) {
    out.push({
      kind: 'farm',
      label: f.farmName,
      sublabel: f.region,
      slug: f.slug,
      image: f.photo,
    })
  }

  return out
}

/** Popular fallback terms shown before the user types (recent/popular). */
export const POPULAR_SEARCHES = [
  'Tomatoes',
  'Plantain',
  'Pepper',
  'Yam',
  'Okra',
  'Garden eggs',
] as const
