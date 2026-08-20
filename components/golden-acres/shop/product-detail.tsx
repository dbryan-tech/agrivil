'use client'

import Link from 'next/link'
import Image from 'next/image'
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
        <div className="ga-rise relative aspect-square overflow-hidden rounded-[28px] border border-black/[0.04] bg-[#EDE8DF]/30 shadow-sm">
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#0B3B25]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0B3B25]">
              {product.category}
            </span>
            {fresh && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#7A3F1C]">
                <Leaf className="h-3.5 w-3.5" />
                {fresh.text}
              </span>
            )}
          </div>

          <h1 className="ga-headline mt-3 text-3xl sm:text-4xl text-[#211A12] font-black">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-black text-[#211A12]">
              <Star className="h-4 w-4 fill-[#F0A81E] text-[#F0A81E]" />
              <span>{product.rating}</span>
            </div>
            <span className="text-xs text-[#5C5247]">({product.reviewsCount} reviews)</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#5C5247]">
            {product.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-[#EDE8DF] px-3 py-1.5 text-xs font-bold text-[#211A12]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Variable-weight pricing explainer */}
          <div className="mt-6 rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-[#211A12]">
                  {formatGHS(estimateEach)}
                </span>
                <span className="text-sm font-medium text-[#5C5247]">
                  {' '}
                  / {product.variableWeight ? weight(product.estWeightKg) : product.unit}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#7A3F1C]">
                {formatGHS(product.pricePerKg)}/kg
              </span>
            </div>
            {product.variableWeight && (
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#5C5247]">
                Priced by weight. You&apos;re charged an estimate of{' '}
                <strong className="text-[#211A12] font-black">{formatGHS(estimateEach)}</strong> now;
                the final price is reconciled to the actual weight picked (typically{' '}
                {formatGHS(product.priceMin)}–{formatGHS(product.priceMax)}). You only pay
                for what you receive.
              </p>
            )}
          </div>

          {/* Quantity + add */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-black/[0.08] bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center rounded-full text-[#211A12] hover:bg-[#EDE8DF]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-base font-black text-[#211A12]">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center rounded-full text-[#211A12] hover:bg-[#EDE8DF]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#0B3B25] px-6 text-sm font-black text-white shadow-sm hover:bg-[#072618] transition-all active:scale-[0.98]"
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

          {/* Trust guarantee stamp */}
          <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-[#FAF7F2] p-3.5 border border-black/[0.06]">
            <Image
              src="/agrivil-stamp.svg"
              alt="AgriVil Farm Fresh Guarantee"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0"
            />
            <div className="text-xs">
              <span className="font-extrabold text-[#0B3B25]">100% Farm-Fresh Quality Guarantee</span>
              <p className="text-[11px] font-medium text-[#5C5247] mt-0.5">
                Picked morning of dispatch. Instant Mobile Money refund on any damaged or delayed batch.
              </p>
            </div>
          </div>

          {/* Farmer mini-card */}
          <Link
            href={`/farmers/${farmer.slug}`}
            className="mt-6 flex items-center gap-4 rounded-[20px] border border-black/[0.04] bg-[#FDFDFB] p-4 shadow-xs transition-colors hover:border-[#0B3B25]/30"
          >
            <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-full border border-black/[0.06]">
              <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-black text-[#211A12]">{farmer.name}</p>
              <p className="flex items-center gap-1 text-xs text-[#5C5247] mt-0.5">
                <Star className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]" />
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
