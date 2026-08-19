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
          <h1 className="text-[16px] font-black text-[#211A12]">Select Quantity</h1>
        </header>

        {/* Product Item Summary Card */}
        <div className="mt-1 flex items-center gap-3 rounded-[24px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h2 className="text-[13px] font-extrabold text-[#211A12]">{product.name}</h2>
            <span className="text-[11px] font-black text-[#0B3B25]">
              {formatGHS(product.priceMin)} / {product.unit}
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('weight')}
            className={cn(
              'flex-1 rounded-full py-2 text-[12px] font-extrabold transition-all active:scale-95 shadow-2xs',
              mode === 'weight'
                ? 'bg-[#0B3B25] text-white'
                : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
            )}
          >
            By Weight
          </button>
          <button
            type="button"
            onClick={() => setMode('piece')}
            className={cn(
              'flex-1 rounded-full py-2 text-[12px] font-extrabold transition-all active:scale-95 shadow-2xs',
              mode === 'piece'
                ? 'bg-[#0B3B25] text-white'
                : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
            )}
          >
            By Piece
          </button>
        </div>

        {/* Big Stepper */}
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (mode === 'weight') setWeightKg(Math.max(0.5, Number((weightKg - 0.5).toFixed(1))))
              else setPieceCount(Math.max(1, pieceCount - 1))
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white text-[#211A12] shadow-2xs active:scale-95"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="text-2xl font-black text-[#211A12] min-w-28 text-center">
            {mode === 'weight' ? `${weightKg.toFixed(1)} kg` : `${pieceCount} pcs`}
          </span>

          <button
            type="button"
            onClick={() => {
              if (mode === 'weight') setWeightKg(Number((weightKg + 0.5).toFixed(1)))
              else setPieceCount(pieceCount + 1)
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white text-[#211A12] shadow-2xs active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Range Slider */}
        {mode === 'weight' && (
          <div className="mt-6 px-2">
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#0B3B25]"
            />
            <div className="flex justify-between text-[10.5px] font-bold text-[#5C5247] mt-1">
              <span>0.5 kg</span>
              <span>10 kg</span>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] font-medium text-[#5C5247]">
          You will pay for the exact weight measured at delivery.
        </p>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="relative border-t border-[rgba(33,26,18,0.06)] pt-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5C5247]">Estimated Price</span>
            <span className="text-[18px] font-black text-[#0B3B25]">
              {formatGHS(estimatedPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex flex-1 h-12 items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
