import Link from 'next/link'
import { ArrowRight, Truck, ShieldCheck, Sprout, Star } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'

const trust = [
  { icon: Truck, label: 'Cold-chain delivery' },
  { icon: ShieldCheck, label: 'Freshness guarantee' },
  { icon: Sprout, label: 'Direct from local farms' },
]

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* faint editorial grid + warm glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 85% 0%, color-mix(in oklab, var(--ga-terracotta) 12%, transparent), transparent 60%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* top hairline meta strip */}
        <div className="flex items-center justify-between gap-4 border-b border-border py-4">
          <span className="ga-kicker text-[var(--ga-terracotta)]">
            Golden Acres&nbsp;·&nbsp;Est. Accra
          </span>
          <span className="ga-kicker hidden text-muted-foreground sm:block">
            Issue 01 — Today&apos;s Harvest
          </span>
          <span className="ga-index text-xs text-muted-foreground">GH ⟶ Your Door</span>
        </div>

        <div className="grid items-stretch gap-10 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* LEFT — editorial copy */}
          <div className="ga-rise flex flex-col justify-center lg:col-span-6 lg:pr-6">
            <span className="ga-kicker inline-flex w-fit items-center gap-2 text-[var(--ga-terracotta)]">
              <Sprout className="h-3.5 w-3.5" />
              Ghana&apos;s virtual farmers&apos; market
            </span>

            <h1 className="ga-headline mt-6 text-balance text-[3.4rem] text-foreground sm:text-7xl lg:text-[5.4rem]">
              Fresh from the farm,
              <br />
              to your <em>door</em>.
            </h1>

            <p className="mt-7 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              Just-harvested produce, direct from local Ghanaian farmers. Picked to order,
              priced by weight, delivered cold — with Mobile Money checkout and a freshness
              promise on every basket.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="ga-press group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground"
              >
                Shop today&apos;s harvest
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/farmers"
                className="ga-press inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-4 text-base font-semibold text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/[0.03]"
              >
                Meet the farmers
              </Link>
            </div>

            {/* hairline trust row */}
            <div className="mt-11 border-t border-border pt-6">
              <dl className="flex flex-wrap gap-x-8 gap-y-4">
                {trust.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <f.icon className="h-4.5 w-4.5 text-primary" strokeWidth={1.75} />
                    <dt className="text-sm font-medium text-foreground">{f.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* RIGHT — asymmetric framed media composition */}
          <div className="ga-rise relative lg:col-span-6" style={{ animationDelay: '120ms' }}>
            <div className="relative h-full min-h-[26rem] lg:min-h-[34rem]">
              {/* primary tall framed video */}
              <div className="ga-zoom relative h-full w-full overflow-hidden rounded-[1.5rem] border border-border shadow-[0_40px_80px_-40px_rgba(12,28,19,0.45)]">
                <video
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/golden-acres/hero-horizontal.png"
                >
                  <source src="/golden-acres/video/farm-hero.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ga-ink-deep)]/35 via-transparent to-transparent" />
              </div>

              {/* offset farmer portrait card */}
              <div className="absolute -bottom-6 -left-5 hidden w-40 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block lg:w-48">
                <div className="ga-zoom relative aspect-[4/5]">
                  <SmartImage
                    src="/golden-acres/hero-farmer.jpg"
                    alt="A Ghanaian farmer in a sunlit field"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* floating rating chip */}
              <div className="absolute -right-3 top-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg lg:-right-5">
                <Star className="h-4 w-4 fill-[var(--ga-gold-soft)] text-[var(--ga-gold-soft)]" />
                <span className="text-sm font-semibold text-foreground">4.9</span>
                <span className="ga-index text-[11px] text-muted-foreground">2.4k reviews</span>
              </div>

              {/* floating stat block */}
              <div className="absolute bottom-7 right-4 rounded-2xl border border-border bg-card/95 px-5 py-4 shadow-xl backdrop-blur-sm lg:right-6">
                <p className="ga-headline text-3xl text-primary">200+</p>
                <p className="ga-kicker mt-1 text-[10px] text-muted-foreground">local farmers</p>
                <div className="my-3 h-px w-full bg-border" />
                <p className="ga-headline text-3xl text-foreground">12 hrs</p>
                <p className="ga-kicker mt-1 text-[10px] text-muted-foreground">
                  farm to door, avg.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
