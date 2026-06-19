import Link from 'next/link'
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
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border/50 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_-16px_rgba(11,59,37,0.25)]"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <SmartImage
              src={t.image}
              alt={t.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-125"
            />
            <span className="ga-media-scrim transition-all duration-500 group-hover:bg-black/50" aria-hidden style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)' }} />
            <span className="relative z-[2] p-3 text-left transition-transform duration-500 group-hover:translate-y-0">
              <span className="block text-sm font-bold leading-tight text-white text-balance transition-all duration-300">
                {t.label}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--ga-lime)] transition-all duration-300 group-hover:gap-2">
                Shop now →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
