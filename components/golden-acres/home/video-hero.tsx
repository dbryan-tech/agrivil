'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Truck, Leaf } from 'lucide-react'

export function VideoHero() {
  return (
    <section className="relative overflow-hidden rounded-b-[32px] sm:rounded-b-[40px] lg:rounded-b-[48px] bg-black shadow-sm">
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
        {/* Subtle global tint for balanced tone */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content — Centered with focused radial contrast behind the text area */}
      <div className="relative mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:min-h-[580px] lg:px-8">
        {/* Localized radial backdrop behind the text area only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        >
          <div className="h-[460px] w-full max-w-3xl rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.72)_0%,_rgba(0,0,0,0.4)_45%,_transparent_75%)] backdrop-blur-[1px]" />
        </div>

        <h1
          className="ga-headline ga-fade-up text-balance text-4xl font-black leading-[1.06] text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)] sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '0.08s' }}
        >
          Ghana&apos;s freshest harvest,{' '}
          <em className="italic text-[#DF8821]">delivered to your door</em>
        </h1>

        <p
          className="ga-fade-up mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-lg"
          style={{ animationDelay: '0.16s' }}
        >
          Shop produce picked today by local farmers, compare offers from the growers nearest you,
          and pay with Mobile Money. Priced by weight, delivered cold.
        </p>

        {/* CTAs — Centered */}
        <div
          className="ga-fade-up mt-8 flex flex-wrap items-center justify-center gap-3.5"
          style={{ animationDelay: '0.24s' }}
        >
          <Link
            href="/shop"
            className="ga-press ga-sheen group inline-flex items-center gap-2 rounded-full bg-[#DF8821] px-7 py-3.5 text-sm font-black text-white shadow-lg hover:bg-[#c97416] transition-all"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/70"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips — Centered */}
        <div
          className="ga-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
          style={{ animationDelay: '0.32s' }}
        >
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#DF8821]" /> Picked today
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#DF8821]" /> GhanaPostGPS delivery
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#DF8821]" /> Pay on delivery · MoMo
          </span>
        </div>
      </div>
    </section>
  )
}
