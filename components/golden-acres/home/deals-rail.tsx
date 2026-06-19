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
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="ga-elev-2 overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-gradient-to-r from-[var(--ga-deal)]/8 to-transparent px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="ga-elev-1 flex h-10 w-10 items-center justify-center rounded-full bg-deal text-deal-foreground">
              <Zap className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <h2 className="ga-headline text-lg text-foreground sm:text-xl">Fresh today</h2>
              <p className="text-xs text-muted-foreground">Picked this morning — grab it before it&apos;s gone</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary"
          >
            See all
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="ga-rail flex gap-3 overflow-x-auto p-4 sm:gap-4 sm:p-5">
          {picks.map((p) => (
            <div key={p.id} className="w-[170px] shrink-0 sm:w-[210px]">
              <ProduceCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
