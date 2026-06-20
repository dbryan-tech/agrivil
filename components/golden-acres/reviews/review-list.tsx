'use client'

import useSWR from 'swr'
import { Star, ShieldCheck, MessageSquare, Sprout } from 'lucide-react'
import { getProductReviews, getFarmerReviews } from '@/app/actions/reviews'
import { shortDate } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import type { Review } from '@/lib/golden-acres/types'

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            'h-4 w-4',
            rating >= n ? 'fill-clay text-clay' : 'fill-transparent text-border',
          )}
        />
      ))}
    </span>
  )
}

/**
 * Verified-purchase review feed for a product or farmer. Self-fetching client
 * component (SWR) so it can drop into server-rendered pages. Pass exactly one
 * of productId / farmerId.
 */
export function ReviewList({
  productId,
  farmerId,
  title = 'Customer reviews',
}: {
  productId?: string
  farmerId?: string
  title?: string
}) {
  const key = productId
    ? ['reviews:product', productId]
    : farmerId
      ? ['reviews:farmer', farmerId]
      : null

  const { data, isLoading } = useSWR<Review[]>(
    key,
    () => (productId ? getProductReviews(productId) : getFarmerReviews(farmerId!)),
    { revalidateOnFocus: false },
  )

  const reviews = data ?? []

  if (isLoading) {
    return <div className="h-28 animate-pulse rounded-2xl bg-secondary" />
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm font-semibold text-foreground">No reviews yet</p>
        <p className="text-sm text-muted-foreground">
          Verified reviews appear here after customers receive their orders.
        </p>
      </div>
    )
  }

  const avg =
    Math.round(
      (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10,
    ) / 10

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="ga-display text-2xl font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <Stars rating={Math.round(avg)} />
          <span className="text-sm font-bold text-foreground">{avg.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            ({reviews.length} review{reviews.length > 1 ? 's' : ''})
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-field text-sm font-bold text-cream">
                  {r.authorName.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{r.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {shortDate(r.createdAt)}
                  </p>
                </div>
              </div>
              <Stars rating={r.rating} />
            </div>
            {r.verifiedPurchase && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-leaf">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified purchase
              </p>
            )}
            {r.body && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            )}
            {r.farmerReply && (
              <div className="mt-3 rounded-xl border border-leaf/20 bg-leaf/5 px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-bold text-leaf">
                  <Sprout className="h-3.5 w-3.5" /> Response from the farmer
                  {r.farmerReplyAt ? (
                    <span className="font-normal text-muted-foreground">
                      · {shortDate(r.farmerReplyAt)}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {r.farmerReply}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
