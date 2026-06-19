import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'

const TILES = [
  { label: 'Vegetables', image: '/golden-acres/produce/roma-tomatoes.png' },
  { label: 'Fruits', image: '/golden-acres/produce/sweet-pineapple.png' },
  { label: 'Roots & Tubers', image: '/golden-acres/produce/white-yam.png' },
  { label: 'Leafy Greens', image: '/golden-acres/produce/kontomire.png' },
  { label: 'Grains & Legumes', image: '/golden-acres/produce/fresh-maize.png' },
  { label: 'Herbs & Spices', image: '/golden-acres/produce/scotch-bonnet.png' },
]

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="ga-headline text-2xl text-foreground sm:text-3xl">Shop by category</h2>
        <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TILES.map((t, i) => (
          <Link
            key={t.label}
            href={`/shop?category=${encodeURIComponent(t.label)}`}
            className="ga-card-hover group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border/50"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <SmartImage
              src={t.image}
              alt={t.label}
              fill
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.1]"
            />
            {/* legibility gradient — strong at the base, fades up */}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/80"
            />
            {/* arrow affordance */}
            <span className="absolute right-3 top-3 z-[2] flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="relative z-[2] p-3.5 text-left">
              <span className="block text-pretty text-[15px] font-bold leading-tight text-white">
                {t.label}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--ga-star)] transition-all duration-300 group-hover:gap-1.5">
                Shop now
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
