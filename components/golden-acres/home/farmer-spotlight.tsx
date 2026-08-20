import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { farmers } from '@/lib/golden-acres/data'
import { ArrowRight, MapPin, Star } from 'lucide-react'

export function FarmerSpotlight() {
  const spotlight = farmers.slice(0, 3)

  return (
    <section className="bg-[#EDE8DF]/40 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="ga-index text-sm font-black text-[#7A3F1C]">08</span>
          <div className="ga-rule" />
          <span className="ga-kicker shrink-0 font-extrabold text-[#5C5247]">Meet The Growers</span>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="ga-headline max-w-xl text-balance text-4xl font-black text-[#211A12] sm:text-5xl">
            Every order has a <em className="text-[#0B3B25]">face</em> behind it
          </h2>
          <Link
            href="/farmers"
            className="group inline-flex items-center gap-2 pb-1 text-sm font-extrabold text-[#0B3B25] hover:text-[#072618]"
          >
            <span className="link-underline">Meet all farmers</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {spotlight.map((farmer) => (
            <Link
              key={farmer.id}
              href={`/farmers/${farmer.slug}`}
              className="ga-card-hover group relative block overflow-hidden rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
            >
              <div className="ga-zoom relative aspect-[4/5]">
                <SmartImage src={farmer.photo} alt={farmer.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F0A81E]">
                  <MapPin className="h-3.5 w-3.5" />
                  {farmer.region}
                </div>
                <h3 className="ga-headline mt-1 text-2xl font-black text-white">{farmer.name}</h3>
                <p className="text-xs font-medium text-white/85">{farmer.farmName}</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]" />
                  <span className="font-extrabold text-white">{farmer.rating}</span>
                  <span className="text-white/75">
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
