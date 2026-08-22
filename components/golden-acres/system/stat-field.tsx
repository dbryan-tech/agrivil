'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * StatBlock — display-size tabular numbers over hairlines.
 * Replaces stat chips: no icons, no boxes. Numbers do the talking.
 */
export function StatBlock({
  value,
  label,
  href,
  tone = 'ink',
  className,
}: {
  /** The number — already formatted (e.g. "1,200+", "48h", "98%"). */
  value: string
  label: string
  /** Optional link wrapper for the whole block. */
  href?: string
  /** ink = standard; cream = on dark bands. */
  tone?: 'ink' | 'cream'
  className?: string
}) {
  const body = (
    <div className={cn('border-t border-current/15 pt-4', className)}>
      <div
        className={cn(
          'ga-index text-[clamp(30px,4vw,52px)] font-semibold leading-none tracking-[-0.02em]',
          tone === 'cream' ? 'text-[#FAF9F6]' : 'text-[#211A12]',
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          'mt-2 text-[13px] font-medium',
          tone === 'cream' ? 'text-[#FAF9F6]/60' : 'text-[#8A7E72]',
        )}
      >
        {label}
      </div>
    </div>
  )
  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-80">
        {body}
      </Link>
    )
  }
  return body
}

/** A responsive row of StatBlocks over a shared hairline grid. */
export function StatGrid({
  stats,
  tone = 'ink',
  className,
}: {
  stats: { value: string; label: string; href?: string }[]
  tone?: 'ink' | 'cream'
  className?: string
}) {
  return (
    <dl
      className={cn(
        'grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {stats.map((s) => (
        <div key={s.label}>
          <StatBlock {...s} tone={tone} />
        </div>
      ))}
    </dl>
  )
}

/**
 * UnderlineField — the form input grammar.
 * No boxes: a hairline underline that turns green on focus, with a
 * sentence-case 13px label above and inline error support below.
 */
export function UnderlineField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required,
  autoComplete,
  inputMode,
  className,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string | null
  hint?: string
  required?: boolean
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'numeric' | 'email' | 'url'
  className?: string
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-[#3D332A]"
      >
        {label}
        {required && <span aria-hidden className="text-[#7A3F1C]"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'mt-1 w-full border-0 border-b bg-transparent pb-2 text-[16px] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2',
          error
            ? 'border-[#B91C1C] focus:border-[#B91C1C]'
            : 'border-[rgba(33,26,18,0.15)] focus:border-[#0B3B25]',
        )}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[12px] text-[#B91C1C]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-[#8A7E72]">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
