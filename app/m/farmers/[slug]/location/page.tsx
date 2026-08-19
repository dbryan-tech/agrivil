'use client'

import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Navigation, Compass, ShieldCheck } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileFarmerLocationScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Farm Location</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Map Graphic Area */}
      <div className="relative h-64 w-full overflow-hidden bg-[#E7E2D5]">
        <div className="absolute inset-0 bg-[radial-gradient(#D5CEBD_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Center Farm Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="rounded-md bg-[#0F7A43] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-lg flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {farmer.farmName || farmer.name}
          </span>
          <div className="mt-1 h-5 w-5 rounded-full border-2 border-white bg-[#0F7A43] shadow-md" />
        </div>
      </div>

      {/* Address & GPS Details Card */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3">
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#6E6A63]">Town &amp; Region</span>
            <span className="font-bold text-[#2B1F17]">{farmer.town}, {farmer.region}</span>
          </div>

          <div className="flex justify-between border-t border-[#E0DACB]/60 pt-2">
            <span className="text-[#6E6A63]">GhanaPostGPS</span>
            <span className="font-extrabold text-[#0F7A43]">{farmer.pickupGPS || 'AK-389-1120'}</span>
          </div>

          <div className="flex justify-between border-t border-[#E0DACB]/60 pt-2">
            <span className="text-[#6E6A63]">Distance to KNUST Hub</span>
            <span className="font-bold text-[#2B1F17]">0.8 km</span>
          </div>

          <div className="flex justify-between border-t border-[#E0DACB]/60 pt-2">
            <span className="text-[#6E6A63]">Delivery Time</span>
            <span className="font-bold text-[#0F7A43]">Same-day (Under 2 hours)</span>
          </div>
        </div>

        {/* Cold Chain Guarantee */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#0F7A43]" />
            <div>
              <h3 className="text-xs font-extrabold text-[#2B1F17]">Direct Farm Pickup Point</h3>
              <p className="mt-1 text-[11px] text-[#6E6A63] leading-relaxed">
                Produce is picked at dawn and transferred immediately to refrigerated dispatch vans at the local hub for temperature-controlled preservation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
