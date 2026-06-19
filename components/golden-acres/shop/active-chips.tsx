'use client'

import { X } from 'lucide-react'
import type { Farmer } from '@/lib/golden-acres/types'
import { activeChips, hasActiveFilters, type FilterState } from '@/lib/golden-acres/filters'

export function ActiveChips({
  filters,
  farmers,
  onChange,
  onClearAll,
}: {
  filters: FilterState
  farmers: Farmer[]
  onChange: (next: FilterState) => void
  onClearAll: () => void
}) {
  const chips = activeChips(filters, farmers)
  if (!hasActiveFilters(filters) || chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Filters
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.clear(filters))}
          className="ga-press group inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60"
        >
          {chip.label}
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
            aria-hidden
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </span>
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
