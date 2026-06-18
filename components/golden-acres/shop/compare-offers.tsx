'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Star, MapPin, ShieldCheck, Check, ShoppingCart, Truck } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { formatGHS, weight } from '@/lib/golden-acres/format'
import { badgeOffers, offerFromPrice, type CompareBadge } from '@/lib/golden-acres/grouping'
import type { Product } from '@/lib/golden-acres/types'

const BADGE_META: Record<CompareBadge, { label: string; className: string }> = {
  'best-price': { label: 'Best price', className: 'bg-primary text-primary-foreground' },
  closest: { label: 'Closest farm', className: 'bg-[var(--ga-copper)] text-[var(--ga-copper-foreground)]' },
  'top-rated': { label: 'Top rated', className: 'bg-[var(--ga-star)] text-[#2a1c02]' },
}

// "Compare farmer offers" — Amazon-style other-sellers panel. Lists every farmer
// selling this product, sorted cheapest-first, with superlative badges and a
// per-offer add-to-cart.
export function CompareOffers({
  current,
  offers,
}: {
  current: Product
  offers: Product[]
}) {
  const { add } = useCart()
  const { getFarmer } = useDataStore()
  const [addedId, setAddedId] = useState<string | null>(null)

  if (offers.length <= 1) return null

  const ratingOf = (fid: string) => getFarmer(fid)?.rating ?? 0
  const distanceOf = (fid: string) => getFarmer(fid)?.farmToHubRadiusKm ?? 999
  const badges = badgeOffers(offers, ratingOf, distanceOf)

  function handleAdd(p: Product) {
    add(p, 1)
    setAddedId(p.id)
    setTimeout(() => setAddedId((id) => (id === p.id ? null : id)), 1400)
  }

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="ga-headline text-2xl text-foreground">
            {offers.length} farmers sell this
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare price, freshness and distance — then pick the grower you like best.
          </p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {offers.map((o) => {
          const farmer = getFarmer(o.farmerId)
          const isCurrent = o.id === current.id
          const offerBadges = badges.get(o.id) ?? []
          const price = offerFromPrice(o)
          const unitLabel = o.variableWeight ? weight(o.estWeightKg) : o.unit
          return (
            <li
              key={o.id}
              className={[
                'flex items-center gap-4 rounded-2xl border bg-card p-3 transition-colors',
                isCurrent ? 'border-primary ring-1 ring-primary/30' : 'border-border',
              ].join(' ')}
            >
              <Link
                href={`/shop/${o.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
              >
                <SmartImage src={o.image} alt={o.name} fill className="object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {offerBadges.map((b) => (
                    <span
                      key={b}
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${BADGE_META[b].className}`}
                    >
                      {BADGE_META[b].label}
                    </span>
                  ))}
                  {isCurrent && (
                    <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Viewing
                    </span>
                  )}
                </div>

                <Link
                  href={farmer ? `/farmers/${farmer.slug}` : '#'}
                  className="mt-1 block truncate text-sm font-semibold text-foreground hover:text-primary"
                >
                  {farmer?.farmName ?? 'Local farm'}
                </Link>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-[var(--ga-star)] text-[var(--ga-star)]" />
                    {(farmer?.rating ?? 0).toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {farmer?.region ?? '—'}
                  </span>
                  {o.organic && (
                    <span className="inline-flex items-center gap-1 text-[var(--ga-leaf)]">
                      <ShieldCheck className="h-3 w-3" />
                      Organic
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    {farmer?.farmToHubRadiusKm ?? '—'}km to hub
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="text-right">
                  <div className="ga-price text-lg text-foreground">{formatGHS(price)}</div>
                  <div className="text-[11px] text-muted-foreground">/ {unitLabel}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(o)}
                  className="ga-press inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground"
                  aria-label={`Add ${farmer?.farmName ?? 'farm'} offer to basket`}
                >
                  {addedId === o.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5" /> Add
                    </>
                  )}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
