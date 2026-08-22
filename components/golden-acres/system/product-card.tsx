import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { RatingStars } from './atoms'
import { Price } from './atoms'

/**
 * ProductCard — the one elevated unit allowed on the storefront canvas.
 * Soft floating grammar: 25/75 tan-white surface, near-invisible border,
 * whisper shadow. Image shell 4:5 with overflow-safe zoom; farm attribution
 * in copper; price via the tabular Price atom.
 */
export function ProductCard({
  href,
  image,
  name,
  farmName,
  price,
  per,
  rating,
  reviewCount,
  badge,
  className,
  priority = false,
}: {
  href: string
  image: string
  name: string
  /** Farm attribution — rendered in copper, the provenance link. */
  farmName?: string
  price: number
  per?: string
  rating?: number
  reviewCount?: number
  /** Optional quiet text badge ("Low stock", "Organic"). No colored chips. */
  badge?: string
  className?: string
  priority?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group block overflow-hidden rounded-[20px] border border-[rgba(33,26,18,0.05)] bg-[#FDFDFB] shadow-[0_1px_2px_rgba(33,26,18,0.04),0_8px_24px_rgba(33,26,18,0.05)] transition-[transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(33,26,18,0.05),0_16px_40px_rgba(33,26,18,0.09)]',
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FDFDFB]/95 px-2.5 py-1 text-[11px] font-semibold text-[#211A12] shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        {farmName && (
          <p className="text-[12px] font-semibold text-[#7A3F1C]">{farmName}</p>
        )}
        <h3 className="mt-0.5 truncate text-[15px] font-semibold tracking-[-0.01em] text-[#211A12]">
          {name}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Price amount={price} size="sm" per={per} />
          {rating !== undefined && (
            <RatingStars rating={rating} count={reviewCount} />
          )}
        </div>
      </div>
    </Link>
  )
}

/**
 * DarkBand — the full-bleed deep-ink/green section for cinematic moments.
 * One gradient, display headline, one pill + one text link. No cards inside.
 */
export function DarkBand({
  eyebrow,
  title,
  lede,
  action,
  secondaryAction,
  children,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  action?: { href: string; label: string }
  secondaryAction?: { href: string; label: string }
  children?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'ga-dark relative w-full overflow-hidden',
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        {eyebrow && (
          <p className="text-[13px] font-semibold text-[#FAF9F6]/60">
            {eyebrow}
          </p>
        )}
        <h2 className="ga-display-title mt-2 max-w-2xl text-[clamp(30px,4vw,52px)] text-[#FAF9F6]">
          {title}
        </h2>
        {lede && (
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#FAF9F6]/70">
            {lede}
          </p>
        )}
        {(action || secondaryAction) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            {action && (
              <Link
                href={action.href}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#FAF9F6] px-7 text-[15px] font-semibold text-[#211A12] transition-all duration-300 hover:bg-white active:scale-[0.98]"
              >
                {action.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#FAF9F6]/85 underline decoration-[#FAF9F6]/30 underline-offset-[6px] transition-colors duration-300 hover:text-[#FAF9F6] hover:decoration-[#FAF9F6]/80"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
