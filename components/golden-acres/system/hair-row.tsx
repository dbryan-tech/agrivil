import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Hairline-topped row — the "no visible card" link grammar.
 * Content sits on the canvas, separated by a 1px rule. The whole row is the
 * tap target. Optional leading index numeral (01, 02, …) in tabular figures.
 */
export function HairRow({
  href,
  index,
  title,
  description,
  meta,
  className,
}: {
  href: string
  /** Two-digit index rendered in quiet tabular numerals, e.g. "01". */
  index?: string
  title: string
  description?: string
  /** Right-aligned metadata line, e.g. "Ashanti · 24 listings". */
  meta?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-[rgba(33,26,18,0.08)] py-4 transition-colors duration-300 sm:gap-x-6 sm:py-5',
        className,
      )}
    >
      {index ? (
        <span className="ga-index self-start pt-0.5 text-[12px] font-semibold text-[#8A7E72]">
          {index}
        </span>
      ) : (
        <span aria-hidden className="w-0 sm:w-0" />
      )}
      <span className="min-w-0">
        <span className="block truncate text-[16px] font-semibold tracking-[-0.01em] text-[#211A12] transition-colors duration-300 group-hover:text-[#7A3F1C] sm:text-[18px]">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-[13px] text-[#5C5247]">
            {description}
          </span>
        )}
      </span>
      <span className="flex items-center gap-3 justify-self-end pt-0.5">
        {meta && (
          <span className="hidden text-[12px] text-[#8A7E72] sm:inline">
            {meta}
          </span>
        )}
        <ArrowRight
          className="h-4 w-4 shrink-0 text-[#8A7E72] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#7A3F1C]"
          width={16}
          height={16}
        />
      </span>
    </Link>
  )
}
