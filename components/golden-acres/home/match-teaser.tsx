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
    <section className="grain relative overflow-hidden bg-[#1A0F06] text-[#FAF9F6]">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 15% 0%, rgba(11, 59, 37, 0.45), transparent 55%)',
        }}
      />
      <div className="relative z-[2] mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-16">
        <div>
          <div className="flex items-center gap-4">
            <span className="ga-index text-sm font-black text-[#F0A81E]">05</span>
            <div className="h-px flex-1 bg-white/15" />
            <span className="ga-kicker shrink-0 font-extrabold text-[#FAF9F6]/65">MarketPlace Match</span>
          </div>
          <h2 className="ga-headline mt-5 text-balance text-4xl font-black sm:text-5xl">
            We find the farms{' '}
            <span className="font-normal text-[#F0A81E]">closest</span> to you
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-[#FAF9F6]/80 text-sm sm:text-base">
            Enter your GhanaPostGPS address and our proximity engine ranks nearby farms by
            distance and what they have in stock — so your produce travels the shortest
            possible path and arrives at its freshest.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="group relative flex-1">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0B3B25] transition-colors duration-300 group-focus-within:text-[#072618]" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. GA-183-4250"
                aria-label="GhanaPostGPS address"
                className="h-14 w-full rounded-full bg-[#FAF9F6] py-3.5 pl-11 pr-4 font-bold text-[#211A12] outline-none ring-2 ring-transparent transition-shadow duration-300 focus:ring-[#F0A81E]"
              />
            </div>
            <button
              type="button"
              onClick={check}
              disabled={state === 'loading'}
              className="ga-press ga-sheen inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#F0A81E] px-7 py-3.5 font-black text-[#211A12] shadow-sm hover:bg-[#F59E0B] disabled:opacity-70"
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
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F59E0B]">
              <XCircle className="h-4 w-4" />
              That doesn&apos;t look like a valid GhanaPostGPS code (format: GA-183-4250).
            </p>
          )}
        </div>

        <div className="rounded-[24px] border border-black/[0.04] bg-[#FAF9F6] p-6 text-[#211A12] shadow-2xl shadow-black/25">
          {state === 'ok' && quote ? (
            <div>
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#0B3B25]" />
                  <span className="font-extrabold text-[#211A12]">We deliver to {area}</span>
                </div>
                <span className="rounded-full bg-[#EDE8DF] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#211A12]">
                  {quote.etaWindow}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="rounded-xl border border-black/[0.04] bg-white p-3.5 shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5C5247]">
                    Delivery fee
                  </p>
                  <p className="ga-display text-xl font-black text-[#0B3B25]">{formatGHS(quote.fee)}</p>
                </div>
                <div className="rounded-xl border border-black/[0.04] bg-white p-3.5 shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5C5247]">
                    From hub
                  </p>
                  <p className="ga-display text-xl font-black text-[#211A12]">
                    {quote.distanceFromHubKm} km
                  </p>
                </div>
              </div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
                Nearest farms
              </p>
              <ul className="mt-2.5 space-y-2">
                {matches.map((m) => (
                  <li
                    key={m.farmer.id}
                    className="flex items-center justify-between rounded-xl border border-black/[0.04] bg-white px-3.5 py-2.5 shadow-xs"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-[#211A12]">{m.farmer.farmName}</p>
                      <p className="text-xs text-[#5C5247]">
                        {m.farmer.region} · {m.inStockCount} items in stock
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#0B3B25]">
                        {m.distanceKm} km
                      </p>
                      <p className="text-xs font-semibold text-[#5C5247]">
                        {pct(m.proximityScore)} match
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE8DF]">
                <Navigation className="h-6 w-6 text-[#0B3B25]" />
              </div>
              <p className="max-w-xs text-sm font-medium text-[#5C5247]">
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
