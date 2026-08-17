'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Check,
  MapPin,
  X,
} from 'lucide-react'
import { products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

export default function MobileCategoryDetailScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || 'All'
  const categoryName = decodeURIComponent(rawSlug)
  const { add } = useCart()

  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default')
  const [organicOnly, setOrganicOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)

  let items = products.filter(
    (p) =>
      p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(p.category.toLowerCase()) ||
      categoryName.toLowerCase() === 'all'
  )

  if (organicOnly) items = items.filter((p) => p.organic)
  if (inStockOnly) items = items.filter((p) => p.inStock)

  if (sortBy === 'price-asc') items.sort((a, b) => a.priceMin - b.priceMin)
  if (sortBy === 'price-desc') items.sort((a, b) => b.priceMin - a.priceMin)
  if (sortBy === 'rating') items.sort((a, b) => (b.rating || 5) - (a.rating || 5))

  function handleQuickAdd(e: React.MouseEvent, product: (typeof products)[0]) {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar
        title={categoryName}
        subtitle={`${items.length} fresh items`}
        showBack
        showSearch
        showCart
      />

      {/* Filter and Sort Action Bar */}
      <div className="sticky top-14 z-20 flex items-center gap-2 border-b border-[#E0DACB] bg-[#F4F1EA] px-4 py-2.5">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={cn(
            'ga-press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-xs',
            organicOnly || inStockOnly
              ? 'border-[#1E5D3B] bg-[#1E5D3B] text-white'
              : 'border-[#E0DACB] bg-white text-[#2B1F17]'
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          {(organicOnly || inStockOnly) && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1E5D3B]">
              {(organicOnly ? 1 : 0) + (inStockOnly ? 1 : 0)}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="ga-press h-8 rounded-full border border-[#E0DACB] bg-white px-3 text-xs font-bold text-[#2B1F17] shadow-xs outline-none"
        >
          <option value="default">Sort: Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="px-4 pt-4">
        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-[#2B1F17]">No items found in this category.</p>
            <p className="mt-1 text-xs text-[#6E6A63]">Try adjusting your filters or search terms.</p>
            <button
              type="button"
              onClick={() => {
                setOrganicOnly(false)
                setInStockOnly(false)
                setSortBy('default')
              }}
              className="mt-4 rounded-xl bg-[#1E5D3B] px-4 py-2 text-xs font-bold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((product) => {
              const isAdded = addedId === product.id
              return (
                <Link
                  key={product.id}
                  href={`/m/product/${product.slug}`}
                  className="ga-press group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs hover:border-[#1E5D3B]/40"
                >
                  <div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 150px, 200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.organic && (
                        <span className="absolute top-2 left-2 rounded-md bg-[#1E5D3B] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Organic
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5">
                      <h3 className="truncate text-xs font-extrabold text-[#2B1F17]">
                        {product.name}
                      </h3>
                      <p className="truncate text-[10px] font-medium text-[#6E6A63]">
                        {product.farmerName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-[#1E5D3B]">
                        {formatGHS(product.priceMin)}
                      </span>
                      <span className="text-[9px] font-semibold text-[#6E6A63]">
                        / {product.variableWeight ? 'kg (est)' : product.unit}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={cn(
                        'ga-press flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs transition-colors',
                        isAdded ? 'bg-[#A3E635] text-[#144028]' : 'bg-[#1E5D3B] hover:bg-[#144028]'
                      )}
                      aria-label={`Add ${product.name} to basket`}
                    >
                      {isAdded ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#E0DACB] pb-3">
              <h3 className="text-base font-extrabold text-[#2B1F17]">Filter Produce</h3>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="rounded-full p-1 text-[#6E6A63] hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2B1F17]">100% Organic Certified</span>
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="h-5 w-5 rounded-md accent-[#1E5D3B]"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2B1F17]">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-5 w-5 rounded-md accent-[#1E5D3B]"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrganicOnly(false)
                  setInStockOnly(false)
                  setFilterOpen(false)
                }}
                className="flex-1 rounded-2xl border border-[#E0DACB] py-3 text-xs font-bold text-[#6E6A63]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex-1 rounded-2xl bg-[#1E5D3B] py-3 text-xs font-bold text-white shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}
