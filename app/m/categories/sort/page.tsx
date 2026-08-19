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
    <div className="relative min-h-dvh bg-[#F7F5F0] p-3 text-[#211A12] flex flex-col justify-between select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <header className="flex items-center gap-2.5 pb-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-[16px] font-black text-[#211A12]">Sort by</h1>
        </header>

        {/* Sort Options List */}
        <div className="mt-2.5 rounded-[24px] bg-[#FDFDFB] p-2 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] divide-y divide-[rgba(33,26,18,0.06)]">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedSort(opt.key)}
              className="flex w-full items-center justify-between p-3 text-[12.5px] font-extrabold text-[#211A12] active:scale-[0.99] transition-transform"
            >
              <span>{opt.label}</span>
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border transition-all',
                  selectedSort === opt.key
                    ? 'border-[#0B3B25] bg-[#0B3B25] text-white'
                    : 'border-[rgba(33,26,18,0.15)] bg-white'
                )}
              >
                {selectedSort === opt.key && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="relative pt-4">
        <button
          type="button"
          onClick={handleApply}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Apply Sort
        </button>
      </div>
    </div>
  )
}
