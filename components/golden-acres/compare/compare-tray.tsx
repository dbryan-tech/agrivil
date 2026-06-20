'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, GitCompareArrows, ArrowRight } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCompare } from './compare-context'
import { products as catalog } from '@/lib/golden-acres/data'

/**
 * Floating comparison tray pinned to the bottom of the storefront. Appears only
 * when the shopper has queued one or more products. Shows thumbnails with
 * remove controls and a primary action to open the side-by-side /compare view.
 */
export function CompareTray() {
  const { ids, count, remove, clear, max } = useCompare()
  const router = useRouter()

  if (count === 0) return null

  const items = ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-4">
      <div className="ga-fade-in pointer-events-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl ring-1 ring-black/5 backdrop-blur-md sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
        <div className="flex items-center gap-2 sm:shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GitCompareArrows className="h-[18px] w-[18px]" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">Compare</span>
            <span className="text-[11px] text-muted-foreground">
              {count} of {max} selected
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {items.map((p) => (
            <div
              key={p.id}
              className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary/40 ring-1 ring-border"
            >
              <SmartImage src={p.image} alt={p.name} fill className="object-cover" />
              <button
                onClick={() => remove(p.id)}
                aria-label={`Remove ${p.name} from comparison`}
                className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-bl-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <button
            onClick={clear}
            className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
          <button
            onClick={() => router.push('/compare')}
            disabled={count < 2}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Compare
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
