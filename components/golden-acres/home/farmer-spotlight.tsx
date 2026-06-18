import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { farmers } from '@/lib/golden-acres/data'
import { ArrowRight, MapPin, Star } from 'lucide-react'

export function FarmerSpotlight() {
  const spotlight = farmers.slice(0, 3)

  return (
    <section className="bg-secondary/50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="ga-index text-sm text-[var(--ga-terracotta)]">07</span>
          <div className="ga-rule" />
          <span className="ga-kicker shrink-0 text-muted-foreground">Meet The Growers</span>
        </div>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="ga-headline max-w-xl text-balance text-5xl text-foreground sm:text-6xl">
            Every order has a <em>face</em> behind it
          </h2>
          <Link
            href="/farmers"
            className="group inline-flex items-center gap-2 pb-2 text-base font-semibold text-primary"
          >
            <span className="link-underline">Meet all farmers</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {spotlight.map((farmer) => (
            <Link
              key={farmer.id}
              href={`/farmers/${farmer.slug}`}
              className="ga-card-hover group relative block overflow-hidden rounded-2xl"
            >
              <div className="ga-zoom relative aspect-[4/5]">
                <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-[var(--ga-cream)]">
                <div className="flex items-center gap-2 text-sm text-[var(--ga-gold-soft)]">
                  <MapPin className="h-4 w-4" />
                  {farmer.region}
                </div>
                <h3 className="ga-headline mt-1 text-3xl">{farmer.name}</h3>
                <p className="text-sm text-[var(--ga-cream)]/80">{farmer.farmName}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-[var(--ga-gold-soft)] text-[var(--ga-gold-soft)]" />
                  <span className="font-bold">{farmer.rating}</span>
                  <span className="text-[var(--ga-cream)]/70">
                    · {farmer.reviewCount} reviews
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
