'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Leaf,
  Wheat,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react'
import { products, productFarmer } from '@/lib/golden-acres/data'
import { formatGHS, weight } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { cn } from '@/lib/utils'

export default function MobileProductDetailScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const router = useRouter()
  const { add } = useCart()
  const { isSaved, toggleWishlist } = useSession()

  const product =
    products.find((p) => p.slug === rawSlug) || products[0]
  const farmer = productFarmer(product)

  const [qty, setQty] = useState(1)
  const [selectedWeightKg, setSelectedWeightKg] = useState(
    product.estWeightKg || 1
  )
  const [showSuccessSheet, setShowSuccessSheet] = useState(false)

  const saved = isSaved(product.id)

  const lineEstimate = product.variableWeight
    ? product.pricePerKg * selectedWeightKg * qty
    : product.priceMin * qty

  function handleAddToCart() {
    add(product, qty)
    setShowSuccessSheet(true)
  }

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-32 text-[#2B1F17]">
      {/* Top Floating App Bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between p-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-sm border border-[#E0DACB]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Save to favorites"
            className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-sm border border-[#E0DACB]"
          >
            <Heart
              className={cn(
                'h-5 w-5',
                saved ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
              )}
            />
          </button>
        </div>
      </div>

      {/* 1. Large Hero Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        {product.organic && (
          <span className="absolute bottom-4 left-4 rounded-full bg-[#1E5D3B] px-3 py-1 text-xs font-bold text-white shadow-sm">
            Certified Organic
          </span>
        )}
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* 2. Product Headline & Pricing */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A6B3D]">
                {product.category}
              </span>
              <h1 className="mt-0.5 text-xl font-extrabold text-[#2B1F17]">
                {product.name}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xl font-extrabold text-[#1E5D3B]">
                {formatGHS(product.priceMin)}
              </span>
              <p className="text-[10px] font-semibold text-[#6E6A63]">
                / {product.unit} {product.variableWeight ? '(est)' : ''}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#6E6A63]">
            {product.description}
          </p>

          {product.variableWeight && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#F4F1EA] p-3 text-xs text-[#2B1F17]">
              <Info className="h-4 w-4 shrink-0 text-[#1E5D3B]" />
              <div>
                <p className="font-bold">Priced by actual harvested weight</p>
                <p className="text-[11px] text-[#6E6A63]">
                  Estimated ~{product.estWeightKg} kg per {product.unit}. You will only be charged for the exact weight picked at harvest.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Trust Badges */}
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-[#E0DACB] bg-white p-3 text-center text-[10px] font-bold text-[#2B1F17] shadow-xs">
          <div className="flex flex-col items-center gap-1">
            <Leaf className="h-4 w-4 text-[#1E5D3B]" />
            <span>100% Natural</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-[#1E5D3B]" />
            <span>Pesticide Free</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wheat className="h-4 w-4 text-[#1E5D3B]" />
            <span>Hand Picked</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-4 w-4 text-[#1E5D3B]" />
            <span>Fast Delivery</span>
          </div>
        </div>

        {/* 4. Variable-Weight / Quantity Control Box */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
              Select Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="ga-press flex h-8 w-8 items-center justify-center rounded-full border border-[#E0DACB] bg-[#F4F1EA] text-[#2B1F17]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-extrabold text-[#2B1F17]">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="ga-press flex h-8 w-8 items-center justify-center rounded-full border border-[#E0DACB] bg-[#1E5D3B] text-white"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {product.variableWeight && (
            <div className="mt-4 border-t border-[#E0DACB] pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#6E6A63]">Weight preference:</span>
                <span className="font-bold text-[#1E5D3B]">
                  {(selectedWeightKg * qty).toFixed(1)} kg total
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                {[0.5, 1.0, 2.0, 5.0].map((wOption) => (
                  <button
                    key={wOption}
                    type="button"
                    onClick={() => setSelectedWeightKg(wOption)}
                    className={cn(
                      'ga-press flex-1 rounded-xl border py-1.5 text-center text-xs font-bold transition-colors',
                      selectedWeightKg === wOption
                        ? 'border-[#1E5D3B] bg-[#1E5D3B] text-white'
                        : 'border-[#E0DACB] bg-[#F4F1EA] text-[#2B1F17]'
                    )}
                  >
                    {wOption} kg
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Origin / Farmer Profile Card */}
        {farmer && (
          <Link
            href={`/m/farmers/${farmer.slug}`}
            className="ga-press flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[#F4F1EA]">
                <Image
                  src={farmer.photo}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8A6B3D]">Grown By</span>
                <h3 className="text-sm font-extrabold text-[#2B1F17]">{farmer.name}</h3>
                <p className="text-[11px] text-[#6E6A63]">
                  {farmer.farmName} · {farmer.town}, {farmer.region}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-[#1E5D3B]">
              <span>View Farm</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        )}
      </div>

      {/* Sticky Bottom Add-to-Cart Bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white p-4 shadow-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-[#6E6A63]">Subtotal</span>
            <span className="text-lg font-extrabold text-[#1E5D3B]">
              {formatGHS(lineEstimate)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="ga-press flex flex-1 h-13 items-center justify-center rounded-2xl bg-[#1E5D3B] text-sm font-bold text-white shadow-sm hover:bg-[#144028]"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Add to Cart Success Sheet */}
      {showSuccessSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E5D3B]/10 text-[#1E5D3B]">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-[#2B1F17]">
                Added to cart!
              </h3>
              <p className="mt-1 text-xs text-[#6E6A63]">
                {qty}x {product.name} ({product.variableWeight ? `${(selectedWeightKg * qty).toFixed(1)} kg` : product.unit})
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => router.push('/m/cart')}
                className="ga-press flex h-12 w-full items-center justify-center rounded-2xl bg-[#1E5D3B] text-xs font-bold text-white shadow-sm hover:bg-[#144028]"
              >
                View Cart &amp; Checkout
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessSheet(false)}
                className="ga-press flex h-12 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-[#F4F1EA] text-xs font-bold text-[#2B1F17]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
