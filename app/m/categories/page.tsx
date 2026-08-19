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
  },
  {
    name: 'Fruits',
    slug: 'Fruits',
    count: '50+ items',
    desc: 'Farm fresh fruits. In season and full of goodness.',
    image: '/golden-acres/produce/sweet-pineapple-1.png',
  },
  {
    name: 'Vegetables',
    slug: 'Vegetables',
    count: '150+ items',
    desc: 'Green, leafy and delicious vegetables for every meal.',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
  },
  {
    name: 'Roots & Tubers',
    slug: 'Roots & Tubers',
    count: '45+ items',
    desc: 'Pona yam, cassava, sweet potatoes.',
    image: '/golden-acres/produce/white-yam.png',
  },
  {
    name: 'Herbs & Spices',
    slug: 'Herbs & Spices',
    count: '40+ items',
    desc: 'Aromatics and spices for flavourful cooking.',
    image: '/golden-acres/produce/scotch-bonnet.png',
  },
  {
    name: 'Grains & Legumes',
    slug: 'Grains & Legumes',
    count: '35+ items',
    desc: 'Cowpea, millet, organic sorghum and beans.',
    image: '/golden-acres/produce/aromatic-rice.png',
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
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* 1. Header with Back Arrow & Title */}
      <header
        className="sticky top-0 z-30 border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[17px] font-extrabold text-[#211A12]">Categories</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce categories..."
            className="h-11 w-full rounded-full border border-[rgba(33,26,18,0.10)] bg-white pl-10 pr-4 text-[13px] font-semibold text-[#211A12] shadow-2xs outline-none focus:border-[#0B3B25]"
          />
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0B3B25] stroke-[2.4]" />
        </div>
      </header>

      {/* 2. 2-Column Category Grid */}
      <div className="relative px-5 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/m/categories/${encodeURIComponent(cat.slug)}`}
              className="group flex flex-col overflow-hidden rounded-[26px] bg-[#FAF9F6] p-3 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90 active:scale-[0.98] transition-transform"
            >
              {/* Category Photo Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-2xs border border-[rgba(33,26,18,0.08)]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title & Count */}
              <div className="mt-2.5 px-1">
                <h2 className="text-[13px] font-extrabold text-[#211A12]">
                  {cat.name}
                </h2>
                <span className="text-[11px] font-bold text-[#7A3F1C]">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 3. Shop Local Banner CTA */}
        <Link
          href="/m/farmers"
          className="flex items-center justify-between rounded-[28px] bg-[#0B3B25] p-5 text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80">
              Community Supported Agriculture
            </span>
            <h3 className="mt-0.5 text-[16px] font-black text-white">Meet Smallholder Growers</h3>
            <p className="mt-0.5 text-[12px] font-semibold text-white/80">
              Support 200+ local Ghanaian family farms
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0B3B25] shadow-sm">
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </div>
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  )
}

