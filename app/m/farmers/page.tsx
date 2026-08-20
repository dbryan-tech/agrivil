'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ChevronRight, Star, Search, MapPin, Sparkles } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
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

      {/* Header Bar */}
      {/* Header */}
      <header className="relative flex items-center justify-between px-3 pt-3 pb-1.5">
        <h1 className="text-[22px] font-black tracking-tight text-[#211A12]">
          Our Growers
        </h1>
        <div className="flex items-center gap-1 text-[10.5px] font-black text-[#0B3B25]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Fair Trade 100%</span>
        </div>
      </header>

      <div className="relative px-3 pt-2 space-y-2.5">
        {/* 1. Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search growers by name, town, or region..."
            className="h-10 w-full rounded-full border border-[rgba(33,26,18,0.10)] bg-white pl-9 pr-3 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none focus:border-[#0B3B25]"
          />
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0B3B25] stroke-[2.4]" />
        </div>

        {/* 2. Region Pills Scroller */}
        <div className="flex gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {REGION_FILTERS.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={cn(
                'flex shrink-0 items-center rounded-full px-3 py-1 text-[11.5px] font-extrabold transition-all active:scale-95 shadow-2xs',
                selectedRegion === reg
                  ? 'bg-[#0B3B25] text-white shadow-xs'
                  : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
              )}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* 3. Featured Hero Grower Card (Bleeds to left & right edges) */}
        {selectedRegion === 'All' && !search && featuredFarmer && (
          <div className="-mx-3 pt-1 pb-1">
            <Link
              href={`/m/farmers/${featuredFarmer.slug}`}
              className="group block overflow-hidden bg-white shadow-xs active:scale-[0.99] transition-transform"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
                <Image
                  src={featuredFarmer.photo}
                  alt={featuredFarmer.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3.5 inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                  <Sparkles className="h-3 w-3 text-[#F0A81E]" /> Featured Farm
                </span>
              </div>

              <div className="p-3.5 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-[15px] font-black text-[#211A12]">
                      {featuredFarmer.name}
                    </h2>
                    <CheckCircle2 className="h-3.5 w-3.5 fill-[#0B3B25] text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[11.5px] font-black text-[#211A12]">
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    <span>{featuredFarmer.rating}</span>
                    <span className="text-[#5C5247] font-semibold">({featuredFarmer.reviewCount})</span>
                  </div>
                </div>

                <p className="mt-0.5 text-[12px] font-bold text-[#7A3F1C]">
                  {featuredFarmer.farmName} · {featuredFarmer.town}, {featuredFarmer.region}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-[#5C5247] font-medium">
                  {featuredFarmer.bio}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* 4. Farmers Directory List */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-[10.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Participating Growers ({filteredFarmers.length})
            </h3>
          </div>

          <div className="space-y-2">
            {filteredFarmers.map((farmer, idx) => {
              const distance = (0.8 + idx * 0.5).toFixed(1)
              return (
                <Link
                  key={farmer.id}
                  href={`/m/farmers/${farmer.slug}`}
                  className="flex items-center justify-between rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-2xs">
                      <Image
                        src={farmer.photo}
                        alt={farmer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13.5px] font-extrabold text-[#211A12] truncate">
                          {farmer.name}
                        </h4>
                        <CheckCircle2 className="h-3 w-3 fill-[#0B3B25] text-white shrink-0" />
                      </div>
                      <span className="text-[10.5px] font-semibold text-[#5C5247] truncate">
                        {farmer.farmName} · <strong className="text-[#0B3B25]">{distance} km away</strong>
                      </span>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px]">
                        <span className="flex items-center gap-0.5 font-black text-[#211A12]">
                          <Star className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]" />
                          <span>{farmer.rating}</span>
                        </span>
                        <span className="text-[#5C5247] font-semibold">({farmer.reviewCount})</span>
                        <span className="text-[#7A3F1C] font-bold truncate">· {farmer.town}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25] shrink-0">
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
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

