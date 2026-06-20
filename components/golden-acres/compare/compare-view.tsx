'use client'

import Link from 'next/link'
import { GitCompareArrows, X, ShoppingCart, Check, Leaf, Star } from 'lucide-react'
import { useState } from 'react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { EmptyState } from '@/components/golden-acres/ui/empty-state'
import { useCompare } from './compare-context'
import { useCart } from '@/components/golden-acres/cart-context'
import { products as catalog, productFarmer, productEstimate } from '@/lib/golden-acres/data'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import type { Product } from '@/lib/golden-acres/types'

export function CompareView() {
  const { ids, remove, clear } = useCompare()
  const { add } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const items = ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={GitCompareArrows}
          title="Nothing to compare yet"
          description="Browse the shop and tap “Compare” on any product to line them up side by side — price, farm, freshness and more."
          action={{ label: 'Browse the shop', href: '/shop' }}
        />
      </div>
    )
  }

  function handleAdd(p: Product) {
    add(p, 1)
    setAdded(p.id)
    setTimeout(() => setAdded((id) => (id === p.id ? null : id)), 1200)
  }

  // Compute best (lowest) price for highlight.
  const prices = items.map((p) => productEstimate(p))
  const bestPrice = Math.min(...prices)

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    {
      label: 'Price',
      render: (p) => {
        const est = productEstimate(p)
        const isBest = est === bestPrice
        return (
          <span className="flex items-center gap-2">
            <span className="ga-price text-lg text-foreground">{formatGHS(est)}</span>
            {isBest && items.length > 1 && (
              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                Best price
              </span>
            )}
          </span>
        )
      },
    },
    { label: 'Unit', render: (p) => (p.variableWeight ? weight(p.estWeightKg) : p.unit) },
    {
      label: 'Farm',
      render: (p) => {
        const f = productFarmer(p)
        return (
          <Link href={`/farmers/${f.slug}`} className="font-semibold text-primary hover:underline">
            {f.farmName}
          </Link>
        )
      },
    },
    {
      label: 'Rating',
      render: (p) => {
        const f = productFarmer(p)
        return (
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" style={{ fill: 'var(--ga-star)', color: 'var(--ga-star)' }} />
            <span className="font-semibold text-foreground">{f.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({f.reviewCount})</span>
          </span>
        )
      },
    },
    { label: 'Region', render: (p) => productFarmer(p).region },
    {
      label: 'Freshness',
      render: (p) => {
        const fr = freshnessLabel(p.expiryDate)
        return (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: fr.color }} />
            {fr.label}
          </span>
        )
      },
    },
    {
      label: 'Organic',
      render: (p) =>
        p.organic ? (
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <Leaf className="h-4 w-4" /> Yes
          </span>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    { label: 'Shelf life', render: (p) => `${p.shelfLifeDays} days` },
    {
      label: 'Refrigeration',
      render: (p) => (p.refrigerationRequired ? 'Cold-chain' : 'Ambient'),
    },
    {
      label: 'Availability',
      render: (p) =>
        p.status === 'delisted' ? (
          <span className="text-deal">Out of stock</span>
        ) : p.status === 'low' ? (
          <span className="text-[var(--ga-copper)]">Low stock</span>
        ) : (
          <span className="text-primary">In stock</span>
        ),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="ga-headline text-2xl font-extrabold text-foreground sm:text-3xl">
            Compare produce
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} item{items.length > 1 ? 's' : ''} side by side
          </p>
        </div>
        <button
          onClick={clear}
          className="rounded-full border border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-32 border-b border-border p-3" />
              {items.map((p) => (
                <th key={p.id} className="border-b border-l border-border p-3 align-top">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-secondary/40">
                      <SmartImage src={p.image} alt={p.name} fill className="object-cover" />
                      <button
                        onClick={() => remove(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Link
                      href={`/shop/${p.slug}`}
                      className="line-clamp-2 text-sm font-bold leading-tight text-foreground hover:text-primary"
                    >
                      {p.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="even:bg-secondary/20">
                <td className="border-b border-border p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </td>
                {items.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-l border-border p-3 text-sm text-foreground"
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3" />
              {items.map((p) => (
                <td key={p.id} className="border-l border-border p-3">
                  <button
                    onClick={() => handleAdd(p)}
                    className={[
                      'ga-press flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors',
                      added === p.id
                        ? 'bg-primary/12 text-primary ring-1 ring-primary/30'
                        : 'bg-primary text-primary-foreground hover:bg-field-deep',
                    ].join(' ')}
                  >
                    {added === p.id ? (
                      <>
                        <Check className="h-4 w-4" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" /> Add
                      </>
                    )}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
