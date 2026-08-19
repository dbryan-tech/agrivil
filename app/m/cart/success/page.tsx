'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { formatGHS } from '@/lib/golden-acres/format'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemName = searchParams.get('item') || 'Fresh Tomatoes'
  const weight = searchParams.get('weight') || '1.0'
  const { count, subtotalEstimate } = useCart()

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] p-3 text-[#211A12] flex flex-col justify-between select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <header className="flex items-center pb-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        {/* Center Giant Checkmark & Text */}
        <div className="mt-6 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-lg animate-bounce">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <h1 className="mt-3 text-[22px] font-black text-[#211A12]">
            Added to cart!
          </h1>
          <p className="mt-1 text-[12px] font-semibold text-[#5C5247] max-w-xs">
            {itemName} ({weight} kg) has been added to your cart.
          </p>
        </div>

        {/* Cart Summary Box */}
        <div className="mt-5 rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-1.5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Cart Summary
          </h2>
          <div className="flex justify-between text-[12.5px] font-bold text-[#211A12]">
            <span>Items</span>
            <span>{count || 3}</span>
          </div>
          <div className="flex justify-between text-[14px] font-black text-[#0B3B25] border-t border-[rgba(33,26,18,0.06)] pt-1.5">
            <span>Total</span>
            <span>{formatGHS(subtotalEstimate > 0 ? subtotalEstimate : 38.0)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative space-y-2 pt-4">
        <button
          type="button"
          onClick={() => router.push('/m/cart')}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          View Cart
        </button>

        <button
          type="button"
          onClick={() => router.push('/m/categories')}
          className="flex h-11 w-full items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)] bg-white text-[12px] font-extrabold text-[#211A12] shadow-2xs active:scale-[0.98] transition-transform"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default function MobileAddToCartSuccessScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#F7F5F0]" />}>
      <SuccessContent />
    </Suspense>
  )
}
