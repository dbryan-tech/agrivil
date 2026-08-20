'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ArrowLeft, X, TrendingUp } from 'lucide-react'
import { products } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'

const POPULAR_SEARCHES = ['Tomatoes', 'White Yam', 'Scotch Bonnet', 'Plantain', 'Garden Eggs', 'Adwoa Farms']

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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Search Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-2 border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-1.5 py-2.5 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <Link
          href="/m"
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search produce, farmers, recipes..."
            autoFocus
            className="h-10 w-full rounded-full border border-[rgba(33,26,18,0.10)] bg-white pl-9 pr-8 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none focus:border-[#0B3B25]"
          />
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0B3B25] stroke-[2.4]" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-[#5C5247] hover:bg-black/5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Query Content */}
      <div className="relative px-1.5 pt-2.5">
        {query.trim().length === 0 ? (
          <div className="space-y-4">
            {/* Recent Searches */}
            {recent.length > 0 && (
              <div>
                <h3 className="text-[10.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                  Recent Searches
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {recent.map((term) => (
                    <div
                      key={term}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FDFDFB] px-3 py-1 text-[11.5px] font-extrabold text-[#211A12] shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectTag(term)}
                        className="hover:text-[#0B3B25]"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecent(term)}
                        className="text-[#5C5247] hover:text-[#DC2626]"
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
              <div className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.14em] text-[#7A3F1C]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Trending Searches</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectTag(term)}
                    className="rounded-full border border-[rgba(33,26,18,0.08)] bg-white px-3 py-1 text-[11.5px] font-extrabold text-[#211A12] shadow-2xs hover:border-[#0B3B25] hover:text-[#0B3B25] active:scale-95 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[11.5px] font-bold text-[#5C5247] mb-2.5">
              {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
            </p>

            {results.length === 0 ? (
              <div className="mt-10 text-center">
                <p className="text-[14px] font-extrabold text-[#211A12]">No harvest found for &ldquo;{query}&rdquo;</p>
                <p className="mt-0.5 text-[11.5px] font-semibold text-[#5C5247]">Try searching for &quot;Tomatoes&quot;, &quot;Yam&quot;, or &quot;Plantain&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
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

