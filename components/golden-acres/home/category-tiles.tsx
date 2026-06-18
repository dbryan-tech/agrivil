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
        {TILES.map((t) => (
          <Link
            key={t.label}
            href={`/shop?category=${encodeURIComponent(t.label)}`}
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(122,63,28,0.55)]"
          >
            <SmartImage
              src={t.image}
              alt={t.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="ga-media-scrim" aria-hidden />
            <span className="relative z-[2] p-3 text-left">
              <span className="block text-sm font-bold leading-tight text-white text-balance">
                {t.label}
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--ga-lime)]">
                Shop now
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
