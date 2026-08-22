import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cedis } from '@/lib/golden-acres/format'

/**
 * Price — guaranteed tabular numerals with GH₵ formatting.
 * Every price on redesigned surfaces renders through this.
 */
export function Price({
  amount,
  size = 'md',
  per,
  className,
  tone = 'ink',
}: {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  /** Unit qualifier, e.g. "/ kg" or "/ bunch". */
  per?: string
  className?: string
  tone?: 'ink' | 'cream'
}) {
  return (
    <span
      className={cn(
        'ga-index inline-flex items-baseline gap-1 font-semibold tracking-[-0.02em]',
        size === 'sm' && 'text-[14px]',
        size === 'md' && 'text-[16px]',
        size === 'lg' && 'text-[clamp(24px,3vw,34px)]',
        tone === 'cream' ? 'text-[#FAF9F6]' : 'text-[#211A12]',
        className,
      )}
    >
      {cedis(amount)}
      {per && (
        <span
          className={cn(
            'font-normal tracking-normal',
            size === 'lg' ? 'text-[14px]' : 'text-[12px]',
            tone === 'cream' ? 'text-[#FAF9F6]/60' : 'text-[#8A7E72]',
          )}
        >
          {per}
        </span>
      )}
    </span>
  )
}

/**
 * RatingStars — harvest-gold stars with an accessible sr-only summary.
 * Gold is for ratings and nothing else.
 */
export function RatingStars({
  rating,
  count,
  size = 'sm',
  className,
}: {
  rating: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const dim = size === 'md' ? 16 : 13
  const rounded = Math.round(rating)
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            width={dim}
            height={dim}
            className={cn(
              i < rounded
                ? 'fill-[#F0A81E] text-[#F0A81E]'
                : 'fill-[rgba(33,26,18,0.10)] text-[rgba(33,26,18,0.10)]',
            )}
          />
        ))}
      </span>
      <span className="sr-only">Rated {rating} out of 5</span>
      {count !== undefined && (
        <span className="text-[12px] font-medium text-[#8A7E72]">
          {rating} ({count})
        </span>
      )}
    </span>
  )
}

/** Plus — the accordion affordance. A hairline circle whose + rotates 45° when open. */
export function Plus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(33,26,18,0.18)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]',
        open && 'rotate-45 border-[rgba(11,59,37,0.5)]',
      )}
    >
      <span className="absolute h-[1.5px] w-3 rounded bg-[#211A12]" />
      <span className="absolute h-3 w-[1.5px] rounded bg-[#211A12]" />
    </span>
  )
}

/** Skeleton — shimmer block with reserved height (CLS-safe). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('ga-skeleton rounded-xl', className)} />
}
