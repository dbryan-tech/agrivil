'use client'

import Link from 'next/link'
  import { useEffect, useState } from 'react'
import {
  Minus,
  Plus,
  Check,
  Snowflake,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { ProductRail } from '@/components/golden-acres/shop/product-rail'
import { ReviewList } from '@/components/golden-acres/reviews/review-list'
import { CompareOffers } from '@/components/golden-acres/shop/compare-offers'
import { useCart } from '@/components/golden-acres/cart-context'
import { useRecordView, useRecentlyViewed } from '@/components/golden-acres/store/recently-viewed'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import type { Product, Farmer } from '@/lib/golden-acres/types'

export function ProductDetail({
  product,
  farmer,
  related,
  offers = [],
}: {
  product: Product
  farmer: Farmer
  related: Product[]
  offers?: Product[]
}) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // record this product into the browse history (excluded from its own rail)
  useRecordView(product.id)
  const recentlyViewed = useRecentlyViewed(product.id)

  // Computed after mount only — freshness depends on the current date and this
  // page is statically prerendered, so computing it during render would cause a
  // hydration mismatch when the prerendered date differs from the client's.
  const [fresh, setFresh] = useState<ReturnType<typeof freshnessLabel> | null>(
    null,
  )
  useEffect(() => {
    setFresh(freshnessLabel(product.expiryDate))
  }, [product.expiryDate])
  const estimateEach = product.variableWeight
    ? product.estWeightKg * product.pricePerKg
    : product.priceMin
  const lineEstimate = estimateEach * qty

  function handleAdd() {
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-foreground">
          Market
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="ga-rise relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {fresh && (
            <span
              className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-sm font-bold text-white"
              style={{ backgroundColor: fresh.color }}
            >
              {fresh.label}
            </span>
          )}
        </div>

        <div className="ga-rise" style={{ animationDelay: '80ms' }}>
          <Link
            href={`/farmers/${farmer.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ga-clay)] hover:underline"
          >
            <MapPin className="h-4 w-4" />
            {farmer.farmName} · {farmer.region}
          </Link>
          <h1 className="ga-display mt-2 text-4xl font-semibold text-foreground">
            {product.name}
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.organic && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ga-leaf)]/12 px-3 py-1.5 text-sm font-semibold text-[var(--ga-leaf)]">
                <Leaf className="h-4 w-4" /> Organic
              </span>
            )}
            {product.refrigerationRequired && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ga-field)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--ga-field)]">
                <Snowflake className="h-4 w-4" /> Cold-chain
              </span>
            )}
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Variable-weight pricing explainer */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-foreground">
                  {formatGHS(estimateEach)}
                </span>
                <span className="text-muted-foreground">
                  {' '}
                  / {product.variableWeight ? weight(product.estWeightKg) : product.unit}
                </span>
              </div>
              <span className="text-sm font-semibold text-[var(--ga-gold)]">
                {formatGHS(product.pricePerKg)}/kg
              </span>
            </div>
            {product.variableWeight && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Priced by weight. You&apos;re charged an estimate of{' '}
                <strong className="text-foreground">{formatGHS(estimateEach)}</strong> now;
                the final price is reconciled to the actual weight picked (typically{' '}
                {formatGHS(product.priceMin)}–{formatGHS(product.priceMax)}). You only pay
                for what you receive.
              </p>
            )}
          </div>

          {/* Quantity + add */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border bg-card">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center rounded-full text-foreground hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-lg font-bold text-foreground">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center rounded-full text-foreground hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" /> Added
                </>
              ) : (
                <>Add to basket · {formatGHS(lineEstimate)}</>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[var(--ga-leaf)]" />
            Freshness promise — instant Mobile Money refund on any bad batch.
          </div>

          {/* Farmer mini-card */}
          <Link
            href={`/farmers/${farmer.slug}`}
            className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[var(--ga-gold)]"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
              <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-foreground">{farmer.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-[var(--ga-gold)] text-[var(--ga-gold)]" />
                {farmer.rating} · {farmer.reviewCount} reviews · since {farmer.joinedYear}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <CompareOffers current={product} offers={offers} />

      <section className="mt-16">
        <ReviewList productId={product.id} title="Customer reviews" />
      </section>

      {related.length > 0 && (
        <ProductRail
          className="mt-16"
          title="More from the market"
          subtitle="Fresh picks you might also like"
          products={related}
        />
      )}

      {recentlyViewed.length > 0 && (
        <ProductRail
          className="mt-14"
          title="Recently viewed"
          subtitle="Pick up where you left off"
          products={recentlyViewed}
        />
      )}
    </div>
  )
}
