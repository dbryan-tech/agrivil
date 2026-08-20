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
        className="ga-page-in relative z-[1] flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-[#FDFDFB] shadow-2xl sm:rounded-[28px] border border-black/[0.04]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ga-press absolute right-3.5 top-3.5 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#211A12] shadow-xs backdrop-blur-md hover:bg-[#EDE8DF]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 overflow-y-auto sm:grid-cols-2">
          {/* image */}
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[360px] bg-[#EDE8DF]/40">
            <SmartImage src={product.image} alt={product.name} fill className="object-cover" />
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.organic && (
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#0B3B25]/95 px-2 py-[3px] text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  <Leaf className="h-3 w-3" strokeWidth={2.5} />
                  Organic
                </span>
              )}
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/45 px-2 py-[3px] text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fresh.color || '#0B3B25' }} />
                {fresh.label}
              </span>
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col p-5 sm:p-6">
            <Link
              href={`/farmers/${farmer.slug}`}
              onClick={onClose}
              className="text-xs font-semibold text-[#5C5247] transition-colors hover:text-[#0B3B25]"
            >
              {farmer.farmName} · {farmer.region}
            </Link>

            <h2 className="ga-headline mt-1 text-2xl font-black text-[#211A12]">{product.name}</h2>

            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5"
                    style={{
                      fill: i < rounded ? '#F0A81E' : 'transparent',
                      color: i < rounded ? '#F0A81E' : '#EAE5DB',
                    }}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-[#211A12]">{farmer.rating.toFixed(1)}</span>
              <span className="text-xs text-[#5C5247]">({farmer.reviewCount} reviews)</span>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#5C5247]">
              {product.description}
            </p>

            {/* price */}
            <div className="mt-4 flex items-baseline gap-1.5">
              {multi && <span className="text-xs font-medium text-[#5C5247]">from</span>}
              <span className="ga-price text-3xl font-black leading-none text-[#211A12]">
                {formatGHS(estimate)}
              </span>
              <span className="text-xs font-medium text-[#5C5247]">/ {unitLabel}</span>
            </div>
            {product.variableWeight && (
              <p className="mt-1 text-xs text-[#5C5247]">
                Estimated weight — final price reconciled after picking.
              </p>
            )}
            {multi && (
              <span className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-bold text-[#7A3F1C]">
                <Users className="h-3.5 w-3.5" />
                {group.count} farmers sell this — compare on the product page
              </span>
            )}

            {/* delivery hint */}
            <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EDE8DF] px-3 py-1.5 text-xs font-bold text-[#211A12]">
              <Truck className="h-3.5 w-3.5 text-[#0B3B25]" />
              {product.refrigerationRequired ? 'Cold-chain delivery' : 'Same-day delivery available'}
            </div>

            {/* quantity + add */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 items-center rounded-full border border-black/[0.08] bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="ga-press flex h-full w-10 items-center justify-center rounded-l-full text-[#211A12] hover:bg-[#EDE8DF] disabled:opacity-40"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-black tabular-nums text-[#211A12]">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="ga-press flex h-full w-10 items-center justify-center rounded-r-full text-[#211A12] hover:bg-[#EDE8DF]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={[
                  'ga-press ga-sheen flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-black transition-all duration-300',
                  added
                    ? 'bg-[#0B3B25]/12 text-[#0B3B25] ring-1 ring-[#0B3B25]/30'
                    : 'bg-[#0B3B25] text-white hover:bg-[#072618] shadow-sm',
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
              className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#0B3B25] hover:gap-2 transition-all"
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
