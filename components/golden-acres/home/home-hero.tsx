import Link from 'next/link'
import { ArrowRight, Truck, ShieldCheck, Sprout } from 'lucide-react'

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed cinematic video backdrop with a legibility scrim */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
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
        {/* Darkening scrims: even overall dim + stronger on the left and bottom so
            text and corner cards stay clearly readable over the footage. */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      <div className="mx-auto flex min-h-[34rem] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[42rem] lg:py-24 lg:px-8">
        <div
          className="ga-rise max-w-2xl"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.55), 0 2px 14px rgba(0,0,0,0.45)' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-white backdrop-blur-sm">
            <Sprout className="h-4 w-4 text-[var(--ga-lime)]" />
            <span className="ga-eyebrow text-[var(--ga-lime)]">
              Ghana&apos;s virtual farmers&apos; market
            </span>
          </span>
          <h1 className="ga-display mt-5 text-balance text-[2.9rem] leading-[0.98] text-white sm:text-6xl lg:text-[5rem]">
            <span className="ga-serif font-normal text-[var(--ga-lime)]">Fresh</span> from the
            farm, to your door.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/85">
            Order just-harvested produce direct from local Ghanaian farmers. Picked to
            order, priced by weight, delivered cold — with Mobile Money checkout and a
            freshness promise on every basket.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="ga-sheen ga-press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-black/20"
            >
              Shop today&apos;s harvest
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/farmers"
              className="ga-press inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:border-[var(--ga-lime)] hover:text-[var(--ga-lime)]"
            >
              Meet the farmers
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {[
              { icon: Truck, label: 'Cold-chain delivery' },
              { icon: ShieldCheck, label: 'Freshness guarantee' },
              { icon: Sprout, label: 'Direct from local farms' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <f.icon className="h-5 w-5 text-[var(--ga-lime)]" />
                <span className="text-sm font-semibold text-white">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating proof cards riding over the footage */}
        <div className="ga-rise absolute right-4 top-24 hidden rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-xl shadow-black/30 backdrop-blur-md lg:block lg:right-8">
          <p className="ga-display text-3xl text-[var(--ga-lime)]">200+</p>
          <p className="ga-eyebrow mt-1 text-[10px] text-white/75">local farmers</p>
        </div>
        <div className="ga-rise absolute bottom-14 right-4 hidden rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl shadow-black/30 backdrop-blur-md lg:block lg:right-8">
          <p className="ga-display text-3xl text-white">12 hrs</p>
          <p className="ga-eyebrow mt-1 text-[10px] text-white/75">farm to door, avg.</p>
        </div>
      </div>
    </section>
  )
}
