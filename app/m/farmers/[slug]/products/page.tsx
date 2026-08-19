'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { farmers, products } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'

export default function MobileFarmerProductsScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const farmProducts = products.filter(
    (p) =>
      p.farmerId === farmer.id ||
      p.farmerName?.toLowerCase().includes(farmer.name.toLowerCase()) ||
      p.farmerName?.toLowerCase().includes(farmer.farmName.toLowerCase())
  )

  const items = farmProducts.length > 0 ? farmProducts : products.slice(0, 6)

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Farmer Harvest</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name} · {items.length} items</p>
          </div>
        </div>
      </header>

      {/* 2-Column Product Grid */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3">
        <p className="text-xs text-[#6E6A63]">
          All produce grown on-site and harvested fresh for same-day packing.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {items.map((prod) => (
            <MobileProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
