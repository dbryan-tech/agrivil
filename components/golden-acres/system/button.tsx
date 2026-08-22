'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * PillButton — the single primary button grammar.
 * Forest green pill, semibold 15px, quiet press physics. No gradients, no
 * sheens, no icon chips. `variant="dark"` renders the charcoal inverse for
 * use on dark bands; `variant="quiet"` is the hairline-outline secondary.
 */
type CommonProps = {
  children: ReactNode
  variant?: 'primary' | 'dark' | 'quiet'
  size?: 'md' | 'lg'
  className?: string
}

const VARIANTS: Record<NonNullable<PillButtonProps['variant']>, string> = {
  primary:
    'bg-[#0B3B25] text-white hover:bg-[#0F4A2E] active:bg-[#082E1D]',
  dark: 'bg-[#211A12] text-[#FAF9F6] hover:bg-[#33291C] active:bg-[#171008]',
  quiet:
    'border border-[rgba(33,26,18,0.15)] bg-transparent text-[#211A12] hover:border-[rgba(11,59,37,0.45)] hover:text-[#0B3B25]',
}

const SIZES = {
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-12 px-7 text-[15px] sm:h-[52px] sm:px-8',
} as const

export type PillButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement>

export function PillButton({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  ...rest
}: PillButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Link twin of PillButton for navigation CTAs. */
export function PillLink({
  href,
  children,
  variant = 'primary',
  size = 'lg',
  className,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-300 active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {children}
    </Link>
  )
}

/**
 * TextLink — the copper underlined secondary action.
 * The quiet counterpart to a pill: used for "Meet the farmers", "Learn more".
 */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#7A3F1C] underline decoration-[rgba(122,63,28,0.35)] decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-[#5E2F13] hover:decoration-[#5E2F13]',
        className,
      )}
    >
      {children}
    </Link>
  )
}
