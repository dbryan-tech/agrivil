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
        {/* copper → green cinematic scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ga-ink-deep)]/92 via-[var(--ga-copper-deep)]/55 to-[var(--ga-field-deep)]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ga-ink-deep)]/85 via-transparent to-[var(--ga-ink-deep)]/30" />
      </div>

      {/* Content */}
      <div className="ga-page-in relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[640px] lg:px-8">
        <span className="ga-fade-in inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur transition-all duration-500 hover:bg-white/15 hover:border-white/40" style={{ animationDelay: '0.1s' }}>
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--ga-star)]" />
          Harvested this morning · Accra pilot
        </span>

        <h1 className="ga-headline ga-fade-in mt-5 max-w-3xl text-balance text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl transition-all duration-700" style={{ animationDelay: '0.2s' }}>
          Ghana&apos;s freshest harvest, <em className="text-[var(--ga-star)] transition-colors duration-500">delivered to your door</em>
        </h1>

        <p className="ga-fade-in mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg transition-all duration-700" style={{ animationDelay: '0.3s' }}>
          Shop produce picked today by local farmers, compare offers from the growers nearest you,
          and pay with Mobile Money. Priced by weight, delivered cold.
        </p>

        {/* Search */}
        <form
          onSubmit={submit}
          className="ga-fade-in mt-8 flex h-14 w-full max-w-2xl items-center overflow-hidden rounded-full bg-card shadow-2xl ring-1 ring-black/5 transition-all duration-500 hover:shadow-xl hover:ring-primary/20 focus-within:shadow-xl focus-within:ring-primary/30"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="relative hidden h-full items-center border-r border-border/50 sm:flex ga-color-transition">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              aria-label="Search category"
              className="h-full cursor-pointer appearance-none bg-transparent pl-5 pr-9 text-sm font-bold text-foreground outline-none ga-color-transition hover:bg-secondary/30 transition-all duration-300"
            >
              <option value="All">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground transition-transform duration-300" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tomatoes, plantain, pepper, yam…"
            className="h-full flex-1 bg-transparent px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-base ga-color-transition transition-all duration-300"
          />
          <button
            type="submit"
            className="ga-press ga-scale-interactive flex h-full items-center gap-2 bg-primary px-6 font-bold text-primary-foreground shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Search className="h-5 w-5 transition-transform duration-300" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* CTAs */}
        <div className="ga-fade-in mt-6 flex flex-wrap items-center gap-3 transition-all duration-700" style={{ animationDelay: '0.5s' }}>
          <Link
            href="/shop"
            className="ga-press ga-scale-interactive inline-flex items-center gap-2 rounded-full bg-[var(--ga-star)] px-6 py-3 text-sm font-bold text-[var(--accent-foreground)] shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmers"
            className="ga-color-transition inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:border-white/50"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips */}
        <div className="ga-fade-in mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-white/90 transition-all duration-700" style={{ animationDelay: '0.6s' }}>
          <span className="inline-flex items-center gap-2 transition-all duration-300 hover:text-white hover:translate-x-1">
            <Leaf className="h-4 w-4 text-[var(--ga-star)] transition-transform duration-300" /> Picked today
          </span>
          <span className="inline-flex items-center gap-2 transition-all duration-300 hover:text-white hover:translate-x-1">
            <MapPin className="h-4 w-4 text-[var(--ga-star)] transition-transform duration-300" /> GhanaPostGPS delivery
          </span>
          <span className="inline-flex items-center gap-2 transition-all duration-300 hover:text-white hover:translate-x-1">
            <Truck className="h-4 w-4 text-[var(--ga-star)] transition-transform duration-300" /> Pay on delivery · MoMo
          </span>
        </div>
      </div>

    </section>
  )
}
