'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Store } from 'lucide-react'

export default function MobileProductUnavailableScreen() {
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
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAE5DC] text-[#5C5247] shadow-inner">
            <Store className="h-10 w-10" />
          </div>

          <h1 className="mt-4 text-[22px] font-black text-[#211A12]">
            Currently unavailable
          </h1>
          <p className="mt-1 text-[12px] font-semibold text-[#5C5247] max-w-xs leading-relaxed">
            This product is not available right now. Please check back later.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative pt-4">
        <button
          type="button"
          onClick={() => router.push('/m/categories')}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Browse Other Products
        </button>
      </div>
    </div>
  )
}
