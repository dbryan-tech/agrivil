'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, ArrowRight, Play, Pause, MapPin, Truck, Leaf } from 'lucide-react'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [playing, setPlaying] = useState(true)

  // Respect reduced-motion: pause the loop and show the poster instead.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      v.pause()
      setPlaying(false)
    }
  }, [])

  function toggle() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

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
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/golden-acres/hero-horizontal.png"
        >
          <source src="/golden-acres/video/farm-hero.mp4" type="video/mp4" />
        </video>
        {/* copper → green cinematic scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ga-ink-deep)]/92 via-[var(--ga-copper-deep)]/55 to-[var(--ga-field-deep)]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ga-ink-deep)]/85 via-transparent to-[var(--ga-ink-deep)]/30" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[640px] lg:px-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--ga-star)]" />
          Harvested this morning · Accra pilot
        </span>

        <h1 className="ga-headline mt-5 max-w-3xl text-balance text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
          Ghana&apos;s freshest harvest, <em className="text-[var(--ga-star)]">delivered to your door</em>
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
          Shop produce picked today by local farmers, compare offers from the growers nearest you,
          and pay with Mobile Money. Priced by weight, delivered cold.
        </p>

        {/* Search */}
        <form
          onSubmit={submit}
          className="mt-8 flex h-14 w-full max-w-2xl items-center overflow-hidden rounded-full bg-card shadow-2xl ring-1 ring-black/5"
        >
          <div className="relative hidden h-full items-center border-r border-border sm:flex">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              aria-label="Search category"
              className="h-full cursor-pointer appearance-none bg-transparent pl-5 pr-9 text-sm font-bold text-foreground outline-none"
            >
              <option value="All">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tomatoes, plantain, pepper, yam…"
            className="h-full flex-1 bg-transparent px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
          />
          <button
            type="submit"
            className="ga-press flex h-full items-center gap-2 bg-primary px-6 font-bold text-primary-foreground transition-colors hover:bg-field-deep"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/shop"
            className="ga-press inline-flex items-center gap-2 rounded-full bg-[var(--ga-star)] px-6 py-3 text-sm font-bold text-[var(--accent-foreground)] transition-transform hover:scale-[1.02]"
          >
            Shop today&apos;s harvest
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/farmers"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            Meet the farmers
          </Link>
        </div>

        {/* Trust chips */}
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-white/90">
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[var(--ga-star)]" /> Picked today
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--ga-star)]" /> GhanaPostGPS delivery
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-[var(--ga-star)]" /> Pay on delivery · MoMo
          </span>
        </div>
      </div>

      {/* Play / pause control */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
        className="absolute bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50"
      >
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
    </section>
  )
}
