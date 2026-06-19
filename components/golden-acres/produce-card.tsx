'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Check, Heart, Star, Users, Leaf, Eye } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
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
  const { account, isSaved, toggleWishlist } = useSession()
  const [added, setAdded] = useState(false)
  const multi = offerCount > 1

  const canSave = account?.role === 'customer'
  const saved = canSave && isSaved(product.id)

  const farmer = productFarmer(product)
  const fresh = freshnessLabel(product.expiryDate)
  const estimate = productEstimate(product)
  const unitLabel = product.variableWeight ? weight(product.estWeightKg) : product.unit
  const rounded = Math.round(farmer.rating)

  function handleAdd() {
    add(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="ga-card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative">
        <Link
          href={`/shop/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-secondary/40"
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
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90"
          />
        </Link>

        {/* top-left: commerce-critical badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.organic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm backdrop-blur-sm">
              <Leaf className="h-3 w-3" strokeWidth={2.5} />
              Organic
            </span>
          )}
          {product.status === 'low' && (
            <span className="inline-flex w-fit items-center rounded-full bg-deal/95 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-deal-foreground shadow-sm backdrop-blur-sm">
              Low stock
            </span>
          )}
        </div>

        {/* top-right: wishlist (refined frosted control) */}
        {canSave && (
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
            aria-pressed={saved}
            className="ga-scale-interactive absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-card/85 text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur-md"
          >
            <Heart
              className="h-[17px] w-[17px] transition-all duration-300"
              style={{
                fill: saved ? 'var(--ga-deal)' : 'transparent',
                color: saved ? 'var(--ga-deal)' : 'currentColor',
              }}
            />
          </button>
        )}

        {/* hover quick-view affordance */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="ga-press absolute left-1/2 top-1/2 z-[3] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-card/95 px-4 py-2 text-xs font-bold text-foreground opacity-0 shadow-md ring-1 ring-black/5 backdrop-blur-md transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Eye className="h-4 w-4" />
            Quick view
          </button>
        )}

        {/* bottom overlay row: freshness chip + multi-farmer pill */}
        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fresh.color }} />
            {fresh.label}
          </span>
          {multi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ga-copper-deep)]/90 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-[var(--ga-copper-foreground)] shadow-sm backdrop-blur-md">
              <Users className="h-3 w-3" />
              {offerCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <Link
          href={`/farmers/${farmer.slug}`}
          className="truncate text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {farmer.farmName}
        </Link>

        <Link href={`/shop/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
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
                  fill: i < rounded ? 'var(--ga-star)' : 'transparent',
                  color: i < rounded ? 'var(--ga-star)' : 'var(--border)',
                }}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-foreground">{farmer.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({farmer.reviewCount})</span>
        </div>

        {/* price */}
        <div className="mt-3 flex items-baseline gap-1.5">
          {multi && <span className="text-xs font-medium text-muted-foreground">from</span>}
          <span className="ga-price text-[1.35rem] leading-none text-foreground">{formatGHS(estimate)}</span>
          <span className="text-xs text-muted-foreground">/ {unitLabel}</span>
        </div>
        <span className="mt-1 block min-h-[1rem] text-[11px] font-medium leading-tight">
          {multi ? (
            <span className="text-[var(--ga-copper)]">Compare {offerCount} farmer prices</span>
          ) : product.variableWeight ? (
            <span className="text-muted-foreground">Est. weight, priced after picking</span>
          ) : null}
        </span>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className={[
            'ga-press ga-sheen mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold',
            'transition-colors duration-300',
            added
              ? 'bg-primary/12 text-primary ring-1 ring-primary/30'
              : 'bg-primary text-primary-foreground hover:bg-field-deep ga-elev-1',
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
