'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  ShoppingBag,
  SlidersHorizontal,
  Plus,
  Check,
  X,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react'
import { products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { ProductImageShell } from '@/app/preview/_lib/premium'
import { cn } from '@/lib/utils'

interface CategoryMeta {
  title: string
  subtitle: string
  count: string
  bannerImage: string
  canonicalItems: Array<{
    name: string
    priceText: string
    priceNum: number
    image: string
    unit: string
    farmerName: string
    organic?: boolean
  }>
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  staples: {
    title: 'Staples',
    subtitle: 'Daily essentials from local farms and trusted suppliers.',
    count: '120+ items',
    bannerImage: '/golden-acres/hero-horizontal.png',
    canonicalItems: [
      { name: 'Rice (Local)', priceText: 'From GH₵12.00 / kg', priceNum: 12, image: '/golden-acres/produce/aromatic-rice.png', unit: 'kg', farmerName: 'Adzaho Brothers Rice' },
      { name: 'Yam', priceText: 'From GH₵10.00 / tuber', priceNum: 10, image: '/golden-acres/produce/white-yam.png', unit: 'tuber', farmerName: 'Kwame Mensah' },
      { name: 'Plantain', priceText: 'From GH₵8.00 / bunch', priceNum: 8, image: '/golden-acres/produce/ripe-plantain.png', unit: 'bunch', farmerName: 'Kwame Mensah' },
      { name: 'Groundnut (Shelled)', priceText: 'GH₵23.00 / kg', priceNum: 23, image: '/golden-acres/produce/aromatic-rice.png', unit: 'kg', farmerName: 'Hawa Azumah' },
      { name: 'Maize', priceText: 'From GH₵9.00 / kg', priceNum: 9, image: '/golden-acres/produce/aromatic-rice.png', unit: 'kg', farmerName: 'Mahama Sulemana' },
    ],
  },
  fruits: {
    title: 'Fruits',
    subtitle: 'Farm fresh fruits. In season and full of goodness.',
    count: '50+ items',
    bannerImage: '/golden-acres/produce/sweet-pineapple-1.png',
    canonicalItems: [
      { name: 'Pineapple', priceText: 'GH₵25.00 / piece', priceNum: 25, image: '/golden-acres/produce/sweet-pineapple-1.png', unit: 'piece', farmerName: 'Kojo Asante' },
      { name: 'Mango', priceText: 'GH₵20.00 / kg', priceNum: 20, image: '/golden-acres/produce/sweet-orange.png', unit: 'kg', farmerName: 'Kojo Asante' },
      { name: 'Watermelon', priceText: 'GH₵10.00 / kg', priceNum: 10, image: '/golden-acres/produce/sweet-pineapple-1.png', unit: 'kg', farmerName: 'Kojo Asante' },
      { name: 'Banana', priceText: 'GH₵10.00 / bunch', priceNum: 10, image: '/golden-acres/produce/ripe-plantain.png', unit: 'bunch', farmerName: 'Kwame Mensah' },
      { name: 'Orange', priceText: 'GH₵17.00 / kg', priceNum: 17, image: '/golden-acres/produce/sweet-orange.png', unit: 'kg', farmerName: 'Kojo Asante' },
    ],
  },
  vegetables: {
    title: 'Vegetables',
    subtitle: 'Green, leafy and delicious vegetables for every meal.',
    count: '150+ items',
    bannerImage: '/golden-acres/hero-farmer.jpg',
    canonicalItems: [
      { name: 'Garden Eggs', priceText: 'GH₵10.00 / kg', priceNum: 10, image: '/golden-acres/produce/garden-eggs.png', unit: 'kg', farmerName: "Ama's Garden" },
      { name: 'Tomatoes', priceText: 'GH₵12.00 / kg', priceNum: 12, image: '/golden-acres/produce/roma-tomatoes-1.png', unit: 'kg', farmerName: "Ama's Garden" },
      { name: 'Spinach', priceText: 'GH₵8.00 / bunch', priceNum: 8, image: '/golden-acres/produce/kontomire.png', unit: 'bunch', farmerName: 'Green Leaf Collective' },
      { name: 'Carrots', priceText: 'GH₵15.00 / kg', priceNum: 15, image: '/golden-acres/produce/roma-tomatoes.png', unit: 'kg', farmerName: 'Sunrise Fields' },
      { name: 'Cabbage', priceText: 'GH₵12.00 / head', priceNum: 12, image: '/golden-acres/produce/green-cabbage.png', unit: 'head', farmerName: 'Green Leaf Collective' },
    ],
  },
  protein: {
    title: 'Protein',
    subtitle: 'Fresh meat, fish, chicken and more.',
    count: '60+ items',
    bannerImage: '/golden-acres/bundle-box.png',
    canonicalItems: [
      { name: 'Chicken (Local)', priceText: 'GH₵30.00 / kg', priceNum: 30, image: '/golden-acres/bundle-box.png', unit: 'kg', farmerName: 'Sunrise Livestock' },
      { name: 'Beef', priceText: 'GH₵50.00 / kg', priceNum: 50, image: '/golden-acres/bundle-box.png', unit: 'kg', farmerName: 'Savannah Ranches' },
      { name: 'Tilapia', priceText: 'GH₵35.00 / kg', priceNum: 35, image: '/golden-acres/bundle-box.png', unit: 'kg', farmerName: 'Volta Lake Fisheries' },
      { name: 'Goat Meat', priceText: 'GH₵55.00 / kg', priceNum: 55, image: '/golden-acres/bundle-box.png', unit: 'kg', farmerName: 'Ashanti Pastures' },
      { name: 'Smoked Fish', priceText: 'GH₵25.00 / piece', priceNum: 25, image: '/golden-acres/bundle-box.png', unit: 'piece', farmerName: 'Tema Harbour Smoked' },
    ],
  },
  'dairy & eggs': {
    title: 'Dairy & Eggs',
    subtitle: 'Milk, cheese, eggs and other dairy products.',
    count: '45+ items',
    bannerImage: '/golden-acres/produce/avocado.png',
    canonicalItems: [
      { name: 'Eggs (30pcs)', priceText: 'GH₵25.00 / tray', priceNum: 25, image: '/golden-acres/produce/avocado.png', unit: 'tray', farmerName: 'Sunrise Farms' },
      { name: 'Fresh Milk (1L)', priceText: 'GH₵18.00 / bottle', priceNum: 18, image: '/golden-acres/produce/avocado.png', unit: 'bottle', farmerName: 'Amrahia Dairy' },
      { name: 'Yoghurt (500ml)', priceText: 'GH₵8.00 / cup', priceNum: 8, image: '/golden-acres/produce/avocado.png', unit: 'cup', farmerName: 'Amrahia Dairy' },
      { name: 'Cheese (Wagashi)', priceText: 'GH₵20.00 / pack', priceNum: 20, image: '/golden-acres/produce/avocado.png', unit: 'pack', farmerName: 'Fulani Artisan Cheese' },
      { name: 'Butter', priceText: 'GH₵15.00 / pack', priceNum: 15, image: '/golden-acres/produce/avocado.png', unit: 'pack', farmerName: 'Amrahia Dairy' },
    ],
  },
  'oils & sauces': {
    title: 'Oils & Sauces',
    subtitle: 'Quality oils, sauces and cooking essentials.',
    count: '35+ items',
    bannerImage: '/golden-acres/produce/scotch-bonnet.png',
    canonicalItems: [
      { name: 'Palm Oil (Zomi)', priceText: 'GH₵15.00 / L', priceNum: 15, image: '/golden-acres/produce/scotch-bonnet.png', unit: 'L', farmerName: 'Eastern Mills' },
      { name: 'Groundnut Oil', priceText: 'GH₵18.00 / L', priceNum: 18, image: '/golden-acres/produce/aromatic-rice.png', unit: 'L', farmerName: 'Bolga Press' },
      { name: 'Cooking Oil (Vegetable)', priceText: 'GH₵20.00 / L', priceNum: 20, image: '/golden-acres/produce/scotch-bonnet.png', unit: 'L', farmerName: 'Ghana Agro Press' },
      { name: 'Tomato Paste', priceText: 'GH₵5.00 / pack', priceNum: 5, image: '/golden-acres/produce/roma-tomatoes-1.png', unit: 'pack', farmerName: 'Techiman Cannery' },
      { name: 'Pepper Sauce (Shito)', priceText: 'GH₵12.00 / bottle', priceNum: 12, image: '/golden-acres/produce/scotch-bonnet.png', unit: 'bottle', farmerName: 'Auntie Ama Artisans' },
    ],
  },
  'herbs & spices': {
    title: 'Herbs & Spices',
    subtitle: 'Aromatics and spices for flavourful cooking.',
    count: '40+ items',
    bannerImage: '/golden-acres/produce/scotch-bonnet.png',
    canonicalItems: [
      { name: 'Ginger', priceText: 'GH₵15.00 / kg', priceNum: 15, image: '/golden-acres/produce/scotch-bonnet.png', unit: 'kg', farmerName: 'Kojo Asante' },
      { name: 'Garlic', priceText: 'GH₵18.00 / kg', priceNum: 18, image: '/golden-acres/produce/scotch-bonnet.png', unit: 'kg', farmerName: 'Sunrise Fields' },
      { name: 'Pepper', priceText: 'GH₵10.00 / 100g', priceNum: 10, image: '/golden-acres/produce/scotch-bonnet.png', unit: '100g', farmerName: "Ama's Garden" },
      { name: 'Rosemary', priceText: 'GH₵8.00 / bunch', priceNum: 8, image: '/golden-acres/produce/kontomire.png', unit: 'bunch', farmerName: 'Green Leaf Collective' },
      { name: 'Thyme', priceText: 'GH₵6.00 / bunch', priceNum: 6, image: '/golden-acres/produce/kontomire.png', unit: 'bunch', farmerName: 'Green Leaf Collective' },
    ],
  },
}

export default function MobileCategoryDetailScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || 'Vegetables'
  const categoryKey = decodeURIComponent(rawSlug).toLowerCase()
  const { add, count } = useCart()

  const [addedItem, setAddedItem] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Filter States (Screen 9)
  const [selectedCatFilter, setSelectedCatFilter] = useState('All')
  const [priceRange, setPriceRange] = useState(100)
  const [farmType, setFarmType] = useState<'all' | 'organic' | 'conventional'>('all')
  const [inStockOnly, setInStockOnly] = useState(true)
  const [localFarmersOnly, setLocalFarmersOnly] = useState(true)

  // Sort State (Screen 10)
  const [sortOption, setSortOption] = useState('Recommended')

  const meta = CATEGORY_MAP[categoryKey] || {
    title: decodeURIComponent(rawSlug),
    subtitle: 'Fresh farm harvest delivered directly to your door.',
    count: '30+ items',
    bannerImage: '/golden-acres/hero-farmer.jpg',
    canonicalItems: [],
  }

  function handleQuickAdd(item: CategoryMeta['canonicalItems'][0]) {
    // Find or create synthetic product representation for cart
    const validCategory = (['Vegetables', 'Fruits', 'Roots & Tubers', 'Grains & Legumes', 'Herbs & Spices', 'Leafy Greens'].includes(meta.title)
      ? meta.title
      : 'Vegetables') as import('@/lib/golden-acres/types').ProduceCategory

    const validUnit = (['kg', 'bunch', 'each', 'crate', 'basket'].includes(item.unit)
      ? item.unit
      : 'each') as import('@/lib/golden-acres/types').ProductUnit

    const prod = products.find((p) => p.name.toLowerCase().includes(item.name.toLowerCase())) || {
      id: `cat-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      name: item.name,
      category: validCategory,
      farmerId: 'f1',
      farmerName: item.farmerName,
      image: item.image,
      unit: validUnit,
      variableWeight: false,
      pricePerKg: 0,
      priceMin: item.priceNum,
      priceMax: item.priceNum,
      refrigerationRequired: false,
      shelfLifeDays: 7,
      expiryDate: '',
      stockKg: 100,
      lowStockThreshold: 10,
      status: 'in-stock' as const,
      organic: !!item.organic,
      season: 'Year-round',
      tags: [],
      description: item.name,
      estWeightKg: 1,
    }
    add(prod, 1)
    setAddedItem(item.name)
    setTimeout(() => setAddedItem(null), 1200)
  }

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* 1. Header Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-3 py-2.5 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-[16px] font-black text-[#211A12]">{meta.title}</h1>
        </div>

        <Link
          href="/m/cart"
          aria-label="Basket"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-sm active:scale-95 transition-transform"
        >
          <ShoppingBag className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A3F1C] px-1 text-[9px] font-black text-white shadow-xs">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>
      </header>

      {/* 2. Category Hero Image Banner */}
      <div className="relative px-3 pt-2.5">
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[24px] bg-[#211A12] shadow-[0_4px_16px_-4px_rgba(33,26,18,0.08)]">
          <Image
            src={meta.bannerImage}
            alt={meta.title}
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
              <Sparkles className="h-2.5 w-2.5" /> Farm Fresh
            </span>
            <h2 className="mt-1 text-[18px] font-black tracking-tight text-white sm:text-xl">
              {meta.title}
            </h2>
          </div>
        </div>
      </div>

      {/* 3. Subtitle & Filter Trigger Bar */}
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-[13.5px] font-extrabold text-[#211A12]">{meta.title}</h3>
            <p className="mt-0.5 text-[11px] font-medium text-[#5C5247]">{meta.subtitle}</p>
            <span className="mt-0.5 inline-block text-[10.5px] font-extrabold text-[#0B3B25]">
              {meta.count}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSortOpen(true)}
              className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-extrabold text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.08)]"
            >
              <span>Sort</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-extrabold text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.08)] hover:border-[#0B3B25]"
            >
              <SlidersHorizontal className="h-3 w-3 text-[#0B3B25]" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Product List with Dynamic ProductImageShell */}
      <div className="px-3 space-y-2">
        {meta.canonicalItems.map((item) => {
          const isAdded = addedItem === item.name
          return (
            <div
              key={item.name}
              className="flex items-center justify-between overflow-hidden rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <ProductImageShell
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-xl"
                />
                <div className="flex flex-col">
                  <h4 className="text-[13px] font-extrabold text-[#211A12]">
                    {item.name}
                  </h4>
                  <span className="text-[12px] font-black text-[#0B3B25]">
                    {item.priceText}
                  </span>
                  <span className="text-[10px] font-semibold text-[#5C5247]">
                    {item.farmerName}
                  </span>
                </div>
              </div>

              {/* Circular Quick Add (+) Button */}
              <button
                type="button"
                onClick={() => handleQuickAdd(item)}
                aria-label={`Add ${item.name}`}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-xs transition-all active:scale-90',
                  isAdded ? 'bg-[#0B3B25]/20 text-[#0B3B25]' : 'bg-[#0B3B25] text-white hover:bg-[#072618]'
                )}
              >
                {isAdded ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* 5. Screen 9: Search & Filter Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E0DACB] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#2B1F17]">Filters</h3>
                <span className="text-xs text-[#6E6A63]">({meta.title})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCatFilter('All')
                  setPriceRange(100)
                  setFarmType('all')
                  setInStockOnly(true)
                  setLocalFarmersOnly(true)
                }}
                className="text-xs font-bold text-[#7A3F1C] hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Category selector chips */}
              <div>
                <span className="font-extrabold text-[#2B1F17]">Category</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['All', 'Fruits', 'Vegetables', 'Staples', 'Protein'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCatFilter(cat)}
                      className={cn(
                        'ga-press rounded-full px-3 py-1 text-xs font-bold border',
                        selectedCatFilter === cat
                          ? 'border-[#0F7A43] bg-[#0F7A43] text-white'
                          : 'border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-2">
                <div className="flex justify-between font-bold text-[#2B1F17]">
                  <span>Price range (GH₵)</span>
                  <span className="text-[#0F7A43] font-extrabold">GH₵00 — GH₵{priceRange}+</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="mt-2 w-full accent-[#0F7A43]"
                />
              </div>

              {/* Farm Type */}
              <div className="pt-2">
                <span className="font-extrabold text-[#2B1F17]">Farm type</span>
                <div className="mt-2 flex gap-2">
                  {(['all', 'organic', 'conventional'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFarmType(type)}
                      className={cn(
                        'ga-press flex-1 rounded-2xl py-2 text-xs font-bold capitalize border',
                        farmType === type
                          ? 'border-[#0F7A43] bg-[#0F7A43] text-white'
                          : 'border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between">
                  <span className="font-bold text-[#2B1F17]">In stock only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-[#0F7A43]"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="font-bold text-[#2B1F17]">Local farmers only</span>
                  <input
                    type="checkbox"
                    checked={localFarmersOnly}
                    onChange={(e) => setLocalFarmersOnly(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-[#0F7A43]"
                  />
                </label>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
              >
                View {meta.canonicalItems.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Screen 10: Sort Options Modal */}
      {sortOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#E0DACB] pb-3">
              <h3 className="text-base font-extrabold text-[#2B1F17]">Sort by</h3>
              <button
                type="button"
                onClick={() => setSortOpen(false)}
                className="rounded-full p-1 text-[#6E6A63] hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'Recommended', isDefault: true },
                { label: 'Price: Low to High' },
                { label: 'Price: High to Low' },
                { label: 'Newest First' },
                { label: 'Best Rated' },
                { label: 'Popular' },
                { label: 'Top Selling' },
              ].map((opt) => {
                const isSelected = sortOption === opt.label
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSortOption(opt.label)}
                    className="flex w-full items-center justify-between py-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full border-2',
                          isSelected ? 'border-[#0F7A43] bg-[#0F7A43]' : 'border-[#E0DACB] bg-white'
                        )}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <span className={cn('text-xs font-bold', isSelected ? 'text-[#0F7A43]' : 'text-[#2B1F17]')}>
                        {opt.label}
                      </span>
                    </div>

                    {opt.isDefault && (
                      <span className="rounded-full bg-[#0F7A43]/10 px-2 py-0.5 text-[9px] font-bold text-[#0F7A43]">
                        Default
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setSortOpen(false)}
                className="ga-press flex h-12 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-md hover:bg-[#0B3B25]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}
