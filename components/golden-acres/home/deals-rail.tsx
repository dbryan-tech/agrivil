'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Zap, ArrowRight } from 'lucide-react'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { useDataStore } from '@/components/golden-acres/store/data-store'

export function DealsRail() {
  const { liveProducts } = useDataStore()

  const picks = useMemo(() => {
    return liveProducts
      .filter((p) => p.status !== 'delisted')
      .slice()
      .sort((a, b) => a.shelfLifeDays - b.shelfLifeDays)
      .slice(0, 10)
  }, [liveProducts])

  if (picks.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-2 py-3 sm:px-3 lg:px-4">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <h2 className="ga-headline text-lg font-black text-[#211A12] sm:text-xl">Fresh today</h2>
          <p className="text-xs font-semibold text-[#5C5247]">Picked this morning — grab it before it&apos;s gone</p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-extrabold text-[#0B3B25] hover:text-[#072618] hover:underline sm:text-sm"
        >
          See all
        </Link>
      </div>

      <div className="ga-rail flex gap-2.5 overflow-x-auto py-1">
        {picks.map((p) => (
          <div key={p.id} className="w-[160px] shrink-0 sm:w-[190px]">
            <ProduceCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
