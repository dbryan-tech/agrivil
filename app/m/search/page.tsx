'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowLeft, X, TrendingUp } from 'lucide-react'
import { products } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'

const POPULAR_SEARCHES = ['Tomatoes', 'Plantain', 'White Yam', 'Scotch Bonnet', 'Garden Eggs', 'Adwoa Farms']

export default function MobileSearchScreen() {
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(['Tomatoes', 'Rice', 'Eggs'])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.farmerName?.toLowerCase().includes(q)
    )
  }, [query])

  function handleSelectTag(tag: string) {
    setQuery(tag)
    if (!recent.includes(tag)) {
      setRecent([tag, ...recent.slice(0, 4)])
    }
  }

  function removeRecent(tag: string) {
    setRecent(recent.filter((r) => r !== tag))
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Search Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <Link
          href="/m"
          aria-label="Back"
          className="ga-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, farmers, recipes..."
            autoFocus
            className="h-10 w-full rounded-2xl border border-[#E0DACB] bg-white pl-9 pr-8 text-xs font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#0F7A43] focus:ring-2 focus:ring-[#0F7A43]/20"
          />
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0F7A43]" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-[#6E6A63] hover:bg-black/5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Query Content */}
      <div className="px-3 sm:px-4 pt-3.5">
        {query.trim().length === 0 ? (
          <div className="space-y-5">
            {/* Recent Searches */}
            {recent.length > 0 && (
              <div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
                  Recent Searches
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <div
                      key={term}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E0DACB] bg-white px-3 py-1 text-xs font-semibold text-[#2B1F17] shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectTag(term)}
                        className="hover:text-[#0F7A43]"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecent(term)}
                        className="text-[#6E6A63] hover:text-[#DC2626]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#7A3F1C]">
                <TrendingUp className="h-3 w-3" />
                <span>Trending Searches</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectTag(term)}
                    className="ga-press rounded-full border border-[#E0DACB] bg-white px-3 py-1 text-xs font-semibold text-[#2B1F17] shadow-xs hover:border-[#0F7A43] hover:text-[#0F7A43]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-bold text-[#6E6A63] mb-3">
              {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
            </p>

            {results.length === 0 ? (
              <div className="mt-12 text-center">
                <p className="text-sm font-bold text-[#2B1F17]">No harvest found for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-xs text-[#6E6A63]">Try searching for &quot;Tomatoes&quot;, &quot;Plantain&quot;, or &quot;Rice&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {results.map((product) => (
                  <MobileProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}
