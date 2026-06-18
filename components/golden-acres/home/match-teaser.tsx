'use client'

import { useState } from 'react'
import { MapPin, Loader2, CheckCircle2, XCircle, Navigation } from 'lucide-react'
import {
  validateGhanaPostGPS,
  getDeliveryQuote,
  getProximityMatches,
} from '@/lib/golden-acres/api'
import { formatGHS, pct } from '@/lib/golden-acres/format'
import type { ProximityMatch, DeliveryQuote } from '@/lib/golden-acres/types'

type State = 'idle' | 'loading' | 'ok' | 'invalid'

export function MatchTeaser() {
  const [code, setCode] = useState('GA-183-4250')
  const [state, setState] = useState<State>('idle')
  const [area, setArea] = useState<string>('')
  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [matches, setMatches] = useState<ProximityMatch[]>([])

  async function check() {
    setState('loading')
    const res = await validateGhanaPostGPS(code)
    if (!res.valid || !res.point) {
      setState('invalid')
      setMatches([])
      setQuote(null)
      return
    }
    const [q, m] = await Promise.all([
      getDeliveryQuote(res.point),
      getProximityMatches(res.point),
    ])
    setArea(res.area ?? '')
    setQuote(q)
    setMatches(m.slice(0, 3))
    setState('ok')
  }

  return (
    <section className="grain relative overflow-hidden bg-[var(--ga-ink-deep)] text-[var(--ga-cream)]">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 15% 0%, color-mix(in oklab, var(--ga-field) 40%, transparent), transparent 55%)',
        }}
      />
      <div className="relative z-[2] mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <p className="ga-eyebrow text-[var(--ga-lime)]">MarketPlace Match</p>
          <h2 className="ga-display mt-3 text-balance text-4xl sm:text-5xl">
            We find the farms{' '}
            <span className="ga-serif font-normal text-[var(--ga-lime)]">closest</span> to you
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-[var(--ga-cream)]/80">
            Enter your GhanaPostGPS address and our proximity engine ranks nearby farms by
            distance and what they have in stock — so your produce travels the shortest
            possible path and arrives at its freshest.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--ga-field-deep)]" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. GA-183-4250"
                aria-label="GhanaPostGPS address"
                className="h-14 w-full rounded-full bg-[var(--ga-cream)] py-3.5 pl-11 pr-4 font-semibold text-[var(--ga-field-deep)] outline-none ring-[var(--ga-gold-soft)] focus:ring-2"
              />
            </div>
            <button
              type="button"
              onClick={check}
              disabled={state === 'loading'}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--ga-gold-soft)] px-6 py-3.5 font-bold text-[var(--ga-field-deep)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {state === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
              Find farms
            </button>
          </div>
          {state === 'invalid' && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ga-gold-soft)]">
              <XCircle className="h-4 w-4" />
              That doesn&apos;t look like a valid GhanaPostGPS code (format: GA-183-4250).
            </p>
          )}
        </div>

        <div className="rounded-3xl bg-[var(--ga-cream)] p-6 text-foreground shadow-2xl shadow-black/20">
          {state === 'ok' && quote ? (
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--ga-leaf)]" />
                  <span className="font-bold">We deliver to {area}</span>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
                  {quote.etaWindow}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="rounded-xl bg-card p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Delivery fee
                  </p>
                  <p className="ga-display text-xl font-semibold">{formatGHS(quote.fee)}</p>
                </div>
                <div className="rounded-xl bg-card p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    From hub
                  </p>
                  <p className="ga-display text-xl font-semibold">
                    {quote.distanceFromHubKm} km
                  </p>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nearest farms
              </p>
              <ul className="mt-2 space-y-2">
                {matches.map((m) => (
                  <li
                    key={m.farmer.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-bold">{m.farmer.farmName}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.farmer.region} · {m.inStockCount} items in stock
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--ga-field)]">
                        {m.distanceKm} km
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pct(m.proximityScore)} match
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <Navigation className="h-6 w-6 text-[var(--ga-field)]" />
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Enter your GhanaPostGPS address to see delivery details and the farms
                closest to you.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
