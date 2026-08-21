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
        'sticky top-0 z-30 flex min-h-[54px] items-center justify-between px-3 transition-colors',
        transparent
          ? 'bg-transparent'
          : 'border-b border-[rgba(33,26,18,0.06)] bg-[#FAF9F6]/90 backdrop-blur-md',
        className
      )}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)',
        paddingBottom: '12px',
      }}
    >
      {/* Left side: Back or Title */}
      <div className="flex items-center gap-3 overflow-hidden">
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        {title && (
          <div className="flex flex-col truncate">
            <h1 className="truncate text-[16px] font-extrabold tracking-tight text-[#211A12]">
              {title}
            </h1>
            {subtitle && (
              <span className="truncate text-[11px] font-semibold text-[#5C5247]">{subtitle}</span>
            )}
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {showSearch && (
          <Link
            href="/m/search"
            prefetch={true}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)] active:scale-95"
          >
            <Search className="h-4 w-4" />
          </Link>
        )}

        {showNotifications && (
          <Link
            href="/m/account/notifications"
            prefetch={true}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)] active:scale-95"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#7A3F1C]" />
          </Link>
        )}

        {showFavorite && (
          <button
            type="button"
            onClick={onFavoriteToggle}
            aria-label="Save item"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)] active:scale-95"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isFavorite ? 'fill-[#7A3F1C] text-[#7A3F1C]' : 'text-[#211A12]'
              )}
            />
          </button>
        )}

        {showShare && (
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)] active:scale-95"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}

        {showCart && (
          <Link
            href="/m/cart"
            prefetch={true}
            aria-label="Shopping Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-sm active:scale-95 transition-transform"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A3F1C] px-1 text-[9px] font-black text-white shadow-xs">
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

