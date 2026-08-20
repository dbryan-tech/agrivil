'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Truck, Leaf } from 'lucide-react'

export function VideoHero() {
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
        {/* Balanced cinematic scrim for 100% readability across all video frames */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60" />
      </div>

      {/* Content — Centered with halved padding and compact vertical rhythm */}
      <div className="relative mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center px-2 py-12 text-center sm:px-4 lg:min-h-[480px]">
        {/* Soft radial backdrop behind text area for maximum text pop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        >
          <div className="h-[380px] w-full max-w-2xl rounded-full bg-black/30 blur-2xl" />
        </div>

        <h1
          className="ga-headline ga-fade-up text-balance text-4xl font-black leading-[1.06] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)] sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '0.08s' }}
        >
          Ghana&apos;s freshest harvest,{' '}
          <span className="inline-block text-[#F0A81E] drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">delivered to your door</span>
        </h1>

        <p
          className="ga-fade-up mt-3 max-w-2xl text-pretty text-base font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-lg"
          style={{ animationDelay: '0.16s' }}
        >
          Shop produce picked today by local farmers, compare offers from the growers nearest you,
          and pay with Mobile Money. Priced by weight, delivered cold.
        </p>

        {/* CTAs — Centered */}
        <div
          className="ga-fade-up mt-5 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '0.24s' }}
        >
          <Link
            href="/shop"
            className="ga-press ga-sheen group inline-flex items-center gap-2 rounded-full bg-[#DF8821] px-7 py-3 text-sm font-black text-white shadow-lg hover:bg-[#c97416] transition-all"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/35 px-7 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-black/55 hover:border-white/70"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips — Centered */}
        <div
          className="ga-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
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
    </section>
  )
}
