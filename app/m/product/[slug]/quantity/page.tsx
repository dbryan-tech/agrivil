'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { products, productFarmer } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

export default function MobileQuantitySelectionScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const { add } = useCart()

  const product = products.find((p) => p.slug === rawSlug) || products[0]

  const [mode, setMode] = useState<'weight' | 'piece'>('weight')
  const [weightKg, setWeightKg] = useState(1.0)
  const [pieceCount, setPieceCount] = useState(1)

  const estimatedPrice = mode === 'weight'
    ? product.pricePerKg > 0 ? product.pricePerKg * weightKg : product.priceMin * weightKg
    : product.priceMin * pieceCount

  function handleAddToCart() {
    add(product, mode === 'weight' ? Math.max(1, Math.round(weightKg)) : pieceCount)
    router.push(`/m/cart/success?item=${encodeURIComponent(product.name)}&weight=${weightKg}`)
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
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
          <h1 className="text-base font-extrabold text-[#2B1F17]">Select Quantity</h1>
        </header>

        {/* Product Item Summary Card */}
        <div className="mt-2 flex items-center gap-3 rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#FAF7F0]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-[#2B1F17]">{product.name}</h2>
            <span className="text-[11px] font-bold text-[#0F7A43]">
              {formatGHS(product.priceMin)} / {product.unit}
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('weight')}
            className={cn(
              'ga-press flex-1 rounded-2xl py-2.5 text-xs font-bold transition-all',
              mode === 'weight'
                ? 'bg-[#0F7A43] text-white shadow-xs'
                : 'border border-[#E0DACB] bg-white text-[#2B1F17]'
            )}
          >
            By Weight
          </button>
          <button
            type="button"
            onClick={() => setMode('piece')}
            className={cn(
              'ga-press flex-1 rounded-2xl py-2.5 text-xs font-bold transition-all',
              mode === 'piece'
                ? 'bg-[#0F7A43] text-white shadow-xs'
                : 'border border-[#E0DACB] bg-white text-[#2B1F17]'
            )}
          >
            By Piece
          </button>
        </div>

        {/* Big Stepper */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => {
              if (mode === 'weight') setWeightKg(Math.max(0.5, Number((weightKg - 0.5).toFixed(1))))
              else setPieceCount(Math.max(1, pieceCount - 1))
            }}
            className="ga-press flex h-12 w-12 items-center justify-center rounded-full border border-[#E0DACB] bg-white text-[#2B1F17] shadow-xs"
          >
            <Minus className="h-5 w-5" />
          </button>

          <span className="text-3xl font-extrabold text-[#2B1F17] min-w-32 text-center">
            {mode === 'weight' ? `${weightKg.toFixed(1)} kg` : `${pieceCount} pcs`}
          </span>

          <button
            type="button"
            onClick={() => {
              if (mode === 'weight') setWeightKg(Number((weightKg + 0.5).toFixed(1)))
              else setPieceCount(pieceCount + 1)
            }}
            className="ga-press flex h-12 w-12 items-center justify-center rounded-full border border-[#E0DACB] bg-white text-[#2B1F17] shadow-xs"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Range Slider */}
        {mode === 'weight' && (
          <div className="mt-8 px-2">
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#0F7A43]"
            />
            <div className="flex justify-between text-[11px] font-bold text-[#6E6A63] mt-1.5">
              <span>0.5 kg</span>
              <span>10 kg</span>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[#6E6A63]">
          You will pay for the exact weight measured at delivery.
        </p>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="border-t border-[#E0DACB] bg-[#FAF7F0] pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6E6A63]">Estimated Price</span>
            <span className="text-xl font-extrabold text-[#0F7A43]">
              {formatGHS(estimatedPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="ga-press flex flex-1 h-13 items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
