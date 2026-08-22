'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, MapPin, Truck, Leaf, Check, ShoppingBasket } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'

/**
 * VideoHero v2 — the old cinematic hero, sharpened.
 * Same rich language (video, gold accent headline, orange CTA, trust chips)
 * with three upgrades:
 *  1. Brand mark + "live market" pulse top-left; scroll cue bottom-right.
 *  2. Left-anchored composition on desktop (reads faster than centered),
 *     still centered on mobile.
 *  3. A shoppable "Fresh this morning" strip docked to the hero's bottom
 *     edge — real catalog products with one-tap add-to-basket.
 */

/** Deterministic morning picks so SSR and client agree (no hydration drift). */
function pickMorningProducts(): typeof products {
  return [0, 4, 8, 12, 16]
    .map((i) => products[i % products.length])
    .filter((p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx && p.status === 'in-stock')
    .slice(0, 4)
}

export function VideoHero() {
  const { add } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)
  const picks = useMemo(() => pickMorningProducts(), [])

  function handleAdd(id: string) {
    const product = products.find((p) => p.id === id)
    if (!product) return
    add(product, 1)
    setAddedId(id)
    window.setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Video layer */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/golden-acres/video/farm-hero.mp4" type="video/mp4" />
        </video>
        {/* Cinematic scrim — heavier left/bottom where content sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/55" />
      </div>

      {/* Top-left brand moment */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2.5 sm:left-8 sm:top-6">
        <span
          aria-hidden
          className="relative flex h-2 w-2"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F0A81E]/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F0A81E]" />
        </span>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 sm:text-xs">
          Live market · Greater Accra
        </p>
      </div>

      {/* Content — left-anchored on desktop, centered on mobile */}
      <div className="relative z-[5] mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:min-h-[600px] lg:items-start lg:px-10 lg:text-left">
        {/* Soft radial backdrop for text pop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[1] flex items-center justify-center"
        >
          <div className="h-[420px] w-full max-w-2xl rounded-full bg-black/25 blur-3xl" />
        </div>

        <p
          className="ga-fade-up text-[11px] font-bold uppercase tracking-[0.24em] text-white/85 sm:text-xs"
          style={{ animationDelay: '0.02s' }}
        >
          From Ghana&apos;s farms · Picked today · Delivered cold
        </p>

        <h1
          className="ga-headline ga-fade-up mt-3 max-w-3xl text-balance text-4xl font-black leading-[1.05] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)] sm:text-5xl lg:text-[64px]"
          style={{ animationDelay: '0.08s' }}
        >
          Ghana&apos;s freshest harvest,{' '}
          <span className="whitespace-nowrap text-[#F0A81E] drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
            delivered to your door
          </span>
        </h1>

        <p
          className="ga-fade-up mt-4 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-lg"
          style={{ animationDelay: '0.16s' }}
        >
          Shop produce picked this morning by local farmers, compare offers
          from growers nearest you, and pay with Mobile Money. Priced by
          weight, delivered cold.
        </p>

        {/* CTAs */}
        <div
          className="ga-fade-up mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          style={{ animationDelay: '0.24s' }}
        >
          <Link
            href="/shop"
            className="ga-press ga-sheen group inline-flex items-center gap-2 rounded-full bg-[#DF8821] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-black/30 hover:bg-[#c97416] transition-all"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/35 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-white/70 hover:bg-black/55"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips */}
        <div
          className="ga-fade-up mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-sm lg:justify-start"
          style={{ animationDelay: '0.32s' }}
        >
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#F0A81E]" /> Picked today
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#F0A81E]" /> GhanaPostGPS delivery
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#F0A81E]" /> Pay on delivery · MoMo
          </span>
        </div>
      </div>

      {/* Shoppable strip docked to the hero's bottom edge */}
      <div className="relative z-10 border-t border-white/15 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-stretch gap-3 overflow-x-auto px-4 py-3 sm:gap-4 sm:px-6 lg:px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Strip label */}
          <div className="hidden shrink-0 flex-col justify-center border-r border-white/15 pr-5 md:flex">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F0A81E]">
              <Leaf className="h-3 w-3" /> Fresh this morning
            </p>
            <Link
              href="/shop"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white/75 transition-colors hover:text-white"
            >
              See all produce
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {picks.map((p) => (
            <button
              key={p.id}
              onClick={() => handleAdd(p.id)}
              disabled={addedId === p.id}
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.07] p-2 pr-4 text-left backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.12] active:scale-[0.98] disabled:pointer-events-none"
              aria-label={`Add ${p.name} to basket`}
            >
              {/* thumb */}
              <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <SmartImage src={p.image} alt="" fill className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block max-w-[150px] truncate text-[13px] font-bold text-white">
                  {p.name}
                </span>
                <span className="ga-index mt-0.5 block text-[11.5px] font-medium text-white/65">
                  {formatGHS(p.priceMin)}{' '}
                  {p.variableWeight ? '/ kg' : `/${p.unit}`}
                </span>
                <span
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                    addedId === p.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#DF8821] text-white group-hover:bg-[#c97416]'
                  }`}
                >
                  {addedId === p.id ? (
                    <>
                      <Check className="h-2.5 w-2.5" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBasket className="h-2.5 w-2.5" /> Add
                    </>
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
