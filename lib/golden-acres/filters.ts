// Golden Acres — marketplace faceted filter + sort engine.
// ---------------------------------------------------------------------------
// Pure, framework-free functions that power the shop catalog. The engine works
// at the OFFER level (each Product is one farmer's offer of a canonical item),
// joins farmer metadata for seller/region/rating facets, then collapses the
// surviving offers into one card per product via groupOffers().
//
// Everything here is deterministic and side-effect-free so it can run in a
// useMemo on the client and (later) be unit-tested or reused server-side.

import type { Farmer, Product, ProduceCategory } from './types'
import { groupOffers, offerFromPrice, type OfferGroup } from './grouping'
import { daysUntil } from './format'

export type SortKey =
  | 'relevance'
  | 'fresh'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'popular'
  | 'name'

export interface FilterState {
  category: ProduceCategory | 'All'
  query: string
  /** inclusive price floor (per-unit estimate), GH₵ */
  priceMin: number | null
  /** inclusive price ceiling (per-unit estimate), GH₵ */
  priceMax: number | null
  organicOnly: boolean
  inStockOnly: boolean
  /** minimum farmer rating, e.g. 4 means "4 stars & up" */
  minRating: number | null
  /** selected farmer ids (OR within facet) */
  sellers: string[]
  /** selected regions (OR within facet) */
  regions: string[]
  /** freshness buckets: 'today' | 'fresh' | 'soon' (OR within facet) */
  freshness: string[]
  sort: SortKey
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  query: '',
  priceMin: null,
  priceMax: null,
  organicOnly: false,
  inStockOnly: false,
  minRating: null,
  sellers: [],
  regions: [],
  freshness: [],
  sort: 'relevance',
}

export interface FacetCount {
  value: string
  label: string
  count: number
}

export interface Facets {
  categories: FacetCount[]
  sellers: FacetCount[]
  regions: FacetCount[]
  freshness: FacetCount[]
  ratings: FacetCount[]
  organicCount: number
  inStockCount: number
  /** price bounds across the currently category/query-scoped set */
  priceFloor: number
  priceCeil: number
  total: number
}

// ---- freshness bucketing ----------------------------------------------------

export function freshnessBucket(expiryDate: string): 'today' | 'fresh' | 'soon' {
  const left = daysUntil(expiryDate)
  if (left <= 2) return 'soon'
  if (left <= 4) return 'fresh'
  return 'today'
}

const FRESHNESS_LABELS: Record<string, string> = {
  today: 'Just harvested',
  fresh: 'Fresh',
  soon: 'Use soon',
}

// ---- core predicates --------------------------------------------------------

function matchesQuery(p: Product, q: string): boolean {
  if (!q) return true
  const needle = q.toLowerCase()
  return (
    p.name.toLowerCase().includes(needle) ||
    p.category.toLowerCase().includes(needle) ||
    p.season.toLowerCase().includes(needle) ||
    p.tags.some((t) => t.toLowerCase().includes(needle))
  )
}

/**
 * Apply every facet EXCEPT the one named in `except`. Used both for the final
 * result set (except = null) and for computing "live" facet counts that don't
 * zero-out the facet the user is currently choosing within.
 */
function offerPasses(
  p: Product,
  f: FilterState,
  farmerOf: (id: string) => Farmer | undefined,
  except: keyof FilterState | null,
): boolean {
  if (except !== 'category' && f.category !== 'All' && p.category !== f.category) return false
  if (p.status === 'delisted') return false
  if (except !== 'query' && !matchesQuery(p, f.query)) return false

  const price = offerFromPrice(p)
  if (except !== 'priceMin' && f.priceMin != null && price < f.priceMin) return false
  if (except !== 'priceMax' && f.priceMax != null && price > f.priceMax) return false

  if (except !== 'organicOnly' && f.organicOnly && !p.organic) return false
  if (except !== 'inStockOnly' && f.inStockOnly && p.status !== 'in-stock') return false

  const farmer = farmerOf(p.farmerId)
  if (except !== 'minRating' && f.minRating != null) {
    if (!farmer || farmer.rating < f.minRating) return false
  }
  if (except !== 'sellers' && f.sellers.length > 0) {
    if (!f.sellers.includes(p.farmerId)) return false
  }
  if (except !== 'regions' && f.regions.length > 0) {
    if (!farmer || !f.regions.includes(farmer.region)) return false
  }
  if (except !== 'freshness' && f.freshness.length > 0) {
    if (!f.freshness.includes(freshnessBucket(p.expiryDate))) return false
  }
  return true
}

// ---- sorting ----------------------------------------------------------------

function popularityOf(g: OfferGroup): number {
  // proxy: total review volume across offers + a nudge for bestseller tags
  return g.offers.reduce((sum, o) => {
    const tagBoost = o.tags.includes('Bestseller') ? 500 : 0
    return sum + tagBoost
  }, g.count * 10)
}

function sortGroups(
  groups: OfferGroup[],
  sort: SortKey,
  ratingOf: (farmerId: string) => number,
): OfferGroup[] {
  const gs = [...groups]
  switch (sort) {
    case 'price-low':
      return gs.sort((a, b) => a.minPrice - b.minPrice)
    case 'price-high':
      return gs.sort((a, b) => b.minPrice - a.minPrice)
    case 'fresh':
      return gs.sort((a, b) => a.lead.shelfLifeDays - b.lead.shelfLifeDays)
    case 'rating':
      return gs.sort((a, b) => ratingOf(b.lead.farmerId) - ratingOf(a.lead.farmerId))
    case 'name':
      return gs.sort((a, b) => a.name.localeCompare(b.name))
    case 'popular':
      return gs.sort((a, b) => popularityOf(b) - popularityOf(a))
    case 'relevance':
    default:
      // Relevance: in-stock first, then more offers (competitive), then rating.
      return gs.sort((a, b) => {
        const sa = a.lead.status === 'in-stock' ? 0 : 1
        const sb = b.lead.status === 'in-stock' ? 0 : 1
        if (sa !== sb) return sa - sb
        if (b.count !== a.count) return b.count - a.count
        return ratingOf(b.lead.farmerId) - ratingOf(a.lead.farmerId)
      })
  }
}

// ---- facet counting ---------------------------------------------------------

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1)
}

function countGroupsFor(
  products: Product[],
  f: FilterState,
  farmerOf: (id: string) => Farmer | undefined,
  except: keyof FilterState,
): Product[] {
  return products.filter((p) => offerPasses(p, f, farmerOf, except))
}

/**
 * Group count helper: how many DISTINCT product cards survive a given
 * offer-level subset. Counts unique canonical names.
 */
function distinctCards(offers: Product[]): number {
  const names = new Set<string>()
  for (const o of offers) names.add(o.name.trim().toLowerCase())
  return names.size
}

// ---- public API -------------------------------------------------------------

export interface CatalogResult {
  groups: OfferGroup[]
  facets: Facets
  /** total surviving offers (farmer listings) under the full filter */
  totalOffers: number
  /** total distinct product cards */
  totalCards: number
}

export function runCatalog(
  products: Product[],
  farmers: Farmer[],
  filters: FilterState,
): CatalogResult {
  const farmerMap = new Map(farmers.map((fm) => [fm.id, fm]))
  const farmerOf = (id: string) => farmerMap.get(id)
  const ratingOf = (id: string) => farmerMap.get(id)?.rating ?? 0

  // 1) Final result set — every facet applied.
  const survivingOffers = products.filter((p) => offerPasses(p, filters, farmerOf, null))
  const groups = sortGroups(groupOffers(survivingOffers), filters.sort, ratingOf)

  // 2) Facet counts — each facet computed with itself excluded so options stay
  //    selectable (classic "OR within facet, AND across facets" behaviour).
  const catScoped = countGroupsFor(products, filters, farmerOf, 'category')
  const sellerScoped = countGroupsFor(products, filters, farmerOf, 'sellers')
  const regionScoped = countGroupsFor(products, filters, farmerOf, 'regions')
  const freshScoped = countGroupsFor(products, filters, farmerOf, 'freshness')
  const ratingScoped = countGroupsFor(products, filters, farmerOf, 'minRating')
  const organicScoped = countGroupsFor(products, filters, farmerOf, 'organicOnly')
  const stockScoped = countGroupsFor(products, filters, farmerOf, 'inStockOnly')

  // categories
  const catMap = new Map<string, number>()
  for (const p of catScoped) bump(catMap, p.category)
  const categories: FacetCount[] = (
    [
      'Vegetables',
      'Fruits',
      'Roots & Tubers',
      'Leafy Greens',
      'Grains & Legumes',
      'Herbs & Spices',
    ] as ProduceCategory[]
  )
    .map((c) => ({ value: c, label: c, count: distinctCardsFor(catScoped, (p) => p.category === c) }))
    .filter((c) => c.count > 0)

  // sellers (farmers)
  const sellerCounts = new Map<string, number>()
  for (const p of sellerScoped) bump(sellerCounts, p.farmerId)
  const sellers: FacetCount[] = [...sellerCounts.entries()]
    .map(([id, count]) => ({
      value: id,
      label: farmerMap.get(id)?.farmName ?? id,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  // regions
  const regionCounts = new Map<string, number>()
  for (const p of regionScoped) {
    const r = farmerMap.get(p.farmerId)?.region
    if (r) bump(regionCounts, r)
  }
  const regions: FacetCount[] = [...regionCounts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  // freshness
  const freshness: FacetCount[] = (['today', 'fresh', 'soon'] as const)
    .map((b) => ({
      value: b,
      label: FRESHNESS_LABELS[b],
      count: distinctCardsFor(freshScoped, (p) => freshnessBucket(p.expiryDate) === b),
    }))
    .filter((b) => b.count > 0)

  // ratings (4+, 3+)
  const ratings: FacetCount[] = [4.5, 4, 3]
    .map((threshold) => ({
      value: String(threshold),
      label: `${threshold}+ stars`,
      count: distinctCardsFor(ratingScoped, (p) => (farmerMap.get(p.farmerId)?.rating ?? 0) >= threshold),
    }))
    .filter((r) => r.count > 0)

  // price bounds across the category/query scope (ignoring price facet itself)
  const priceScoped = countGroupsFor(products, filters, farmerOf, 'priceMin').filter((p) =>
    offerPasses(p, { ...filters, priceMin: null, priceMax: null }, farmerOf, 'priceMax'),
  )
  const prices = priceScoped.map(offerFromPrice)
  const priceFloor = prices.length ? Math.floor(Math.min(...prices)) : 0
  const priceCeil = prices.length ? Math.ceil(Math.max(...prices)) : 100

  const facets: Facets = {
    categories,
    sellers,
    regions,
    freshness,
    ratings,
    organicCount: distinctCardsFor(organicScoped, (p) => p.organic),
    inStockCount: distinctCardsFor(stockScoped, (p) => p.status === 'in-stock'),
    priceFloor,
    priceCeil,
    total: distinctCards(survivingOffers),
  }

  return {
    groups,
    facets,
    totalOffers: survivingOffers.length,
    totalCards: groups.length,
  }
}

/** distinct product-card count among offers passing an extra predicate. */
function distinctCardsFor(offers: Product[], pred: (p: Product) => boolean): number {
  const names = new Set<string>()
  for (const o of offers) if (pred(o)) names.add(o.name.trim().toLowerCase())
  return names.size
}

// ---- active-filter summarisation (for chips) --------------------------------

export interface ActiveChip {
  key: string
  label: string
  /** returns the next FilterState with this chip removed */
  clear: (f: FilterState) => FilterState
}

export function activeChips(f: FilterState, farmers: Farmer[]): ActiveChip[] {
  const farmerMap = new Map(farmers.map((fm) => [fm.id, fm]))
  const chips: ActiveChip[] = []

  if (f.category !== 'All') {
    chips.push({
      key: `cat`,
      label: f.category,
      clear: (s) => ({ ...s, category: 'All' }),
    })
  }
  if (f.query.trim()) {
    chips.push({
      key: 'q',
      label: `“${f.query.trim()}”`,
      clear: (s) => ({ ...s, query: '' }),
    })
  }
  if (f.priceMin != null || f.priceMax != null) {
    const lo = f.priceMin != null ? `GH₵${f.priceMin}` : ''
    const hi = f.priceMax != null ? `GH₵${f.priceMax}` : ''
    const label = lo && hi ? `${lo} – ${hi}` : lo ? `${lo}+` : `Under ${hi}`
    chips.push({
      key: 'price',
      label,
      clear: (s) => ({ ...s, priceMin: null, priceMax: null }),
    })
  }
  if (f.organicOnly) {
    chips.push({ key: 'organic', label: 'Organic', clear: (s) => ({ ...s, organicOnly: false }) })
  }
  if (f.inStockOnly) {
    chips.push({ key: 'stock', label: 'In stock', clear: (s) => ({ ...s, inStockOnly: false }) })
  }
  if (f.minRating != null) {
    chips.push({
      key: 'rating',
      label: `${f.minRating}+ stars`,
      clear: (s) => ({ ...s, minRating: null }),
    })
  }
  for (const id of f.sellers) {
    chips.push({
      key: `seller-${id}`,
      label: farmerMap.get(id)?.farmName ?? 'Farm',
      clear: (s) => ({ ...s, sellers: s.sellers.filter((x) => x !== id) }),
    })
  }
  for (const r of f.regions) {
    chips.push({
      key: `region-${r}`,
      label: r,
      clear: (s) => ({ ...s, regions: s.regions.filter((x) => x !== r) }),
    })
  }
  for (const b of f.freshness) {
    chips.push({
      key: `fresh-${b}`,
      label: FRESHNESS_LABELS[b] ?? b,
      clear: (s) => ({ ...s, freshness: s.freshness.filter((x) => x !== b) }),
    })
  }
  return chips
}

export function hasActiveFilters(f: FilterState): boolean {
  return (
    f.category !== 'All' ||
    f.query.trim() !== '' ||
    f.priceMin != null ||
    f.priceMax != null ||
    f.organicOnly ||
    f.inStockOnly ||
    f.minRating != null ||
    f.sellers.length > 0 ||
    f.regions.length > 0 ||
    f.freshness.length > 0
  )
}
