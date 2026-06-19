import Link from 'next/link'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { featuredProducts } from '@/lib/golden-acres/data'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/golden-acres/reveal'

export function FeaturedProduce() {
  const featured = featuredProducts.slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="ga-index text-sm text-[var(--ga-terracotta)]">02</span>
          <div className="ga-rule" />
          <span className="ga-kicker shrink-0 text-muted-foreground">Today&apos;s Harvest</span>
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="ga-headline max-w-xl text-balance text-4xl text-foreground sm:text-5xl">
            Picked this <em>morning</em>
          </h2>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 pb-1 text-base font-semibold text-primary"
          >
            <span className="link-underline">Browse all produce</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="ga-stagger mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {featured.map((product) => (
          <ProduceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
