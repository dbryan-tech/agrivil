'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, MapPin, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { count } = useCart()

  // Define the 5 primary tabs matching the mockups and IA specs
  const TABS = [
    { href: '/m', label: 'Home', icon: Home, match: (p: string) => p === '/m' },
    { href: '/m/categories', label: 'Categories', icon: Grid, match: (p: string) => p.startsWith('/m/categories') },
    { href: '/m/local', label: 'Shop Local', icon: MapPin, match: (p: string) => p.startsWith('/m/local') },
    { href: '/m/orders', label: 'Orders', icon: ShoppingBag, badge: count, match: (p: string) => p.startsWith('/m/orders') },
    { href: '/m/account', label: 'Account', icon: User, match: (p: string) => p.startsWith('/m/account') },
  ]

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-[#E0DACB] bg-[#FAF7F0] px-2 shadow-xs"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)', paddingTop: '6px' }}
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname)
        const Icon = tab.icon

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              'ga-press relative flex flex-1 flex-col items-center justify-center py-1 transition-colors',
              active ? 'text-[#0F7A43]' : 'text-[#6E6A63] hover:text-[#2B1F17]'
            )}
          >
            <div className="relative">
              <Icon className={cn('h-5 w-5', active && 'stroke-[2.4]')} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0F7A43] px-1 text-[9px] font-bold text-white shadow-xs">
                  {tab.badge! > 9 ? '9+' : tab.badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                'mt-1 text-[11px] font-semibold tracking-tight',
                active ? 'text-[#0F7A43] font-bold' : 'text-[#6E6A63]'
              )}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
