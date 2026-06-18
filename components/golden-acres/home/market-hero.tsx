import Link from 'next/link'
import { ArrowRight, ShoppingBasket } from 'lucide-react'

export function MarketHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed market-stall photograph with a legibility scrim */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/golden-acres/new-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      <div className="mx-auto flex min-h-[26rem] max-w-7xl items-center px-4 py-14 sm:px-6 lg:min-h-[32rem] lg:py-20 lg:px-8">
        <div
          className="ga-rise max-w-xl"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.55), 0 2px 14px rgba(0,0,0,0.45)' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-white backdrop-blur-sm">
            <ShoppingBasket className="h-4 w-4 text-[var(--ga-lime)]" />
            <span className="ga-eyebrow text-[var(--ga-lime)]">A market that comes to you</span>
          </span>
          <h2 className="ga-display mt-5 text-balance text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">
            Every stall, every harvest — in{' '}
            <span className="ga-serif font-normal text-[var(--ga-lime)]">one basket</span>.
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-white/85">
            Tomatoes, peppers, leafy greens, yam and more — sourced from market gardens
            across Ghana and bundled into a single, fresh delivery. Shop the whole stall
            without ever leaving home.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="ga-sheen ga-press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-black/20"
            >
              Browse the market
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/bundles"
              className="ga-press inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:border-[var(--ga-lime)] hover:text-[var(--ga-lime)]"
            >
              Shop fresh bundles
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
