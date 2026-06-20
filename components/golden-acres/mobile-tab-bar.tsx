'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, ShoppingBasket, User } from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { cn } from '@/lib/utils'

/**
 * App-style bottom tab bar for mobile. Gives the storefront a native feel with
 * one-tap access to Home, Shop, Wishlist, Basket (with live count) and Account.
 * Hidden on large screens where the full header nav is used.
 */
export function MobileTabBar() {
  const pathname = usePathname()
  const { count, openDrawer } = useCart()
  const { wishlist } = useSession()

  const wishCount = wishlist.length

  const tabs = [
    { href: '/', label: 'Home', icon: Home, match: (p: string) => p === '/' },
    { href: '/shop', label: 'Shop', icon: Search, match: (p: string) => p.startsWith('/shop') },
    {
      href: '/account?tab=favorites',
      label: 'Saved',
      icon: Heart,
      badge: wishCount,
      match: (p: string) => false,
    },
    {
      label: 'Basket',
      icon: ShoppingBasket,
      badge: count,
      onClick: openDrawer,
      match: (p: string) => false,
    },
    {
      href: '/account',
      label: 'Account',
      icon: User,
      match: (p: string) => p.startsWith('/account'),
    },
  ]

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => {
        const active = tab.match(pathname)
        const Icon = tab.icon
        const inner = (
          <span className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2">
            <span className="relative">
              <Icon
                className={cn('h-[22px] w-[22px]', active ? 'text-primary' : 'text-muted-foreground')}
                strokeWidth={active ? 2.4 : 2}
              />
              {tab.badge ? (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-deal px-1 text-[10px] font-bold text-deal-foreground">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                'text-[10px] font-semibold',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {tab.label}
            </span>
          </span>
        )

        if (tab.onClick) {
          return (
            <button key={tab.label} onClick={tab.onClick} className="flex flex-1 ga-press">
              {inner}
            </button>
          )
        }
        return (
          <Link key={tab.label} href={tab.href!} className="flex flex-1 ga-press">
            {inner}
          </Link>
        )
      })}
    </nav>
  )
}
