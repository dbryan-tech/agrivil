import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { ArrowRight, MapPin, Truck, ShieldCheck } from 'lucide-react'

export function HeroPromo() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Main promo */}
        <Link
          href="/shop"
          className="group relative col-span-12 overflow-hidden rounded-2xl lg:col-span-8"
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto lg:h-full lg:min-h-[420px]">
            <SmartImage
              src="/golden-acres/new-hero.png"
              alt="Fresh produce harvested this morning in Ghana"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ga-ink-deep)]/85 via-[var(--ga-ink-deep)]/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center gap-4 p-7 sm:p-10 lg:max-w-[60%]">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                <MapPin className="h-3.5 w-3.5" /> Now delivering in Accra
              </span>
              <h1 className="ga-headline text-balance text-4xl text-white sm:text-5xl lg:text-6xl">
                Fresh from the farm, <em className="text-[var(--ga-lime)]">to your door</em>
              </h1>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
                Order produce picked this morning by Ghana&apos;s local farmers. Priced by
                weight, delivered cold, paid with Mobile Money.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors group-hover:bg-field-deep">
                  Shop today&apos;s harvest
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-sm font-semibold text-white/90">Free delivery over GH₵250</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Side promos */}
        <div className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <SidePromo
            href="/bundles"
            image="/golden-acres/bundle-box.png"
            kicker="Save up to 20%"
            title="Weekly veg boxes"
            sub="Curated bundles & subscriptions"
            tone="dark"
          />
          <SidePromo
            href="/local"
            image="/golden-acres/story-harvest.jpg"
            kicker="MarketPlace Match"
            title="Shop closest to you"
            sub="Produce from your 5 nearest farms"
            tone="light"
          />
        </div>
      </div>
    </section>
  )
}

function SidePromo({
  href,
  image,
  kicker,
  title,
  sub,
  tone,
}: {
  href: string
  image: string
  kicker: string
  title: string
  sub: string
  tone: 'dark' | 'light'
}) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/9] sm:aspect-auto sm:h-full sm:min-h-[200px] lg:min-h-[202px]">
        <SmartImage
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className={
            tone === 'dark'
              ? 'absolute inset-0 bg-gradient-to-t from-[var(--ga-ink-deep)]/90 to-[var(--ga-ink-deep)]/20'
              : 'absolute inset-0 bg-gradient-to-t from-[var(--ga-ink-deep)]/85 to-transparent'
          }
        />
        <div className="absolute inset-0 flex flex-col justify-end gap-0.5 p-5">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--ga-lime)]">
            {kicker}
          </span>
          <h3 className="ga-headline text-xl text-white">{title}</h3>
          <p className="flex items-center gap-1 text-xs text-white/80">
            {sub}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </div>
    </Link>
  )
}

export function TrustStrip() {
  const items = [
    { icon: Truck, title: 'Scheduled delivery', sub: 'Pick your time slot' },
    { icon: ShieldCheck, title: 'Freshness guarantee', sub: 'Spoiled? Instant refund' },
    { icon: MapPin, title: 'GhanaPostGPS', sub: 'Accurate to your door' },
  ]
  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <it.icon className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
