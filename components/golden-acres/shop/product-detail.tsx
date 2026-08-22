'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Minus,
  Plus,
  Check,
  Snowflake,
  MapPin,
  ArrowRight,
  Star,
} from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { ProductRail } from '@/components/golden-acres/shop/product-rail'
import { ReviewList } from '@/components/golden-acres/reviews/review-list'
import { CompareOffers } from '@/components/golden-acres/shop/compare-offers'
import { useCart } from '@/components/golden-acres/cart-context'
import { useRecordView, useRecentlyViewed } from '@/components/golden-acres/store/recently-viewed'
import { formatGHS, freshnessLabel, weight, packedDateIso, dayMonth } from '@/lib/golden-acres/format'
import type { Product, Farmer } from '@/lib/golden-acres/types'

/**
 * Product detail (redesigned, docs/redesign/02 §4).
 * Gallery left / sticky buy column right on desktop. Prices via tabular
 * numerals, variable-weight honesty stated plainly, FEFO-derived harvest
 * date (real, from the RC fixes), farmer provenance strip, compare offers
 * as hairline rows. All cart wiring unchanged.
 */
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
  const unitLabel = product.variableWeight
    ? `≈${weight(product.estWeightKg)}`
    : product.unit

  function handleAdd() {
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-[13px] text-[#8A7E72]">
        <Link href="/shop" className="transition-colors hover:text-[#211A12]">
          Shop
        </Link>
        <span className="px-1.5">/</span>
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="transition-colors hover:text-[#211A12]"
        >
          {product.category}
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-[#211A12]">{product.name}</span>
      </nav>

      <div className="mt-7 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-[rgba(33,26,18,0.05)] bg-white shadow-[0_2px_4px_rgba(33,26,18,0.05),0_16px_40px_rgba(33,26,18,0.08)]">
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
          {product.organic && (
            <span className="absolute left-4 top-4 rounded-full bg-[#FDFDFB]/95 px-3 py-1.5 text-[11px] font-semibold text-[#0B3B25] shadow-sm">
              Certified organic
            </span>
          )}
        </div>

        {/* Buy column */}
        <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
          {/* Farmer attribution */}
          <Link
            href={`/farmers/${farmer.slug}`}
            className="group inline-flex w-fit items-center gap-2 text-[13px] font-semibold text-[#7A3F1C]"
          >
            <MapPin width={13} height={13} />
            {farmer.farmName} · {farmer.region}
          </Link>

          <h1 className="ga-display-title mt-2 text-[clamp(30px,3.4vw,46px)] text-[#211A12]">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  width={14}
                  height={14}
                  className={
                    i < Math.round(product.rating ?? 0)
                      ? 'fill-[#F0A81E] text-[#F0A81E]'
                      : 'fill-[rgba(33,26,18,0.10)] text-[rgba(33,26,18,0.10)]'
                  }
                />
              ))}
            </span>
            <span className="sr-only">Rated {product.rating} out of 5</span>
            <span className="ga-index text-[13px] text-[#8A7E72]">
              {product.rating} ({product.reviewCount} reviews)
            </span>
            {fresh && (
              <span className="text-[13px] text-[#5C5247]">
                · {fresh.label}
              </span>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-[#5C5247]">
            {product.description}
          </p>

          {/* Price block */}
          <div className="mt-7 border-t border-[rgba(33,26,18,0.08)] pt-6">
            <div className="flex items-baseline gap-2">
              <span className="ga-index text-[34px] font-semibold leading-none tracking-[-0.02em] text-[#211A12]">
                {formatGHS(estimateEach)}
              </span>
              <span className="text-[14px] text-[#8A7E72]">/ {unitLabel}</span>
            </div>
            {product.variableWeight && (
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[#5C5247]">
                You pay <strong className="font-semibold text-[#211A12]">{formatGHS(estimateEach)}</strong>{' '}
                now — the final price reconciles to the exact weight picked
                (typically {formatGHS(product.priceMin)}–{formatGHS(product.priceMax)}).
                You only pay for what you receive.
              </p>
            )}
            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {product.tags.map((t) => (
                  <span key={t} className="text-[12px] font-medium text-[#8A7E72]">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quantity + add */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="inline-flex h-12 items-center rounded-full border border-[rgba(33,26,18,0.15)]">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-full w-11 items-center justify-center rounded-l-full text-[#211A12] transition-colors hover:bg-[#F2EEE6]"
              >
                <Minus width={15} height={15} />
              </button>
              <span className="ga-index w-8 text-center text-[15px] font-semibold text-[#211A12]">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-full w-11 items-center justify-center rounded-r-full text-[#211A12] transition-colors hover:bg-[#F2EEE6]"
              >
                <Plus width={15} height={15} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className={[
                'group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold tracking-[-0.01em] transition-all duration-300 active:scale-[0.98] sm:flex-none sm:px-9',
                added
                  ? 'bg-[#0B3B25]/10 text-[#0B3B25] ring-1 ring-[#0B3B25]/40'
                  : 'bg-[#0B3B25] text-white hover:bg-[#0F4A2E]',
              ].join(' ')}
            >
              {added ? (
                <>
                  <Check width={17} height={17} /> Added to basket
                </>
              ) : (
                <>
                  Add to basket · {formatGHS(lineEstimate)}
                </>
              )}
            </button>
          </div>

          {/* Farm-to-door specs — hairline rows, real FEFO data */}
          <dl className="mt-9 border-t border-[rgba(33,26,18,0.08)]">
            {[
              {
                label: 'Harvest date',
                value: dayMonth(packedDateIso(product.expiryDate, product.shelfLifeDays)),
              },
              { label: 'Shelf life', value: `${product.shelfLifeDays} days (FEFO)` },
              {
                label: 'Storage',
                value: product.refrigerationRequired
                  ? 'Refrigerated below 8°C'
                  : 'Cool, dry place',
              },
              { label: 'Season', value: product.season },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-[rgba(33,26,18,0.08)] py-3"
              >
                <dt className="text-[13px] text-[#8A7E72]">{row.label}</dt>
                <dd className="text-[14px] font-medium text-[#211A12]">{row.value}</dd>
              </div>
            ))}
          </dl>

          {/* Guarantees */}
          <div className="mt-6 space-y-2.5 text-[13px] text-[#5C5247]">
            <p className="flex items-center gap-2">
              <Snowflake width={14} height={14} className="text-[#0B3B25]" />
              Cold-chain packed at the Tema hub
            </p>
            <p className="text-[13px] text-[#5C5247]">
              Instant Mobile Money refund on any spoiled or missing item —
              reported within 24 hours.
            </p>
          </div>

          {/* Farmer strip */}
          <Link
            href={`/farmers/${farmer.slug}`}
            className="group mt-8 flex items-center gap-4 rounded-[20px] border border-[rgba(33,26,18,0.06)] bg-[#FDFDFB] p-4 transition-colors duration-300 hover:border-[rgba(11,59,37,0.3)]"
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold text-[#211A12]">
                {farmer.name}
              </span>
              <span className="mt-0.5 block text-[12px] text-[#8A7E72]">
                ★ {farmer.rating} · {farmer.reviewCount} reviews · farming since {farmer.joinedYear}
              </span>
            </span>
            <ArrowRight
              width={16}
              height={16}
              className="shrink-0 text-[#8A7E72] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#7A3F1C]"
            />
          </Link>
        </div>
      </div>

      {/* Competing offers — hairline rows */}
      <CompareOffers current={product} offers={offers} />

      {/* Reviews */}
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
