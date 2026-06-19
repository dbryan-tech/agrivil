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
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 transition-all duration-700">
      <div className="ga-card-hover overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:border-primary/30">
        <div className="ga-color-transition flex items-center justify-between gap-3 border-b border-border/50 bg-secondary/40 px-4 py-3 sm:px-5 transition-all duration-300">
          <div className="ga-fade-in flex items-center gap-2.5 transition-all duration-500">
            <span className="ga-scale-interactive flex h-9 w-9 items-center justify-center rounded-full bg-deal text-deal-foreground shadow-md transition-all duration-300 hover:shadow-lg">
              <Zap className="h-5 w-5 animate-pulse" />
            </span>
            <div className="leading-tight">
              <h2 className="ga-headline text-lg text-foreground sm:text-xl transition-colors duration-300">Fresh today</h2>
              <p className="text-xs text-muted-foreground transition-colors duration-300">Picked this morning — grab it before it&apos;s gone</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="ga-color-transition inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-all duration-300 hover:gap-2 hover:underline"
          >
            See all <ArrowRight className="h-4 w-4 transition-transform duration-300" />
          </Link>
        </div>

        <div className="ga-rail flex gap-3 overflow-x-auto p-4 sm:p-5 transition-all duration-500">
          {picks.map((p, i) => (
            <div key={p.id} className="ga-fade-in w-[170px] shrink-0 sm:w-[210px] transition-all duration-500" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProduceCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
