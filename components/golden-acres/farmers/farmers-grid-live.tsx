'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { RatingStars } from '@/components/golden-acres/system'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { pct } from '@/lib/golden-acres/format'
import type { Farmer } from '@/lib/golden-acres/types'

/**
 * Farmers directory grid (redesigned, docs/redesign/06 §3).
 * Quiet editorial cards — the trust backbone of the marketplace. Live store
 * so session-registered farmers appear alongside seeded growers.
 */
export function FarmersGridLive({ seed }: { seed: Farmer[] }) {
  const { farmers } = useDataStore()
  const list = farmers.length > 0 ? farmers : seed

  return (
    <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((farmer) => (
        <Link
          key={farmer.id}
          href={`/farmers/${farmer.slug}`}
          className="group block"
        >
          {/* Portrait */}
          <span className="relative block aspect-[4/5] overflow-hidden rounded-[20px] border border-[rgba(33,26,18,0.05)] bg-white">
            <SmartImage
              src={farmer.cover ?? farmer.photo}
              alt={`${farmer.farmName} — ${farmer.name}`}
              fill
              className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </span>

          {/* Attribution */}
          <span className="mt-4 block">
            <span className="text-[12px] font-semibold text-[#7A3F1C]">{farmer.farmName}</span>
            <span className="ga-display-title mt-0.5 block truncate text-[20px] text-[#211A12] transition-colors duration-300 group-hover:text-[#7A3F1C]">
              {farmer.name}
            </span>
            <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-[#5C5247]">
              {farmer.bio}
            </span>
          </span>

          <span className="ga-index mt-2.5 flex items-center justify-between text-[12px] text-[#8A7E72]">
            <span className="inline-flex items-center gap-1">
              <MapPin width={11} height={11} /> {farmer.region}
            </span>
            <RatingStars rating={farmer.rating} />
          </span>
          <span className="ga-index mt-1 block text-[12px] font-medium text-[#0F7A43]">
            {pct(farmer.onTimeRate)} on-time delivery
          </span>
        </Link>
      ))}
    </div>
  )
}
