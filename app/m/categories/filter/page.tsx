'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'

export default function MobileCategoriesFilterScreen() {
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState(100)
  const [farmType, setFarmType] = useState<'All' | 'Organic' | 'Conventional'>('All')
  const [inStockOnly, setInStockOnly] = useState(true)
  const [localFarmersOnly, setLocalFarmersOnly] = useState(true)

  function handleReset() {
    setSelectedCategory('All')
    setMaxPrice(100)
    setFarmType('All')
    setInStockOnly(true)
    setLocalFarmersOnly(false)
  }

  function handleApply() {
    router.back()
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Filter Products</h1>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </header>

        {/* 1. Category Selector */}
        <div className="mt-3 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Category
          </h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {['All', 'Staples', 'Fruits', 'Vegetables', 'Protein', 'Dairy & Eggs', 'Oils & Sauces', 'Herbs & Spices'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'ga-press rounded-full px-3 py-1 text-xs font-bold transition-all',
                  selectedCategory === cat
                    ? 'bg-[#0F7A43] text-white shadow-xs'
                    : 'border border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Price Range Slider */}
        <div className="mt-3 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Price Range
            </h2>
            <span className="text-xs font-extrabold text-[#0F7A43]">
              GH₵0.00 — {formatGHS(maxPrice)}
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-3 w-full accent-[#0F7A43]"
          />

          <div className="flex justify-between text-[10px] font-bold text-[#6E6A63] mt-1">
            <span>GH₵10.00</span>
            <span>GH₵200.00+</span>
          </div>
        </div>

        {/* 3. Farm Type */}
        <div className="mt-3 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Farm Type
          </h2>
          <div className="mt-2.5 flex gap-2">
            {(['All', 'Organic', 'Conventional'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFarmType(type)}
                className={cn(
                  'ga-press flex-1 rounded-2xl py-2 text-xs font-bold transition-all',
                  farmType === type
                    ? 'bg-[#0F7A43] text-white shadow-xs'
                    : 'border border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Toggles */}
        <div className="mt-3 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#2B1F17]">In Stock Only</span>
              <p className="text-[10px] text-[#6E6A63]">Hide items that are harvested out</p>
            </div>
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={cn(
                'h-6 w-11 rounded-full p-0.5 transition-colors',
                inStockOnly ? 'bg-[#0F7A43]' : 'bg-[#E0DACB]'
              )}
            >
              <div
                className={cn(
                  'h-5 w-5 rounded-full bg-white transition-transform',
                  inStockOnly ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[#E0DACB]/60 pt-3">
            <div>
              <span className="text-xs font-extrabold text-[#2B1F17]">Local Farmers Only (&lt; 10km)</span>
              <p className="text-[10px] text-[#6E6A63]">Prioritize direct same-day harvest</p>
            </div>
            <button
              type="button"
              onClick={() => setLocalFarmersOnly(!localFarmersOnly)}
              className={cn(
                'h-6 w-11 rounded-full p-0.5 transition-colors',
                localFarmersOnly ? 'bg-[#0F7A43]' : 'bg-[#E0DACB]'
              )}
            >
              <div
                className={cn(
                  'h-5 w-5 rounded-full bg-white transition-transform',
                  localFarmersOnly ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleApply}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          View Results (48)
        </button>
      </div>
    </div>
  )
}
