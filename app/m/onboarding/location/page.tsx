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

      {/* Center Map Radar Graphic & Content */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        {/* Modern Map Radar Graphic */}
        <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white/70 shadow-sm">
          {/* Concentric radar rings */}
          <span className="absolute h-44 w-44 animate-ping rounded-full bg-[#0B3B25]/10 opacity-70" />
          <span className="absolute h-36 w-36 rounded-full border border-[#7A3F1C]/15 bg-[#7A3F1C]/5" />
          <span className="absolute h-28 w-28 rounded-full border border-[#0B3B25]/20 bg-[#0B3B25]/10" />
          
          {/* Center Location Pin Badge */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-md">
            <MapPin className="h-7 w-7" />
          </div>
        </div>

        <h1 className="mt-6 text-[26px] font-black tracking-tight text-[#211A12] sm:text-3xl leading-tight">
          Allow location access
        </h1>
        <p className="mt-2 max-w-xs text-[12.5px] font-semibold leading-relaxed text-[#5C5247]">
          We use your location to show you farmers and products near you and check delivery availability.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-2 pb-2">
        <button
          type="button"
          onClick={handleAllow}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <Navigation className="h-4 w-4" />
          Allow Location
        </button>

        <Link
          href="/m/onboarding/gps"
          className="flex h-11 w-full items-center justify-center text-[12px] font-extrabold text-[#7A3F1C] transition-colors hover:text-[#211A12]"
        >
          Not now
        </Link>
      </div>
    </div>
  )
}
