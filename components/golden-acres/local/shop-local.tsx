'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { WaitlistForm } from '@/components/golden-acres/waitlist-form'
import {
  validateGhanaPostGPS,
  getDeliveryQuote,
  getProximityMatches,
  type GpsValidation,
} from '@/lib/golden-acres/api'
import { pct } from '@/lib/golden-acres/format'
import type { ProximityMatch, DeliveryQuote } from '@/lib/golden-acres/types'
import { MapPin, Loader2, Navigation, Star, Truck, Sprout, ArrowRight } from 'lucide-react'

type Stage = 'idle' | 'searching' | 'in-zone' | 'out-zone'

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
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Hero / search */}
      <section className="relative overflow-hidden border-b border-black/[0.04] bg-[#1A0F06] text-white">
        <div className="relative z-[2] mx-auto max-w-4xl px-2 py-8 text-center sm:px-3 lg:px-4">
          <p className="ga-kicker font-extrabold text-[#F0A81E]">MarketPlace Match</p>
          <h1 className="ga-headline mt-2 text-balance text-3xl font-black text-white sm:text-4xl">
            Shop the farms <span className="text-[#F0A81E]">closest</span> to you
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-sm leading-relaxed text-white/80">
            Enter your GhanaPostGPS address and we&apos;ll match you with the nearest farmers — for
            shorter trips, fresher produce, and lower delivery fees.
          </p>

          <div className="mx-auto mt-5 flex max-w-md flex-col gap-2.5 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 text-[#211A12] shadow-sm">
              <MapPin className="h-4 w-4 shrink-0 text-[#7A3F1C]" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="GA-183-4250"
                className="h-12 w-full bg-transparent font-black tracking-wider text-[#211A12] outline-none placeholder:text-[#5C5247]/50 text-sm"
                aria-label="GhanaPostGPS code"
              />
            </div>
            <button
              type="button"
              onClick={search}
              disabled={stage === 'searching'}
              className="ga-press flex h-12 items-center justify-center gap-2 rounded-full bg-[#F0A81E] px-6 text-sm font-black text-[#1A0F06] shadow-sm hover:bg-[#F0A81E]/90 disabled:opacity-70 transition-all"
            >
              {stage === 'searching' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Navigation className="h-4 w-4" /> Find farms
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-xs font-bold text-[#F0A81E]">{error}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-2 py-6 sm:px-3 lg:px-4">
        {stage === 'idle' && <IdleState />}

        {stage === 'in-zone' && validation && quote && (
          <div className="ga-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#0B3B25]/20 bg-[#0B3B25]/10 px-5 py-4">
              <p className="text-sm font-bold text-[#211A12]">
                <span className="font-black text-[#0B3B25]">We deliver to {validation.area}.</span>{' '}
                {quote.distanceFromHubKm} km from {quote.hubName} · {quote.etaWindow} ·{' '}
                {`GH\u20B5 ${quote.fee.toFixed(2)}`} delivery
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#0B3B25] hover:underline"
              >
                Browse everything <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <h2 className="ga-headline mt-8 text-2xl font-black text-[#211A12]">
              {matches.length} farms near {validation.area}
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((m) => (
                <FarmerMatchCard key={m.farmer.id} match={m} />
              ))}
            </div>
          </div>
        )}

        {stage === 'out-zone' && (
          <div className="ga-fade-up mx-auto max-w-md">
            <WaitlistForm area={validation?.area} ghanaPostGPS={code} />
          </div>
        )}
      </div>
    </div>
  )
}

function IdleState() {
  const steps = [
    { icon: MapPin, title: 'Enter your address', body: 'Use your GhanaPostGPS digital address — we never need a street name.' },
    { icon: Sprout, title: 'We match nearby farms', body: 'Our engine ranks farmers by distance and what they have in stock right now.' },
    { icon: Truck, title: 'Fresher, cheaper delivery', body: 'Shorter farm-to-door trips mean produce arrives fresher and fees stay low.' },
  ]
  return (
    <div className="ga-stagger grid gap-5 md:grid-cols-3">
      {steps.map((s) => (
        <div key={s.title} className="rounded-[24px] border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
            <s.icon className="h-5 w-5" />
          </div>
          <h3 className="ga-headline mt-4 text-base font-black text-[#211A12]">{s.title}</h3>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5C5247]">{s.body}</p>
        </div>
      ))}
    </div>
  )
}

function FarmerMatchCard({ match }: { match: ProximityMatch }) {
  const { farmer, distanceKm, availabilityScore, inStockCount } = match
  return (
    <Link
      href={`/farmers/${farmer.slug}`}
      className="ga-press group flex flex-col overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={farmer.cover || farmer.photo}
          alt={farmer.farmName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-xs">
          <Navigation className="h-3 w-3" /> {distanceKm} km away
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="ga-headline text-base font-black text-[#211A12]">{farmer.farmName}</h3>
        <p className="text-xs font-semibold text-[#5C5247]">
          {farmer.name} · {farmer.town}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs font-bold">
          <span className="inline-flex items-center gap-1 font-black text-[#211A12]">
            <Star className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]" /> {farmer.rating.toFixed(1)}
          </span>
          <span className="text-[#5C5247]">{inStockCount} items in stock</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#5C5247]">
            <span>Basket availability</span>
            <span className="font-black text-[#211A12]">{pct(availabilityScore)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EDE8DF]">
            <div
              className="h-full rounded-full bg-[#0B3B25] transition-all"
              style={{ width: `${Math.round(availabilityScore * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
