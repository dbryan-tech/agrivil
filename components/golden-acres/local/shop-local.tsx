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
    <div className="ga-root min-h-screen bg-background">
      {/* Hero / search */}
      <section
        className="grain relative overflow-hidden border-b border-border text-cream"
        style={{
          backgroundColor: 'var(--ga-ink-deep)',
          backgroundImage:
            'radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--ga-field) 50%, transparent), transparent 60%)',
        }}
      >
        <div className="relative z-[2] mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="ga-eyebrow text-[var(--ga-lime)]">MarketPlace Match</p>
          <h1 className="ga-display mt-3 text-balance text-4xl sm:text-5xl">
            Shop the farms{' '}
            <span className="ga-serif font-normal text-[var(--ga-lime)]">closest</span> to you
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-lg leading-relaxed text-cream/80">
            Enter your GhanaPostGPS address and we&apos;ll match you with the nearest farmers — for
            shorter trips, fresher produce, and lower delivery fees.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-cream px-4 text-field">
              <MapPin className="size-5 shrink-0 text-gold" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="GA-183-4250"
                className="h-14 w-full bg-transparent font-semibold tracking-wide outline-none placeholder:text-field/40"
                aria-label="GhanaPostGPS code"
              />
            </div>
            <button
              type="button"
              onClick={search}
              disabled={stage === 'searching'}
              className="ga-press flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--ga-lime)] px-6 font-bold text-[var(--ga-ink-deep)] disabled:opacity-70"
            >
              {stage === 'searching' ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <Navigation className="size-4" /> Find farms
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-sm font-semibold text-gold-soft">{error}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {stage === 'idle' && <IdleState />}

        {stage === 'in-zone' && validation && quote && (
          <div className="ga-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-leaf/30 bg-leaf/10 px-5 py-4">
              <p className="font-semibold text-foreground">
                <span className="text-leaf">We deliver to {validation.area}.</span>{' '}
                {quote.distanceFromHubKm} km from {quote.hubName} · {quote.etaWindow} ·{' '}
                {`GH\u20B5 ${quote.fee.toFixed(2)}`} delivery
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-sm font-bold text-field hover:underline"
              >
                Browse everything <ArrowRight className="size-4" />
              </Link>
            </div>

            <h2 className="mt-8 font-serif text-2xl font-semibold text-foreground">
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
        <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <s.icon className="size-5" />
          </div>
          <h3 className="mt-4 font-bold text-foreground">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
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
      className="ga-press group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={farmer.cover || farmer.photo}
          alt={farmer.farmName}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-field px-2.5 py-1 text-xs font-bold text-cream">
          <Navigation className="size-3" /> {distanceKm} km away
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-semibold text-foreground">{farmer.farmName}</h3>
        <p className="text-sm text-muted-foreground">
          {farmer.name} · {farmer.town}
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 font-bold text-foreground">
            <Star className="size-4 fill-gold text-gold" /> {farmer.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">{inStockCount} items in stock</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Basket availability</span>
            <span className="text-foreground">{pct(availabilityScore)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-leaf transition-all"
              style={{ width: `${Math.round(availabilityScore * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
