import Link from 'next/link'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { featuredProducts } from '@/lib/golden-acres/data'
import { ArrowRight } from 'lucide-react'

export function FeaturedProduce() {
  const featured = featuredProducts.slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 transition-all duration-700">
      <div className="ga-fade-in flex items-center gap-4 transition-all duration-500">
        <span className="ga-index text-sm text-[var(--ga-terracotta)] transition-colors duration-300">02</span>
        <div className="ga-rule transition-all duration-300" />
        <span className="ga-kicker shrink-0 text-muted-foreground transition-colors duration-300">Today&apos;s Harvest</span>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 transition-all duration-500">
        <h2 className="ga-headline ga-fade-in max-w-xl text-balance text-5xl text-foreground sm:text-6xl transition-all duration-700" style={{ animationDelay: '0.1s' }}>
          Picked this <em className="transition-colors duration-300">morning</em>
        </h2>
        <Link
          href="/shop"
          className="ga-color-transition group inline-flex items-center gap-2 pb-2 text-base font-semibold text-primary transition-all duration-300 hover:gap-3"
        >
          <span className="link-underline transition-all duration-300">Browse all produce</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
      </div>

      <div className="ga-stagger mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {featured.map((product) => (
          <ProduceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
