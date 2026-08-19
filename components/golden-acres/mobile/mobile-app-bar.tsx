'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, ShoppingBag, Search, Share2, Heart } from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

interface MobileAppBarProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  showSearch?: boolean
  showNotifications?: boolean
  showCart?: boolean
  showShare?: boolean
  showFavorite?: boolean
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onShare?: () => void
  rightSlot?: React.ReactNode
  transparent?: boolean
  className?: string
}

export function MobileAppBar({
  title,
  subtitle,
  showBack = false,
  showSearch = false,
  showNotifications = false,
  showCart = true,
  showShare = false,
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle,
  onShare,
  rightSlot,
  transparent = false,
  className,
}: MobileAppBarProps) {
  const router = useRouter()
  const { count } = useCart()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center justify-between px-3 sm:px-4 transition-colors',
        transparent
          ? 'bg-transparent'
          : 'border-b border-[#E0DACB] bg-[#FAF7F0]',
        className
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Left side: Back or Title */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        {title && (
          <div className="flex flex-col truncate">
            <h1 className="truncate text-base font-bold tracking-tight text-[#2B1F17]">
              {title}
            </h1>
            {subtitle && (
              <span className="truncate text-xs text-[#6E6A63]">{subtitle}</span>
            )}
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {showSearch && (
          <Link
            href="/m/search"
            aria-label="Search"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full text-[#2B1F17] hover:bg-[#FAF7F0]"
          >
            <Search className="h-4 w-4" />
          </Link>
        )}

        {showNotifications && (
          <Link
            href="/m/account/notifications"
            aria-label="Notifications"
            className="ga-press relative flex h-9 w-9 items-center justify-center rounded-full text-[#2B1F17] hover:bg-[#FAF7F0]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E67A2E]" />
          </Link>
        )}

        {showFavorite && (
          <button
            type="button"
            onClick={onFavoriteToggle}
            aria-label="Save item"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full text-[#2B1F17] hover:bg-[#FAF7F0]"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isFavorite ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
              )}
            />
          </button>
        )}

        {showShare && (
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full text-[#2B1F17] hover:bg-[#FAF7F0]"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}

        {showCart && (
          <Link
            href="/m/cart"
            aria-label="Shopping Cart"
            className="ga-press relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ShoppingBag className="h-4 w-4 text-[#0F7A43]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0F7A43] px-1 text-[9px] font-bold text-white shadow-xs">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        )}

        {rightSlot}
      </div>
    </header>
  )
}
