'use client'

import { useState } from 'react'
import { Star, Heart, Loader2, CheckCircle2, Sprout } from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { submitDeliveryFeedback } from '@/app/actions/reviews'
import { cedis } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/golden-acres/types'

/* ------------------------------- star input ------------------------------- */

function StarRating({
  value,
  onChange,
  size = 'h-8 w-8',
  label,
}: {
  value: number
  onChange: (n: number) => void
  size?: string
  label: string
}) {
  const [hover, setHover] = useState(0)
  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label={label}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="rounded-full p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-field"
          >
            <Star
              className={cn(
                size,
                'transition-colors',
                filled
                  ? 'fill-clay text-clay'
                  : 'fill-transparent text-border',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------- submitted summary ---------------------------- */

function FeedbackSummary({ order }: { order: Order }) {
  return (
    <div className="ga-rise rounded-2xl border border-leaf/30 bg-leaf/5 p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf text-cream">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <h2 className="ga-display text-xl font-semibold text-foreground">
            Thanks for your feedback
          </h2>
          <p className="text-sm text-muted-foreground">
            Your rating helps our farmers and riders.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="font-semibold">Order</span>
          <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn(
                  'h-4 w-4',
                  (order.orderRating ?? 0) >= n
                    ? 'fill-clay text-clay'
                    : 'fill-transparent text-border',
                )}
              />
            ))}
          </span>
        </span>
        {order.riderRating ? (
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="font-semibold">Rider</span>
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    'h-4 w-4',
                    (order.riderRating ?? 0) >= n
                      ? 'fill-clay text-clay'
                      : 'fill-transparent text-border',
                  )}
                />
              ))}
            </span>
          </span>
        ) : null}
        {order.tip && order.tip > 0 ? (
          <span className="flex items-center gap-1.5 font-semibold text-field">
            <Heart className="h-4 w-4 fill-field text-field" />
            {cedis(order.tip)} tip
          </span>
        ) : null}
      </div>
      {order.feedbackComment ? (
        <p className="mt-3 rounded-lg bg-card px-3 py-2 text-sm italic text-muted-foreground">
          “{order.feedbackComment}”
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------- main card -------------------------------- */

const TIP_OPTIONS = [0, 5, 10, 20]

export function DeliveryFeedback({ order }: { order: Order }) {
  const { applyServerOrder } = useDataStore()
  const [orderRating, setOrderRating] = useState(0)
  const [riderRating, setRiderRating] = useState(0)
  const [tip, setTip] = useState(0)
  const [comment, setComment] = useState('')
  // Per-product star ratings keyed by productId.
  const [productRatings, setProductRatings] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Already rated → show the read-only summary.
  if (order.feedbackAt) {
    return <FeedbackSummary order={order} />
  }

  const riderName = order.threePL.driverName

  async function handleSubmit() {
    if (orderRating < 1) {
      setError('Please give your order a star rating first.')
      return
    }
    setSubmitting(true)
    setError(null)
    const productReviews = Object.entries(productRatings)
      .filter(([, r]) => r > 0)
      .map(([productId, rating]) => ({ productId, rating }))
    const res = await submitDeliveryFeedback({
      reference: order.reference,
      orderRating,
      riderRating: riderRating > 0 ? riderRating : undefined,
      tip,
      comment: comment.trim() || undefined,
      productReviews,
    })
    setSubmitting(false)
    if (!res.ok || !res.order) {
      setError(res.error ?? 'Could not submit your feedback.')
      return
    }
    applyServerOrder(res.order)
  }

  return (
    <div className="ga-rise rounded-2xl border border-clay/30 bg-card p-6">
      <div className="flex items-center gap-2">
        <Sprout className="h-5 w-5 text-leaf" />
        <h2 className="ga-display text-xl font-semibold text-foreground">
          How was your delivery?
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Your feedback rewards the farmers and rider behind this order.
      </p>

      {/* Overall order rating */}
      <div className="mt-5">
        <p className="text-sm font-bold text-foreground">Rate your order</p>
        <div className="mt-2">
          <StarRating
            value={orderRating}
            onChange={setOrderRating}
            label="Overall order rating"
          />
        </div>
      </div>

      {/* Rider rating */}
      {riderName && (
        <div className="mt-5">
          <p className="text-sm font-bold text-foreground">
            Rate your rider · {riderName}
          </p>
          <div className="mt-2">
            <StarRating
              value={riderRating}
              onChange={setRiderRating}
              size="h-7 w-7"
              label="Rider rating"
            />
          </div>
        </div>
      )}

      {/* Tip */}
      {riderName && (
        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Heart className="h-4 w-4 text-field" /> Add a tip for {riderName}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIP_OPTIONS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTip(amt)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-bold transition-colors',
                  tip === amt
                    ? 'border-field bg-field text-cream'
                    : 'border-border bg-card text-foreground hover:bg-secondary',
                )}
              >
                {amt === 0 ? 'No tip' : cedis(amt)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Per-product reviews */}
      {order.items.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-sm font-bold text-foreground">
            Rate the produce <span className="font-normal text-muted-foreground">(optional)</span>
          </p>
          <ul className="mt-3 space-y-3">
            {order.items.map((it) => (
              <li
                key={it.productId}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="text-sm font-semibold text-foreground">
                  {it.name}
                </span>
                <StarRating
                  value={productRatings[it.productId] ?? 0}
                  onChange={(n) =>
                    setProductRatings((p) => ({ ...p, [it.productId]: n }))
                  }
                  size="h-5 w-5"
                  label={`Rate ${it.name}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comment */}
      <div className="mt-6">
        <label
          htmlFor="feedback-comment"
          className="text-sm font-bold text-foreground"
        >
          Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Tell us about the freshness, packaging, or your rider…"
          className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-field"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm font-semibold text-clay" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-field px-6 py-3.5 font-bold text-cream transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
          </>
        ) : (
          'Submit feedback'
        )}
      </button>
    </div>
  )
}
