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
    <div className="relative min-h-dvh bg-[#F7F5F0] p-3 text-[#211A12] flex flex-col justify-between select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      <div className="relative space-y-2.5">
        {/* Header */}
        <header className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[16px] font-black text-[#211A12]">Filter Products</h1>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </header>

        {/* 1. Category Selector */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Category
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['All', 'Staples', 'Fruits', 'Vegetables', 'Protein', 'Dairy & Eggs', 'Oils & Sauces', 'Herbs & Spices'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'rounded-full px-3 py-1 text-[11.5px] font-extrabold transition-all active:scale-95 shadow-2xs',
                  selectedCategory === cat
                    ? 'bg-[#0B3B25] text-white'
                    : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Price Range Slider */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Price Range
            </h2>
            <span className="text-[12px] font-black text-[#0B3B25]">
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
            className="mt-2.5 w-full accent-[#0B3B25]"
          />

          <div className="flex justify-between text-[10px] font-bold text-[#5C5247] mt-1">
            <span>GH₵10.00</span>
            <span>GH₵200.00+</span>
          </div>
        </div>

        {/* 3. Farm Type */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Farm Type
          </h2>
          <div className="mt-2 flex gap-1.5">
            {(['All', 'Organic', 'Conventional'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFarmType(type)}
                className={cn(
                  'flex-1 rounded-full py-1.5 text-[11.5px] font-extrabold transition-all active:scale-95 shadow-2xs',
                  farmType === type
                    ? 'bg-[#0B3B25] text-white'
                    : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Toggles */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[12.5px] font-extrabold text-[#211A12]">In Stock Only</span>
              <p className="text-[10px] font-medium text-[#5C5247]">Hide items that are harvested out</p>
            </div>
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={cn(
                'h-5.5 w-10 rounded-full p-0.5 transition-colors',
                inStockOnly ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.15)]'
              )}
            >
              <div
                className={cn(
                  'h-4.5 w-4.5 rounded-full bg-white transition-transform',
                  inStockOnly ? 'translate-x-4.5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-2.5">
            <div>
              <span className="text-[12.5px] font-extrabold text-[#211A12]">Local Farmers Only (&lt; 10km)</span>
              <p className="text-[10px] font-medium text-[#5C5247]">Prioritize direct same-day harvest</p>
            </div>
            <button
              type="button"
              onClick={() => setLocalFarmersOnly(!localFarmersOnly)}
              className={cn(
                'h-5.5 w-10 rounded-full p-0.5 transition-colors',
                localFarmersOnly ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.15)]'
              )}
            >
              <div
                className={cn(
                  'h-4.5 w-4.5 rounded-full bg-white transition-transform',
                  localFarmersOnly ? 'translate-x-4.5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative pt-4">
        <button
          type="button"
          onClick={handleApply}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          View Results (48)
        </button>
      </div>
    </div>
  )
}
