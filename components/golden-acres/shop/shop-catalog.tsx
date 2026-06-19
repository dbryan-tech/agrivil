'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Search,
  Sprout,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { ProductListRow } from '@/components/golden-acres/shop/product-list-row'
import { FilterRail } from '@/components/golden-acres/shop/filter-rail'
import { ActiveChips } from '@/components/golden-acres/shop/active-chips'
import { QuickView } from '@/components/golden-acres/shop/quick-view'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import type { ProduceCategory } from '@/lib/golden-acres/types'
import type { OfferGroup } from '@/lib/golden-acres/grouping'
import {
  runCatalog,
  hasActiveFilters,
  DEFAULT_FILTERS,
  type FilterState,
  type SortKey,
} from '@/lib/golden-acres/filters'

const CATEGORIES: (ProduceCategory | 'All')[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Leafy Greens',
  'Grains & Legumes',
  'Herbs & Spices',
]

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'fresh', label: 'Freshest first' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated farms' },
  { value: 'popular', label: 'Most popular' },
  { value: 'name', label: 'Name: A to Z' },
]

const PAGE_SIZE = 16

// ---- URL <-> FilterState serialisation -------------------------------------

function readFilters(params: URLSearchParams): FilterState {
  const num = (k: string) => {
    const v = params.get(k)
    return v != null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : null
  }
  const list = (k: string) => {
    const v = params.get(k)
    return v ? v.split(',').filter(Boolean) : []
  }
  const cat = params.get('category')
  return {
    category: cat && CATEGORIES.includes(cat as ProduceCategory) ? (cat as ProduceCategory) : 'All',
    query: params.get('q') ?? '',
    priceMin: num('min'),
    priceMax: num('max'),
    organicOnly: params.get('organic') === '1',
    inStockOnly: params.get('instock') === '1',
    minRating: num('rating'),
    sellers: list('sellers'),
    regions: list('regions'),
    freshness: list('fresh'),
    sort: (params.get('sort') as SortKey) || 'relevance',
  }
}

function writeFilters(f: FilterState): string {
  const sp = new URLSearchParams()
  if (f.category !== 'All') sp.set('category', f.category)
  if (f.query.trim()) sp.set('q', f.query.trim())
  if (f.priceMin != null) sp.set('min', String(f.priceMin))
  if (f.priceMax != null) sp.set('max', String(f.priceMax))
  if (f.organicOnly) sp.set('organic', '1')
  if (f.inStockOnly) sp.set('instock', '1')
  if (f.minRating != null) sp.set('rating', String(f.minRating))
  if (f.sellers.length) sp.set('sellers', f.sellers.join(','))
  if (f.regions.length) sp.set('regions', f.regions.join(','))
  if (f.freshness.length) sp.set('fresh', f.freshness.join(','))
  if (f.sort !== 'relevance') sp.set('sort', f.sort)
  return sp.toString()
}

export function ShopCatalog() {
  const { liveProducts, farmers } = useDataStore()
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters = useMemo(() => readFilters(new URLSearchParams(params.toString())), [params])

  // local search input (debounced into the URL)
  const [searchInput, setSearchInput] = useState(filters.query)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [quickView, setQuickView] = useState<OfferGroup | null>(null)

  // keep the search box in sync with the URL (header search / back-forward)
  useEffect(() => {
    setSearchInput(filters.query)
  }, [filters.query])

  // reset pagination whenever the filter signature changes
  const filterSig = writeFilters(filters)
  useEffect(() => {
    setPage(1)
  }, [filterSig])

  const commit = useCallback(
    (next: FilterState) => {
      const qs = writeFilters(next)
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  const update = useCallback(
    (patch: Partial<FilterState>) => commit({ ...filters, ...patch }),
    [commit, filters],
  )

  // debounce the free-text search into the URL
  useEffect(() => {
    if (searchInput === filters.query) return
    const t = setTimeout(() => commit({ ...filters, query: searchInput }), 280)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const { groups, facets, totalOffers } = useMemo(
    () => runCatalog(liveProducts, farmers, filters),
    [liveProducts, farmers, filters],
  )

  const visibleGroups = groups.slice(0, page * PAGE_SIZE)
  const hasMore = visibleGroups.length < groups.length

  function resetAll() {
    setSearchInput('')
    router.push(pathname, { scroll: false })
  }

  const railEl = (
    <FilterRail filters={filters} facets={facets} onChange={update} />
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* breadcrumb + title */}
      <div className="ga-rise">
        <p className="text-xs text-muted-foreground">
          Home <span className="px-1">/</span>{' '}
          <span className="font-semibold text-foreground">Shop</span>
          {filters.category !== 'All' && (
            <>
              <span className="px-1">/</span>
              <span className="font-semibold text-foreground">{filters.category}</span>
            </>
          )}
        </p>
        <h1 className="ga-headline mt-1 text-3xl text-foreground sm:text-4xl">
          {filters.category === 'All' ? 'All produce' : filters.category}
        </h1>
      </div>

      {/* search */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tomatoes, plantain, pepper…"
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileFilters(true)}
          className="ga-press inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {hasActiveFilters(filters) && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
              •
            </span>
          )}
        </button>
      </div>

      {/* category quick-tabs (mobile/tablet) */}
      <div className="ga-rail mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => update({ category: c })}
            className={[
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
              filters.category === c
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground/75 hover:border-primary/40',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Filters</h2>
              {hasActiveFilters(filters) && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            {railEl}
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{groups.length}</span>{' '}
              {groups.length === 1 ? 'product' : 'products'}
              {filters.category !== 'All' && (
                <>
                  {' '}
                  in <span className="font-semibold text-primary">{filters.category}</span>
                </>
              )}
              {totalOffers > groups.length && (
                <span className="text-muted-foreground"> · {totalOffers} farmer listings</span>
              )}
            </p>

            <div className="flex items-center gap-2">
              {/* grid/list toggle */}
              <div className="hidden items-center rounded-full border border-border bg-card p-0.5 sm:flex">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary',
                  ].join(' ')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary',
                  ].join(' ')}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>

              <label className="flex items-center gap-2">
                <span className="hidden text-sm text-muted-foreground sm:inline">Sort</span>
                <select
                  value={filters.sort}
                  onChange={(e) => update({ sort: e.target.value as SortKey })}
                  aria-label="Sort produce"
                  className="h-9 rounded-full border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-[border-color] duration-200 hover:border-primary/50 focus:border-primary"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* active chips */}
          <div className="mt-4">
            <ActiveChips filters={filters} farmers={farmers} onChange={commit} onClearAll={resetAll} />
          </div>

          {/* results */}
          {visibleGroups.length > 0 ? (
            <>
              {view === 'grid' ? (
                <div
                  key={`grid-${filterSig}`}
                  className="ga-stagger mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
                >
                  {visibleGroups.map((g) => (
                    <ProduceCard
                      key={g.key}
                      product={g.lead}
                      offerCount={g.count}
                      onQuickView={() => setQuickView(g)}
                    />
                  ))}
                </div>
              ) : (
                <div key={`list-${filterSig}`} className="ga-stagger mt-5 flex flex-col gap-3">
                  {visibleGroups.map((g) => (
                    <ProductListRow key={g.key} group={g} onQuickView={() => setQuickView(g)} />
                  ))}
                </div>
              )}

              {/* pagination / load more */}
              {hasMore ? (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    Showing {visibleGroups.length} of {groups.length} products
                  </p>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    className="ga-press inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
                  >
                    Show more produce
                  </button>
                </div>
              ) : (
                groups.length > PAGE_SIZE && (
                  <p className="mt-8 text-center text-xs text-muted-foreground">
                    You&apos;ve reached the end — {groups.length} products
                  </p>
                )
              )}
            </>
          ) : (
            <div className="ga-fade-up mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <Sprout className="h-7 w-7 text-[var(--ga-leaf)]" />
              </div>
              <p className="mt-4 font-semibold text-foreground">No produce matches your filters.</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                That crop may be out of season or sold out for today. Try removing a filter or
                clearing everything to see the full harvest.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="ga-press mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFilters(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="ga-headline text-xl text-foreground">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">{railEl}</div>
            <div className="flex items-center gap-3 border-t border-border px-5 py-4">
              {hasActiveFilters(filters) && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="ga-press rounded-full border border-border px-4 py-3 text-sm font-bold text-foreground"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="ga-press flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground"
              >
                Show {groups.length} {groups.length === 1 ? 'product' : 'products'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick view modal */}
      <QuickView group={quickView} onClose={() => setQuickView(null)} />
    </div>
  )
}
