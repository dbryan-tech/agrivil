'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, Check, Star, Users, Leaf, Eye, MapPin } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import { productFarmer, productEstimate } from '@/lib/golden-acres/data'
import type { OfferGroup } from '@/lib/golden-acres/grouping'

export function ProductListRow({
  group,
  onQuickView,
}: {
  group: OfferGroup
  onQuickView?: (group: OfferGroup) => void
}) {
  const product = group.lead
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const farmer = productFarmer(product)
  // Date-dependent + statically prerendered → compute after mount to avoid a
  // hydration mismatch on the freshness chip.
  const [fresh, setFresh] = useState<ReturnType<typeof freshnessLabel> | null>(
    null,
  )
  useEffect(() => {
    setFresh(freshnessLabel(product.expiryDate))
  }, [product.expiryDate])
  const estimate = productEstimate(product)
  const unitLabel = product.variableWeight ? weight(product.estWeightKg) : product.unit
  const rounded = Math.round(farmer.rating)
  const multi = group.count > 1

  function handleAdd() {
    add(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="ga-card-hover group flex gap-4 overflow-hidden rounded-[20px] border border-black/[0.04] bg-[#FDFDFB] p-3 sm:gap-5 sm:p-4 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
      {/* image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square w-28 shrink-0 overflow-hidden rounded-2xl bg-[#EDE8DF]/40 sm:w-40"
      >
        <SmartImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        {product.organic && (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-[#0B3B25]/95 px-2 py-[2px] text-[9.5px] font-black uppercase tracking-wider text-white shadow-xs">
            <Leaf className="h-2.5 w-2.5" strokeWidth={2.5} />
            Organic
          </span>
        )}
      </Link>

      {/* info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/farmers/${farmer.slug}`}
              className="flex items-center gap-1 text-xs font-semibold text-[#5C5247] transition-colors hover:text-[#0B3B25]"
            >
              <MapPin className="h-3 w-3" />
              <span className="truncate">{farmer.farmName} · {farmer.region}</span>
            </Link>
            <Link href={`/shop/${product.slug}`}>
              <h3 className="mt-0.5 line-clamp-1 text-base font-black leading-tight text-[#211A12] transition-colors group-hover:text-[#0B3B25] sm:text-lg">
                {product.name}
              </h3>
            </Link>
            <div className="mt-1 flex items-center gap-1.5">
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
              <span className="text-xs font-bold text-[#211A12]">{farmer.rating.toFixed(1)}</span>
              <span className="text-xs text-[#5C5247]">({farmer.reviewCount})</span>
            </div>
          </div>

          {/* freshness chip */}
          {fresh && (
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#EDE8DF] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#211A12] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fresh.color || '#0B3B25' }} />
              {fresh.label}
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 hidden text-sm leading-relaxed text-[#5C5247] sm:block">
          {product.description}
        </p>

        {/* bottom row: price + actions */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              {multi && <span className="text-xs font-medium text-[#5C5247]">from</span>}
              <span className="ga-price text-[1.4rem] font-black leading-none text-[#211A12]">
                {formatGHS(estimate)}
              </span>
              <span className="text-xs font-medium text-[#5C5247]">/ {unitLabel}</span>
            </div>
            {multi && (
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#7A3F1C]">
                <Users className="h-3 w-3" />
                Compare {group.count} farmer prices
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(group)}
                className="ga-press inline-flex h-10 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 text-sm font-bold text-[#211A12] hover:bg-[#F7F5F0]"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Quick view</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={[
                'ga-press ga-sheen inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold transition-all duration-300',
                added
                  ? 'bg-[#0B3B25]/12 text-[#0B3B25] ring-1 ring-[#0B3B25]/30'
                  : 'bg-[#0B3B25] text-white hover:bg-[#072618] shadow-sm',
              ].join(' ')}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" /> Add to cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
