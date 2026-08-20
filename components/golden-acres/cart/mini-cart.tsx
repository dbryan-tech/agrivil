'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Plus, Minus, Trash2, ShoppingBasket, Truck, ArrowRight } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart, unitEstimate } from '@/components/golden-acres/cart-context'
import { formatGHS, weight } from '@/lib/golden-acres/format'

// Free-delivery threshold (GH₵). Tunable; mirrors the checkout logic.
const FREE_DELIVERY_AT = 150

export function MiniCart() {
  const {
    lines,
    count,
    subtotalEstimate,
    setQty,
    remove,
    drawerOpen,
    closeDrawer,
  } = useCart()
  const pathname = usePathname()

  // Close the drawer on route change (e.g. when navigating to checkout).
  useEffect(() => {
    closeDrawer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [drawerOpen, closeDrawer])

  const remaining = Math.max(0, FREE_DELIVERY_AT - subtotalEstimate)
  const progress = Math.min(100, (subtotalEstimate / FREE_DELIVERY_AT) * 100)

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden={!drawerOpen}
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-[#FAF9F6] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.05] bg-white px-5 py-4">
          <h2 className="ga-headline flex items-center gap-2 text-lg font-black text-[#211A12]">
            <ShoppingBasket className="h-5 w-5 text-[#0B3B25]" />
            Your basket
            {count > 0 && (
              <span className="rounded-full bg-[#0B3B25] px-2 py-0.5 text-xs font-black text-white">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close basket"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full text-[#211A12] hover:bg-[#EDE8DF]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE8DF]">
              <ShoppingBasket className="h-9 w-9 text-[#5C5247]" />
            </div>
            <div>
              <p className="font-black text-[#211A12] text-lg">Your basket is empty</p>
              <p className="mt-1 text-sm text-[#5C5247]">
                Add fresh produce and it&apos;ll show up here.
              </p>
            </div>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="ga-press inline-flex items-center gap-2 rounded-full bg-[#0B3B25] px-6 py-3.5 text-sm font-black text-white shadow-sm hover:bg-[#072618]"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free-delivery progress */}
            <div className="border-b border-black/[0.05] bg-[#EDE8DF]/50 px-5 py-3">
              <p className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#211A12]">
                <Truck className="h-4 w-4 text-[#0B3B25]" />
                {remaining > 0 ? (
                  <span>
                    Add <strong className="font-black text-[#0B3B25]">{formatGHS(remaining)}</strong> more for free delivery
                  </span>
                ) : (
                  <span className="text-[#0B3B25] font-black">You&apos;ve unlocked free delivery!</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#0B3B25] transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Lines */}
            <div className="ga-rail flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-3">
                {lines.map((l) => {
                  const each = unitEstimate(l.product)
                  return (
                    <li key={l.product.id} className="flex gap-3 rounded-[18px] border border-black/[0.04] bg-white p-3 shadow-xs">
                      <Link
                        href={`/shop/${l.product.slug}`}
                        onClick={closeDrawer}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EDE8DF]/40"
                      >
                        <SmartImage
                          src={l.product.image}
                          alt={l.product.name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/shop/${l.product.slug}`}
                            onClick={closeDrawer}
                            className="truncate text-sm font-black text-[#211A12] hover:text-[#0B3B25]"
                          >
                            {l.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(l.product.id)}
                            aria-label={`Remove ${l.product.name}`}
                            className="ga-press shrink-0 text-[#5C5247] hover:text-[#D6402C]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#5C5247] font-medium">
                          {formatGHS(each)}{' '}
                          / {l.product.variableWeight ? weight(l.product.estWeightKg) : l.product.unit}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border border-black/[0.08] bg-white">
                            <button
                              type="button"
                              onClick={() => setQty(l.product.id, l.qty - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[#211A12] hover:bg-[#EDE8DF]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-black text-[#211A12]">
                              {l.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(l.product.id, l.qty + 1)}
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[#211A12] hover:bg-[#EDE8DF]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-black text-[#211A12]">
                            {formatGHS(each * l.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-black/[0.05] bg-white px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C5247]">
                  Subtotal (est.)
                </span>
                <span className="text-xl font-black text-[#211A12]">
                  {formatGHS(subtotalEstimate)}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#5C5247]">
                Variable-weight items are reconciled to actual weight at delivery.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="ga-press ga-sheen flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-sm font-black text-white shadow-sm hover:bg-[#072618]"
                >
                  Checkout · {formatGHS(subtotalEstimate)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="ga-press flex h-11 items-center justify-center rounded-full border border-black/[0.08] bg-white text-xs font-black uppercase tracking-wider text-[#211A12] hover:bg-[#EDE8DF]"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
