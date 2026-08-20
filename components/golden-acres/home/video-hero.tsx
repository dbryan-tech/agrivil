'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, ArrowRight, MapPin, Truck, Leaf } from 'lucide-react'

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Leafy Greens',
  'Grains & Legumes',
  'Herbs & Spices',
] as const

export function VideoHero() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (cat !== 'All') params.set('category', cat)
    router.push(`/shop${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="relative overflow-hidden">
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
        {/* cinematic scrim — anchors legibility to the lower-left where copy lives */}
        <div className="ga-hero-scrim" />
        {/* warm copper wash for brand tone */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[var(--ga-copper-deep)]/25" />
        {/* blend the hero into the page background below */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[660px] lg:px-8">
        <span className="ga-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur" style={{ animationDelay: '0.05s' }}>
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--ga-star)]" />
          Harvested this morning · Accra pilot
        </span>

        <h1 className="ga-headline ga-fade-up mt-5 max-w-3xl text-balance text-5xl leading-[1.02] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl" style={{ animationDelay: '0.12s' }}>
          Ghana&apos;s freshest harvest,{' '}
          <em style={{ color: 'var(--ga-star)' }}>delivered to your door</em>
        </h1>

        <p className="ga-fade-up mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg" style={{ animationDelay: '0.2s' }}>
          Shop produce picked today by local farmers, compare offers from the growers nearest you,
          and pay with Mobile Money. Priced by weight, delivered cold.
        </p>

        {/* Search */}
        <form
          onSubmit={submit}
          className="ga-fade-up mt-8 flex h-14 w-full max-w-2xl items-center overflow-hidden rounded-full bg-white shadow-2xl ring-1 ring-black/10 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-[#0B3B25]/40"
          style={{ animationDelay: '0.28s' }}
        >
          <div className="relative hidden h-full items-center border-r border-black/[0.08] sm:flex">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              aria-label="Search category"
              className="h-full cursor-pointer appearance-none bg-transparent pl-5 pr-9 text-sm font-bold text-[#211A12] outline-none transition-colors hover:bg-black/[0.03]"
            >
              <option value="All">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#5C5247]" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tomatoes, plantain, pepper, yam…"
            className="h-full flex-1 bg-transparent px-5 text-sm text-[#211A12] outline-none placeholder:text-[#5C5247]/70 sm:text-base font-medium"
          />
          <button
            type="submit"
            className="ga-press ga-sheen flex h-full items-center gap-2 bg-[#0B3B25] px-6 font-extrabold text-white hover:bg-[#072618]"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* CTAs */}
        <div className="ga-fade-up mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: '0.36s' }}>
          <Link
            href="/shop"
            className="ga-press ga-sheen group inline-flex items-center gap-2 rounded-full bg-[#F0A81E] px-6 py-3.5 text-sm font-black text-[#211A12] shadow-sm hover:bg-[#F59E0B]"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors duration-300 hover:bg-white/20 hover:border-white/55"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips */}
        <div className="ga-fade-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-white/95" style={{ animationDelay: '0.44s' }}>
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
