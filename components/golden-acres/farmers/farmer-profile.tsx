import Link from 'next/link'
import { MapPin, Star, ShieldCheck, Sprout, CalendarDays } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { ReviewList } from '@/components/golden-acres/reviews/review-list'
import { pct } from '@/lib/golden-acres/format'
import type { Farmer, Product } from '@/lib/golden-acres/types'

export function FarmerProfile({
  farmer,
  catalog,
}: {
  farmer: Farmer
  catalog: Product[]
}) {
  return (
    <div>
      {/* Cover */}
      <div className="relative h-56 overflow-hidden sm:h-72 lg:h-80">
        <SmartImage
          src={farmer.cover ?? farmer.photo}
          alt={`${farmer.farmName} farmland`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ga-field-deep)]/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-card bg-card">
            <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
          </div>
          <div className="flex-1 pb-1">
            <p className="font-jakarta text-sm font-bold uppercase tracking-widest text-[var(--ga-gold-soft)]">
              {farmer.farmName}
            </p>
            <h1 className="ga-display mt-1 text-4xl font-semibold text-foreground">
              {farmer.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {farmer.town}, {farmer.region}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-[var(--ga-gold)] text-[var(--ga-gold)]" />
                {farmer.rating} ({farmer.reviewCount} reviews)
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> Partner since {farmer.joinedYear}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'On-time delivery', value: pct(farmer.onTimeRate) },
            { label: 'Rating', value: `${farmer.rating} / 5` },
            { label: 'Produce listed', value: String(catalog.length) },
            { label: 'Farm radius', value: `${farmer.farmToHubRadiusKm} km` },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-4 text-center"
            >
              <p className="ga-display text-2xl font-semibold text-foreground">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="ga-display text-2xl font-semibold text-foreground">
              The story
            </h2>
            <p className="mt-4 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
              {farmer.story}
            </p>
          </div>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Sprout className="h-5 w-5 text-[var(--ga-leaf)]" /> Growing methods
              </h3>
              <ul className="mt-3 space-y-2">
                {farmer.methods.map((m) => (
                  <li key={m} className="text-sm text-muted-foreground">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {farmer.certifications.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 font-bold text-foreground">
                  <ShieldCheck className="h-5 w-5 text-[var(--ga-gold)]" /> Certifications
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {farmer.certifications.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Catalog */}
        <section className="mt-14 pb-16">
          <div className="flex items-end justify-between">
            <h2 className="ga-display text-2xl font-semibold text-foreground">
              From this farm
            </h2>
            <Link href="/shop" className="text-sm font-semibold text-[var(--ga-gold)] hover:underline">
              All produce
            </Link>
          </div>
          {catalog.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {catalog.map((p) => (
                <ProduceCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              This farm has no produce listed right now. Check back soon.
            </p>
          )}
        </section>

        {/* Verified customer reviews */}
        <section className="pb-16">
          <ReviewList farmerId={farmer.id} title="What customers say" />
        </section>
      </div>
    </div>
  )
}
