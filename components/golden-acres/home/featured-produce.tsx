import Link from 'next/link'
import { ProduceCard } from '@/components/golden-acres/produce-card'
import { featuredProducts } from '@/lib/golden-acres/data'
import { ArrowRight } from 'lucide-react'

export function FeaturedProduce() {
  const featured = featuredProducts.slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ga-eyebrow text-primary">Today&apos;s harvest</p>
          <h2 className="ga-display mt-3 text-4xl text-foreground sm:text-5xl">
            Picked this <span className="ga-serif font-normal text-primary">morning</span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-base font-bold text-primary hover:underline"
        >
          Browse all produce
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {featured.map((product) => (
          <ProduceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
