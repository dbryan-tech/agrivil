'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Leaf, Check, ShoppingBasket } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'

/**
 * VideoHero v3 — cinematic, quiet, confident.
 * Full-bleed video, one bold statement, one action. The headline is THE
 * element: oversized (clamp to 88px), tight leading, white + one gold line.
 * No badges, no eyebrows — the film and the words do all the talking.
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
        {/* Cinematic scrim — weighted bottom-left so type sits on calm ground */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />
      </div>

      {/* Statement block — bottom-anchored, generous breathing room */}
      <div className="relative z-[5] mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-end px-5 pb-24 pt-40 sm:px-8 sm:pb-28 lg:min-h-[86svh] lg:px-12 lg:pb-32">
        <h1
          className="ga-fade-up max-w-[13ch] text-balance font-black leading-[0.98] tracking-[-0.03em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] [font-size:clamp(44px,7.2vw,92px)]"
          style={{ animationDelay: '0.06s' }}
        >
          Ghana&apos;s freshest harvest.
        </h1>
        <p
          className="ga-fade-up mt-1 max-w-[20ch] text-balance font-black leading-[1.04] tracking-[-0.02em] text-[#F0A81E] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] [font-size:clamp(44px,7.2vw,92px)]"
          style={{ animationDelay: '0.14s' }}
        >
          Delivered to your door.
        </p>

        <p
          className="ga-fade-up mt-6 max-w-md text-pretty text-base leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:text-lg"
          style={{ animationDelay: '0.22s' }}
        >
          Picked this morning by Ghana&apos;s farmers. Compare real offers,
          pay with Mobile Money, get it cold — tomorrow.
        </p>

        <div
          className="ga-fade-up mt-7 flex flex-wrap items-center gap-x-7 gap-y-3"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/shop"
            className="ga-press ga-sheen group inline-flex items-center gap-2 rounded-full bg-[#DF8821] px-8 py-4 text-[15px] font-black text-white shadow-lg shadow-black/40 hover:bg-[#c97416] transition-all"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 border-b-2 border-white/50 pb-1 text-[15px] font-bold text-white transition-colors duration-300 hover:border-white"
          >
            Meet the farmers
          </Link>
        </div>
      </div>

      {/* Shoppable strip docked to the hero's bottom edge — solid, not glass */}
      <div className="relative z-10 border-t border-white/10 bg-[#15110C]">
        <div className="mx-auto flex max-w-7xl items-stretch gap-3 overflow-x-auto px-5 py-3 sm:gap-4 sm:px-8 lg:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="hidden shrink-0 flex-col justify-center border-r border-white/10 pr-5 md:flex">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F0A81E]">
              <Leaf className="h-3 w-3" /> Fresh this morning
            </p>
            <Link
              href="/shop"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-colors hover:text-white"
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
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-[#221C13] p-2 pr-4 text-left transition-all duration-300 hover:border-[#DF8821]/60 hover:bg-[#2A2318] active:scale-[0.98] disabled:pointer-events-none"
              aria-label={`Add ${p.name} to basket`}
            >
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
