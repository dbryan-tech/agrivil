'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star, CheckCircle2, ChevronRight, Navigation } from 'lucide-react'
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
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* 1. Header (Matching Screen 11) */}
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
          <h1 className="text-base font-extrabold text-[#2B1F17]">Shop Local</h1>
        </div>

        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="ga-press rounded-full border border-[#E0DACB] bg-white px-3 py-1 text-xs font-bold text-[#2B1F17] shadow-xs hover:border-[#0F7A43]"
        >
          {viewMode === 'map' ? 'List view' : 'Map view'}
        </button>
      </header>

      {/* 2. Map Radar Graphic Section (Screen 11) */}
      <div className="relative h-64 w-full overflow-hidden bg-[#E7E2D5]">
        {/* Map Grid Pattern & Roads */}
        <div className="absolute inset-0 bg-[radial-gradient(#D5CEBD_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Pulsating User Location Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-[#0F7A43]/20 animate-ping" />
          <div className="absolute h-5 w-5 rounded-full border-2 border-white bg-[#0F7A43] shadow-md flex items-center justify-center text-white">
            <Navigation className="h-2.5 w-2.5 fill-white" />
          </div>
        </div>

        {/* Nearby Farm Location Pins */}
        <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
          <span className="rounded-md bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md">
            Adwoa (0.8km)
          </span>
          <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0F7A43] shadow-md" />
        </div>

        <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
          <span className="rounded-md bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md">
            Nyamekye (1.2km)
          </span>
          <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0F7A43] shadow-md" />
        </div>

        <div className="absolute bottom-1/4 left-1/3 flex flex-col items-center">
          <span className="rounded-md bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md">
            Baffour (2.1km)
          </span>
          <div className="mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0F7A43] shadow-md" />
        </div>
      </div>

      {/* 3. "Show products near me" Toggle Bar */}
      <div className="border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-[#2B1F17]">Show products near me</span>
          <input
            type="checkbox"
            checked={showNearMe}
            onChange={(e) => setShowNearMe(e.target.checked)}
            className="h-5 w-5 rounded-md accent-[#0F7A43]"
          />
        </label>
      </div>

      {/* 4. Farmers & Products List (Matching Screen 11) */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3">
        <div className="pb-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Farmers &amp; products near KNUST, Kumasi
          </h2>
        </div>

        <div className="space-y-2.5">
          {LOCAL_FARMS.map((farm) => (
            <Link
              key={farm.name}
              href={`/m/farmers/${farm.slug}`}
              className="ga-press flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs hover:border-[#0F7A43]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl border border-[#E0DACB] bg-[#FAF7F0]">
                  <Image
                    src={farm.image}
                    alt={farm.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-extrabold text-[#2B1F17]">
                      {farm.name}
                    </h3>
                    <CheckCircle2 className="h-3 w-3 fill-[#0F7A43] text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#0F7A43]">
                    {farm.distance}
                  </span>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#6E6A63]">
                    <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="font-bold text-[#2B1F17]">{farm.rating}</span>
                    <span>({farm.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="flex h-7 w-7 items-center justify-center text-[#6E6A63]">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
