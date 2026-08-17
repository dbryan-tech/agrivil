'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowLeft, MapPin } from 'lucide-react'
import { CornerProduceOrnaments } from '@/components/golden-acres/mobile/corner-produce-ornaments'

function ConfirmAreaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || 'GA-143-3586'
  const area = searchParams.get('area') || 'KNUST, Kumasi, Ashanti Region'

  function handleFinish() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ga_onboarding_completed', 'true')
    }
    router.push('/m')
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F4F1EA] px-6 py-6 sm:px-8">
      <CornerProduceOrnaments preset="success" delayMs={80} />

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
      <div className="relative z-10 my-auto flex flex-col pt-4">
        <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17]">
          We deliver to <br />
          <span className="text-[#1E5D3B]">your area!</span>
        </h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#6E6A63]">
          Good news! We currently deliver fresh morning harvests to your location.
        </p>

        {/* Confirmation Card */}
        <div className="mt-8 rounded-3xl border border-[#E0DACB] bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E5D3B]/10 text-[#1E5D3B]">
            <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-[#6E6A63]">Delivering to</span>
            <p className="text-xl font-extrabold tracking-tight text-[#2B1F17]">
              {code}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#1E5D3B]">
              {area}
            </p>
          </div>

          <div className="mt-4 border-t border-[#E0DACB]/60 pt-3">
            <Link
              href="/m/onboarding/gps"
              className="text-xs font-bold text-[#6E6A63] underline underline-offset-2 hover:text-[#2B1F17]"
            >
              Change location
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="relative z-10 pb-6">
        <button
          type="button"
          onClick={handleFinish}
          className="ga-press flex h-14 w-full items-center justify-center rounded-2xl bg-[#1E5D3B] text-base font-bold text-white shadow-md hover:bg-[#144028]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default function DeliveryAreaConfirmationScreen() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-[#F4F1EA]" />}>
      <ConfirmAreaContent />
    </Suspense>
  )
}
