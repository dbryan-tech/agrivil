'use client'

import { useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Star, MessageSquareReply, Check, Loader2, Filter } from 'lucide-react'
import type { Farmer, Review } from '@/lib/golden-acres/types'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import {
  getReviewsForFarmerPortal,
  replyToReview,
} from '@/app/actions/reviews'
import { shortDate } from '@/lib/golden-acres/format'
import { EmptyState } from '@/components/golden-acres/ui/empty-state'
import { ListSkeleton } from '@/components/golden-acres/ui/skeleton'

type ReplyFilter = 'all' | 'needs-reply' | 'replied'

export function FarmerReviewsTab({ farmer }: { farmer: Farmer }) {
  const { productsByFarmer } = useDataStore()
  const productName = useMemo(() => {
    const map = new Map<string, string>()
    productsByFarmer(farmer.id).forEach((p) => map.set(p.id, p.name))
    return map
  }, [farmer.id, productsByFarmer])

  const key = ['farmer-portal-reviews', farmer.id]
  const { data, isLoading } = useSWR(key, () =>
    getReviewsForFarmerPortal(farmer.id),
  )
  const reviews = data ?? []
  const [filter, setFilter] = useState<ReplyFilter>('all')

  const stats = useMemo(() => {
    const total = reviews.length
    const avg =
      total > 0
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) /
          10
        : 0
    const needsReply = reviews.filter((r) => !r.farmerReply).length
    return { total, avg, needsReply }
  }, [reviews])

  const filtered = reviews.filter((r) => {
    if (filter === 'needs-reply') return !r.farmerReply
    if (filter === 'replied') return Boolean(r.farmerReply)
    return true
  })

  const FILTERS: { id: ReplyFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'needs-reply', label: 'Needs reply', count: stats.needsReply },
    { id: 'replied', label: 'Replied', count: stats.total - stats.needsReply },
  ]

  return (
    <section className="space-y-4">
      <SectionTitle eyebrow="Reputation" title="Customer reviews" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryCard
          label="Rating"
          value={
            <span className="flex items-center gap-1">
              {stats.avg.toFixed(1)}
              <Star className="h-4 w-4 fill-[var(--ga-gold)] text-[var(--ga-gold)]" />
            </span>
          }
        />
        <SummaryCard label="Reviews" value={stats.total} />
        <SummaryCard label="To answer" value={stats.needsReply} highlight />
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === f.id
                ? 'bg-[var(--ga-field-deep)] text-[var(--ga-cream)]'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquareReply}
          title={
            filter === 'needs-reply'
              ? 'All caught up'
              : 'No reviews yet'
          }
          description={
            filter === 'needs-reply'
              ? "You've replied to every review. Nicely done."
              : 'Reviews from customers who bought your produce will appear here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              productName={r.productId ? productName.get(r.productId) : undefined}
              onReplied={() => mutate(key)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function ReviewCard({
  review,
  productName,
  onReplied,
}: {
  review: Review
  productName?: string
  onReplied: () => void
}) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState(review.farmerReply ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setSaving(true)
    setError(null)
    const res = await replyToReview(review.id, text)
    setSaving(false)
    if (res.ok) {
      setOpen(false)
      onReplied()
    } else {
      setError(res.error ?? 'Could not post reply.')
    }
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-foreground">{review.authorName}</p>
          <p className="text-xs text-muted-foreground">
            {productName ? `${productName} · ` : 'Farm review · '}
            {shortDate(review.createdAt)}
            {review.verifiedPurchase ? ' · Verified' : ''}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5"
              style={{
                fill: i < review.rating ? 'var(--ga-gold)' : 'transparent',
                color:
                  i < review.rating
                    ? 'var(--ga-gold)'
                    : 'var(--muted-foreground)',
              }}
            />
          ))}
        </div>
      </div>

      {review.body && (
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          {review.body}
        </p>
      )}

      {/* Existing reply */}
      {review.farmerReply && !open && (
        <div className="mt-3 rounded-xl bg-[var(--ga-field)]/8 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--ga-field-deep)]">
            <MessageSquareReply className="h-3.5 w-3.5" /> Your reply
          </p>
          <p className="mt-1 text-sm text-foreground/90">{review.farmerReply}</p>
        </div>
      )}

      {/* Reply composer */}
      {open ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="Thank your customer or address their feedback…"
            className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-[var(--ga-field)]"
          />
          {error && <p className="text-xs font-semibold text-[var(--ga-clay)]">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={saving || !text.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ga-field-deep)] px-4 py-2 text-sm font-bold text-[var(--ga-cream)] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Post reply
            </button>
            <button
              onClick={() => {
                setOpen(false)
                setText(review.farmerReply ?? '')
              }}
              className="rounded-full px-3 py-2 text-sm font-bold text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ga-field-deep)]"
        >
          <MessageSquareReply className="h-4 w-4" />
          {review.farmerReply ? 'Edit reply' : 'Reply'}
        </button>
      )}
    </article>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--ga-gold)]">
        {eyebrow}
      </p>
      <h2 className="ga-display text-2xl font-semibold text-foreground">
        {title}
      </h2>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-3 text-center ${
        highlight
          ? 'border-[var(--ga-gold-soft)] bg-[var(--ga-gold)]/8'
          : 'border-border bg-card'
      }`}
    >
      <p className="ga-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
