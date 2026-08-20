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
        <h2 className="ga-headline text-2xl font-black text-[#211A12] sm:text-3xl">Shop by category</h2>
        <Link href="/shop" className="text-sm font-extrabold text-[#0B3B25] hover:text-[#072618] hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TILES.map((t, i) => (
          <Link
            key={t.label}
            href={`/shop?category=${encodeURIComponent(t.label)}`}
            className="ga-card-hover group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
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
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/85"
            />
            {/* arrow affordance */}
            <span className="absolute right-3 top-3 z-[2] flex h-7 w-7 translate-y-1 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
            <span className="relative z-[2] p-3.5 text-left">
              <span className="block text-pretty text-[15px] font-black leading-tight text-white">
                {t.label}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[#F0A81E] transition-all duration-300 group-hover:gap-1.5">
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
