'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

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
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#FAF7F0] px-6 py-6 sm:px-8">
      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-sm font-bold text-[#6E6A63] transition-colors hover:text-[#7A3F1C]"
        >
          Skip
        </Link>
      </div>

      {/* Center Body Content */}
      <div className="relative z-10 my-auto flex flex-col pt-4">
        <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17] sm:text-4xl">
          We deliver to <br />
          <span className="text-[#0F7A43]">your area!</span>
        </h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#6E6A63]">
          Good news! We currently deliver to your location.
        </p>

        {/* Confirmation Card */}
        <div className="mt-8 rounded-3xl border border-[#E0DACB] bg-white p-6 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F7A43]/10 text-[#0F7A43]">
            <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-[#6E6A63]">Delivering to</span>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#2B1F17]">
              {code}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#0F7A43]">
              {area}
            </p>
          </div>

          <div className="mt-5 border-t border-[#E0DACB]/60 pt-3">
            <Link
              href="/m/onboarding/gps"
              className="text-xs font-bold text-[#7A3F1C] underline underline-offset-2 hover:text-[#2B1F17]"
            >
              Change location
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="relative z-10 pb-4">
        <button
          type="button"
          onClick={handleFinish}
          className="ga-press flex h-14 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-base font-bold text-white shadow-md transition-all hover:bg-[#0B3B25]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default function DeliveryAreaConfirmationScreen() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-[#FAF7F0]" />}>
      <ConfirmAreaContent />
    </Suspense>
  )
}
