'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  X,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Leaf,
  Users,
  ArrowRight,
  Truck,
} from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import { productFarmer, productEstimate } from '@/lib/golden-acres/data'
import type { OfferGroup } from '@/lib/golden-acres/grouping'

export function QuickView({
  group,
  onClose,
}: {
  group: OfferGroup | null
  onClose: () => void
}) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // reset local state whenever a new product opens
  useEffect(() => {
    setQty(1)
    setAdded(false)
  }, [group?.key])

  // close on Escape + lock body scroll while open
  useEffect(() => {
    if (!group) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [group, onClose])

  if (!group) return null

  const product = group.lead
  const farmer = productFarmer(product)
  const fresh = freshnessLabel(product.expiryDate)
  const estimate = productEstimate(product)
  const unitLabel = product.variableWeight ? weight(product.estWeightKg) : product.unit
  const rounded = Math.round(farmer.rating)
  const multi = group.count > 1

  function handleAdd() {
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm ga-fade-in"
      />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        className="ga-page-in relative z-[1] flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ga-press absolute right-3 top-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md ring-1 ring-black/5 backdrop-blur-md hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 overflow-y-auto sm:grid-cols-2">
          {/* image */}
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[360px]">
            <SmartImage src={product.image} alt={product.name} fill className="object-cover" />
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.organic && (
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/95 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
                  <Leaf className="h-3 w-3" strokeWidth={2.5} />
                  Organic
                </span>
              )}
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/40 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fresh.color }} />
                {fresh.label}
              </span>
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col p-5 sm:p-6">
            <Link
              href={`/farmers/${farmer.slug}`}
              onClick={onClose}
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {farmer.farmName} · {farmer.region}
            </Link>

            <h2 className="ga-headline mt-1 text-2xl text-foreground">{product.name}</h2>

            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    style={{
                      fill: i < rounded ? 'var(--ga-star)' : 'transparent',
                      color: i < rounded ? 'var(--ga-star)' : 'var(--border)',
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{farmer.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({farmer.reviewCount} reviews)</span>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* price */}
            <div className="mt-4 flex items-baseline gap-1.5">
              {multi && <span className="text-sm font-medium text-muted-foreground">from</span>}
              <span className="ga-price text-3xl leading-none text-foreground">
                {formatGHS(estimate)}
              </span>
              <span className="text-sm text-muted-foreground">/ {unitLabel}</span>
            </div>
            {product.variableWeight && (
              <p className="mt-1 text-xs text-muted-foreground">
                Estimated weight — final price reconciled after picking.
              </p>
            )}
            {multi && (
              <span className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-semibold text-[var(--ga-copper)]">
                <Users className="h-3.5 w-3.5" />
                {group.count} farmers sell this — compare on the product page
              </span>
            )}

            {/* delivery hint */}
            <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground">
              <Truck className="h-3.5 w-3.5 text-primary" />
              {product.refrigerationRequired ? 'Cold-chain delivery' : 'Same-day delivery available'}
            </div>

            {/* quantity + add */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 items-center rounded-full border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="ga-press flex h-full w-10 items-center justify-center rounded-l-full text-foreground hover:bg-secondary disabled:opacity-40"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="ga-press flex h-full w-10 items-center justify-center rounded-r-full text-foreground hover:bg-secondary"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={[
                  'ga-press ga-sheen flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors duration-300',
                  added
                    ? 'bg-primary/12 text-primary ring-1 ring-primary/30'
                    : 'bg-primary text-primary-foreground hover:bg-field-deep ga-elev-1',
                ].join(' ')}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to basket
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add {qty} to basket
                  </>
                )}
              </button>
            </div>

            <Link
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2"
            >
              View full details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
