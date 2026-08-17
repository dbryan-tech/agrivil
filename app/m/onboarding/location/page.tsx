'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Navigation, ArrowLeft } from 'lucide-react'
import { CornerProduceOrnaments } from '@/components/golden-acres/mobile/corner-produce-ornaments'

export default function LocationPermissionScreen() {
  const router = useRouter()

  function handleAllow() {
    // In browser or hybrid shell, request geolocation or proceed to GPS entry
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => router.push('/m/onboarding/gps'),
        () => router.push('/m/onboarding/gps')
      )
    } else {
      router.push('/m/onboarding/gps')
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F4F1EA] px-6 py-6 sm:px-8">
      <CornerProduceOrnaments preset="citrus-greens" corners={['tl', 'tr']} delayMs={100} />

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

      {/* Center Map Radar Graphic */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#E0DACB] bg-white/50 shadow-inner">
          {/* Pulsing radar rings */}
          <span className="absolute h-44 w-44 animate-ping rounded-full bg-[#1E5D3B]/10 opacity-75" />
          <span className="absolute h-32 w-32 rounded-full border border-[#1E5D3B]/20 bg-[#1E5D3B]/5" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1E5D3B] text-white shadow-lg">
            <MapPin className="h-8 w-8" />
          </div>
        </div>

        <h1 className="ga-headline mt-8 text-2xl font-extrabold tracking-tight text-[#2B1F17] sm:text-3xl">
          Allow location access
        </h1>
        <p className="mt-2.5 max-w-xs text-xs font-medium leading-relaxed text-[#6E6A63]">
          We use your location to show you farmers and products near you and check delivery availability in your area.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-3 pb-6">
        <button
          type="button"
          onClick={handleAllow}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-base font-bold text-white shadow-md hover:bg-[#144028]"
        >
          <Navigation className="h-4 w-4" />
          Allow Location
        </button>

        <Link
          href="/m/onboarding/gps"
          className="ga-press flex h-12 w-full items-center justify-center text-sm font-bold text-[#6E6A63] hover:text-[#2B1F17]"
        >
          Not now
        </Link>
      </div>
    </div>
  )
}
