'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight, ArrowLeft, Sparkles, Filter, ChefHat, Repeat } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { products, recipes, bundles } from '@/lib/golden-acres/data'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

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

const ALL_FILTER_TABS = [
  'All',
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Staples',
  'Herbs & Spices',
  'Grains & Legumes',
]

function CategoriesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'

  const [search, setSearch] = useState('')
  const [activeCatalogTab, setActiveCatalogTab] = useState(initialCategory)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setActiveCatalogTab(cat)
    }
  }, [searchParams])

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return CATEGORY_DEFINITIONS
    return CATEGORY_DEFINITIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
    )
  }, [search])

  // Continuous All Products Catalog (mixed / filtered)
  const catalogProducts = useMemo(() => {
    if (activeCatalogTab === 'All') {
      return [...products].sort((a, b) => (a.id > b.id ? 1 : -1))
    }
    return products.filter((p) => {
      const cat = p.category?.toLowerCase() || ''
      const tab = activeCatalogTab.toLowerCase()
      return cat.includes(tab) || tab.includes(cat)
    })
  }, [activeCatalogTab])

  return (
    <div className="relative min-h-dvh w-full bg-[#FAF9F6] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* Top warm brand radiant gradient backdrop (Seamless Harvest Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(280px,48vh,400px)] z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(223, 136, 33, 0.20) 0%, rgba(240, 168, 30, 0.08) 35%, rgba(247, 245, 240, 0.6) 75%, rgba(247, 245, 240, 1) 100%)',
        }}
      />

      {/* 1. Header with Back Arrow & Title */}
      <header
        className="sticky top-0 z-30 border-b border-[rgba(33,26,18,0.06)] bg-[#FAF7F2]/95 px-2 py-2.5 backdrop-blur-md transition-colors"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
          paddingBottom: '10px',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[17px] font-black text-[#211A12]">Categories</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Explore fresh Ghanaian harvests</p>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (search.trim()) {
              router.push(`/m/shop?search=${encodeURIComponent(search.trim())}`)
            }
          }}
          className="relative mt-2.5"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce categories or items..."
            className="h-10 w-full rounded-full border border-[rgba(33,26,18,0.10)] bg-white pl-9 pr-3 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none focus:border-[#0B3B25]"
          />
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0B3B25] stroke-[2.4]" />
        </form>
      </header>

      <div className="relative px-1.5 pt-3 space-y-3">
        {/* 2. 2-Column Category Grid */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-[14.5px] font-black text-[#211A12]">
              Browse Categories
            </h2>
            <span className="text-[11px] font-bold text-[#7A3F1C]">
              {CATEGORY_DEFINITIONS.length} Departments
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/m/shop?category=${encodeURIComponent(cat.slug)}`}
                prefetch={true}
                className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_10px_-2px_rgba(33,26,18,0.04),0_4px_14px_-4px_rgba(33,26,18,0.06)] active:scale-[0.985] transition-transform"
              >
                <div className="relative aspect-[1.28/1] w-full overflow-hidden bg-white">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 190px, 240px"
                    className="object-cover object-center scale-[1.08] transition-transform duration-500 group-hover:scale-115"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col justify-center p-2.5 bg-[#FAF9F6]">
                  <h3 className="truncate text-[13px] font-black text-[#211A12] group-hover:text-[#0B3B25] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10.5px] font-extrabold text-[#7A3F1C]">
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Cross-Discovery Cards: Recipes & Bundles with Rich Photography */}
        <div className="grid grid-cols-2 gap-1.5">
          <Link
            href="/m/recipes"
            prefetch={true}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] min-h-[145px] p-3 text-white shadow-sm active:scale-[0.98] transition-transform"
          >
            {/* Real Kitchen/Recipe Photographic Backdrop */}
            <Image
              src="/golden-acres/recipes/ghana-jollof.png"
              alt="Cook and Shop Recipes"
              fill
              sizes="(max-width: 640px) 190px, 240px"
              className="object-cover scale-110 transition-transform duration-700 group-hover:scale-120"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/35" />

            <div className="relative z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DF8821] text-[#211A12] shadow-xs">
                <ChefHat className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <h3 className="mt-2 text-[14px] font-black text-white leading-tight">Cook &amp; Shop</h3>
              <p className="mt-0.5 text-[10.5px] font-semibold text-white/90 line-clamp-2">
                Authentic recipes with 1-tap ingredients
              </p>
            </div>
            <div className="relative z-10 mt-2 flex items-center gap-1 text-[10.5px] font-extrabold text-[#F0A81E]">
              <span>View Recipes</span>
              <ArrowRight className="h-3 w-3 stroke-[2.5]" />
            </div>
          </Link>

          <Link
            href="/m/bundles"
            prefetch={true}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] min-h-[145px] p-3 text-white shadow-sm active:scale-[0.98] transition-transform"
          >
            {/* Real Weekly Harvest Box Photographic Backdrop */}
            <Image
              src="/golden-acres/bundle-box.png"
              alt="Weekly Harvest Boxes"
              fill
              sizes="(max-width: 640px) 190px, 240px"
              className="object-cover scale-110 transition-transform duration-700 group-hover:scale-120"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/35" />

            <div className="relative z-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-xs">
                <Repeat className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <h3 className="mt-2 text-[14px] font-black text-white leading-tight">Weekly Boxes</h3>
              <p className="mt-0.5 text-[10.5px] font-semibold text-white/90 line-clamp-2">
                Curated farm boxes delivered to your door
              </p>
            </div>
            <div className="relative z-10 mt-2 flex items-center gap-1 text-[10.5px] font-extrabold text-[#F0A81E]">
              <span>Explore Boxes</span>
              <ArrowRight className="h-3 w-3 stroke-[2.5]" />
            </div>
          </Link>
        </div>

        {/* 4. Shop Local Banner CTA */}
        <Link
          href="/m/farmers"
          prefetch={true}
          className="flex items-center justify-between rounded-[22px] bg-white p-3.5 text-[#211A12] border border-[rgba(33,26,18,0.08)] shadow-2xs active:scale-[0.98] transition-transform"
        >
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#7A3F1C]">
              Community Supported Agriculture
            </span>
            <h3 className="mt-0.5 text-[14.5px] font-black text-[#211A12]">Meet Smallholder Growers</h3>
            <p className="mt-0.5 text-[11px] font-medium text-[#5C5247]">
              Support 200+ local Ghanaian family farms
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-sm">
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </div>
        </Link>

        {/* ========================================================
            5. CONTINUING ALL-PRODUCTS SECTION (Sliding filter + Grid)
           ======================================================== */}
        <div className="pt-2">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-[15px] font-black text-[#211A12]">
                Explore All Produce
              </h2>
              <p className="text-[11px] font-semibold text-[#5C5247]">
                Continuous harvest catalog across Ghana
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#7A3F1C]">
              {catalogProducts.length} items
            </span>
          </div>

          {/* Sliding Category Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {ALL_FILTER_TABS.map((tab) => {
              const isActive = activeCatalogTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCatalogTab(tab)}
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11.5px] font-black shadow-2xs transition-all active:scale-95',
                    isActive
                      ? 'bg-[#0B3B25] text-white shadow-xs'
                      : 'bg-white text-[#211A12] border border-[rgba(33,26,18,0.08)] hover:border-[#0B3B25]'
                  )}
                >
                  <span>{tab}</span>
                </button>
              )
            })}
          </div>

          {/* 2-Column Continuous Grid */}
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {catalogProducts.map((prod) => (
              <MobileProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default function MobileCategoriesScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#FAF9F6]" />}>
      <CategoriesContent />
    </Suspense>
  )
}

