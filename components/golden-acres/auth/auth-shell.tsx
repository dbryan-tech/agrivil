'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * AuthShell (redesigned, docs/redesign/03 §2.1).
 * Two-pane: left = quiet deep-green brand panel (wordmark, display line,
 * rotating proof quote — no carousel chrome); right = canvas with the form.
 * Brand panel collapses to a slim top band on narrow widths.
 *
 * The rotating quote cycles on a timer and pauses for reduced-motion users
 * (single static line).
 */

export interface AuthShellProps {
  /** Eyebrow above the headline, e.g. "Welcome back". */
  eyebrow: string
  /** Display headline in the brand panel. */
  headline: string
  /** Quiet proof lines under the headline (replaces the old icon-chip list). */
  proof?: string[]
  /** Optional photo for the brand panel backdrop. */
  image?: string
  children: ReactNode
}

const QUOTES = [
  {
    text: 'The tomatoes arrived cold, firm, and still smelling of the vine.',
    who: 'Ama Owusu · East Legon',
  },
  {
    text: 'I get paid within two days of delivery — no haggling, no middlemen.',
    who: 'Kwabena Darko · Darko Organics, Eastern Region',
  },
  {
    text: 'Ordering feels like sending a message. Fresh food just shows up.',
    who: 'Nana Adjei · Cantonments',
  },
]

export function AuthShell({
  eyebrow,
  headline,
  proof = [],
  image = '/golden-acres/auth/auth-customer.png',
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* ---------- Brand panel (desktop) ---------- */}
      <aside className="ga-dark relative hidden overflow-hidden lg:block" aria-hidden="true">
        {image && (
          <>
            <Image src={image} alt="" fill sizes="50vw" className="object-cover opacity-30" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(200deg, rgba(8,26,18,0.55) 0%, rgba(8,26,18,0.92) 70%, #081A12 100%)',
              }}
            />
          </>
        )}
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-14">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3" tabIndex={-1}>
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden">
              <Image
                src="/agrivil-mark.svg"
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.01em] text-[#FAF9F6]">
              AgriVil <span className="font-normal text-[#FAF9F6]/60">Ghana</span>
            </span>
          </Link>

          {/* Display + proof */}
          <div className="max-w-md">
            <p className="text-[13px] font-semibold text-[#FAF9F6]/60">{eyebrow}</p>
            <h2 className="ga-display-title mt-3 text-[clamp(28px,2.6vw,40px)] leading-[1.12] text-[#FAF9F6]">
              {headline}
            </h2>
            <ul className="mt-8 space-y-2.5">
              {proof.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#FAF9F6]/75">
                  <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#DF8821]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <RotatingQuote />
        </div>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="flex flex-col bg-[#F7F5F0]">
        {/* Slim top band replaces the panel on narrow widths */}
        <div className="border-b border-[rgba(33,26,18,0.06)] px-5 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative block h-7 w-7 shrink-0 overflow-hidden">
              <Image
                src="/agrivil-mark.svg"
                alt="AgriVil"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#211A12]">
              AgriVil <span className="font-normal text-[#8A7E72]">Ghana</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <footer className="px-5 pb-6 pt-2 text-center lg:px-8">
          <p className="text-[11.5px] leading-relaxed text-[#B7AC9E]">
            Protected sessions · httpOnly cookies · We never post anywhere.
          </p>
        </footer>
      </main>
    </div>
  )
}

/** Slow crossfade between farmer/customer proof quotes; static under reduced motion. */
function RotatingQuote() {
  // Reduced-motion is read lazily at mount (no effect-setState cascade);
  // these users get a single static quote.
  const [reduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((n) => (n + 1) % QUOTES.length), 7000)
    return () => clearInterval(id)
  }, [reduce])

  // All three are rendered; opacity swaps keep layout stable and let the
  // change be a fade rather than a jump.
  return (
    <figure className="relative min-h-[76px] max-w-md border-t border-[#FAF9F6]/15 pt-5">
      {QUOTES.map((q, idx) => (
        <blockquote
          key={q.who}
          className={cn(
            'absolute inset-x-0 top-5 transition-opacity duration-1000',
            reduce
              ? idx === 0
                ? 'opacity-100'
                : 'hidden'
              : idx === i
                ? 'opacity-100'
                : 'opacity-0',
          )}
        >
          <p className="text-[15px] italic leading-relaxed text-[#FAF9F6]/85">
            &ldquo;{q.text}&rdquo;
          </p>
          <figcaption className="ga-index mt-2 text-[12px] font-medium not-italic text-[#FAF9F6]/55">
            {q.who}
          </figcaption>
        </blockquote>
      ))}
    </figure>
  )
}
