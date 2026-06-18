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
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((farmer, i) => (
        <Link
          key={farmer.id}
          href={`/farmers/${farmer.slug}`}
          className="ga-rise group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-xl hover:shadow-black/5"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <SmartImage
              src={farmer.cover ?? farmer.photo}
              alt={`${farmer.farmName}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white">
                <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
              </div>
              <div className="text-white">
                <p className="font-bold leading-tight">{farmer.name}</p>
                <p className="text-xs text-white/85">{farmer.farmName}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {farmer.bio}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {farmer.region}
              </span>
              <span className="inline-flex items-center gap-3 font-semibold text-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[var(--ga-gold)] text-[var(--ga-gold)]" />
                  {farmer.rating}
                </span>
                <span className="text-[var(--ga-leaf)]">{pct(farmer.onTimeRate)} on-time</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
