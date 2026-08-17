'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react'
import { useCart, unitEstimate } from '@/components/golden-acres/cart-context'
import { formatGHS, weight } from '@/lib/golden-acres/format'

export default function MobileCartScreen() {
  const router = useRouter()
  const { lines, count, subtotalEstimate, setQty, remove, clear } = useCart()

  const deliveryFee = subtotalEstimate > 150 ? 0 : 8
  const total = subtotalEstimate + deliveryFee

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-32 text-[#2B1F17]">
      {/* App Bar */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E0DACB] bg-[#F4F1EA] px-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-extrabold text-[#2B1F17]">
            My Basket ({count})
          </h1>
        </div>

        {lines.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-xs font-bold text-[#DC2626] hover:underline"
          >
            Clear All
          </button>
        )}
      </header>

      {/* Cart Body */}
      <div className="px-4 pt-4">
        {lines.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EBE6DA] text-[#6E6A63]">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-base font-extrabold text-[#2B1F17]">
              Your basket is empty
            </h2>
            <p className="mt-1 max-w-xs text-xs text-[#6E6A63]">
              Explore freshly harvested produce directly from local Ghanaian farms.
            </p>
            <Link
              href="/m"
              className="ga-press mt-6 flex h-12 items-center justify-center rounded-2xl bg-[#1E5D3B] px-6 text-xs font-bold text-white shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Line Items List */}
            <div className="space-y-3">
              {lines.map(({ product, qty }) => {
                const itemTotal = unitEstimate(product) * qty
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F4F1EA]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col truncate">
                      <h3 className="truncate text-xs font-extrabold text-[#2B1F17]">
                        {product.name}
                      </h3>
                      <span className="text-[10px] text-[#6E6A63]">
                        {product.farmerName}
                      </span>
                      <span className="mt-1 text-xs font-bold text-[#1E5D3B]">
                        {formatGHS(itemTotal)}
                        {product.variableWeight && (
                          <span className="text-[9px] text-[#6E6A63] font-normal">
                            {' '}
                            (est)
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => (qty <= 1 ? remove(product.id) : setQty(product.id, qty - 1))}
                        className="ga-press flex h-7 w-7 items-center justify-center rounded-full border border-[#E0DACB] bg-[#F4F1EA] text-[#2B1F17]"
                        aria-label="Decrease quantity"
                      >
                        {qty <= 1 ? (
                          <Trash2 className="h-3 w-3 text-[#DC2626]" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </button>
                      <span className="min-w-4 text-center text-xs font-bold text-[#2B1F17]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty + 1)}
                        className="ga-press flex h-7 w-7 items-center justify-center rounded-full bg-[#1E5D3B] text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Variable Weight Notice */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-[#DDE4C5]/40 p-3 text-[11px] font-medium text-[#2B1F17]">
              <Info className="h-4 w-4 shrink-0 text-[#1E5D3B]" />
              <span>
                Perishable variable-weight items are weighed at packing. Final exact weight will be confirmed before dispatch.
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 space-y-2.5 shadow-xs text-xs">
              <div className="flex justify-between text-[#6E6A63]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#2B1F17]">
                  {formatGHS(subtotalEstimate)}
                </span>
              </div>
              <div className="flex justify-between text-[#6E6A63]">
                <span>Delivery Fee (Cold-Chain)</span>
                <span className="font-bold text-[#2B1F17]">
                  {deliveryFee === 0 ? (
                    <span className="text-[#1E5D3B]">FREE</span>
                  ) : (
                    formatGHS(deliveryFee)
                  )}
                </span>
              </div>
              <div className="border-t border-[#E0DACB]/60 pt-2.5 flex justify-between text-sm font-extrabold text-[#2B1F17]">
                <span>Estimated Total</span>
                <span className="text-base text-[#1E5D3B]">{formatGHS(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action */}
      {lines.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white p-4 shadow-md"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
        >
          <Link
            href="/m/checkout"
            className="ga-press flex h-14 w-full items-center justify-between rounded-2xl bg-[#1E5D3B] px-5 text-sm font-bold text-white shadow-md hover:bg-[#144028]"
          >
            <span>Proceed to Checkout</span>
            <div className="flex items-center gap-1.5">
              <span>{formatGHS(total)}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
