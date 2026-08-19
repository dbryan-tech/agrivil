'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Truck, Smile, ArrowLeft } from 'lucide-react'

export default function HowItWorksScreen() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F7F5F0] px-3 py-4 text-[#211A12] select-none antialiased">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-[12px] font-extrabold text-[#5C5247] transition-colors hover:text-[#7A3F1C]"
        >
          Skip
        </Link>
      </div>

      {/* Center Body Content */}
      <div className="relative z-10 my-auto flex flex-col pt-2 pb-2">
        <div className="max-w-xs">
          <h1 className="text-[28px] font-black tracking-tight text-[#211A12] sm:text-3xl leading-tight">
            How <span className="text-[#0B3B25]">Agrivil</span> works
          </h1>
          <p className="mt-1 text-[12.5px] font-semibold leading-relaxed text-[#5C5247]">
            From farm to your table in 3 simple steps.
          </p>
        </div>

        {/* 3 Step List with Copper Circular Badges */}
        <div className="mt-6 space-y-4">
          {/* Step 1: Shop */}
          <div className="flex items-start gap-3 rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
              <ShoppingCart className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col pt-0.5">
              <h2 className="text-[14px] font-extrabold text-[#211A12]">1. Shop</h2>
              <p className="mt-0.5 text-[11.5px] font-semibold leading-relaxed text-[#5C5247]">
                Browse fresh products from trusted local farmers.
              </p>
            </div>
          </div>

          {/* Step 2: We Deliver */}
          <div className="flex items-start gap-3 rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Truck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col pt-0.5">
              <h2 className="text-[14px] font-extrabold text-[#211A12]">2. We deliver</h2>
              <p className="mt-0.5 text-[11.5px] font-semibold leading-relaxed text-[#5C5247]">
                We carefully pick, pack and deliver to your doorstep.
              </p>
            </div>
          </div>

          {/* Step 3: Enjoy */}
          <div className="flex items-start gap-3 rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
              <Smile className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col pt-0.5">
              <h2 className="text-[14px] font-extrabold text-[#211A12]">3. Enjoy</h2>
              <p className="mt-0.5 text-[11.5px] font-semibold leading-relaxed text-[#5C5247]">
                Enjoy healthy, farm-fresh produce with your loved ones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="relative z-10 pb-2">
        <Link
          href="/m/onboarding/location"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Next
        </Link>
      </div>
    </div>
  )
}
