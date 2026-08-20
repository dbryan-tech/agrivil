import Link from 'next/link'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { featuredProducts } from '@/lib/golden-acres/data'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/golden-acres/reveal'

export function FeaturedProduce() {
  const featured = featuredProducts.slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-2 py-4 sm:px-3 lg:px-4">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="ga-index text-xs font-black text-[#7A3F1C]">02</span>
          <div className="ga-rule" />
          <span className="ga-kicker shrink-0 text-xs font-extrabold text-[#5C5247]">Today&apos;s Harvest</span>
        </div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="ga-headline max-w-xl text-balance text-xl font-black text-[#211A12] sm:text-2xl">
            Picked this <em className="text-[#0B3B25]">morning</em>
          </h2>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 pb-0.5 text-xs font-extrabold text-[#0B3B25] hover:text-[#072618] sm:text-sm"
          >
            <span className="link-underline">Browse all produce</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="ga-stagger mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {featured.map((product) => (
          <ProduceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
