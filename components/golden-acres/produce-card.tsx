'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, Check, Heart, Star, Users, Leaf, Eye, GitCompareArrows } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { useCompare } from '@/components/golden-acres/compare/compare-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import { productFarmer, productEstimate } from '@/lib/golden-acres/data'
import type { Product } from '@/lib/golden-acres/types'

export function ProduceCard({
  product,
  offerCount = 1,
  onQuickView,
}: {
  product: Product
  /** when > 1, this card represents a group of competing farmer offers */
  offerCount?: number
  /** when provided, a hover "Quick view" affordance opens a preview modal */
  onQuickView?: (product: Product) => void
}) {
  const { add } = useCart()
  const { isComparing, toggle: toggleCompare, full: compareFull } = useCompare()
  const { account, isSaved, toggleWishlist } = useSession()
  const [added, setAdded] = useState(false)
  const multi = offerCount > 1

  const canSave = account?.role === 'customer'
  const saved = canSave && isSaved(product.id)
  const comparing = isComparing(product.id)

  const farmer = productFarmer(product)
  // Freshness depends on the current date, but these cards are statically
  // prerendered — so compute it only after mount to avoid a server/client
  // hydration mismatch (the badge would otherwise flip label/colour on hydrate).
  const [fresh, setFresh] = useState<ReturnType<typeof freshnessLabel> | null>(
    null,
  )
  useEffect(() => {
    setFresh(freshnessLabel(product.expiryDate))
  }, [product.expiryDate])
  const estimate = productEstimate(product)
  const unitLabel = product.variableWeight ? weight(product.estWeightKg) : product.unit
  const rounded = Math.round(farmer.rating)

  function handleAdd() {
    add(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="ga-card-hover group relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[#FDFDFB] border border-black/[0.04] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
      <div className="relative">
        <Link
          href={`/shop/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-[#EDE8DF]/40"
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
          {/* soft bottom gradient keeps overlay chips legible on any photo */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-90"
          />
        </Link>

        {/* top-left: commerce-critical badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.organic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25]/95 px-2 py-[3px] text-[10px] font-black uppercase tracking-wider text-white shadow-xs backdrop-blur-sm">
              <Leaf className="h-3 w-3" strokeWidth={2.5} />
              Organic
            </span>
          )}
          {product.status === 'low' && (
            <span className="inline-flex w-fit items-center rounded-full bg-[#7A3F1C]/95 px-2 py-[3px] text-[10px] font-black uppercase tracking-wider text-white shadow-xs backdrop-blur-sm">
              Low stock
            </span>
          )}
        </div>

        {/* top-right: wishlist + compare (refined frosted controls) */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
          {canSave && (
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
              aria-pressed={saved}
              className="ga-scale-interactive flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#211A12] shadow-xs backdrop-blur-md"
            >
              <Heart
                className="h-[16px] w-[16px] transition-all duration-300"
                style={{
                  fill: saved ? '#7A3F1C' : 'transparent',
                  color: saved ? '#7A3F1C' : 'currentColor',
                }}
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => toggleCompare(product.id)}
            disabled={!comparing && compareFull}
            aria-label={comparing ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
            aria-pressed={comparing}
            title={!comparing && compareFull ? 'Compare list is full (max 4)' : 'Compare'}
            className={[
              'ga-scale-interactive flex h-8 w-8 items-center justify-center rounded-full shadow-xs backdrop-blur-md transition-colors disabled:opacity-40',
              comparing
                ? 'bg-[#0B3B25] text-white'
                : 'bg-white/90 text-[#211A12]',
            ].join(' ')}
          >
            <GitCompareArrows className="h-[15px] w-[15px]" />
          </button>
        </div>

        {/* hover quick-view affordance */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="ga-press absolute left-1/2 top-1/2 z-[3] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#211A12] opacity-0 shadow-md backdrop-blur-md transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Eye className="h-4 w-4" />
            Quick view
          </button>
        )}

        {/* bottom overlay row: freshness chip + multi-farmer pill */}
        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-2">
          {fresh ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-[3px] text-[9.5px] font-extrabold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fresh.color || '#0B3B25' }} />
              {fresh.label}
            </span>
          ) : (
            <span aria-hidden />
          )}
          {multi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#7A3F1C]/90 px-2 py-[3px] text-[9.5px] font-extrabold uppercase tracking-wider text-white shadow-xs backdrop-blur-md">
              <Users className="h-3 w-3" />
              {offerCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 pt-3">
        <Link
          href={`/farmers/${farmer.slug}`}
          className="truncate text-xs font-semibold text-[#5C5247] transition-colors hover:text-[#0B3B25]"
        >
          {farmer.farmName}
        </Link>

        <Link href={`/shop/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[14px] font-black leading-tight text-[#211A12] transition-colors group-hover:text-[#0B3B25]">
            {product.name}
          </h3>
        </Link>

        {/* rating */}
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
          <span className="text-xs font-bold text-[#211A12]">{farmer.rating.toFixed(1)}</span>
          <span className="text-xs text-[#5C5247]">({farmer.reviewCount})</span>
        </div>

        {/* price */}
        <div className="mt-3 flex items-baseline gap-1.5">
          {multi && <span className="text-xs font-medium text-[#5C5247]">from</span>}
          <span className="ga-price text-[1.35rem] font-black leading-none text-[#211A12]">{formatGHS(estimate)}</span>
          <span className="text-xs font-medium text-[#5C5247]">/ {unitLabel}</span>
        </div>
        <span className="mt-1 block min-h-[1rem] text-[11px] font-medium leading-tight">
          {multi ? (
            <span className="text-[#7A3F1C] font-semibold">Compare {offerCount} farmer prices</span>
          ) : product.variableWeight ? (
            <span className="text-[#5C5247]">Est. weight, priced after picking</span>
          ) : null}
        </span>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className={[
            'ga-press ga-sheen mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-extrabold',
            'transition-all duration-300',
            added
              ? 'bg-[#0B3B25]/12 text-[#0B3B25] ring-1 ring-[#0B3B25]/30'
              : 'bg-[#0B3B25] text-white hover:bg-[#072618] shadow-sm',
          ].join(' ')}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 ga-scale-in" /> Added to basket
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}
