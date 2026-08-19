'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Check } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

export default function MobileRelatedProductsScreen() {
  const router = useRouter()
  const { add } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)

  const relatedItems = [
    { name: 'Red Bell Pepper', price: 16.0, unit: 'kg', image: '/golden-acres/produce/roma-tomatoes.png' },
    { name: 'Garden Eggs', price: 10.0, unit: 'kg', image: '/golden-acres/produce/garden-eggs.png' },
    { name: 'Onions (Dry)', price: 8.0, unit: 'kg', image: '/golden-acres/produce/aromatic-rice.png' },
    { name: 'Fresh Carrots', price: 15.0, unit: 'kg', image: '/golden-acres/produce/roma-tomatoes-1.png' },
    { name: 'Cucumber', price: 4.0, unit: 'piece', image: '/golden-acres/produce/crisphead-lettuce.png' },
  ]

  const recentlyViewed = [
    { name: 'Fresh Tomatoes', priceText: 'GH₵12.00 / kg', image: '/golden-acres/produce/roma-tomatoes-1.png', slug: 'roma-tomatoes' },
    { name: 'Yam (White)', priceText: 'GH₵8.00 - 12.00 / kg', image: '/golden-acres/produce/white-yam.png', slug: 'white-yam' },
  ]

  function handleQuickAdd(item: typeof relatedItems[0]) {
    const syntheticProduct = {
      id: `rel-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      name: item.name,
      category: 'Vegetables' as import('@/lib/golden-acres/types').ProduceCategory,
      farmerId: 'f1',
      farmerName: 'Adwoa Sarpomaa Farms',
      image: item.image,
      unit: (item.unit === 'piece' ? 'each' : item.unit) as import('@/lib/golden-acres/types').ProductUnit,
      variableWeight: false,
      pricePerKg: 0,
      priceMin: item.price,
      priceMax: item.price,
      refrigerationRequired: false,
      shelfLifeDays: 7,
      expiryDate: '',
      stockKg: 50,
      lowStockThreshold: 10,
      status: 'in-stock' as const,
      organic: false,
      season: 'Year-round',
      tags: [],
      description: item.name,
      estWeightKg: 1,
    }
    add(syntheticProduct, 1)
    setAddedItem(item.name)
    setTimeout(() => setAddedItem(null), 1200)
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] pb-24">
      {/* Header */}
      <header className="flex items-center gap-3 pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-base font-extrabold text-[#2B1F17]">You may also like</h1>
      </header>

      {/* Vertical Items List (Screen 5) */}
      <div className="space-y-2.5 pt-2">
        {relatedItems.map((item) => {
          const isAdded = addedItem === item.name
          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl bg-[#FAF7F0]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold text-[#2B1F17]">{item.name}</h2>
                  <span className="text-[11px] font-bold text-[#0F7A43]">
                    {formatGHS(item.price)} / {item.unit}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickAdd(item)}
                aria-label={`Add ${item.name}`}
                className={cn(
                  'ga-press flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs transition-all',
                  isAdded ? 'bg-[#0B3B25]' : 'bg-[#0F7A43]'
                )}
              >
                {isAdded ? <Check className="h-4 w-4 stroke-[3]" /> : <Plus className="h-4 w-4 stroke-[2.5]" />}
              </button>
            </div>
          )
        })}
      </div>

      {/* Recently Viewed Section (Screen 5 bottom) */}
      <div className="mt-6">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-2">
          Recently viewed
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {recentlyViewed.map((item) => (
            <Link
              key={item.name}
              href={`/m/product/${item.slug}`}
              className="ga-press flex flex-col overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-2.5 shadow-xs"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h4 className="mt-2 truncate text-xs font-extrabold text-[#2B1F17]">
                {item.name}
              </h4>
              <span className="text-[10px] font-bold text-[#0F7A43]">
                {item.priceText}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
