'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Check, Heart, Star, Users } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import { productFarmer, productEstimate } from '@/lib/golden-acres/data'
import type { Product } from '@/lib/golden-acres/types'

export function ProduceCard({
  product,
  offerCount = 1,
}: {
  product: Product
  /** when > 1, this card represents a group of competing farmer offers */
  offerCount?: number
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
    <div className="ga-card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative">
        <Link
          href={`/shop/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-secondary/40"
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.organic && (
            <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
              Organic
            </span>
          )}
          {product.status === 'low' && (
            <span className="rounded-md bg-deal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deal-foreground shadow-sm">
              Low stock
            </span>
          )}
        </div>

        <span
          className="absolute right-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
          style={{ backgroundColor: fresh.color }}
        >
          {fresh.label}
        </span>

        {multi && (
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-[var(--ga-copper-deep)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ga-copper-foreground)] shadow-sm">
            <Users className="h-3 w-3" />
            {offerCount} farmers
          </span>
        )}

        {canSave && (
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
            aria-pressed={saved}
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart
              className="h-[18px] w-[18px] transition-colors"
              style={{
                fill: saved ? 'var(--ga-deal)' : 'transparent',
                color: saved ? 'var(--ga-deal)' : 'currentColor',
              }}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
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
        <div className="mt-1.5 flex items-center gap-1">
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
        <div className="mt-2.5 flex items-baseline gap-1.5">
          {multi && <span className="text-xs font-medium text-muted-foreground">from</span>}
          <span className="ga-price text-xl text-foreground">{formatGHS(estimate)}</span>
          <span className="text-xs text-muted-foreground">/ {unitLabel}</span>
        </div>
        {multi ? (
          <span className="text-[11px] font-medium text-[var(--ga-copper)]">
            Compare {offerCount} farmer prices
          </span>
        ) : (
          product.variableWeight && (
            <span className="text-[11px] text-muted-foreground">Est. weight, priced after picking</span>
          )
        )}

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className={[
            'ga-press mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors',
            added
              ? 'bg-secondary text-primary'
              : 'bg-primary text-primary-foreground hover:bg-field-deep',
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
  )
}
