'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobilePriceUpdateScreen() {
  const router = useRouter()

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Price Update</h1>
            <p className="text-[10px] text-[#6E6A63]">
              The price of this item has been updated.
            </p>
          </div>
        </div>

        {/* Product Comparison Card */}
        <div className="mt-4 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#FAF7F0]">
              <Image
                src="/golden-acres/produce/roma-tomatoes-1.png"
                alt="Fresh Tomatoes"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-[#2B1F17]">Fresh Tomatoes</h2>
              <span className="text-[10px] text-[#6E6A63]">1.0 kg</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-[#E0DACB]/60 pt-3 text-xs">
            <div className="flex justify-between text-[#6E6A63]">
              <span>Old Price</span>
              <span className="line-through">{formatGHS(12.0)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-[#2B1F17] text-sm">
              <span>New Price</span>
              <span className="text-[#0F7A43]">{formatGHS(13.0)}</span>
            </div>
          </div>

          <p className="mt-3 text-[10px] italic text-[#6E6A63]">
            * Price changed due to morning market supply update.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-3 pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/checkout')}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          Continue
        </button>

        <button
          type="button"
          onClick={() => router.push('/m/cart/removed')}
          className="w-full text-center text-xs font-bold text-[#DC2626] hover:underline"
        >
          Remove item
        </button>
      </div>
    </div>
  )
}
