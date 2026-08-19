'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  ShoppingCart,
  Check,
  Star,
  Eye,
  Leaf,
  Users,
  GitCompareArrows,
} from 'lucide-react'
import { formatGHS, freshnessLabel } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { MobileQuickView } from '@/components/golden-acres/mobile/mobile-quick-view'
import type { Product } from '@/lib/golden-acres/types'
import { cn } from '@/lib/utils'

interface MobileProductCardProps {
  product: Product
  className?: string
  priority?: boolean
  offerCount?: number
}

export function MobileProductCard({
  product,
  className,
  priority = false,
  offerCount = 6,
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
    setTimeout(() => setIsAdded(false), 1400)
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

  const fresh = freshnessLabel(product.expiryDate)

  return (
    <>
      <Link
        href={`/m/product/${product.slug}`}
        className={cn(
          'group relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.985] transition-transform',
          className
        )}
      >
        {/* 1. Image Container with Web-Matched Badges (-20% height: aspect-[1.32/1]) */}
        <div className="relative aspect-[1.32/1] w-full overflow-hidden bg-white/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 190px, 240px"
            priority={priority}
            className="object-cover object-center scale-[1.06] transition-transform duration-500 group-hover:scale-112"
          />

          {/* Soft bottom gradient */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

          {/* Top-Left: Organic Badge */}
          {product.organic && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-[#0B3B25]/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
              <Leaf className="h-2.5 w-2.5 stroke-[2.5]" />
              <span>Organic</span>
            </div>
          )}

          {/* Top-Right: Quick View & Wishlist */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            <button
              type="button"
              onClick={handleOpenQuickView}
              aria-label="Quick view"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#211A12] shadow-xs backdrop-blur-xs active:scale-90 transition-transform"
            >
              <Eye className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Favorite"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#211A12] shadow-xs backdrop-blur-xs active:scale-90 transition-transform"
            >
              <Heart
                className={cn(
                  'h-3 w-3',
                  saved ? 'fill-[#7A3F1C] text-[#7A3F1C]' : 'text-[#211A12]'
                )}
              />
            </button>
          </div>

          {/* Bottom-Left: Freshness Status Pill */}
          <div className="absolute bottom-1.5 left-2 z-10 flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: fresh.color || '#0B3B25' }}
            />
            <span>{fresh.label || 'FRESH'}</span>
          </div>

          {/* Bottom-Right: Competing Farmers Offer Count */}
          {offerCount > 1 && (
            <div className="absolute bottom-1.5 right-2 z-10 flex items-center gap-1 rounded-full bg-[#7A3F1C]/90 px-1.5 py-0.5 text-[8.5px] font-extrabold text-white backdrop-blur-md shadow-xs">
              <Users className="h-2.5 w-2.5" />
              <span>{offerCount}</span>
            </div>
          )}
        </div>

        {/* 2. Content Body (Streamlined for -20% card height) */}
        <div className="flex flex-1 flex-col justify-between p-3 pt-2">
          <div>
            {/* Farm Name */}
            <span className="block truncate text-[11px] font-semibold text-[#5C5247]">
              {product.farmerName || 'Ghanaian Family Farm'}
            </span>

            {/* Product Title */}
            <h3 className="mt-0.5 line-clamp-1 text-[13.5px] font-black leading-tight text-[#211A12] group-hover:text-[#0B3B25] transition-colors">
              {product.name}
            </h3>

            {/* Star Rating */}
            <div className="mt-0.5 flex items-center gap-1 text-[10.5px] font-bold text-[#5C5247]">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]"
                  />
                ))}
              </div>
              <span className="font-black text-[#211A12]">
                {product.rating?.toFixed(1) || '4.9'}
              </span>
              <span>({product.reviewCount || 121})</span>
            </div>

            {/* Price Row */}
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[10.5px] font-semibold text-[#5C5247]">from</span>
              <span className="text-[15.5px] font-black text-[#211A12] leading-none">
                {formatGHS(product.priceMin)}
              </span>
              <span className="text-[10.5px] font-semibold text-[#5C5247]">
                / {product.unit}
              </span>
            </div>

            {/* Compare note */}
            <p className="mt-0.5 text-[10px] font-bold text-[#7A3F1C] truncate">
              {offerCount > 1
                ? `Compare ${offerCount} farmer prices`
                : product.variableWeight
                ? 'Est. weight, priced after picking'
                : 'Direct smallholder price'}
            </p>
          </div>

          {/* 3. Full-Width Add To Cart Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={cn(
              'mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-full text-[12px] font-extrabold shadow-xs transition-all active:scale-95',
              isAdded
                ? 'bg-[#0B3B25]/15 text-[#0B3B25] ring-1 ring-[#0B3B25]/30'
                : 'bg-[#0B3B25] text-white hover:bg-[#072919]'
            )}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 stroke-[2.4]" />
                <span>Add to cart</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Quick View Modal */}
      <MobileQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}
