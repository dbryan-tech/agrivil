'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function MobileRemovedFromCartScreen() {
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
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626] shadow-sm">
            <Trash2 className="h-10 w-10" />
          </div>

          <h1 className="ga-headline mt-5 text-xl font-extrabold text-[#2B1F17]">
            Removed from cart
          </h1>
          <p className="mt-1 text-xs text-[#6E6A63]">
            Fresh Tomatoes (1.0 kg) has been removed.
          </p>
        </div>
      </div>

      {/* Action Footer (Screen 12) */}
      <div className="space-y-3 pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/cart')}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#B91C1C] text-sm font-bold text-white shadow-md hover:bg-[#991B1B]"
        >
          Undo
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
