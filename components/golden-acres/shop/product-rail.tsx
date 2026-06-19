'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { groupOffers } from '@/lib/golden-acres/grouping'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/golden-acres/types'

/**
 * Horizontal, scrollable rail of produce cards with arrow controls.
 * Used for "Recently viewed", "You might also like", and category cross-sells.
 * Groups offers by product so duplicate canonical items collapse into one card.
 */
export function ProductRail({
  title,
  subtitle,
  products,
  icon,
  onQuickView,
  groupByName = true,
  className,
}: {
  title: string
  subtitle?: string
  products: Product[]
  icon?: React.ReactNode
  onQuickView?: (p: Product) => void
  groupByName?: boolean
  className?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)

  if (products.length === 0) return null

  const cards = groupByName
    ? groupOffers(products).map((g) => ({ product: g.lead, count: g.count }))
    : products.map((p) => ({ product: p, count: 1 }))

  function scroll(dir: -1 | 1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className={cn('mt-12', className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="ga-headline flex items-center gap-2 text-2xl text-foreground">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary/50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="ga-rail -mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {cards.map(({ product, count }) => (
          <div key={product.id} className="w-[170px] shrink-0 sm:w-[220px]">
            <ProduceCard product={product} offerCount={count} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </section>
  )
}
