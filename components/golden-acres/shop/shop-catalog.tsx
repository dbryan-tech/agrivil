'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Leaf, Sprout } from 'lucide-react'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import type { ProduceCategory } from '@/lib/golden-acres/types'

const CATEGORIES: (ProduceCategory | 'All')[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Leafy Greens',
  'Grains & Legumes',
  'Herbs & Spices',
]

type SortKey = 'fresh' | 'price-low' | 'price-high'

export function ShopCatalog() {
  const { liveProducts } = useDataStore()
  const [category, setCategory] = useState<ProduceCategory | 'All'>('All')
  const [query, setQuery] = useState('')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('fresh')

  const visible = useMemo(() => {
    let list = liveProducts.filter((p) => p.status !== 'delisted')
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (organicOnly) list = list.filter((p) => p.organic)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (sort === 'price-low') list = [...list].sort((a, b) => a.priceMin - b.priceMin)
    if (sort === 'price-high') list = [...list].sort((a, b) => b.priceMin - a.priceMin)
    if (sort === 'fresh')
      list = [...list].sort((a, b) => a.shelfLifeDays - b.shelfLifeDays)
    return list
  }, [liveProducts, category, query, organicOnly, sort])

  function resetFilters() {
    setCategory('All')
    setQuery('')
    setOrganicOnly(false)
    setSort('fresh')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="ga-rise">
        <p className="ga-eyebrow text-primary">The Market</p>
        <h1 className="ga-display mt-3 text-4xl text-foreground sm:text-5xl">
          Today&apos;s <span className="ga-serif font-normal text-primary">harvest</span>
        </h1>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Every item is picked to order and priced by weight. The freshness badge shows
          how soon to enjoy it — we route your basket to the nearest farm first.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tomatoes, plantain, pepper…"
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOrganicOnly((v) => !v)}
            className={[
              'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors',
              organicOnly
                ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)] text-white'
                : 'border-border bg-card text-foreground hover:border-[var(--ga-leaf)]',
            ].join(' ')}
          >
            <Leaf className="h-4 w-4" />
            Organic
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort produce"
              className="bg-transparent text-sm font-semibold text-foreground outline-none"
            >
              <option value="fresh">Freshest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              category === c
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {visible.length} {visible.length === 1 ? 'item' : 'items'} available
      </p>

      {visible.length > 0 ? (
        <div
          key={`${category}-${query}-${organicOnly}-${sort}`}
          className="ga-stagger mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {visible.map((p) => (
            <ProduceCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="ga-fade-up mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Sprout className="h-7 w-7 text-[var(--ga-leaf)]" />
          </div>
          <p className="mt-4 font-semibold text-foreground">
            No produce matches that search.
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            That crop may be out of season or sold out for today. Try clearing your
            filters to see the full harvest.
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
  )
}
