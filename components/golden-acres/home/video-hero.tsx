'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Truck, Leaf } from 'lucide-react'

export function VideoHero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Video layer */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/golden-acres/video/farm-hero.mp4" type="video/mp4" />
        </video>
        {/* neutral dark scrim for maximum legibility */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />
        {/* soft transition into page background */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content — Centered */}
      <div className="relative mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:min-h-[580px] lg:px-8">
        <h1
          className="ga-headline ga-fade-up text-balance text-4xl font-black leading-[1.06] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '0.08s' }}
        >
          Ghana&apos;s freshest harvest,{' '}
          <em className="italic text-[#DF8821]">delivered to your door</em>
        </h1>

        <p
          className="ga-fade-up mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg"
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
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/60"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips — Centered */}
        <div
          className="ga-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-semibold text-white/90"
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
