import Link from 'next/link'
import Image from 'next/image'
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#072618]/85 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[24px] border-4 border-white bg-white shadow-md">
            <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
          </div>
          <div className="flex-1 pb-1">
            <p className="font-jakarta text-xs font-black uppercase tracking-widest text-[#F0A81E]">
              {farmer.farmName}
            </p>
            <h1 className="ga-headline mt-1 text-3xl sm:text-4xl font-black text-[#211A12]">
              {farmer.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold text-[#5C5247]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#0B3B25]" /> {farmer.town}, {farmer.region}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F0A81E] text-[#F0A81E]" />
                {farmer.rating} ({farmer.reviewCount} reviews)
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-[#0B3B25]" /> Partner since {farmer.joinedYear}
              </span>
            </div>
          </div>

          {/* Verified Partner Seal */}
          <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-[#FAF7F2] p-3 border border-black/[0.06] shadow-xs">
            <Image
              src="/agrivil-stamp.svg"
              alt="AgriVil Verified Partner"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0"
            />
            <div className="text-xs">
              <span className="font-extrabold text-[#0B3B25]">Verified Grower</span>
              <p className="text-[11px] font-medium text-[#5C5247]">Direct Cold-Chain Dispatch</p>
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
              className="rounded-[20px] border border-black/[0.04] bg-[#FDFDFB] p-4 text-center shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
            >
              <p className="ga-headline text-2xl font-black text-[#211A12]">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#5C5247]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="ga-headline text-2xl font-black text-[#211A12]">
              The story
            </h2>
            <p className="mt-4 whitespace-pre-line text-pretty leading-relaxed text-[#5C5247]">
              {farmer.story}
            </p>
          </div>
          <aside className="space-y-5">
            <div className="rounded-[20px] border border-black/[0.04] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
              <h3 className="flex items-center gap-2 font-black text-[#211A12]">
                <Sprout className="h-5 w-5 text-[#0B3B25]" /> Growing methods
              </h3>
              <ul className="mt-3 space-y-2">
                {farmer.methods.map((m) => (
                  <li key={m} className="text-sm font-medium text-[#5C5247]">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {farmer.certifications.length > 0 && (
              <div className="rounded-[20px] border border-black/[0.04] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
                <h3 className="flex items-center gap-2 font-black text-[#211A12]">
                  <ShieldCheck className="h-5 w-5 text-[#F0A81E]" /> Certifications
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {farmer.certifications.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-[#EDE8DF] px-3 py-1.5 text-xs font-bold text-[#211A12]"
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
        <section className="mt-12 pb-14">
          <div className="flex items-end justify-between">
            <h2 className="ga-headline text-2xl font-black text-[#211A12]">
              From this farm
            </h2>
            <Link href="/shop" className="text-sm font-extrabold text-[#0B3B25] hover:underline">
              All produce
            </Link>
          </div>
          {catalog.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {catalog.map((p) => (
                <ProduceCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[#5C5247]">
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
