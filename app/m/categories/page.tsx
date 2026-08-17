'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { products } from '@/lib/golden-acres/data'

const CATEGORIES = [
  {
    name: 'Vegetables',
    slug: 'Vegetables',
    desc: 'Tomatoes, Pepper, Lettuce, Cabbage, Cucumber...',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
  },
  {
    name: 'Fruits',
    slug: 'Fruits',
    desc: 'Banana, Pineapple, Mango, Pawpaw, Orange...',
    image: '/golden-acres/produce/sweet-pineapple-1.png',
  },
  {
    name: 'Roots & Tubers',
    slug: 'Roots & Tubers',
    desc: 'White Yam, Cassava, Sweet Potato, Cocoyam...',
    image: '/golden-acres/produce/white-yam.png',
  },
  {
    name: 'Grains & Legumes',
    slug: 'Grains & Legumes',
    desc: 'Aromatic Rice, Maize, Millet, Brown Rice, Cowpeas...',
    image: '/golden-acres/produce/aromatic-rice.png',
  },
  {
    name: 'Leafy Greens',
    slug: 'Leafy Greens',
    desc: 'Kontomire (Cocoyam leaves), Spinach, Spring Greens...',
    image: '/golden-acres/produce/kontomire.png',
  },
  {
    name: 'Herbs & Spices',
    slug: 'Herbs & Spices',
    desc: 'Ginger, Garlic, Scotch Bonnet, Turmeric, Lemongrass...',
    image: '/golden-acres/produce/scotch-bonnet.png',
  },
]

export default function MobileCategoriesScreen() {
  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar title="Categories" showSearch showCart />

      <div className="px-4 py-4 space-y-3">
        {CATEGORIES.map((cat) => {
          const count = products.filter(
            (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
          ).length

          return (
            <Link
              key={cat.slug}
              href={`/m/categories/${encodeURIComponent(cat.slug)}`}
              className="ga-press flex items-center justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs hover:border-[#1E5D3B]/40"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#F4F1EA]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-[#2B1F17]">
                      {cat.name}
                    </h2>
                    <span className="text-[10px] font-bold text-[#1E5D3B]">
                      {count > 0 ? `${count}+ items` : 'Fresh stock'}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#6E6A63]">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#6E6A63]">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          )
        })}
      </div>

      <MobileBottomNav />
    </div>
  )
}
