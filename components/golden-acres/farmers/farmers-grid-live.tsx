'use client'

import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { pct } from '@/lib/golden-acres/format'
import type { Farmer } from '@/lib/golden-acres/types'

// Renders the public growers grid from the live store, so farmers who
// registered this session appear alongside the seeded growers.
export function FarmersGridLive({ seed }: { seed: Farmer[] }) {
  const { farmers } = useDataStore()
  const list = farmers.length > 0 ? farmers : seed

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((farmer, i) => (
        <Link
          key={farmer.id}
          href={`/farmers/${farmer.slug}`}
          className="ga-rise group flex flex-col overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] transition-all"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <SmartImage
              src={farmer.cover ?? farmer.photo}
              alt={`${farmer.farmName}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-xs">
                <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
              </div>
              <div className="text-white">
                <p className="font-black leading-tight text-base">{farmer.name}</p>
                <p className="text-xs text-white/85">{farmer.farmName}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="line-clamp-2 text-sm leading-relaxed text-[#5C5247]">
              {farmer.bio}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3.5 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 text-[#5C5247]">
                <MapPin className="h-3.5 w-3.5 text-[#0B3B25]" /> {farmer.region}
              </span>
              <span className="inline-flex items-center gap-3 font-extrabold text-[#211A12]">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]" />
                  {farmer.rating}
                </span>
                <span className="text-[#0B3B25]">{pct(farmer.onTimeRate)} on-time</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
