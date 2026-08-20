import Link from 'next/link'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { featuredProducts } from '@/lib/golden-acres/data'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/golden-acres/reveal'

export function FeaturedProduce() {
  const featured = featuredProducts.slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="ga-index text-sm font-black text-[#7A3F1C]">02</span>
          <div className="ga-rule" />
          <span className="ga-kicker shrink-0 font-extrabold text-[#5C5247]">Today&apos;s Harvest</span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="ga-headline max-w-xl text-balance text-4xl font-black text-[#211A12] sm:text-5xl">
            Picked this <em className="text-[#0B3B25]">morning</em>
          </h2>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 pb-1 text-sm font-extrabold text-[#0B3B25] hover:text-[#072618]"
          >
            <span className="link-underline">Browse all produce</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="ga-stagger mt-8 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
        {featured.map((product) => (
          <ProduceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
