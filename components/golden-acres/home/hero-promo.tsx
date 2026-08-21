import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { ArrowRight, MapPin, Truck, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeroBannerData {
  badge: string
  title: string
  highlightText: string
  description: string
  ctaText: string
  ctaHref: string
  freeDeliveryText: string
  image: string
  imageAlt: string
}

export const HERO_BANNER_DATA: HeroBannerData = {
  badge: 'Now delivering in Accra',
  title: 'Fresh from the farm,',
  highlightText: 'to your door',
  description:
    "Order produce picked this morning by Ghana's local farmers. Priced by weight, delivered cold, paid with Mobile Money.",
  ctaText: "Shop today's harvest",
  ctaHref: '/shop',
  freeDeliveryText: 'Free delivery over GH₵250',
  image: '/golden-acres/new-hero.png',
  imageAlt: 'Fresh produce harvested this morning in Ghana',
}

export function MobileHeroBanner({
  data = HERO_BANNER_DATA,
  className = '',
}: {
  data?: HeroBannerData
  className?: string
}) {
  return (
    <Link
      href="/m/categories"
      className={cn(
        'group relative block overflow-hidden rounded-t-[22px] rounded-b-[38px] shadow-[0_4px_18px_-4px_rgba(122,63,28,0.12)] active:scale-[0.99] transition-transform',
        className
      )}
    >
      <div className="relative min-h-[195px] sm:min-h-[215px] w-full overflow-hidden">
        <SmartImage
          src={data.image}
          alt={data.imageAlt}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Multi-gradient backdrop for crisp legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
          {/* Yellow Location Pill */}
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0A81E] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-[#211A12] shadow-xs">
              <MapPin className="h-2.5 w-2.5 stroke-[2.8]" />
              <span>{data.badge}</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="mt-2 max-w-[280px]">
            <h2 className="text-[19px] sm:text-[21px] font-black leading-[1.15] tracking-tight text-white">
              {data.title}{' '}
              <span className="text-[#DF8821]">{data.highlightText}</span>
            </h2>
            <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed text-white/90">
              {data.description}
            </p>
          </div>

          {/* CTA & Delivery info (Copper Button Style) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#7A3F1C] px-3.5 py-1.5 text-[11.5px] font-extrabold text-white shadow-sm transition-transform active:scale-95 group-hover:bg-[#5E2F14]">
              <span>{data.ctaText}</span>
              <ArrowRight className="h-3 w-3 stroke-[2.5]" />
            </div>
            <span className="text-[10.5px] font-bold text-white/90">
              {data.freeDeliveryText}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HeroPromo() {
  const data = HERO_BANNER_DATA

  return (
    <section className="mx-auto max-w-7xl px-2 pt-2.5 sm:px-3 lg:px-4">
      <div className="grid gap-2 sm:gap-2.5 lg:grid-cols-12">
        {/* Main promo */}
        <Link
          href={data.ctaHref}
          className="group relative col-span-12 overflow-hidden rounded-2xl lg:col-span-8"
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto lg:h-full lg:min-h-[360px]">
            <SmartImage
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ga-ink-deep)]/85 via-[var(--ga-ink-deep)]/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center gap-2.5 p-4 sm:p-7 lg:max-w-[60%]">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                <MapPin className="h-3.5 w-3.5" /> {data.badge}
              </span>
              <h1 className="ga-headline text-balance text-3xl text-white sm:text-4xl lg:text-5xl">
                {data.title} <em className="not-italic text-[#DF8821]">{data.highlightText}</em>
              </h1>
              <p className="max-w-md text-pretty text-xs leading-relaxed text-white/85 sm:text-sm">
                {data.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-colors group-hover:bg-field-deep sm:text-sm">
                  {data.ctaText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-xs font-semibold text-white/90 sm:text-sm">{data.freeDeliveryText}</span>
              </div>
            </div>
          </div>
        </Link>


        {/* Side promos */}
        <div className="col-span-12 grid gap-2 sm:gap-2.5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
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
      <div className="relative aspect-[16/9] sm:aspect-auto sm:h-full sm:min-h-[175px] lg:min-h-[175px]">
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
        <div className="absolute inset-0 flex flex-col justify-end gap-0.5 p-3.5 sm:p-4">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--ga-lime)]">
            {kicker}
          </span>
          <h3 className="ga-headline text-lg text-white sm:text-xl">{title}</h3>
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
    <section className="mx-auto mt-2 max-w-7xl px-2 sm:px-3 lg:px-4">
      <div className="grid grid-cols-1 gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <it.icon className="h-4 w-4" />
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
