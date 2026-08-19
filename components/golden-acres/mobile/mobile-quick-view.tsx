'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Leaf,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { formatGHS, freshnessLabel, weight } from '@/lib/golden-acres/format'
import { productFarmer, productEstimate } from '@/lib/golden-acres/data'
import type { Product } from '@/lib/golden-acres/types'
import { cn } from '@/lib/utils'

interface MobileQuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function MobileQuickView({
  product,
  isOpen,
  onClose,
}: MobileQuickViewProps) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [selectedWeight, setSelectedWeight] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (product) {
      setQty(1)
      setSelectedWeight(product.estWeightKg || 1)
      setAdded(false)
    }
  }, [product?.id])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  const currentProduct = product
  const farmer = productFarmer(currentProduct)
  const fresh = freshnessLabel(currentProduct.expiryDate)
  const isLowStock = currentProduct.status === 'low' || Boolean(currentProduct.stockKg !== undefined && currentProduct.stockKg < 20)
  const isOutOfStock = currentProduct.status === 'out-of-stock' || Boolean(currentProduct.stockKg !== undefined && currentProduct.stockKg <= 0)

  const linePrice = currentProduct.variableWeight
    ? currentProduct.pricePerKg * selectedWeight * qty
    : currentProduct.priceMin * qty

  function handleAddToCart() {
    if (isOutOfStock) return
    add(currentProduct, qty)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop with beautiful blur effect */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Sheet Container */}
      <div className="relative z-10 w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[#FAF7F0] p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Drag handle & close button */}
        <div className="flex items-center justify-between pb-3">
          <div className="h-1 w-10 rounded-full bg-[#E0DACB] mx-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ga-press absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product Photo Header with badges */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white shadow-xs">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2"
          />

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.organic && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs">
                <Leaf className="h-2.5 w-2.5" /> Organic
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-extrabold text-white backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fresh.color }} />
              {fresh.label}
            </span>
          </div>

          {isLowStock && !isOutOfStock && (
            <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[#DC2626] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs">
              Low Stock: Few kg left
            </span>
          )}
        </div>

        {/* Title & Pricing */}
        <div className="mt-3.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A3F1C]">
            {product.category}
          </span>
          <h2 className="ga-headline text-lg font-extrabold text-[#2B1F17]">
            {product.name}
          </h2>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[#0F7A43]">
              {formatGHS(product.priceMin)}
            </span>
            <span className="text-xs font-semibold text-[#6E6A63]">
              / {product.unit} {product.variableWeight ? '(est weight)' : ''}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs leading-relaxed text-[#6E6A63]">
          {product.description}
        </p>

        {/* Farmer Attribution */}
        {farmer && (
          <Link
            href={`/m/farmers/${farmer.slug}`}
            onClick={onClose}
            className="ga-press mt-3 flex items-center justify-between rounded-2xl border border-[#E0DACB] bg-white p-2.5 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E0DACB]">
                <Image
                  src={farmer.photo}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-[#2B1F17]">{farmer.name}</span>
                <span className="text-[10px] font-medium text-[#0F7A43]">{farmer.town}, {farmer.region}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#7A3F1C]">
              <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
              <span className="font-bold text-[#2B1F17]">{farmer.rating}</span>
              <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
            </div>
          </Link>
        )}

        {/* Variable Weight Multiplier */}
        {product.variableWeight && (
          <div className="mt-3 rounded-2xl border border-[#E0DACB] bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#2B1F17]">
              <span>Choose Weight</span>
              <span className="text-[#0F7A43] font-extrabold">{selectedWeight} kg</span>
            </div>
            <div className="mt-2 flex gap-2">
              {[0.5, 1.0, 1.5, 2.0].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWeight(w)}
                  className={cn(
                    'ga-press flex-1 rounded-xl py-1.5 text-xs font-bold border transition-all',
                    selectedWeight === w
                      ? 'border-[#0F7A43] bg-[#0F7A43] text-white shadow-xs'
                      : 'border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                  )}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Controls & Add to Cart Footer */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E0DACB] pt-3">
          {/* Stepper */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#E0DACB] bg-white p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={isOutOfStock}
              className="ga-press flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF7F0] text-[#2B1F17] disabled:opacity-50"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-6 text-center text-xs font-extrabold text-[#2B1F17]">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              disabled={isOutOfStock}
              className="ga-press flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF7F0] text-[#2B1F17] disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              'ga-press flex-1 flex h-12 items-center justify-center gap-2 rounded-2xl font-bold text-white shadow-md transition-all',
              isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : added
                ? 'bg-[#0B3B25]'
                : 'bg-[#0F7A43] hover:bg-[#0B3B25]'
            )}
          >
            {isOutOfStock ? (
              <span className="text-xs">Out of Stock</span>
            ) : added ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span className="text-xs">Added ({formatGHS(linePrice)})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs">Add · {formatGHS(linePrice)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
