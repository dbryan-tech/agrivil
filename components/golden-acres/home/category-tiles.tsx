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
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {TILES.map((t) => (
          <Link
            key={t.label}
            href={`/shop?category=${encodeURIComponent(t.label)}`}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-3 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_24px_-14px_rgba(11,59,37,0.4)]"
          >
            <span className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/50">
              <SmartImage
                src={t.image}
                alt={t.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="text-xs font-bold leading-tight text-foreground sm:text-sm">
              {t.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
