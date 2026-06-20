import { cn } from '@/lib/utils'

/**
 * Shimmering skeleton placeholder used across the storefront and portals while
 * data hydrates. Uses the muted token so it adapts to light/dark themes.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('ga-skeleton rounded-md bg-muted', className)}
      aria-hidden="true"
    />
  )
}

/** A ready-made product card skeleton matching the produce-card footprint. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-2 h-9 w-full rounded-full" />
      </div>
    </div>
  )
}

/** A horizontal row skeleton for queues/tables. */
export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  )
}

/** Stack of row skeletons for a loading list/queue. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  )
}
