'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductImageShell, PreviewBottomNav } from '@/app/preview/_lib/premium'

const CATEGORIES_DATA = [
  {
    id: 'vegetables',
    name: 'Vegetables & Leafy Greens',
    itemsCount: 14,
    leadImage: '/golden-acres/produce/roma-tomatoes-1.png',
    tags: ['Roma Tomatoes', 'Kontomire', 'Okra', 'Cabbage'],
    origin: 'Eastern & Greater Accra',
  },
  {
    id: 'fruits',
    name: 'Fresh Orchard Fruits',
    itemsCount: 8,
    leadImage: '/golden-acres/produce/sweet-pineapple-1.png',
    tags: ['Sugarloaf Pineapple', 'Mango', 'Papaya', 'Orange'],
    origin: 'Central & Volta Coast',
  },
  {
    id: 'tubers',
    name: 'Roots & Staple Tubers',
    itemsCount: 10,
    leadImage: '/golden-acres/produce/white-yam.png',
    tags: ['Pona White Yam', 'Ripe Plantain', 'Cassava', 'Cocoyam'],
    origin: 'Ashanti & Bono',
  },
  {
    id: 'spices',
    name: 'Herbs & Hot Spices',
    itemsCount: 9,
    leadImage: '/golden-acres/produce/scotch-bonnet.png',
    tags: ['Scotch Bonnet', 'Fresh Ginger', 'Garlic', 'Lemongrass'],
    origin: 'Volta Hills & Eastern',
  },
  {
    id: 'grains',
    name: 'Savannah Grains & Legumes',
    itemsCount: 7,
    leadImage: '/golden-acres/produce/aromatic-rice.png',
    tags: ['Aromatic Rice', 'Cowpeas', 'Millet', 'Groundnuts'],
    origin: 'Northern & Upper East',
  },
]

export default function MobileCategoriesScreen() {
  const [query, setQuery] = useState('')
  const [filterActive, setFilterActive] = useState('all')

  const filtered = CATEGORIES_DATA.filter((c) =>
    query
      ? c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      : true
  )

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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(200px,36vh,320px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative px-5 pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#211A12]">
            Categories
          </h1>
          <p className="text-[12px] font-bold text-[#5C5247]">
            Directly from 10 Ghanaian smallholder regions
          </p>
        </div>
        <Link
          href="/preview/home"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </header>

      {/* Search & Filter Bar */}
      <div className="relative mt-3 px-5">
        <div className="flex h-[48px] w-full items-center rounded-full bg-white px-4 shadow-2xs border border-[rgba(33,26,18,0.10)]">
          <Search className="h-4 w-4 text-[#5C5247] stroke-[2.3] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories, yam, peppers, grains..."
            className="w-full bg-transparent pl-2.5 text-[13px] font-medium text-[#211A12] placeholder:text-[#7A6E61] outline-none"
          />
        </div>
      </div>

      {/* Category Cards List */}
      <div className="relative mt-4 px-5 space-y-3.5">
        {filtered.map((cat) => (
          <Link
            key={cat.id}
            href={`/preview/home`}
            className="block active:scale-[0.985] transition-transform"
          >
            <div className="flex items-center justify-between overflow-hidden rounded-[28px] bg-[#FAF9F6] p-4 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
              <div className="flex items-center gap-3.5 flex-1 pr-2">
                <ProductImageShell
                  src={cat.leadImage}
                  alt={cat.name}
                  className="h-16 w-16"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-extrabold text-[#211A12]">
                      {cat.name}
                    </h3>
                    <span className="rounded-full bg-[#0B3B25]/10 px-2 py-0.5 text-[10px] font-black text-[#0B3B25]">
                      {cat.itemsCount} items
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-bold text-[#7A3F1C]">
                    Hub Origins: {cat.origin}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {cat.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white/80 px-1.5 py-0.5 text-[9.5px] font-semibold text-[#5C5247] border border-[rgba(33,26,18,0.06)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#5C5247] shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <PreviewBottomNav active="home" />
    </div>
  )
}
