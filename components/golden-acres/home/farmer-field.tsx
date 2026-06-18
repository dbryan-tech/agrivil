import Link from 'next/link'
import { ArrowRight, Leaf, Sun } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'

export function FarmerField() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.4fr)_1fr] lg:gap-12 lg:py-12 lg:px-8">
        {/* Editorial portrait — the farmer in a delightful field (compact) */}
        <div className="ga-rise relative mx-auto w-full max-w-[16rem] lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border shadow-2xl shadow-black/10">
            <SmartImage
              src="/golden-acres/hero-farmer.jpg"
              alt="A Ghanaian farmer standing in a sunlit field holding a freshly picked ear of corn"
              fill
              label="Farmer in the field"
              className="h-full w-full"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
          {/* Quote chip floating over the visible image */}
          <div className="absolute -bottom-4 left-3 max-w-[13rem] rounded-xl border border-border bg-card/95 p-3 shadow-xl shadow-black/10 backdrop-blur-sm">
            <p className="ga-display text-sm font-semibold leading-snug text-foreground">
              &ldquo;You taste the difference when it&apos;s picked this morning.&rdquo;
            </p>
            <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--ga-gold)]">
              Kwame · Maize farmer, Eastern Region
            </p>
          </div>
        </div>

        {/* Copy that fills the side space */}
        <div className="ga-rise" style={{ animationDelay: '120ms' }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-secondary-foreground">
            <Leaf className="h-4 w-4 text-[var(--ga-leaf)]" />
            <span className="ga-eyebrow text-primary">Grown with care, close to home</span>
          </span>
          <h2 className="ga-display mt-5 text-balance text-4xl leading-[1.02] text-foreground sm:text-5xl">
            Real farmers. Real fields. Real{' '}
            <span className="ga-serif font-normal text-primary">flavour</span>.
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Behind every basket is a Ghanaian grower who planted, tended and hand-picked your
            produce. We bring their harvest straight to you — no cold-storage limbo, no
            anonymous supply chain. Just honest food from people who are proud to put their
            name on it.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-[var(--ga-field)] ring-1 ring-border">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Picked at peak</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Harvested to order the same day it leaves the farm.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-[var(--ga-field)] ring-1 ring-border">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Known by name</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Every farmer has a profile, a story and a fair payout.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9">
            <Link
              href="/farmers"
              className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground"
            >
              Meet the farmers behind your food
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
