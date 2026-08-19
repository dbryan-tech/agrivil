'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Navigation, ArrowLeft } from 'lucide-react'

export default function LocationPermissionScreen() {
  const router = useRouter()

  function handleAllow() {
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

      {/* Center Map Radar Graphic & Content */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        {/* Modern Map Radar Graphic */}
        <div className="relative flex h-60 w-60 items-center justify-center rounded-full border border-[#E0DACB]/80 bg-white/70 shadow-sm">
          {/* Concentric radar rings */}
          <span className="absolute h-52 w-52 animate-ping rounded-full bg-[#0F7A43]/10 opacity-70" />
          <span className="absolute h-44 w-44 rounded-full border border-[#7A3F1C]/15 bg-[#7A3F1C]/5" />
          <span className="absolute h-32 w-32 rounded-full border border-[#0F7A43]/20 bg-[#0F7A43]/10" />
          
          {/* Center Location Pin Badge */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-lg">
            <MapPin className="h-8 w-8" />
          </div>
        </div>

        <h1 className="ga-headline mt-8 text-3xl font-extrabold tracking-tight text-[#2B1F17] sm:text-4xl">
          Allow location access
        </h1>
        <p className="mt-2.5 max-w-xs text-sm font-medium leading-relaxed text-[#6E6A63]">
          We use your location to show you farmers and products near you and check delivery availability.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-3 pb-4">
        <button
          type="button"
          onClick={handleAllow}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-base font-bold text-white shadow-md transition-all hover:bg-[#0B3B25]"
        >
          <Navigation className="h-4 w-4" />
          Allow Location
        </button>

        <Link
          href="/m/onboarding/gps"
          className="ga-press flex h-12 w-full items-center justify-center text-sm font-bold text-[#7A3F1C] transition-colors hover:text-[#2B1F17]"
        >
          Not now
        </Link>
      </div>
    </div>
  )
}
