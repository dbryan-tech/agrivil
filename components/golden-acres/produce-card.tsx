'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Check, Heart } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import { productFarmer, productEstimate } from '@/lib/golden-acres/data'
import type { Product } from '@/lib/golden-acres/types'

export function ProduceCard({ product }: { product: Product }) {
  const { add } = useCart()
  const { account, isSaved, toggleWishlist } = useSession()
  const [added, setAdded] = useState(false)

  const canSave = account?.role === 'customer'
  const saved = canSave && isSaved(product.id)

  const farmer = productFarmer(product)
  const fresh = freshnessLabel(product.expiryDate)
  const estimate = productEstimate(product)

  function handleAdd() {
    add(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="ga-card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Link
        href={`/shop/${product.slug}`}
        className="ga-zoom relative block aspect-[4/5] overflow-hidden"
      >
        <SmartImage src={product.image} alt={product.name} fill className="object-cover" />

        {/* top badges row */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {product.organic ? (
            <span className="ga-kicker rounded-full bg-card/90 px-2.5 py-1 text-[9px] text-primary backdrop-blur">
              Organic
            </span>
          ) : (
            <span />
          )}
          <span
            className="ga-kicker rounded-full px-2.5 py-1 text-[9px] text-white backdrop-blur"
            style={{ backgroundColor: fresh.color }}
          >
            {fresh.label}
          </span>
        </div>

        {product.status === 'low' && (
          <span className="ga-kicker absolute bottom-3 left-3 rounded-full bg-[var(--ga-terracotta)] px-2.5 py-1 text-[9px] text-white">
            Low stock
          </span>
        )}
        {canSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }}
            aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
            aria-pressed={saved}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart
              className="h-5 w-5 transition-colors"
              style={{
                fill: saved ? 'var(--ga-terracotta)' : 'transparent',
                color: saved ? 'var(--ga-terracotta)' : 'currentColor',
              }}
            />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/farmers/${farmer.slug}`}
          className="ga-kicker text-[10px] text-[var(--ga-clay)] transition-colors hover:text-[var(--ga-terracotta)]"
        >
          {farmer.farmName}
        </Link>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="ga-headline mt-2 text-xl leading-tight text-foreground">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3.5">
          <div className="flex flex-col">
            <span className="ga-headline text-2xl text-foreground">
              {formatGHS(estimate)}
            </span>
            <span className="ga-index text-[11px] text-muted-foreground">
              / {product.variableWeight ? weight(product.estWeightKg) : product.unit}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="ga-press flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30"
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
