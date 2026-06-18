// Golden Acres — offer grouping.
// ---------------------------------------------------------------------------
// The same canonical product (e.g. "Red Onions") is sold by several farmers,
// each as its own Product "offer". These helpers group offers by product name
// so the shop can show one card per product ("from GH₵X · N farmers") and the
// product page can show an Amazon-style "compare offers" panel.
import type { Product } from './types'

export interface OfferGroup {
  /** stable key for the group (canonical name, lowercased) */
  key: string
  name: string
  category: Product['category']
  /** representative offer (cheapest in-stock) used for the card image + link */
  lead: Product
  offers: Product[]
  count: number
  minPrice: number
  maxPrice: number
  anyOrganic: boolean
}

/** Effective "from" price for an offer (per-unit estimate). */
export function offerFromPrice(p: Product): number {
  return p.variableWeight ? p.estWeightKg * p.pricePerKg : p.priceMin
}

/** Rank offers cheapest-first, in-stock before low-stock. */
function byBestValue(a: Product, b: Product): number {
  const sa = a.status === 'low' ? 1 : 0
  const sb = b.status === 'low' ? 1 : 0
  if (sa !== sb) return sa - sb
  return offerFromPrice(a) - offerFromPrice(b)
}

/**
 * Group a flat list of offers into one entry per canonical product name.
 * Each group's `lead` is the best-value offer, and `offers` is sorted.
 */
export function groupOffers(products: Product[]): OfferGroup[] {
  const map = new Map<string, Product[]>()
  for (const p of products) {
    const key = p.name.trim().toLowerCase()
    const arr = map.get(key)
    if (arr) arr.push(p)
    else map.set(key, [p])
  }

  const groups: OfferGroup[] = []
  for (const [key, offers] of map) {
    const sorted = [...offers].sort(byBestValue)
    const prices = offers.map(offerFromPrice)
    groups.push({
      key,
      name: sorted[0].name,
      category: sorted[0].category,
      lead: sorted[0],
      offers: sorted,
      count: offers.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      anyOrganic: offers.some((o) => o.organic),
    })
  }
  return groups
}

export type CompareBadge = 'best-price' | 'closest' | 'top-rated'

/**
 * Decide which superlative badges apply to each offer in a group, given a
 * farmer-rating lookup and a farmer-distance lookup. Returns a map keyed by
 * product id → set of badges.
 */
export function badgeOffers(
  offers: Product[],
  ratingOf: (farmerId: string) => number,
  distanceOf: (farmerId: string) => number,
): Map<string, CompareBadge[]> {
  const result = new Map<string, CompareBadge[]>()
  if (offers.length === 0) return result

  const cheapest = offers.reduce((m, o) => (offerFromPrice(o) < offerFromPrice(m) ? o : m))
  const closest = offers.reduce((m, o) => (distanceOf(o.farmerId) < distanceOf(m.farmerId) ? o : m))
  const topRated = offers.reduce((m, o) => (ratingOf(o.farmerId) > ratingOf(m.farmerId) ? o : m))

  function push(id: string, b: CompareBadge) {
    const arr = result.get(id)
    if (arr) arr.push(b)
    else result.set(id, [b])
  }
  push(cheapest.id, 'best-price')
  push(closest.id, 'closest')
  push(topRated.id, 'top-rated')
  return result
}
