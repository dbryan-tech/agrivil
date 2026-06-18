import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function MarketHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* section index header */}
      <div className="flex items-center gap-4">
        <span className="ga-index text-sm text-[var(--ga-terracotta)]">01</span>
        <div className="ga-rule" />
        <span className="ga-kicker shrink-0 text-muted-foreground">The Market</span>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-border">
        {/* wide cinematic photograph */}
        <img
          src="/golden-acres/new-hero.png"
          alt="A vibrant Ghanaian market stall stacked with fresh produce"
          className="h-[24rem] w-full object-cover object-center sm:h-[30rem] lg:h-[34rem]"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(90deg, rgba(12,28,19,0.55) 0%, rgba(12,28,19,0.12) 45%, transparent 70%)',
          }}
        />

        {/* floating paper copy card — magazine feature style */}
        <div className="absolute inset-y-0 left-0 flex items-center p-5 sm:p-8 lg:p-12">
          <div className="max-w-md rounded-2xl border border-border bg-card/95 p-7 shadow-2xl backdrop-blur-sm sm:p-9">
            <span className="ga-kicker text-[var(--ga-terracotta)]">
              A market that comes to you
            </span>
            <h2 className="ga-headline mt-4 text-balance text-4xl text-foreground sm:text-5xl">
              Every stall, every harvest — in <em>one basket</em>.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Tomatoes, peppers, leafy greens, yam and more — sourced from market gardens
              across Ghana and bundled into a single, fresh delivery.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="ga-press group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground"
              >
                Browse the market
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/bundles"
                className="ga-press inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-foreground/40"
              >
                Fresh bundles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
