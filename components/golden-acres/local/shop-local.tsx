'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { WaitlistForm } from '@/components/golden-acres/waitlist-form'
import { RatingStars } from '@/components/golden-acres/system'
import {
  validateGhanaPostGPS,
  getDeliveryQuote,
  getProximityMatches,
  type GpsValidation,
} from '@/lib/golden-acres/api'
import { pct } from '@/lib/golden-acres/format'
import { formatGHS } from '@/lib/golden-acres/format'
import type { ProximityMatch, DeliveryQuote } from '@/lib/golden-acres/types'
import { Loader2, Navigation, ArrowRight, MapPin, Truck, Sprout, ShieldCheck } from 'lucide-react'

type Stage = 'idle' | 'searching' | 'in-zone' | 'out-zone'

/**
 * Shop Local (redesigned, docs/redesign/03 §3).
 * Real GhanaPostGPS validation + delivery quote + proximity matches (all
 * live API seams unchanged). Editorial header on canvas; farmer matches as
 * elevated cards; outside-zone routes to the waitlist with the area
 * recorded.
 */
export function ShopLocal() {
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [validation, setValidation] = useState<GpsValidation | null>(null)
  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [matches, setMatches] = useState<ProximityMatch[]>([])
  const [error, setError] = useState<string | null>(null)

  async function search() {
    if (!code.trim()) return
    setStage('searching')
    setError(null)
    const v = await validateGhanaPostGPS(code)
    setValidation(v)
    if (!v.valid) {
      setError('That doesn\u2019t look like a valid GhanaPostGPS code (e.g. GA-183-4250).')
      setStage('idle')
      return
    }
    if (!v.servesArea || !v.point) {
      setStage('out-zone')
      return
    }
    const [q, m] = await Promise.all([
      getDeliveryQuote(v.point),
      getProximityMatches(v.point),
    ])
    setQuote(q)
    if (!q.servesArea) {
      setStage('out-zone')
      return
    }
    setMatches(m.slice(0, 6))
    setStage('in-zone')
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Editorial header + search */}
        <header className="ga-rise max-w-2xl">
          <p className="text-[13px] font-semibold text-[#7A3F1C]">Marketplace match</p>
          <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
            Shop the farms closest to you.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5C5247]">
            Enter your GhanaPostGPS address and we&apos;ll match you with the
            nearest growers — shorter trips, fresher produce, lower delivery
            fees. We never need a street name.
          </p>

          <div className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[rgba(33,26,18,0.14)] bg-white px-5 transition-colors focus-within:border-[#0B3B25]">
              <MapPin width={15} height={15} className="shrink-0 text-[#8A7E72]" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="GA-183-4250"
                aria-label="GhanaPostGPS code"
                className="ga-index h-12 w-full border-0 bg-transparent text-[15px] font-medium tracking-wide text-[#211A12] outline-none placeholder:text-[#B7AC9E]"
              />
            </div>
            <button
              type="button"
              onClick={search}
              disabled={stage === 'searching'}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0B3B25] px-7 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:opacity-70"
            >
              {stage === 'searching' ? (
                <Loader2 width={16} height={16} className="animate-spin" />
              ) : (
                <>
                  Find farms
                  <ArrowRight
                    width={16}
                    height={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-[13px] font-medium text-[#B91C1C]" role="alert">
              {error}
            </p>
          )}
        </header>

        <div className="mt-12">
          {stage === 'idle' && <IdleState />}

          {stage === 'in-zone' && validation && quote && (
            <div className="ga-fade-up">
              {/* Zone verdict — quiet band, not a card */}
              <section
                aria-label="Delivery verdict"
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-[rgba(33,26,18,0.08)] py-5"
              >
                <p className="text-[14.5px] leading-relaxed text-[#3D332A]">
                  <span className="font-semibold text-[#0F7A43]">
                    We deliver to {validation.area}.
                  </span>{' '}
                  <span className="ga-index text-[#8A7E72]">
                    {quote.distanceFromHubKm} km from {quote.hubName} ·{' '}
                    {quote.etaWindow} window ·{' '}
                    {formatGHS(quote.fee)} typical delivery
                  </span>
                </p>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0B3B25]"
                >
                  Browse everything
                  <ArrowRight
                    width={15}
                    height={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </section>

              <h2 className="ga-display-title mt-10 text-[clamp(22px,2.4vw,30px)] text-[#211A12]">
                {matches.length} farms near {validation.area}
              </h2>
              <p className="mt-2 text-[14px] text-[#5C5247]">
                Ranked by distance and what they have in stock right now.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((m) => (
                  <FarmerMatchCard key={m.farmer.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {stage === 'out-zone' && (
            <div className="ga-fade-up mx-auto max-w-md pt-4">
              <WaitlistForm area={validation?.area} ghanaPostGPS={code} />
              <p className="mt-5 text-center text-[12.5px] leading-relaxed text-[#8A7E72]">
                Your area is recorded so we can tell you the moment cold-chain
                delivery reaches you.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

/* ------------------------------- Idle state ------------------------------- */

function IdleState() {
  const steps = [
    {
      icon: MapPin,
      title: 'Enter your address',
      body: 'Your GhanaPostGPS digital address is enough — it resolves to an exact point.',
    },
    {
      icon: Sprout,
      title: 'We match nearby farms',
      body: 'Growers are ranked by distance and what\u2019s in stock at this moment.',
    },
    {
      icon: Truck,
      title: 'Fresher, cheaper delivery',
      body: 'Shorter farm-to-door trips mean produce arrives fresher and fees stay low.',
    },
  ]
  return (
    <dl className="grid gap-x-10 gap-y-10 border-t border-[rgba(33,26,18,0.08)] pt-10 md:grid-cols-3">
      {steps.map((s, i) => (
        <div key={s.title}>
          <dt className="flex items-baseline gap-3">
            <span className="ga-index text-[12px] font-semibold text-[#8A7E72]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.01em] text-[#211A12]">
              {s.title}
            </span>
          </dt>
          <dd className="mt-2 pl-9 text-[13.5px] leading-relaxed text-[#5C5247]">
            {s.body}
          </dd>
        </div>
      ))}
      <p className="flex items-center gap-2 pl-9 text-[12px] text-[#8A7E72] md:col-span-3 md:pl-0">
        <ShieldCheck width={13} height={13} className="text-[#0B3B25]" />
        Your location is used only to match farms and price delivery — never shared.
      </p>
    </dl>
  )
}

/* ------------------------------ Match card -------------------------------- */

function FarmerMatchCard({ match }: { match: ProximityMatch }) {
  const { farmer, distanceKm, availabilityScore, inStockCount } = match
  return (
    <Link
      href={`/farmers/${farmer.slug}`}
      className="group block overflow-hidden rounded-[20px] border border-[rgba(33,26,18,0.05)] bg-[#FDFDFB] shadow-[0_1px_2px_rgba(33,26,18,0.04),0_8px_24px_rgba(33,26,18,0.05)] transition-[transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(33,26,18,0.05),0_16px_40px_rgba(33,26,18,0.09)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={farmer.cover || farmer.photo}
          alt={farmer.farmName}
          fill
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <span className="ga-index absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#211A12] shadow-sm">
          <Navigation width={11} height={11} className="text-[#7A3F1C]" />
          {distanceKm} km away
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate text-[16px] font-semibold tracking-[-0.01em] text-[#211A12] transition-colors duration-300 group-hover:text-[#7A3F1C]">
          {farmer.farmName}
        </h3>
        <p className="mt-0.5 truncate text-[12.5px] text-[#5C5247]">
          {farmer.name} · {farmer.town}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <RatingStars rating={farmer.rating} count={farmer.reviewCount} />
          <span className="ga-index text-[12px] text-[#8A7E72]">
            {inStockCount} in stock
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11.5px] font-medium text-[#8A7E72]">
            <span>Basket availability</span>
            <span className="ga-index font-semibold text-[#211A12]">
              {pct(availabilityScore)}
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[rgba(33,26,18,0.08)]">
            <div
              className="h-full rounded-full bg-[#0B3B25]"
              style={{ width: `${Math.round(availabilityScore * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
