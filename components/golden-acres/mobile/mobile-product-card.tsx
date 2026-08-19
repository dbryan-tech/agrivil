'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Check, Star, Eye } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { MobileQuickView } from '@/components/golden-acres/mobile/mobile-quick-view'
import type { Product } from '@/lib/golden-acres/types'
import { cn } from '@/lib/utils'

interface MobileProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export function MobileProductCard({
  product,
  className,
  priority = false,
}: MobileProductCardProps) {
  const { add } = useCart()
  const { isSaved, toggleWishlist } = useSession()
  const [isAdded, setIsAdded] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

  const saved = isSaved(product.id)

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1200)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  function handleOpenQuickView(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  // Farmer avatar mapping fallback
  const farmerPhoto =
    product.farmerName?.toLowerCase().includes('adwoa')
      ? '/golden-acres/farmers/adwoa-sarpong.jpg'
      : product.farmerName?.toLowerCase().includes('ama')
      ? '/golden-acres/farmers/auntie-ama.jpg'
      : product.farmerName?.toLowerCase().includes('kwame')
      ? '/golden-acres/farmers/kwame-mensah.jpg'
      : product.farmerName?.toLowerCase().includes('esi')
      ? '/golden-acres/farmers/esi-boateng.jpg'
      : '/golden-acres/farmers/fati-abukari.jpg'

  return (
    <>
      <Link
        href={`/m/product/${product.slug}`}
        className={cn(
          'ga-press group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-2.5 shadow-xs transition-all hover:border-[#0F7A43]/40',
          className
        )}
      >
        <div>
          {/* Large Product Photo Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 170px, 220px"
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Top-Left Pill Badge */}
            {product.organic ? (
              <span className="absolute top-2 left-2 rounded-md bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs">
                Organic
              </span>
            ) : (
              <span className="absolute top-2 left-2 rounded-md bg-[#2B1F17]/80 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs backdrop-blur-xs">
                Fresh
              </span>
            )}

            {/* Top-Right Floating Actions */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {/* Quick View Button */}
              <button
                type="button"
                onClick={handleOpenQuickView}
                aria-label="Quick view"
                className="ga-press flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-xs backdrop-blur-xs transition-transform hover:scale-110"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={handleWishlist}
                aria-label="Favorite"
                className="ga-press flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-xs backdrop-blur-xs transition-transform hover:scale-110"
              >
                <Heart
                  className={cn(
                    'h-3.5 w-3.5',
                    saved ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
                  )}
                />
              </button>
            </div>

            {/* Bottom-Right Floating Cart Button (FAB) */}
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                'ga-press absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-110',
                isAdded ? 'bg-[#0B3B25]' : 'bg-[#0F7A43] hover:bg-[#0B3B25]'
              )}
            >
              {isAdded ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5 stroke-[2.2]" />
              )}
            </button>
          </div>

          {/* Farmer/Vendor Attribution */}
          <div className="mt-2.5 flex items-center gap-1.5 px-0.5">
            <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-[#E0DACB]">
              <Image
                src={farmerPhoto}
                alt={product.farmerName || 'Farmer'}
                fill
                className="object-cover"
              />
            </div>
            <span className="truncate text-[10px] font-semibold text-[#6E6A63]">
              {product.farmerName || 'Local Ghana Farm'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="mt-1 line-clamp-1 px-0.5 text-xs font-extrabold text-[#2B1F17]">
            {product.name}
          </h3>
        </div>

        {/* Price & Rating / Sold Count */}
        <div className="mt-2 px-0.5 pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-[#0F7A43]">
              {formatGHS(product.priceMin)}
            </span>
            <span className="text-[10px] font-semibold text-[#6E6A63]">
              / {product.unit} {product.variableWeight ? '(est)' : ''}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#6E6A63]">
            <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
            <span className="font-bold text-[#2B1F17]">{product.rating || 4.8}</span>
            <span>({product.reviewCount || 24})</span>
            <span>·</span>
            <span>{120 + (product.reviewCount || 10) * 3} sold</span>
          </div>
        </div>
      </Link>

      {/* Quick View Modal with Blur Effect */}
      <MobileQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}
