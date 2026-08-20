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
            <span className="ga-headline text-lg font-black text-[#211A12]">{formatGHS(est)}</span>
            {isBest && items.length > 1 && (
              <span className="rounded-full bg-[#0B3B25]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0B3B25]">
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
          <Link href={`/farmers/${f.slug}`} className="font-bold text-[#7A3F1C] hover:underline">
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
            <Star className="h-4 w-4 fill-[#F0A81E] text-[#F0A81E]" />
            <span className="font-bold text-[#211A12]">{f.rating.toFixed(1)}</span>
            <span className="text-xs text-[#5C5247]">({f.reviewCount})</span>
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
          <span className="flex items-center gap-1.5 font-bold text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: fr.color || '#0B3B25' }} />
            {fr.label}
          </span>
        )
      },
    },
    {
      label: 'Organic',
      render: (p) =>
        p.organic ? (
          <span className="inline-flex items-center gap-1 font-bold text-[#0B3B25]">
            <Leaf className="h-4 w-4" /> Yes
          </span>
        ) : (
          <span className="text-[#5C5247]">No</span>
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
          <span className="text-[#D6402C] font-bold">Out of stock</span>
        ) : p.status === 'low' ? (
          <span className="text-[#7A3F1C] font-bold">Low stock</span>
        ) : (
          <span className="text-[#0B3B25] font-bold">In stock</span>
        ),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="ga-headline text-2xl font-black text-[#211A12] sm:text-3xl">
            Compare produce
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C5247]">
            {items.length} item{items.length > 1 ? 's' : ''} side by side
          </p>
        </div>
        <button
          onClick={clear}
          className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-[#5C5247] transition-colors hover:text-[#211A12] hover:bg-[#EDE8DF]"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-black/[0.04] bg-white shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-32 border-b border-black/[0.06] p-4" />
              {items.map((p) => (
                <th key={p.id} className="border-b border-l border-black/[0.06] p-4 align-top">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-[#EDE8DF]/40">
                      <SmartImage src={p.image} alt={p.name} fill className="object-cover" />
                      <button
                        onClick={() => remove(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Link
                      href={`/shop/${p.slug}`}
                      className="line-clamp-2 text-sm font-black leading-tight text-[#211A12] hover:text-[#0B3B25]"
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
              <tr key={row.label} className="even:bg-[#FAF9F6]">
                <td className="border-b border-black/[0.06] p-4 text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                  {row.label}
                </td>
                {items.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-l border-black/[0.06] p-4 text-sm font-medium text-[#211A12]"
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4" />
              {items.map((p) => (
                <td key={p.id} className="border-l border-black/[0.06] p-4">
                  <button
                    onClick={() => handleAdd(p)}
                    className={[
                      'ga-press flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-black transition-all shadow-xs',
                      added === p.id
                        ? 'bg-[#0B3B25]/12 text-[#0B3B25] ring-1 ring-[#0B3B25]/30'
                        : 'bg-[#0B3B25] text-white hover:bg-[#072618]',
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
