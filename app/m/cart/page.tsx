'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Info,
} from 'lucide-react'
import { useCart, unitEstimate } from '@/components/golden-acres/cart-context'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { ProductImageShell } from '@/app/preview/_lib/premium'

export default function MobileCartScreen() {
  const router = useRouter()
  const { lines, count, subtotalEstimate, setQty, remove, clear } = useCart()
  const [deliverySlot, setDeliverySlot] = useState<'today-pm' | 'tomorrow-am'>('today-pm')

  const deliveryFee = subtotalEstimate > 150 ? 0 : 8
  const discount = subtotalEstimate > 0 ? 5.0 : 0
  const total = Math.max(0, subtotalEstimate + deliveryFee - discount)

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-32 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand radiant gradient backdrop (Seamless Harvest Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(280px,48vh,400px)] z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(223, 136, 33, 0.20) 0%, rgba(240, 168, 30, 0.08) 35%, rgba(247, 245, 240, 0.6) 75%, rgba(247, 245, 240, 1) 100%)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.05)] bg-[#FAF7F2]/95 px-2 py-2.5 backdrop-blur-md rounded-b-[24px] shadow-[0_4px_16px_-4px_rgba(33,26,18,0.06)] transition-all"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
          paddingBottom: '10px',
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <h1 className="text-[16px] font-black tracking-tight text-[#211A12]">
            My Farm Basket
          </h1>
          <p className="text-[11px] font-bold text-[#5C5247]">
            {count} items · Dawn harvested
          </p>
        </div>
        {lines.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="text-[11px] font-extrabold text-[#7A3F1C] hover:underline"
          >
            Clear
          </button>
        ) : (
          <div className="w-9" />
        )}
      </header>

      <div className="relative px-1.5 pt-2.5 space-y-2">
        {lines.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDFDFB] text-[#5C5247] shadow-sm">
              <ShoppingBag className="h-8 w-8 text-[#0B3B25]" />
            </div>
            <h2 className="mt-3 text-[17px] font-black text-[#211A12]">
              Your basket is empty
            </h2>
            <p className="mt-1 max-w-xs text-[11.5px] font-semibold text-[#5C5247]">
              Explore freshly harvested produce directly from local Ghanaian farms.
            </p>
            <Link
              href="/m"
              className="mt-5 flex h-11 items-center justify-center rounded-full bg-[#0B3B25] px-6 text-[12.5px] font-extrabold text-white shadow-md active:scale-95 transition-transform"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Delivery Address Pill */}
            <div className="flex items-center justify-between rounded-2xl bg-white/80 p-2.5 shadow-2xs border border-[rgba(33,26,18,0.08)]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                  <MapPin className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-[#5C5247]">
                    Delivering to
                  </span>
                  <p className="text-[12px] font-extrabold text-[#211A12]">
                    KNUST Campus, Kumasi (GA-183-4250)
                  </p>
                </div>
              </div>
              <Link
                href="/m/onboarding/gps"
                className="text-[11px] font-bold text-[#7A3F1C] hover:underline"
              >
                Change
              </Link>
            </div>

            {/* Cart Items List */}
            <div className="space-y-1.5">
              {lines.map(({ product, qty }) => {
                const itemTotal = unitEstimate(product) * qty
                return (
                  <div
                    key={product.id}
                    className="relative flex items-center justify-between overflow-hidden rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
                  >
                    <div className="flex items-center gap-3 flex-1 pr-2">
                      <ProductImageShell src={product.image} alt={product.name} />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13.5px] font-extrabold text-[#211A12] truncate">
                          {product.name}
                        </h4>
                        <p className="text-[10.5px] font-bold text-[#7A3F1C]">
                          {product.farmerName}
                        </p>
                        <p className="text-[10.5px] font-semibold text-[#5C5247]">
                          {product.unit} · {formatGHS(unitEstimate(product))} each
                        </p>
                        <p className="mt-0.5 text-[12.5px] font-black text-[#0B3B25]">
                          {formatGHS(itemTotal)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 shadow-2xs border border-[rgba(33,26,18,0.10)]">
                      <button
                        type="button"
                        onClick={() => (qty <= 1 ? remove(product.id) : setQty(product.id, qty - 1))}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FDFDFB] text-[#211A12] active:scale-90"
                      >
                        {qty === 1 ? (
                          <Trash2 className="h-3 w-3 text-[#7A3F1C]" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </button>
                      <span className="min-w-4 text-center text-[11.5px] font-black text-[#211A12]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty + 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FDFDFB] text-[#211A12] active:scale-90"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cold-Chain Guarantee Card */}
            <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                  <Truck className="h-4 w-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-[12.5px] font-extrabold text-[#211A12]">
                    Insulated Cold-Chain Packaging
                  </h4>
                  <p className="text-[10.5px] font-semibold text-[#5C5247]">
                    Produce packed with reusable gel ice packs. Delivered at &lt; 8°C.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Slot Selector */}
            <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
              <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Select Delivery Window
              </span>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeliverySlot('today-pm')}
                  className={cn(
                    'rounded-2xl p-2.5 text-left transition-all border',
                    deliverySlot === 'today-pm'
                      ? 'bg-[#211A12] text-white border-[#211A12] shadow-sm'
                      : 'bg-white text-[#211A12] border-[rgba(33,26,18,0.10)]'
                  )}
                >
                  <p className="text-[11.5px] font-extrabold">Today Afternoon</p>
                  <p
                    className={cn(
                      'text-[10.5px] mt-0.5',
                      deliverySlot === 'today-pm' ? 'text-white/80' : 'text-[#5C5247]'
                    )}
                  >
                    2:00 PM – 5:00 PM
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliverySlot('tomorrow-am')}
                  className={cn(
                    'rounded-2xl p-2.5 text-left transition-all border',
                    deliverySlot === 'tomorrow-am'
                      ? 'bg-[#211A12] text-white border-[#211A12] shadow-sm'
                      : 'bg-white text-[#211A12] border-[rgba(33,26,18,0.10)]'
                  )}
                >
                  <p className="text-[11.5px] font-extrabold">Tomorrow Dawn</p>
                  <p
                    className={cn(
                      'text-[10.5px] mt-0.5',
                      deliverySlot === 'tomorrow-am' ? 'text-white/80' : 'text-[#5C5247]'
                    )}
                  >
                    8:00 AM – 11:00 AM
                  </p>
                </button>
              </div>
            </div>

            {/* Price Breakdown Summary */}
            <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-1.5">
              <div className="flex justify-between text-[12.5px] font-semibold text-[#5C5247]">
                <span>Produce Subtotal</span>
                <span className="font-extrabold text-[#211A12]">{formatGHS(subtotalEstimate)}</span>
              </div>
              <div className="flex justify-between text-[12.5px] font-semibold text-[#5C5247]">
                <span>Cold-Chain Delivery</span>
                <span className="font-extrabold text-[#211A12]">{formatGHS(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[12.5px] font-semibold text-[#0B3B25]">
                <span>Direct Farm Promo Discount</span>
                <span className="font-extrabold">-{formatGHS(discount)}</span>
              </div>
              <div className="flex justify-between text-[15px] font-black text-[#211A12] pt-1.5 border-t border-[rgba(33,26,18,0.08)]">
                <span>Total to Pay</span>
                <span className="text-[#0B3B25] text-[17px]">{formatGHS(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Checkout Bar */}
      {lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-1.5 pt-2.5 pb-[clamp(16px,2.5vh,22px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
          <Link
            href="/m/checkout"
            className="flex w-full items-center justify-between rounded-full bg-[#0B3B25] px-5 py-3 text-white shadow-md active:scale-[0.98] transition-transform"
          >
            <div className="text-left">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-white/80">
                Total ({count} items)
              </span>
              <p className="text-[15px] font-black leading-none">{formatGHS(total)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-black">
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
