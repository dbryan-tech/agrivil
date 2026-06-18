import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { farmers } from '@/lib/golden-acres/data'
import { ArrowRight, MapPin, Star } from 'lucide-react'

export function FarmerSpotlight() {
  const spotlight = farmers.slice(0, 3)

  return (
    <section className="bg-[var(--ga-cream)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="ga-eyebrow text-primary">Meet the growers</p>
            <h2 className="ga-display mt-3 text-balance text-4xl text-foreground sm:text-5xl">
              Every order has a <span className="ga-serif font-normal text-primary">face</span>{' '}
              behind it
            </h2>
          </div>
          <Link
            href="/farmers"
            className="group inline-flex items-center gap-2 text-base font-bold text-primary hover:underline"
          >
            Meet all farmers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {spotlight.map((farmer) => (
            <Link
              key={farmer.id}
              href={`/farmers/${farmer.slug}`}
              className="ga-card-hover group relative block overflow-hidden rounded-3xl"
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
                <h3 className="ga-display mt-1 text-2xl font-semibold">{farmer.name}</h3>
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
