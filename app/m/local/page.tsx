'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star, CheckCircle2, ChevronRight, Navigation, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

const LOCAL_FARMS = [
  {
    name: 'Adwoa Sarpong Farms',
    slug: 'adwoa-sarpong',
    distance: '0.8 km away',
    rating: 4.7,
    reviews: 32,
    image: '/golden-acres/farmers/adwoa-sarpong.jpg',
    specialty: 'Fresh Roma Tomatoes, Plantain & Onions',
  },
  {
    name: 'Nyamekye Greens',
    slug: 'esi-boateng',
    distance: '1.2 km away',
    rating: 4.6,
    reviews: 18,
    image: '/golden-acres/farmers/esi-boateng.jpg',
    specialty: 'Kontomire, Spinach & Green Leafy Greens',
  },
  {
    name: 'Baffour Organic Farm',
    slug: 'kwame-mensah',
    distance: '2.1 km away',
    rating: 4.8,
    reviews: 27,
    image: '/golden-acres/farmers/kwame-mensah.jpg',
    specialty: 'Yam, Cassava & Organic Roots',
  },
]

export default function MobileShopLocalScreen() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [showNearMe, setShowNearMe] = useState(true)

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* 1. Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[17px] font-extrabold text-[#211A12]">Shop Local</h1>
        </div>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="rounded-full border border-[rgba(33,26,18,0.10)] bg-white px-3.5 py-1.5 text-[11px] font-extrabold text-[#211A12] shadow-2xs active:scale-95 transition-transform"
        >
          {viewMode === 'map' ? 'List View' : 'Map View'}
        </button>
      </header>

      {/* 2. Map Radar Graphic Section */}
      <div className="relative h-60 w-full overflow-hidden bg-[#EAE5DC] border-b border-[rgba(33,26,18,0.10)]">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(122,63,28,0.12)_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-70" />

        {/* Pulsating User Location Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-[#0B3B25]/20 animate-ping" />
          <div className="absolute h-6 w-6 rounded-full border-2 border-white bg-[#0B3B25] shadow-md flex items-center justify-center text-white">
            <Navigation className="h-3 w-3 fill-white" />
          </div>
        </div>

        {/* Nearby Farm Location Pins */}
        <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
          <span className="rounded-md bg-[#0B3B25] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
            Adwoa (0.8km)
          </span>
          <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0B3B25] shadow-md" />
        </div>

        <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
          <span className="rounded-md bg-[#0B3B25] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
            Nyamekye (1.2km)
          </span>
          <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0B3B25] shadow-md" />
        </div>

        <div className="absolute bottom-1/4 left-1/3 flex flex-col items-center">
          <span className="rounded-md bg-[#0B3B25] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
            Baffour (2.1km)
          </span>
          <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0B3B25] shadow-md" />
        </div>
      </div>

      {/* 3. "Show products near me" Toggle Bar */}
      <div className="border-b border-[rgba(33,26,18,0.06)] bg-white/70 px-5 py-3 backdrop-blur-xs">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#0B3B25]" />
            <span className="text-[13px] font-extrabold text-[#211A12]">Show growers near KNUST</span>
          </div>
          <input
            type="checkbox"
            checked={showNearMe}
            onChange={(e) => setShowNearMe(e.target.checked)}
            className="h-5 w-5 rounded-md accent-[#0B3B25]"
          />
        </label>
      </div>

      {/* 4. Farmers & Products List */}
      <div className="relative px-5 pt-4 space-y-3">
        <div className="pb-1">
          <h2 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Farmers &amp; produce near KNUST, Kumasi
          </h2>
        </div>

        <div className="space-y-3">
          {LOCAL_FARMS.map((farm) => (
            <Link
              key={farm.name}
              href={`/m/farmers/${farm.slug}`}
              className="flex items-center justify-between rounded-[26px] bg-[#FAF9F6] p-3.5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs border border-[rgba(33,26,18,0.08)]">
                  <Image
                    src={farm.image}
                    alt={farm.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[14px] font-extrabold text-[#211A12] truncate">
                      {farm.name}
                    </h3>
                    <CheckCircle2 className="h-3.5 w-3.5 fill-[#0B3B25] text-white shrink-0" />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0B3B25]">
                    {farm.distance}
                  </span>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[#5C5247]">
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    <span className="font-black text-[#211A12]">{farm.rating}</span>
                    <span className="font-semibold">({farm.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25] shrink-0">
                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}

