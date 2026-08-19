'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function MobileRemovedFromCartScreen() {
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

        {/* Center Graphic & Text */}
        <div className="mt-12 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626] shadow-sm">
            <Trash2 className="h-9 w-9" />
          </div>

          <h1 className="mt-4 text-[22px] font-black text-[#211A12]">
            Removed from cart
          </h1>
          <p className="mt-1 text-[12px] font-semibold text-[#5C5247]">
            Fresh Tomatoes (1.0 kg) has been removed.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative space-y-2 pt-4">
        <button
          type="button"
          onClick={() => router.push('/m/cart')}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#B91C1C] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Undo
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
