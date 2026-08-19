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
      <div className="relative z-10 my-auto flex flex-col pt-2">
        <h1 className="text-[26px] font-black tracking-tight text-[#211A12] sm:text-3xl leading-tight">
          We deliver to <br />
          <span className="text-[#0B3B25]">your area!</span>
        </h1>
        <p className="mt-1 text-[12.5px] font-semibold leading-relaxed text-[#5C5247]">
          Good news! We currently deliver to your location.
        </p>

        {/* Confirmation Card */}
        <div className="mt-5 rounded-[24px] bg-[#FDFDFB] p-4 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
            <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
          </div>

          <div className="mt-3">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-[#5C5247]">Delivering to</span>
            <p className="mt-0.5 text-[22px] font-black tracking-tight text-[#211A12]">
              {code}
            </p>
            <p className="mt-0.5 text-[12px] font-bold text-[#0B3B25]">
              {area}
            </p>
          </div>

          <div className="mt-4 border-t border-[rgba(33,26,18,0.06)] pt-2.5">
            <Link
              href="/m/onboarding/gps"
              className="text-[11.5px] font-bold text-[#7A3F1C] underline underline-offset-2 hover:text-[#211A12]"
            >
              Change location
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="relative z-10 pb-2">
        <button
          type="button"
          onClick={handleFinish}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default function DeliveryAreaConfirmationScreen() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center bg-[#F7F5F0]" />}>
      <ConfirmAreaContent />
    </Suspense>
  )
}
