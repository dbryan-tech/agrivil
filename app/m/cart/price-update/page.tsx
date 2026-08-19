'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobilePriceUpdateScreen() {
  const router = useRouter()

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
        <div className="flex items-center gap-2.5 pb-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[16px] font-black text-[#211A12]">Price Update</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">
              The price of this item has been updated.
            </p>
          </div>
        </div>

        {/* Product Comparison Card */}
        <div className="mt-3 rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
              <Image
                src="/golden-acres/produce/roma-tomatoes-1.png"
                alt="Fresh Tomatoes"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h2 className="text-[13px] font-extrabold text-[#211A12]">Fresh Tomatoes</h2>
              <span className="text-[10.5px] font-semibold text-[#5C5247]">1.0 kg</span>
            </div>
          </div>

          <div className="mt-3 space-y-2 border-t border-[rgba(33,26,18,0.06)] pt-2.5 text-xs">
            <div className="flex justify-between text-[#5C5247] font-semibold text-[11.5px]">
              <span>Old Price</span>
              <span className="line-through">{formatGHS(12.0)}</span>
            </div>
            <div className="flex justify-between font-black text-[#211A12] text-[13.5px]">
              <span>New Price</span>
              <span className="text-[#0B3B25]">{formatGHS(13.0)}</span>
            </div>
          </div>

          <p className="mt-2.5 text-[10px] italic font-medium text-[#5C5247]">
            * Price changed due to morning market supply update.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative space-y-2 pt-4">
        <button
          type="button"
          onClick={() => router.push('/m/checkout')}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Continue
        </button>

        <button
          type="button"
          onClick={() => router.push('/m/cart/removed')}
          className="w-full text-center text-[11.5px] font-extrabold text-[#DC2626] hover:underline py-1"
        >
          Remove item
        </button>
      </div>
    </div>
  )
}
