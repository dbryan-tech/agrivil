'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Truck, Smile, ArrowRight, ArrowLeft } from 'lucide-react'
import { CornerProduceOrnaments } from '@/components/golden-acres/mobile/corner-produce-ornaments'

export default function HowItWorksScreen() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F4F1EA] px-6 py-6 sm:px-8">
      {/* Animated Botanical Corner Produce Assets (Fly-in + 2x Bounce) */}
      <CornerProduceOrnaments preset="onboarding" delayMs={60} />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#2B1F17] shadow-xs border border-[#E0DACB]/60"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-xs font-bold text-[#6E6A63] hover:text-[#1E5D3B]"
        >
          Skip
        </Link>
      </div>

      {/* Center Body Content */}
      <div className="relative z-10 my-auto flex flex-col pt-6 pb-6">
        <div className="max-w-xs">
          <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17] sm:text-4xl">
            How <span className="text-[#1E5D3B]">Agrivil</span> works
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[#6E6A63]">
            From farm to your table in 3 simple steps.
          </p>
        </div>

        {/* 3 Step List */}
        <div className="mt-8 space-y-6">
          {/* Step 1: Shop */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EBE6DA] text-[#2B1F17] shadow-xs">
              <ShoppingCart className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex flex-col pt-1">
              <h2 className="text-base font-bold text-[#2B1F17]">1. Shop</h2>
              <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#6E6A63]">
                Browse fresh products from trusted farmers.
              </p>
            </div>
          </div>

          {/* Step 2: We Deliver */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EBE6DA] text-[#2B1F17] shadow-xs">
              <Truck className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex flex-col pt-1">
              <h2 className="text-base font-bold text-[#2B1F17]">2. We deliver</h2>
              <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#6E6A63]">
                We carefully pick, pack and deliver to your door.
              </p>
            </div>
          </div>

          {/* Step 3: Enjoy */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EBE6DA] text-[#2B1F17] shadow-xs">
              <Smile className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex flex-col pt-1">
              <h2 className="text-base font-bold text-[#2B1F17]">3. Enjoy</h2>
              <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#6E6A63]">
                Enjoy healthy, farm fresh produce with your loved ones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="relative z-10 pb-6">
        <Link
          href="/m/onboarding/location"
          className="ga-press flex h-14 w-full items-center justify-center rounded-2xl bg-[#1E5D3B] text-base font-bold text-white shadow-md transition-all hover:bg-[#144028]"
        >
          Next
        </Link>
      </div>
    </div>
  )
}
