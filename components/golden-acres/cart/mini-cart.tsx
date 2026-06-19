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
        className={`fixed inset-0 z-[60] bg-[var(--ga-ink-deep)]/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-4">
          <h2 className="ga-headline flex items-center gap-2 text-lg text-foreground">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            Your basket
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close basket"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBasket className="h-9 w-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground">Your basket is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add fresh produce and it&apos;ll show up here.
              </p>
            </div>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Free-delivery progress */}
            <div className="border-b border-border bg-secondary/40 px-5 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Truck className="h-4 w-4 text-primary" />
                {remaining > 0 ? (
                  <span>
                    Add <strong>{formatGHS(remaining)}</strong> more for free delivery
                  </span>
                ) : (
                  <span className="text-primary">You&apos;ve unlocked free delivery!</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Lines */}
            <div className="ga-rail flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {lines.map((l) => {
                  const each = unitEstimate(l.product)
                  return (
                    <li key={l.product.id} className="flex gap-3">
                      <Link
                        href={`/shop/${l.product.slug}`}
                        onClick={closeDrawer}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-card"
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
                            className="truncate text-sm font-bold text-foreground hover:text-primary"
                          >
                            {l.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(l.product.id)}
                            aria-label={`Remove ${l.product.name}`}
                            className="ga-press shrink-0 text-muted-foreground hover:text-deal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatGHS(each)}{' '}
                          / {l.product.variableWeight ? weight(l.product.estWeightKg) : l.product.unit}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border border-border bg-card">
                            <button
                              type="button"
                              onClick={() => setQty(l.product.id, l.qty - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-foreground">
                              {l.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(l.product.id, l.qty + 1)}
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-extrabold text-foreground">
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
            <div className="border-t border-border bg-card px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Subtotal (est.)
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  {formatGHS(subtotalEstimate)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Variable-weight items are reconciled to actual weight at delivery.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="ga-press ga-sheen flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground"
                >
                  Checkout · {formatGHS(subtotalEstimate)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="ga-press flex h-11 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-foreground hover:bg-secondary"
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
