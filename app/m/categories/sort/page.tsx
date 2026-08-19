'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileCategoriesSortScreen() {
  const router = useRouter()
  const [selectedSort, setSelectedSort] = useState('recommended')

  const sortOptions = [
    { key: 'recommended', label: 'Recommended (Default)' },
    { key: 'price-asc', label: 'Price: Low to High' },
    { key: 'price-desc', label: 'Price: High to Low' },
    { key: 'newest', label: 'Newest First' },
    { key: 'rating', label: 'Best Rated' },
    { key: 'popular', label: 'Popular' },
    { key: 'top-selling', label: 'Top Selling' },
  ]

  function handleApply() {
    router.back()
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="flex items-center gap-2.5 pb-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-extrabold text-[#2B1F17]">Sort by</h1>
        </header>

        {/* Sort Options List */}
        <div className="mt-3 rounded-3xl border border-[#E0DACB] bg-white p-2 shadow-xs divide-y divide-[#E0DACB]/60">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedSort(opt.key)}
              className="ga-press flex w-full items-center justify-between p-3.5 text-xs font-bold text-[#2B1F17]"
            >
              <span>{opt.label}</span>
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border transition-all',
                  selectedSort === opt.key
                    ? 'border-[#0F7A43] bg-[#0F7A43] text-white'
                    : 'border-[#E0DACB] bg-[#FAF7F0]'
                )}
              >
                {selectedSort === opt.key && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleApply}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          Apply Sort
        </button>
      </div>
    </div>
  )
}
