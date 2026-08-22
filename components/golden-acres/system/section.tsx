import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'

/**
 * The system-tier section scaffold for redesigned web surfaces.
 *
 * A section is: optional label (small, copper, sentence case) + display title
 * (Fraunces) + optional lede (muted) + content. Hairline-topped by default —
 * sections separate the canvas with rules, not boxes. Content always sits
 * directly on the page background.
 */
export function Section({
  label,
  title,
  lede,
  action,
  children,
  className,
  contentClassName,
  topRule = true,
  tone = 'canvas',
  id,
}: {
  /** Small overline above the title, e.g. "Featured harvest". Sentence case. */
  label?: string
  /** Display headline. Rendered in Fraunces via .ga-display-title. */
  title?: ReactNode
  /** Supporting line under the title, in muted ink. */
  lede?: ReactNode
  /** Optional right-aligned action beside the title row ("See all" etc.). */
  action?: { href: string; label: string }
  children?: ReactNode
  className?: string
  contentClassName?: string
  topRule?: boolean
  /** canvas = page background; alt = quiet alternate band; dark = deep green band */
  tone?: 'canvas' | 'alt' | 'dark'
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'w-full',
        tone === 'alt' && 'bg-[#F2EEE6]',
        tone === 'dark' && 'ga-dark',
        topRule && tone === 'canvas' && 'border-t border-[rgba(33,26,18,0.08)]',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        {(label || title || lede || action) && (
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
              <div className="max-w-2xl">
                {label && (
                  <p className="text-[13px] font-semibold tracking-[0.01em] text-[#7A3F1C]">
                    {label}
                  </p>
                )}
                {title && (
                  <h2 className="ga-display-title mt-2 text-[clamp(28px,3.4vw,44px)] text-[#211A12]">
                    {title}
                  </h2>
                )}
                {lede && (
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#5C5247] sm:text-[17px]">
                    {lede}
                  </p>
                )}
              </div>
              {action && (
                <Link
                  href={action.href}
                  className="group hidden shrink-0 items-center gap-1.5 pb-1 text-[14px] font-semibold text-[#0B3B25] sm:inline-flex"
                >
                  {action.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    width={16}
                    height={16}
                  />
                </Link>
              )}
            </div>
          </Reveal>
        )}
        <Reveal delay={80}>
          <div className={contentClassName}>{children}</div>
        </Reveal>
      </div>
    </section>
  )
}
