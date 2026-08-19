'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export const CATEGORY_DEFINITIONS = [
  {
    name: 'Staples',
    slug: 'Staples',
    count: '120+ items',
    desc: 'Daily essentials from local farms and trusted suppliers.',
    image: '/golden-acres/produce/aromatic-rice.png',
    heroImage: '/golden-acres/hero-horizontal.png',
  },
  {
    name: 'Fruits',
    slug: 'Fruits',
    count: '50+ items',
    desc: 'Farm fresh fruits. In season and full of goodness.',
    image: '/golden-acres/produce/sweet-pineapple-1.png',
    heroImage: '/golden-acres/produce/sweet-pineapple-1.png',
  },
  {
    name: 'Vegetables',
    slug: 'Vegetables',
    count: '150+ items',
    desc: 'Green, leafy and delicious vegetables for every meal.',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
    heroImage: '/golden-acres/hero-farmer.jpg',
  },
  {
    name: 'Protein',
    slug: 'Protein',
    count: '60+ items',
    desc: 'Fresh meat, fish, chicken and more.',
    image: '/golden-acres/bundle-box.png',
    heroImage: '/golden-acres/bundle-box.png',
  },
  {
    name: 'Dairy & Eggs',
    slug: 'Dairy & Eggs',
    count: '45+ items',
    desc: 'Milk, cheese, eggs and other dairy products.',
    image: '/golden-acres/produce/avocado.png',
    heroImage: '/golden-acres/produce/avocado.png',
  },
  {
    name: 'Oils & Sauces',
    slug: 'Oils & Sauces',
    count: '35+ items',
    desc: 'Quality oils, sauces and cooking essentials.',
    image: '/golden-acres/produce/scotch-bonnet.png',
    heroImage: '/golden-acres/produce/scotch-bonnet.png',
  },
  {
    name: 'Herbs & Spices',
    slug: 'Herbs & Spices',
    count: '40+ items',
    desc: 'Aromatics and spices for flavourful cooking.',
    image: '/golden-acres/produce/scotch-bonnet.png',
    heroImage: '/golden-acres/produce/scotch-bonnet.png',
  },
]

export default function MobileCategoriesScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return CATEGORY_DEFINITIONS
    return CATEGORY_DEFINITIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* 1. Header with Back Arrow & Title */}
      <header
        className="sticky top-0 z-30 border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-extrabold text-[#2B1F17]">Categories</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2.5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
            className="h-10 w-full rounded-2xl border border-[#E0DACB] bg-white pl-9 pr-4 text-xs font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#0F7A43] focus:ring-2 focus:ring-[#0F7A43]/20"
          />
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0F7A43]" />
        </div>
      </header>

      {/* 2. 2-Column Category Grid */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/m/categories/${encodeURIComponent(cat.slug)}`}
              className="ga-press group flex flex-col overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-2.5 shadow-xs hover:border-[#0F7A43]/40 transition-all"
            >
              {/* Category Photo Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title & Count */}
              <div className="mt-2 px-1">
                <h2 className="text-xs font-extrabold text-[#2B1F17]">
                  {cat.name}
                </h2>
                <span className="text-[10px] font-semibold text-[#6E6A63]">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 3. Shop Local Banner CTA (Matching Screen 1 Mockup) */}
        <Link
          href="/m/local"
          className="ga-press flex items-center justify-between rounded-3xl bg-[#0F7A43] p-4 text-white shadow-xs hover:bg-[#0B3B25] transition-all"
        >
          <div>
            <h3 className="text-sm font-extrabold text-white">Shop Local</h3>
            <p className="mt-0.5 text-[11px] text-white/80">
              Support local farmers near KNUST, Kumasi
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0F7A43] shadow-sm">
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </div>
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  )
}
