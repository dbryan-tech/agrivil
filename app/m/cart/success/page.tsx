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
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="flex items-center pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        {/* Center Giant Checkmark & Text */}
        <div className="mt-8 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-lg animate-bounce">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <h1 className="ga-headline mt-5 text-2xl font-extrabold text-[#2B1F17]">
            Added to cart!
          </h1>
          <p className="mt-1.5 text-xs text-[#6E6A63] max-w-xs">
            {itemName} ({weight} kg) has been added to your cart.
          </p>
        </div>

        {/* Cart Summary Box */}
        <div className="mt-8 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2">
          <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Cart Summary
          </h2>
          <div className="flex justify-between text-xs font-bold text-[#2B1F17]">
            <span>Items</span>
            <span>{count || 3}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-[#0F7A43] border-t border-[#E0DACB]/60 pt-2">
            <span>Total</span>
            <span>{formatGHS(subtotalEstimate > 0 ? subtotalEstimate : 38.0)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/cart')}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          View Cart
        </button>

        <button
          type="button"
          onClick={() => router.push('/m/categories')}
          className="ga-press flex h-12 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-white text-xs font-bold text-[#2B1F17] shadow-xs hover:bg-[#FAF7F0]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default function MobileAddToCartSuccessScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#FAF7F0]" />}>
      <SuccessContent />
    </Suspense>
  )
}
