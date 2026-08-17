'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Navigation, Star, Map as MapIcon, List, CheckCircle2, ChevronRight, Phone } from 'lucide-react'
import { farmers, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

export default function MobileShopLocalScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [filterTab, setFilterTab] = useState<'all' | 'farmers' | 'products'>('all')

  const nearbyFarms = farmers.slice(0, 4)
  const nearbyProducts = products.slice(0, 6)

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar
        title="Shop Local"
        subtitle="Farmers &amp; produce near KNUST, Kumasi"
        showSearch
        showCart
        rightSlot={
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            aria-label="Toggle map view"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1E5D3B] shadow-xs border border-[#E0DACB]"
          >
            {viewMode === 'list' ? <MapIcon className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </button>
        }
      />

      {/* Filter Tabs (All / Farmers / Products) */}
      <div className="flex gap-2 border-b border-[#E0DACB]/80 bg-[#F4F1EA] px-4 py-3">
        {(['all', 'farmers', 'products'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterTab(tab)}
            className={cn(
              'ga-press rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all',
              filterTab === tab
                ? 'bg-[#1E5D3B] text-white shadow-xs'
                : 'bg-white border border-[#E0DACB] text-[#2B1F17]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {viewMode === 'map' ? (
        /* Map View Graphic */
        <div className="relative h-[65vh] w-full overflow-hidden bg-[#EBE6DA]">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/golden-acres/hero-farmer.jpg"
              alt="Map area"
              fill
              className="object-cover"
            />
          </div>

          {/* Interactive Radar Pins */}
          <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
            <span className="rounded-md bg-[#1E5D3B] px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
              Adwoa Farms (0.8km)
            </span>
            <div className="h-6 w-6 rounded-full border-2 border-white bg-[#1E5D3B] shadow-lg animate-bounce" />
          </div>

          <div className="absolute top-1/2 right-1/4 flex flex-col items-center">
            <span className="rounded-md bg-[#1E5D3B] px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
              Nyamekye Greens (1.2km)
            </span>
            <div className="h-6 w-6 rounded-full border-2 border-white bg-[#1E5D3B] shadow-lg" />
          </div>

          <div className="absolute bottom-1/4 left-1/2 flex flex-col items-center">
            <span className="rounded-md bg-[#1E5D3B] px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
              Baffour Organic (2.1km)
            </span>
            <div className="h-6 w-6 rounded-full border-2 border-white bg-[#1E5D3B] shadow-lg" />
          </div>
        </div>
      ) : (
        /* List View */
        <div className="px-4 py-4 space-y-6">
          {/* Nearby Farmers Section */}
          {(filterTab === 'all' || filterTab === 'farmers') && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Closest Participating Farms
              </h2>

              <div className="mt-3 space-y-3">
                {nearbyFarms.map((farm, idx) => {
                  const dist = (0.8 + idx * 0.4).toFixed(1)
                  return (
                    <Link
                      key={farm.id}
                      href={`/m/farmers/${farm.slug}`}
                      className="ga-press flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs hover:border-[#1E5D3B]/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#E0DACB]">
                          <Image
                            src={farm.photo}
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
                            <CheckCircle2 className="h-3 w-3 fill-[#1E5D3B] text-white" />
                          </div>
                          <span className="text-[10px] text-[#6E6A63]">
                            {farm.region} · <strong className="text-[#1E5D3B]">{dist} km away</strong>
                          </span>
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold">
                            <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
                            <span>{farm.rating}</span>
                            <span className="text-[#6E6A63]">({farm.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center text-[#6E6A63]">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Local Produce Section */}
          {(filterTab === 'all' || filterTab === 'products') && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Harvested Within 5km
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {nearbyProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/m/product/${p.slug}`}
                    className="ga-press group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2.5">
                      <h4 className="truncate text-xs font-extrabold text-[#2B1F17]">
                        {p.name}
                      </h4>
                      <p className="truncate text-[10px] text-[#6E6A63]">
                        {p.farmerName}
                      </p>
                      <span className="mt-1 block text-xs font-bold text-[#1E5D3B]">
                        {formatGHS(p.priceMin)} / {p.variableWeight ? 'kg' : p.unit}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}
