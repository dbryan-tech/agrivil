'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Leaf,
  X,
  Filter,
  Check,
  ChevronDown,
} from 'lucide-react'
import { products, categories, getCategoryCount } from '@/lib/golden-acres/data'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { useCart } from '@/components/golden-acres/cart-context'
import type { ProduceCategory } from '@/lib/golden-acres/types'
import { cn } from '@/lib/utils'

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: 'All Produce', value: 'all' },
  { label: 'Staples', value: 'Roots & Tubers' },
  { label: 'Vegetables', value: 'Vegetables' },
  { label: 'Fruits', value: 'Fruits' },
  { label: 'Leafy Greens', value: 'Leafy Greens' },
  { label: 'Grains & Legumes', value: 'Grains & Legumes' },
  { label: 'Herbs & Spices', value: 'Herbs & Spices' },
  { label: 'Certified Organic', value: 'organic' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { count } = useCart()

  const initialCat = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [priceFilter, setPriceFilter] = useState<'all' | 'under10' | '10to25' | 'over25'>('all')
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(q)
        const matchesCat = p.category.toLowerCase().includes(q)
        const matchesTag = p.tags?.some((t) => t.toLowerCase().includes(q))
        if (!matchesName && !matchesCat && !matchesTag) return false
      }

      // Category
      if (selectedCategory === 'organic') {
        if (!p.organic) return false
      } else if (selectedCategory !== 'all') {
        if (p.category !== selectedCategory && selectedCategory !== 'Staples') return false
        if (selectedCategory === 'Staples' && p.category !== 'Roots & Tubers' && p.category !== 'Grains & Legumes') {
          return false
        }
      }

      // Organic filter toggle
      if (organicOnly && !p.organic) return false

      // Price filter
      const price = p.pricePerKg || p.priceMin
      if (priceFilter === 'under10' && price >= 10) return false
      if (priceFilter === '10to25' && (price < 10 || price > 25)) return false
      if (priceFilter === 'over25' && price <= 25) return false

      return true
    }).sort((a, b) => {
      const priceA = a.pricePerKg || a.priceMin
      const priceB = b.pricePerKg || b.priceMin
      if (sortBy === 'price-asc') return priceA - priceB
      if (sortBy === 'price-desc') return priceB - priceA
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8)
      return 0
    })
  }, [searchQuery, selectedCategory, organicOnly, priceFilter, sortBy])

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

      {/* Top warm radiant backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)] z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(223, 136, 33, 0.16) 0%, rgba(240, 168, 30, 0.06) 35%, rgba(247, 245, 240, 0.6) 75%, rgba(247, 245, 240, 1) 100%)',
        }}
      />

      {/* 1. Sticky Header with Search & Filter Trigger */}
      <header
        className="sticky top-0 z-30 border-b border-[rgba(33,26,18,0.06)] bg-[#FAF7F2]/95 px-2 py-2 backdrop-blur-md transition-all space-y-2"
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

          {/* Integrated Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5247]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tomatoes, yam, plantain..."
              className="w-full h-9 rounded-full bg-white pl-9 pr-8 text-[13px] font-semibold text-[#211A12] placeholder:text-[#8A7E72] shadow-2xs border border-[rgba(33,26,18,0.10)] focus:outline-none focus:border-[#0B3B25] focus:ring-1 focus:ring-[#0B3B25]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-[#211A12]/10 text-[#211A12]"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>

          {/* Filter Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            aria-label="Filters"
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-2xs border active:scale-95 transition-transform',
              organicOnly || priceFilter !== 'all' || sortBy !== 'featured'
                ? 'bg-[#0B3B25] text-white border-[#0B3B25]'
                : 'bg-white text-[#211A12] border-[rgba(33,26,18,0.10)]'
            )}
          >
            <SlidersHorizontal className="h-4 w-4 stroke-[2.2]" />
          </button>

          {/* Basket Icon */}
          <Link
            href="/m/cart"
            aria-label="Basket"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-sm active:scale-95 transition-transform"
          >
            <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A3F1C] px-1 text-[9px] font-black text-white shadow-xs">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>

        {/* Horizontal Category Pill Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedCategory(tab.value)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-[11.5px] font-extrabold transition-all active:scale-95 shadow-2xs',
                  active
                    ? 'bg-[#0B3B25] text-white shadow-xs'
                    : 'bg-white text-[#5C5247] border border-[rgba(33,26,18,0.08)] hover:bg-[#FAF9F6]'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Produce Catalog Body */}
      <main className="relative z-10 px-1.5 pt-2 space-y-2">
        {/* Results Header Count & Sort Bar */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-black text-[#211A12]">
              {filteredProducts.length} Items Found
            </span>
            {selectedCategory !== 'all' && (
              <span className="rounded-full bg-[#DF8821]/15 px-2 py-0.5 text-[10px] font-bold text-[#7A3F1C]">
                {selectedCategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5C5247]">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-extrabold text-[#0B3B25] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* 2-Column Produce Card Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredProducts.map((product, idx) => (
              <MobileProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DF8821]/15 text-[#DF8821]">
              <Search className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-black text-[#211A12]">No harvest matches found</h3>
              <p className="text-[12px] font-medium text-[#5C5247] max-w-[240px]">
                Try adjusting your search terms or clearing your active filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setOrganicOnly(false)
                setPriceFilter('all')
              }}
              className="rounded-full bg-[#0B3B25] px-4 py-2 text-[12px] font-extrabold text-white shadow-xs active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Filter Sheet Modal */}
      {showFiltersDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-t-[28px] bg-white p-4 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#0B3B25]" />
                <h3 className="text-[16px] font-black text-[#211A12]">Filter & Refine</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFiltersDrawer(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#211A12]/5 text-[#211A12]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <span className="text-[12px] font-black uppercase tracking-wider text-[#5C5247]">
                Price Range (GH₵)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Under 10', value: 'under10' },
                  { label: '10 – 25', value: '10to25' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPriceFilter(item.value as any)}
                    className={cn(
                      'rounded-xl py-2 text-[12px] font-bold border transition-all',
                      priceFilter === item.value
                        ? 'bg-[#0B3B25] text-white border-[#0B3B25]'
                        : 'bg-[#FAF9F6] text-[#211A12] border-[rgba(33,26,18,0.10)]'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Organic Switch */}
            <div className="flex items-center justify-between rounded-2xl bg-[#FAF9F6] p-3 border border-[rgba(33,26,18,0.08)]">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-[#0B3B25]" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-extrabold text-[#211A12]">Certified Organic Only</span>
                  <span className="text-[10.5px] font-medium text-[#5C5247]">Pesticide-free smallholder harvest</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-[#0B3B25] focus:ring-[#0B3B25] accent-[#0B3B25]"
              />
            </div>

            {/* Apply Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPriceFilter('all')
                  setOrganicOnly(false)
                  setSortBy('featured')
                }}
                className="flex-1 rounded-full py-2.5 text-[12px] font-bold text-[#5C5247] border border-[rgba(33,26,18,0.12)] active:scale-95"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFiltersDrawer(false)}
                className="flex-[2] rounded-full bg-[#0B3B25] py-2.5 text-[12px] font-extrabold text-white shadow-sm active:scale-95"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Navigation Bar */}
      <MobileBottomNav activeTab="categories" />
    </div>
  )
}

export default function MobileShopScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#FAF9F6]" />}>
      <ShopContent />
    </Suspense>
  )
}
