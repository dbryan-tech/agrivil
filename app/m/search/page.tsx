'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowLeft, X, Clock, Plus, Check, TrendingUp } from 'lucide-react'
import { products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

const POPULAR_SEARCHES = ['Tomatoes', 'Plantain', 'White Yam', 'Scotch Bonnet', 'Garden Eggs', 'Adwoa Farms']

export default function MobileSearchScreen() {
  const { add } = useCart()
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(['Tomatoes', 'Rice', 'Eggs'])
  const [addedId, setAddedId] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q)
    )
  }, [query])

  function handleAdd(e: React.MouseEvent, product: (typeof products)[0]) {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

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
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      {/* Search Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#E0DACB]/80 bg-[#F4F1EA]/95 px-4 py-3 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
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
            className="h-11 w-full rounded-2xl border border-[#E0DACB] bg-white pl-10 pr-9 text-xs font-semibold text-[#2B1F17] shadow-xs outline-none focus:border-[#1E5D3B] focus:ring-2 focus:ring-[#1E5D3B]/20"
          />
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#1E5D3B]" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-[#6E6A63] hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Query Content */}
      <div className="px-4 pt-4">
        {query.trim().length === 0 ? (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recent.length > 0 && (
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
                  Recent Searches
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <div
                      key={term}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E0DACB] bg-white px-3 py-1.5 text-xs font-semibold text-[#2B1F17] shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectTag(term)}
                        className="hover:text-[#1E5D3B]"
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
              <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#8A6B3D]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Trending Searches</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectTag(term)}
                    className="ga-press rounded-full border border-[#E0DACB] bg-white px-3 py-1.5 text-xs font-semibold text-[#2B1F17] shadow-xs hover:border-[#1E5D3B] hover:text-[#1E5D3B]"
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
              <div className="space-y-2.5">
                {results.map((product) => {
                  const isAdded = addedId === product.id
                  return (
                    <Link
                      key={product.id}
                      href={`/m/product/${product.slug}`}
                      className="ga-press flex items-center justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs hover:border-[#1E5D3B]/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#F4F1EA]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-xs font-extrabold text-[#2B1F17]">
                            {product.name}
                          </h4>
                          <span className="text-[10px] text-[#6E6A63]">
                            {product.farmerName}
                          </span>
                          <span className="mt-1 text-xs font-bold text-[#1E5D3B]">
                            {formatGHS(product.priceMin)} / {product.variableWeight ? 'kg (est)' : product.unit}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAdd(e, product)}
                        className={cn(
                          'ga-press flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs',
                          isAdded ? 'bg-[#A3E635] text-[#144028]' : 'bg-[#1E5D3B]'
                        )}
                      >
                        {isAdded ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <Plus className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </button>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}
