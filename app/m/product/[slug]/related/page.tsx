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
    <div className="relative min-h-dvh bg-[#F7F5F0] p-3 text-[#211A12] pb-24 select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
          <h1 className="text-[16px] font-black text-[#211A12]">You may also like</h1>
        </header>

        {/* Vertical Items List */}
        <div className="space-y-1.5 pt-1">
          {relatedItems.map((item) => {
            const isAdded = addedItem === item.name
            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-[22px] bg-[#FDFDFB] p-2.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h2 className="text-[13px] font-extrabold text-[#211A12]">{item.name}</h2>
                    <span className="text-[11px] font-black text-[#0B3B25]">
                      {formatGHS(item.price)} / {item.unit}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  aria-label={`Add ${item.name}`}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-white shadow-xs transition-all active:scale-90',
                    isAdded ? 'bg-[#7A3F1C]' : 'bg-[#0B3B25]'
                  )}
                >
                  {isAdded ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Plus className="h-3.5 w-3.5 stroke-[2.5]" />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Recently Viewed Section */}
        <div className="mt-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247] pb-2">
            Recently viewed
          </h3>

          <div className="grid grid-cols-2 gap-1.5">
            {recentlyViewed.map((item) => (
              <Link
                key={item.name}
                href={`/m/product/${item.slug}`}
                className="flex flex-col overflow-hidden rounded-[22px] bg-[#FDFDFB] p-2.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F7F5F0]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <h4 className="mt-1.5 truncate text-[12.5px] font-extrabold text-[#211A12]">
                  {item.name}
                </h4>
                <span className="text-[10.5px] font-black text-[#0B3B25]">
                  {item.priceText}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
