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
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] bg-[#F7F5F0]/90 backdrop-blur-md px-3 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[16px] font-black text-[#211A12]">Farm Location</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Map Graphic Area */}
      <div className="relative h-60 w-full overflow-hidden bg-[#EAE5DC]">
        <div className="absolute inset-0 bg-[radial-gradient(#D5CEBD_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Center Farm Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="rounded-full bg-[#0B3B25] px-3 py-1 text-[10px] font-black text-white shadow-lg flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {farmer.farmName || farmer.name}
          </span>
          <div className="mt-1 h-4 w-4 rounded-full border-2 border-white bg-[#0B3B25] shadow-md animate-ping" />
        </div>
      </div>

      {/* Address & GPS Details Card */}
      <div className="relative px-3 pt-3 space-y-2.5">
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-2 text-xs">
          <div className="flex justify-between text-[11.5px]">
            <span className="text-[#5C5247] font-semibold">Town &amp; Region</span>
            <span className="font-bold text-[#211A12]">{farmer.town}, {farmer.region}</span>
          </div>

          <div className="flex justify-between border-t border-[rgba(33,26,18,0.06)] pt-2 text-[11.5px]">
            <span className="text-[#5C5247] font-semibold">GhanaPostGPS</span>
            <span className="font-black text-[#0B3B25]">{farmer.pickupGPS || 'AK-389-1120'}</span>
          </div>

          <div className="flex justify-between border-t border-[rgba(33,26,18,0.06)] pt-2 text-[11.5px]">
            <span className="text-[#5C5247] font-semibold">Distance to KNUST Hub</span>
            <span className="font-bold text-[#211A12]">0.8 km</span>
          </div>

          <div className="flex justify-between border-t border-[rgba(33,26,18,0.06)] pt-2 text-[11.5px]">
            <span className="text-[#5C5247] font-semibold">Delivery Time</span>
            <span className="font-black text-[#0B3B25]">Same-day (Under 2 hours)</span>
          </div>
        </div>

        {/* Cold Chain Guarantee */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#0B3B25]" />
            <div>
              <h3 className="text-[12.5px] font-extrabold text-[#211A12]">Direct Farm Pickup Point</h3>
              <p className="mt-1 text-[11px] text-[#5C5247] leading-relaxed font-medium">
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
