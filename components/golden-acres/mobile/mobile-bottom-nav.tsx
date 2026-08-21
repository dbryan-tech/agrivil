'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ShoppingBag, User, LayoutGrid } from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { count } = useCart()

  const TABS = [
    { href: '/m', label: 'Home', icon: Home, match: (p: string) => p === '/m' },
    { href: '/m/categories', label: 'Categories', icon: LayoutGrid, match: (p: string) => p.startsWith('/m/categories') },
    { href: '/m/orders', label: 'Orders', icon: Package, match: (p: string) => p.startsWith('/m/orders') },
    { href: '/m/cart', label: 'Cart', icon: ShoppingBag, badge: count, match: (p: string) => p.startsWith('/m/cart') },
    { href: '/m/account', label: 'Account', icon: User, match: (p: string) => p.startsWith('/m/account') },
  ]

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[rgba(33,26,18,0.06)] bg-[#FDFDFB] px-1.5 shadow-[0_-4px_20px_rgba(33,26,18,0.04)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)', paddingTop: '6px' }}
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname)
        const Icon = tab.icon

        return (
          <Link
            key={tab.label}
            href={tab.href}
            prefetch={true}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center py-1 transition-all active:scale-95',
              active ? 'text-[#0B3B25]' : 'text-[#5C5247] hover:text-[#211A12]'
            )}
          >
            <div className="relative">
              <Icon className={cn('h-5 w-5', active ? 'stroke-[2.6] text-[#0B3B25]' : 'stroke-[2] text-[#5C5247]')} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0B3B25] px-1 text-[9px] font-black text-white shadow-xs">
                  {tab.badge! > 9 ? '9+' : tab.badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                'mt-1 text-[10.5px] tracking-tight',
                active ? 'text-[#0B3B25] font-black' : 'text-[#5C5247] font-semibold'
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

