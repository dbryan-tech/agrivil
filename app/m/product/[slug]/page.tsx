'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Leaf,
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

export default function MobileProductDetailScreen({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { add } = useCart()
  const { isSaved, toggleWishlist } = useSession()

  const product =
    products.find((p) => p.slug === resolvedParams.slug) || products[0]
  const farmer = productFarmer(product)

  const [qty, setQty] = useState(1)
  const [selectedWeightKg, setSelectedWeightKg] = useState(product.estWeightKg || 1.0)
  const [showSuccessSheet, setShowSuccessSheet] = useState(false)

  const saved = isSaved(product.id)

  const lineEstimate = product.variableWeight
    ? selectedWeightKg * product.pricePerKg * qty
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
          className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-md backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Save to favorites"
            className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-md backdrop-blur-md"
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
      <div className="relative aspect-square w-full overflow-hidden bg-white shadow-xs">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        {product.organic && (
          <span className="absolute top-18 left-4 rounded-full bg-[#1E5D3B] px-3 py-1 text-xs font-bold text-white shadow-sm">
            100% Organic
          </span>
        )}
      </div>

      {/* 2. Product Information Card */}
      <div className="px-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="ga-headline text-2xl font-extrabold tracking-tight text-[#2B1F17]">
              {product.name}
            </h1>
            <Link
              href={`/m/farmers/${farmer.slug}`}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E5D3B] hover:underline"
            >
              <span>From {farmer.name}</span>
              <CheckCircle2 className="h-3.5 w-3.5 fill-[#1E5D3B] text-white" />
            </Link>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xl font-extrabold text-[#1E5D3B]">
              {formatGHS(product.priceMin)}
            </span>
            <span className="text-xs font-semibold text-[#6E6A63]">
              / {product.variableWeight ? 'kg' : product.unit}
            </span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
          <span className="font-bold text-[#2B1F17]">{farmer.rating}</span>
          <span className="text-[#6E6A63]">({farmer.reviewCount} customer reviews)</span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-[#6E6A63]">
          {product.description ||
            'Farm-fresh produce harvested this morning in Ghana. Crisp, healthy, and handled with certified cold-chain care.'}
        </p>

        {/* 3. Trust Badges */}
        <div className="mt-5 grid grid-cols-4 gap-2 rounded-2xl border border-[#E0DACB] bg-white p-3 text-center text-[10px] font-bold text-[#2B1F17] shadow-xs">
          <div className="flex flex-col items-center gap-1">
            <Leaf className="h-4 w-4 text-[#1E5D3B]" />
            <span>100% Natural</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-[#1E5D3B]" />
            <span>Pesticide Free</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm">🌾</span>
            <span>Hand Picked</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-4 w-4 text-[#1E5D3B]" />
            <span>Fast Delivery</span>
          </div>
        </div>

        {/* 4. Variable-Weight / Quantity Control Box */}
        <div className="mt-5 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
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
                className="ga-press flex h-8 w-8 items-center justify-center rounded-full bg-[#1E5D3B] text-white"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {product.variableWeight && (
            <div className="mt-4 border-t border-[#E0DACB]/60 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#6E6A63]">Estimated Weight:</span>
                <span className="font-bold text-[#1E5D3B]">{selectedWeightKg.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={selectedWeightKg}
                onChange={(e) => setSelectedWeightKg(parseFloat(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer accent-[#1E5D3B]"
              />
              <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#8A6B3D]">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>You will pay for the exact weight confirmed at packing.</span>
              </p>
            </div>
          )}
        </div>

        {/* 5. Farmer Snippet Card */}
        <Link
          href={`/m/farmers/${farmer.slug}`}
          className="ga-press mt-5 flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#E0DACB]">
              <Image
                src={farmer.photo}
                alt={farmer.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#2B1F17]">{farmer.name}</h3>
              <p className="text-[10px] text-[#6E6A63]">{farmer.region} · 0.8 km away</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#1E5D3B]">
            <span>View Farm</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Sticky Bottom Add-to-Cart Bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white/95 p-4 shadow-xl backdrop-blur-md"
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
            className="ga-press flex flex-1 h-13 items-center justify-center rounded-2xl bg-[#1E5D3B] text-sm font-bold text-white shadow-md hover:bg-[#144028]"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Add to Cart Success Sheet */}
      {showSuccessSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
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
              <Link
                href="/m/cart"
                className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#1E5D3B] text-sm font-bold text-white shadow-md"
              >
                View Cart
              </Link>
              <button
                type="button"
                onClick={() => setShowSuccessSheet(false)}
                className="ga-press flex h-11 w-full items-center justify-center rounded-2xl border border-[#E0DACB] text-xs font-bold text-[#6E6A63]"
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
