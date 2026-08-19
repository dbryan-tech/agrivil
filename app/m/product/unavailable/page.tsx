'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Store } from 'lucide-react'

export default function MobileProductUnavailableScreen() {
  const router = useRouter()

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

        {/* Center Graphic & Text */}
        <div className="mt-16 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EBE6DA] text-[#6E6A63] shadow-inner">
            <Store className="h-12 w-12" />
          </div>

          <h1 className="ga-headline mt-5 text-xl font-extrabold text-[#2B1F17]">
            Currently unavailable
          </h1>
          <p className="mt-2 text-xs text-[#6E6A63] max-w-xs leading-relaxed">
            This product is not available right now. Please check back later.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/categories')}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          Browse Other Products
        </button>
      </div>
    </div>
  )
}
