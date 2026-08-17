'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle2, ChevronRight, ShieldCheck, Leaf } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileFarmersScreen() {
  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar title="Our Farmers" showSearch showCart />

      <div className="px-4 py-4 space-y-4">
        {/* Featured Hero Farmer Card */}
        {farmers.length > 0 && (
          <Link
            href={`/m/farmers/${farmers[0].slug}`}
            className="ga-press group block overflow-hidden rounded-3xl border border-[#E0DACB] bg-white shadow-xs"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EBE6DA]">
              <Image
                src={farmers[0].photo}
                alt={farmers[0].name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#1E5D3B] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                <Leaf className="h-3 w-3" /> Featured Farm
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-[#2B1F17]">
                    {farmers[0].name}
                  </h2>
                  <CheckCircle2 className="h-4 w-4 fill-[#1E5D3B] text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#8A6B3D]">
                  <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>{farmers[0].rating}</span>
                  <span className="text-[#6E6A63]">({farmers[0].reviewCount})</span>
                </div>
              </div>

              <p className="mt-1 text-xs font-medium text-[#1E5D3B]">
                {farmers[0].region} · 0.8 km away
              </p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6E6A63]">
                {farmers[0].bio}
              </p>
            </div>
          </Link>
        )}

        {/* All Farmers List */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-2">
            More Local Growers Near You
          </h3>

          <div className="space-y-3">
            {farmers.slice(1).map((farmer, idx) => {
              const distance = (1.2 + idx * 0.9).toFixed(1)
              return (
                <Link
                  key={farmer.id}
                  href={`/m/farmers/${farmer.slug}`}
                  className="ga-press flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs hover:border-[#1E5D3B]/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#E0DACB]">
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
                        <CheckCircle2 className="h-3 w-3 fill-[#1E5D3B] text-white" />
                      </div>
                      <span className="text-[10px] text-[#6E6A63]">
                        {farmer.region} · <strong className="text-[#1E5D3B]">{distance} km away</strong>
                      </span>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-[#8A6B3D]">
                        <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
                        <span>{farmer.rating}</span>
                        <span className="text-[#6E6A63]">({farmer.reviewCount})</span>
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
      </div>

      <MobileBottomNav />
    </div>
  )
}
