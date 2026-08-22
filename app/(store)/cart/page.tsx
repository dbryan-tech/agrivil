'use client'

import Link from 'next/link'
import {
  Minus,
  Plus,
  Snowflake,
  ArrowRight,
  ShoppingBasket,
} from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart, unitEstimate } from '@/components/golden-acres/cart-context'
import { formatGHS, weight } from '@/lib/golden-acres/format'

// Free-delivery threshold mirrors the mini-cart + checkout logic.
const FREE_DELIVERY_AT = 150

/**
 * Cart page (docs/redesign/02 §5) — the full-basket view that complements the
 * mini-cart drawer. Hairline rows on canvas: image, name + farm, unit price,
 * qty stepper, line total, quiet remove. Sticky summary with free-delivery
 * progress and variable-weight honesty note.
 */
export default function CartPage() {
  const { lines, count, subtotalEstimate, setQty, remove, hydrated } = useCart()

  const remaining = Math.max(0, FREE_DELIVERY_AT - subtotalEstimate)
  const progress = Math.min(100, (subtotalEstimate / FREE_DELIVERY_AT) * 100)
  const refrigerated = lines.some((l) => l.product.refrigerationRequired)

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="h-64 animate-pulse rounded-[20px] bg-white/60" />
      </div>
    )
  }

  return (
    <main className="min-h-[70vh] bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">Your basket</p>
        <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
          {count === 0
            ? 'Your basket is empty'
            : `${count} ${count === 1 ? 'item' : 'items'} ready for delivery`}
        </h1>

        {lines.length === 0 ? (
          <div className="mt-10 border-t border-[rgba(33,26,18,0.08)] pt-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)]">
              <ShoppingBasket width={24} height={24} className="text-[#5C5247]" />
            </div>
            <p className="ga-display-title mt-5 text-[22px]">Nothing here yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[#5C5247]">
              Fresh produce picked this morning is one tap away.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0B3B25] px-8 text-[15px] font-semibold text-white transition-all hover:bg-[#0F4A2E]"
            >
              Shop the harvest
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            {/* Lines */}
            <ul className="border-t border-[rgba(33,26,18,0.08)]">
              {lines.map((l) => {
                const each = unitEstimate(l.product)
                return (
                  <li
                    key={l.product.id}
                    className="grid grid-cols-[96px_1fr] gap-x-5 gap-y-3 border-b border-[rgba(33,26,18,0.08)] py-5 sm:grid-cols-[112px_1fr_auto]"
                  >
                    <Link
                      href={`/shop/${l.product.slug}`}
                      className="relative block aspect-square overflow-hidden rounded-[16px] border border-[rgba(33,26,18,0.05)]"
                    >
                      <SmartImage
                        src={l.product.image}
                        alt={l.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/shop/${l.product.slug}`}
                            className="block truncate text-[16px] font-semibold tracking-[-0.01em] text-[#211A12] transition-colors hover:text-[#7A3F1C]"
                          >
                            {l.product.name}
                          </Link>
                          <p className="mt-0.5 text-[13px] text-[#8A7E72]">
                            {formatGHS(each)} /{' '}
                            {l.product.variableWeight
                              ? `≈${weight(l.product.estWeightKg)}`
                              : l.product.unit}
                          </p>
                          {l.product.refrigerationRequired && (
                            <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B3B25]">
                              <Snowflake width={12} height={12} /> Cold-chain item
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(l.product.id)}
                          aria-label={`Remove ${l.product.name}`}
                          className="shrink-0 text-[12px] font-medium text-[#8A7E72] underline decoration-[rgba(138,126,114,0.4)] underline-offset-4 transition-colors hover:text-[#B91C1C] hover:decoration-[#B91C1C]"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Stepper + line total */}
                      <div className="mt-3 flex items-center justify-between gap-3 sm:justify-end sm:gap-6">
                        <div className="inline-flex items-center rounded-full border border-[rgba(33,26,18,0.14)]">
                          <button
                            type="button"
                            onClick={() => setQty(l.product.id, l.qty - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#211A12] hover:bg-[#F2EEE6]"
                          >
                            <Minus width={14} height={14} />
                          </button>
                          <span className="ga-index w-8 text-center text-[14px] font-semibold text-[#211A12]">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(l.product.id, l.qty + 1)}
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#211A12] hover:bg-[#F2EEE6]"
                          >
                            <Plus width={14} height={14} />
                          </button>
                        </div>
                        <span className="ga-index pr-1 text-[17px] font-semibold tracking-[-0.02em] text-[#211A12]">
                          {formatGHS(each * l.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Summary */}
            <aside className="h-fit lg:sticky lg:top-24">
              {/* Free delivery progress */}
              <div className="border-t border-[rgba(33,26,18,0.08)] pt-5">
                <p className="text-[13px] font-medium text-[#3D332A]">
                  {remaining > 0 ? (
                    <>
                      Add{' '}
                      <strong className="font-semibold text-[#0B3B25]">
                        {formatGHS(remaining)}
                      </strong>{' '}
                      more for free delivery
                    </>
                  ) : (
                    <span className="font-semibold text-[#0B3B25]">
                      You&apos;ve unlocked free delivery.
                    </span>
                  )}
                </p>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[rgba(33,26,18,0.08)]">
                  <div
                    className="h-full rounded-full bg-[#0B3B25] transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <dl className="mt-7 space-y-3 border-t border-[rgba(33,26,18,0.08)] pt-5 text-[14px]">
                <div className="flex items-baseline justify-between">
                  <dt className="text-[#5C5247]">Subtotal (est.)</dt>
                  <dd className="ga-index font-semibold text-[#211A12]">
                    {formatGHS(subtotalEstimate)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-[#5C5247]">Delivery</dt>
                  <dd className="text-[#8A7E72]">Calculated at checkout</dd>
                </div>
                {refrigerated && (
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#0B3B25]">
                    <Snowflake width={13} height={13} /> Cold-chain packaging included
                  </div>
                )}
              </dl>

              <div className="mt-6 flex items-baseline justify-between border-t border-[rgba(33,26,18,0.08)] pt-5">
                <span className="text-[15px] font-semibold text-[#211A12]">
                  Total (est.)
                </span>
                <span className="ga-index text-[26px] font-semibold tracking-[-0.02em] text-[#211A12]">
                  {formatGHS(subtotalEstimate)}
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-[#8A7E72]">
                Variable-weight items are charged on the estimate and reconciled
                to the exact weight at packing.
              </p>

              <Link
                href="/checkout"
                className="group mt-7 flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98]"
              >
                Continue to delivery
                <ArrowRight
                  width={17}
                  height={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/shop"
                className="mt-3 flex h-11 items-center justify-center rounded-full border border-[rgba(33,26,18,0.15)] text-[14px] font-medium text-[#211A12] transition-colors hover:border-[rgba(11,59,37,0.45)]"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
