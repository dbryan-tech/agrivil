'use client'

import { useState } from 'react'
import { Check, ChevronDown, Leaf, Star, PackageCheck } from 'lucide-react'
import type { Facets, FilterState } from '@/lib/golden-acres/filters'
import type { ProduceCategory } from '@/lib/golden-acres/types'

interface FilterRailProps {
  filters: FilterState
  facets: Facets
  onChange: (next: Partial<FilterState>) => void
  /** how many seller rows to show before "show more" */
  sellerLimit?: number
}

export function FilterRail({ filters, facets, onChange, sellerLimit = 6 }: FilterRailProps) {
  const [showAllSellers, setShowAllSellers] = useState(false)

  const sellers = showAllSellers ? facets.sellers : facets.sellers.slice(0, sellerLimit)

  function toggleArray(key: 'sellers' | 'regions' | 'freshness', value: string) {
    const cur = filters[key]
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
    onChange({ [key]: next } as Partial<FilterState>)
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Category */}
      <Section title="Category" defaultOpen>
        <div className="flex flex-col gap-0.5">
          <CategoryRow
            label="All produce"
            active={filters.category === 'All'}
            onClick={() => onChange({ category: 'All' })}
          />
          {facets.categories.map((c) => (
            <CategoryRow
              key={c.value}
              label={c.label}
              count={c.count}
              active={filters.category === c.value}
              onClick={() => onChange({ category: c.value as ProduceCategory })}
            />
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price" defaultOpen>
        <PriceFilter filters={filters} facets={facets} onChange={onChange} />
      </Section>

      {/* Customer rating */}
      {facets.ratings.length > 0 && (
        <Section title="Farmer rating" defaultOpen>
          <div className="flex flex-col gap-0.5">
            {facets.ratings.map((r) => {
              const val = Number(r.value)
              const active = filters.minRating === val
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => onChange({ minRating: active ? null : val })}
                  className={rowClass(active)}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5"
                          style={{
                            fill: i < Math.round(val) ? 'var(--ga-star)' : 'transparent',
                            color: i < Math.round(val) ? 'var(--ga-star)' : 'var(--border)',
                          }}
                        />
                      ))}
                    </span>
                    <span className="text-sm">&amp; up</span>
                  </span>
                  <Count n={r.count} active={active} />
                </button>
              )
            })}
          </div>
        </Section>
      )}

      {/* Farmer / seller */}
      {facets.sellers.length > 0 && (
        <Section title="Farm" defaultOpen={false}>
          <div className="flex flex-col gap-0.5">
            {sellers.map((s) => (
              <CheckRow
                key={s.value}
                label={s.label}
                count={s.count}
                checked={filters.sellers.includes(s.value)}
                onClick={() => toggleArray('sellers', s.value)}
              />
            ))}
            {facets.sellers.length > sellerLimit && (
              <button
                type="button"
                onClick={() => setShowAllSellers((v) => !v)}
                className="mt-1 px-2.5 text-left text-xs font-semibold text-primary hover:underline"
              >
                {showAllSellers ? 'Show less' : `Show all ${facets.sellers.length} farms`}
              </button>
            )}
          </div>
        </Section>
      )}

      {/* Region */}
      {facets.regions.length > 0 && (
        <Section title="Region" defaultOpen={false}>
          <div className="flex flex-col gap-0.5">
            {facets.regions.map((r) => (
              <CheckRow
                key={r.value}
                label={r.label}
                count={r.count}
                checked={filters.regions.includes(r.value)}
                onClick={() => toggleArray('regions', r.value)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Freshness */}
      {facets.freshness.length > 0 && (
        <Section title="Freshness" defaultOpen={false}>
          <div className="flex flex-col gap-0.5">
            {facets.freshness.map((b) => (
              <CheckRow
                key={b.value}
                label={b.label}
                count={b.count}
                checked={filters.freshness.includes(b.value)}
                onClick={() => toggleArray('freshness', b.value)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Toggles */}
      <Section title="More filters" defaultOpen>
        <div className="flex flex-col gap-2">
          <ToggleRow
            icon={<Leaf className="h-4 w-4" />}
            label="Certified organic"
            count={facets.organicCount}
            active={filters.organicOnly}
            onClick={() => onChange({ organicOnly: !filters.organicOnly })}
          />
          <ToggleRow
            icon={<PackageCheck className="h-4 w-4" />}
            label="In stock now"
            count={facets.inStockCount}
            active={filters.inStockOnly}
            onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}
          />
        </div>
      </Section>
    </div>
  )
}

// ---- price filter -----------------------------------------------------------

function PriceFilter({
  filters,
  facets,
  onChange,
}: {
  filters: FilterState
  facets: Facets
  onChange: (n: Partial<FilterState>) => void
}) {
  // Derive sensible bands from the live price bounds.
  const bands = buildBands(facets.priceFloor, facets.priceCeil)
  const [lo, setLo] = useState<string>(filters.priceMin != null ? String(filters.priceMin) : '')
  const [hi, setHi] = useState<string>(filters.priceMax != null ? String(filters.priceMax) : '')

  function isActive(min: number | null, max: number | null) {
    return filters.priceMin === min && filters.priceMax === max
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        {bands.map((b) => {
          const active = isActive(b.min, b.max)
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onChange({ priceMin: b.min, priceMax: b.max })}
              className={rowClass(active)}
            >
              <span className="text-sm">{b.label}</span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </button>
          )
        })}
      </div>

      {/* manual range */}
      <form
        className="mt-1 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          onChange({
            priceMin: lo.trim() === '' ? null : Math.max(0, Number(lo)),
            priceMax: hi.trim() === '' ? null : Math.max(0, Number(hi)),
          })
        }}
      >
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ₵
          </span>
          <input
            value={lo}
            onChange={(e) => setLo(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode="decimal"
            placeholder="Min"
            aria-label="Minimum price"
            className="h-9 w-full rounded-lg border border-border bg-card pl-6 pr-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <span className="text-muted-foreground">–</span>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ₵
          </span>
          <input
            value={hi}
            onChange={(e) => setHi(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode="decimal"
            placeholder="Max"
            aria-label="Maximum price"
            className="h-9 w-full rounded-lg border border-border bg-card pl-6 pr-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="ga-press flex h-9 shrink-0 items-center rounded-lg bg-secondary px-3 text-sm font-bold text-foreground hover:bg-secondary/70"
          aria-label="Apply price range"
        >
          Go
        </button>
      </form>
    </div>
  )
}

function buildBands(floor: number, ceil: number) {
  // Produce prices are small (GH₵2–28). Build 4 contextual bands.
  const bands: { id: string; label: string; min: number | null; max: number | null }[] = [
    { id: 'all', label: 'Any price', min: null, max: null },
  ]
  if (ceil <= 30) {
    bands.push(
      { id: 'u5', label: 'Under GH₵5', min: null, max: 5 },
      { id: '5-10', label: 'GH₵5 – GH₵10', min: 5, max: 10 },
      { id: '10-20', label: 'GH₵10 – GH₵20', min: 10, max: 20 },
      { id: '20', label: 'GH₵20 & above', min: 20, max: null },
    )
  } else {
    const q = Math.max(5, Math.round(ceil / 4))
    bands.push(
      { id: 'b1', label: `Under GH₵${q}`, min: null, max: q },
      { id: 'b2', label: `GH₵${q} – GH₵${q * 2}`, min: q, max: q * 2 },
      { id: 'b3', label: `GH₵${q * 2} – GH₵${q * 3}`, min: q * 2, max: q * 3 },
      { id: 'b4', label: `GH₵${q * 3} & above`, min: q * 3, max: null },
    )
  }
  return bands
}

// ---- shared row primitives --------------------------------------------------

function rowClass(active: boolean) {
  return [
    'flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors',
    active ? 'bg-secondary font-semibold text-primary' : 'text-foreground/80 hover:bg-secondary/60',
  ].join(' ')
}

function CategoryRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className={rowClass(active)}>
      <span className="text-sm">{label}</span>
      {active ? <Check className="h-4 w-4" /> : count != null ? <Count n={count} /> : null}
    </button>
  )
}

function CheckRow({
  label,
  count,
  checked,
  onClick,
}: {
  label: string
  count: number
  checked: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className={rowClass(checked)}>
      <span className="flex items-center gap-2">
        <span
          className={[
            'flex h-4 w-4 items-center justify-center rounded border',
            checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card',
          ].join(' ')}
          aria-hidden
        >
          {checked && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        <span className="truncate text-sm">{label}</span>
      </span>
      <Count n={count} active={checked} />
    </button>
  )
}

function ToggleRow({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-foreground hover:border-primary/40',
      ].join(' ')}
      aria-pressed={active}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <Count n={count} active={active} />
    </button>
  )
}

function Count({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={[
        'ml-2 shrink-0 text-xs tabular-nums',
        active ? 'text-primary' : 'text-muted-foreground',
      ].join(' ')}
    >
      {n}
    </span>
  )
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <ChevronDown
          className={[
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}
