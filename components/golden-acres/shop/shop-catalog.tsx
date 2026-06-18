'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, Leaf, Sprout, SlidersHorizontal, X, Check } from 'lucide-react'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import type { ProduceCategory } from '@/lib/golden-acres/types'
import { groupOffers } from '@/lib/golden-acres/grouping'

const CATEGORIES: (ProduceCategory | 'All')[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Leafy Greens',
  'Grains & Legumes',
  'Herbs & Spices',
]

const PRICE_BANDS = [
  { id: 'all', label: 'Any price', min: 0, max: Infinity },
  { id: 'u5', label: 'Under GH₵5', min: 0, max: 5 },
  { id: '5-10', label: 'GH₵5 – GH₵10', min: 5, max: 10 },
  { id: '10-20', label: 'GH₵10 – GH₵20', min: 10, max: 20 },
  { id: '20', label: 'GH₵20 & above', min: 20, max: Infinity },
] as const

type SortKey = 'fresh' | 'price-low' | 'price-high'

export function ShopCatalog() {
  const { liveProducts } = useDataStore()
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Category is fully URL-driven — the single source of truth shared by the
  // header search select, the header category strip, and the sidebar radios.
  const category = useMemo<ProduceCategory | 'All'>(() => {
    const c = params.get('category')
    return c && CATEGORIES.includes(c as ProduceCategory) ? (c as ProduceCategory) : 'All'
  }, [params])

  const [query, setQuery] = useState(params.get('q') ?? '')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [band, setBand] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('fresh')
  const [mobileFilters, setMobileFilters] = useState(false)

  // Keep the search box in sync when the URL query changes (header search,
  // back/forward). In-page typing updates local state only.
  useEffect(() => {
    setQuery(params.get('q') ?? '')
  }, [params])

  // Update the category by writing to the URL so every entry point agrees.
  function setCategory(next: ProduceCategory | 'All') {
    const sp = new URLSearchParams(Array.from(params.entries()))
    if (next === 'All') sp.delete('category')
    else sp.set('category', String(next))
    const qs = sp.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    // On mobile the filters live in a slide-in drawer that covers the grid —
    // close it on selection so the shopper immediately sees the filtered results.
    setMobileFilters(false)
  }

  const visible = useMemo(() => {
    let list = liveProducts.filter((p) => p.status !== 'delisted')
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (organicOnly) list = list.filter((p) => p.organic)
    const pb = PRICE_BANDS.find((b) => b.id === band)
    if (pb && pb.id !== 'all') list = list.filter((p) => p.priceMin >= pb.min && p.priceMin < pb.max)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    return list
  }, [liveProducts, category, query, organicOnly, band])

  // Collapse competing farmer offers into one card per product, then sort the
  // groups by the selected key (using each group's representative/cheapest offer).
  const groups = useMemo(() => {
    const gs = groupOffers(visible)
    if (sort === 'price-low') return [...gs].sort((a, b) => a.minPrice - b.minPrice)
    if (sort === 'price-high') return [...gs].sort((a, b) => b.minPrice - a.minPrice)
    return [...gs].sort((a, b) => a.lead.shelfLifeDays - b.lead.shelfLifeDays)
  }, [visible, sort])

  const totalListings = visible.length

  function resetFilters() {
    setQuery('')
    setOrganicOnly(false)
    setBand('all')
    setSort('fresh')
    // Clear category + query from the URL in one go.
    router.push(pathname, { scroll: false })
  }

  const FiltersPanel = (
    <div className="flex flex-col gap-6">
      <FilterGroup title="Category">
        <div className="flex flex-col">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={[
                'flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                category === c
                  ? 'bg-secondary font-semibold text-primary'
                  : 'text-foreground/75 hover:bg-secondary/60',
              ].join(' ')}
            >
              {c}
              {category === c && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex flex-col">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setBand(b.id)
                setMobileFilters(false)
              }}
              className={[
                'flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                band === b.id
                  ? 'bg-secondary font-semibold text-primary'
                  : 'text-foreground/75 hover:bg-secondary/60',
              ].join(' ')}
            >
              {b.label}
              {band === b.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Certification">
        <button
          type="button"
          onClick={() => {
            setOrganicOnly((v) => !v)
            setMobileFilters(false)
          }}
          className={[
            'inline-flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors',
            organicOnly
              ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)] text-white'
              : 'border-border bg-card text-foreground hover:border-[var(--ga-leaf)]',
          ].join(' ')}
        >
          <Leaf className="h-4 w-4" />
          Certified Organic only
        </button>
      </FilterGroup>

      <button
        type="button"
        onClick={resetFilters}
        className="text-left text-sm font-semibold text-primary hover:underline"
      >
        Clear all filters
      </button>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* breadcrumb + title */}
      <div className="ga-rise">
        <p className="text-xs text-muted-foreground">
          Home <span className="px-1">/</span> <span className="font-semibold text-foreground">Shop</span>
          {category !== 'All' && (
            <>
              <span className="px-1">/</span>
              <span className="font-semibold text-foreground">{category}</span>
            </>
          )}
        </p>
        <h1 className="ga-headline mt-1 text-3xl text-foreground sm:text-4xl">
          {category === 'All' ? 'All produce' : category}
        </h1>
      </div>

      {/* search */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tomatoes, plantain, pepper…"
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => setMobileFilters(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Always-visible category tabs (mobile/tablet) — instant, like the top bar.
          On desktop the same choices live in the sticky sidebar. */}
      <div className="ga-rail mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={[
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
              category === c
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
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-44 rounded-2xl border border-border bg-card p-4">{FiltersPanel}</div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{groups.length}</span>{' '}
              {groups.length === 1 ? 'product' : 'products'}
              {category !== 'All' && <> in {category}</>}
              {totalListings > groups.length && (
                <span className="text-muted-foreground"> · {totalListings} farmer listings</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort produce"
                className="h-9 rounded-full border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
              >
                <option value="fresh">Freshest first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          {groups.length > 0 ? (
            <div
              key={`${category}-${query}-${organicOnly}-${band}-${sort}`}
              className="ga-stagger mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
            >
              {groups.map((g) => (
                <ProduceCard key={g.key} product={g.lead} offerCount={g.count} />
              ))}
            </div>
          ) : (
            <div className="ga-fade-up mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <Sprout className="h-7 w-7 text-[var(--ga-leaf)]" />
              </div>
              <p className="mt-4 font-semibold text-foreground">No produce matches that search.</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                That crop may be out of season or sold out for today. Try clearing your filters to
                see the full harvest.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="ga-press mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Clear filters
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
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
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
            {FiltersPanel}
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              className="ga-press mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              Show {groups.length} {groups.length === 1 ? 'product' : 'products'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}
