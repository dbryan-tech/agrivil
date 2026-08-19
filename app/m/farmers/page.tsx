'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ChevronRight, Leaf, Star, Search, MapPin, Sparkles } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

const REGION_FILTERS = ['All', 'Ashanti', 'Eastern', 'Greater Accra', 'Volta', 'Bono', 'Northern']

export default function MobileFarmersScreen() {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')

  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      const matchesSearch =
        search.trim() === '' ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.farmName.toLowerCase().includes(search.toLowerCase()) ||
        f.town.toLowerCase().includes(search.toLowerCase()) ||
        f.region.toLowerCase().includes(search.toLowerCase())

      const matchesRegion =
        selectedRegion === 'All' || f.region.toLowerCase() === selectedRegion.toLowerCase()

      return matchesSearch && matchesRegion
    })
  }, [search, selectedRegion])

  const featuredFarmer = farmers[0]

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      <MobileAppBar title="Our Local Farmers" showCart />

      <div className="px-3 sm:px-4 py-3 space-y-3.5">
        {/* 1. Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search growers by name, town, or region..."
            className="h-11 w-full rounded-2xl border border-[#E0DACB] bg-white pl-10 pr-4 text-xs font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#0F7A43] focus:ring-2 focus:ring-[#0F7A43]/20"
          />
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0F7A43]" />
        </div>

        {/* 2. Region Pills Scroller */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-0.5">
          {REGION_FILTERS.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={cn(
                'ga-press flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-xs font-bold transition-all',
                selectedRegion === reg
                  ? 'bg-[#0F7A43] text-white shadow-xs'
                  : 'border border-[#E0DACB] bg-white text-[#2B1F17] hover:bg-[#FAF7F0]'
              )}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* 3. Featured Hero Grower Card */}
        {selectedRegion === 'All' && !search && featuredFarmer && (
          <Link
            href={`/m/farmers/${featuredFarmer.slug}`}
            className="ga-press group block overflow-hidden rounded-3xl border border-[#E0DACB] bg-white shadow-xs"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAF7F0]">
              <Image
                src={featuredFarmer.photo}
                alt={featuredFarmer.name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#0F7A43] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-md">
                <Sparkles className="h-2.5 w-2.5 text-[#A3E635]" /> Featured Farm
              </span>
            </div>

            <div className="p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold text-[#2B1F17]">
                    {featuredFarmer.name}
                  </h2>
                  <CheckCircle2 className="h-3.5 w-3.5 fill-[#0F7A43] text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#7A3F1C]">
                  <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>{featuredFarmer.rating}</span>
                  <span className="text-[#6E6A63]">({featuredFarmer.reviewCount})</span>
                </div>
              </div>

              <p className="mt-0.5 text-xs font-semibold text-[#0F7A43]">
                {featuredFarmer.farmName} · {featuredFarmer.town}, {featuredFarmer.region}
              </p>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#6E6A63]">
                {featuredFarmer.bio}
              </p>
            </div>
          </Link>
        )}

        {/* 4. Farmers Directory List */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Participating Growers ({filteredFarmers.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {filteredFarmers.map((farmer, idx) => {
              const distance = (0.8 + idx * 0.5).toFixed(1)
              return (
                <Link
                  key={farmer.id}
                  href={`/m/farmers/${farmer.slug}`}
                  className="ga-press flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs hover:border-[#0F7A43]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl border border-[#E0DACB] bg-[#FAF7F0]">
                      <Image
                        src={farmer.photo}
                        alt={farmer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-[#2B1F17]">
                          {farmer.name}
                        </h4>
                        <CheckCircle2 className="h-3 w-3 fill-[#0F7A43] text-white" />
                      </div>
                      <span className="text-[10px] text-[#6E6A63]">
                        {farmer.farmName} · <strong className="text-[#0F7A43]">{distance} km away</strong>
                      </span>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-0.5 font-bold text-[#7A3F1C]">
                          <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" />
                          <span>{farmer.rating}</span>
                        </span>
                        <span className="text-[#6E6A63]">({farmer.reviewCount} reviews)</span>
                        <span className="text-[#0F7A43] font-semibold">· {farmer.town}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF7F0] text-[#0F7A43]">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
