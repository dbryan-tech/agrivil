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
    <div className="ga-card-hover group flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <Link
        href={`/shop/${product.slug}`}
        className="ga-zoom relative block aspect-square overflow-hidden rounded-b-[1.75rem]"
      >
        <SmartImage src={product.image} alt={product.name} fill className="object-cover" />
        {product.organic && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--ga-lime)] px-2.5 py-1 text-xs font-bold text-[var(--ga-ink-deep)]">
            Organic
          </span>
        )}
        <span
          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: fresh.color }}
        >
          {fresh.label}
        </span>
        {product.status === 'low' && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[var(--ga-terracotta)] px-2.5 py-1 text-xs font-bold text-white">
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
          className="text-xs font-semibold text-[var(--ga-clay)] hover:underline"
        >
          {farmer.farmName}
        </Link>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mt-1 text-base font-bold leading-snug text-foreground">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-extrabold text-foreground">
              {formatGHS(estimate)}
            </span>
            <span className="text-sm text-muted-foreground">
              {' '}
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
