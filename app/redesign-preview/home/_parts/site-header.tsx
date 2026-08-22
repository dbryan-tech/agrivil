'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search, ShoppingBasket, Menu, X, User, Heart, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { SearchAutocomplete } from '@/components/golden-acres/search/search-autocomplete'

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/farmers', label: 'Farmers' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/bundles', label: 'Boxes' },
  { href: '/sell', label: 'Sell with us' },
]

/**
 * SiteHeader — the redesigned frosted header (docs/redesign/01 §3.7).
 * One 56px bar: wordmark, centered nav, search affordance, basket/account.
 * Transparent-over-hero on the home route, frosted everywhere else and
 * after 8px of scroll on home. Route-aware per the Apple-editorial spec.
 */
export function SiteHeader({ forceDark = false }: { forceDark?: boolean }) {
  const pathname = usePathname()
  const { count, openDrawer } = useCart()
  const { account, hydrated } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const overHero = pathname === '/' || forceDark

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dark = overHero && !scrolled && !menu

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        dark
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-[rgba(33,26,18,0.08)] bg-white/75 backdrop-blur-xl [backdrop-filter:saturate(180%)_blur(20px)]',
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5 sm:px-8">
        {/* Wordmark — pure typographic lockup */}
        <Link
          href="/"
          aria-label="AgriVil home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span
            className={cn(
              'text-[17px] font-bold tracking-[0.02em] transition-colors duration-500',
              dark ? 'text-white' : 'text-[#211A12]',
            )}
          >
            AgriVil
          </span>
          <span
            aria-hidden
            className={cn(
              'hidden h-3.5 w-px transition-colors duration-500 sm:block',
              dark ? 'bg-white/30' : 'bg-[rgba(33,26,18,0.2)]',
            )}
          />
          <span
            className={cn(
              'hidden text-[11px] transition-colors duration-500 sm:block',
              dark ? 'text-white/60' : 'text-[#8A7E72]',
            )}
          >
            Ghana
          </span>
        </Link>

        {/* Centered nav (desktop) */}
        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === '/shop'
                ? pathname.startsWith('/shop') || pathname.startsWith('/product')
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-1 text-[13px] font-medium transition-colors duration-300',
                  dark
                    ? active
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                    : active
                      ? 'text-[#211A12]'
                      : 'text-[#5C5247] hover:text-[#211A12]',
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-300',
                    dark ? 'bg-white' : 'bg-[#211A12]',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/shop"
            aria-label="Search produce"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
              dark ? 'text-white/80 hover:bg-white/10' : 'text-[#3D332A] hover:bg-[rgba(33,26,18,0.05)]',
            )}
          >
            <Search width={18} height={18} />
          </Link>
          {account?.role === 'customer' && (
            <Link
              href="/account"
              aria-label="Saved items"
              className={cn(
                'hidden h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 sm:flex',
                dark ? 'text-white/80 hover:bg-white/10' : 'text-[#3D332A] hover:bg-[rgba(33,26,18,0.05)]',
              )}
            >
              <Heart width={18} height={18} />
            </Link>
          )}
          <AccountChip dark={dark} hydrated={hydrated} account={account} />
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Open basket${count > 0 ? `, ${count} items` : ''}`}
            className={cn(
              'relative ml-1 flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-all duration-300 active:scale-[0.97]',
              dark
                ? 'bg-white text-[#211A12] hover:bg-white/90'
                : 'bg-[#0B3B25] text-white hover:bg-[#0F4A2E]',
            )}
          >
            <ShoppingBasket width={16} height={16} />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span
                className={cn(
                  'absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
                  dark ? 'bg-[#211A12] text-white' : 'bg-[#7A3F1C] text-white',
                )}
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? 'Close menu' : 'Open menu'}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden',
              dark ? 'text-white' : 'text-[#211A12]',
            )}
          >
            {menu ? <X width={19} height={19} /> : <Menu width={19} height={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menu && (
        <nav className="border-t border-[rgba(33,26,18,0.08)] bg-white px-5 pb-6 pt-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenu(false)}
              className="group flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] py-3.5 text-[16px] font-medium text-[#211A12]"
            >
              {item.label}
              <ArrowRight
                width={16}
                height={16}
                className="text-[#8A7E72] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          ))}
          {!hydrated ? null : account ? (
            <Link
              href={account.role === 'customer' ? '/account' : account.role === 'farmer' ? '/farmer' : '/support'}
              onClick={() => setMenu(false)}
              className="mt-4 flex h-11 items-center justify-center rounded-full bg-[#0B3B25] text-[14px] font-semibold text-white"
            >
              {account.role === 'customer'
                ? 'My account'
                : account.role === 'farmer'
                  ? 'Farmer portal'
                  : 'Staff console'}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenu(false)}
              className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[14px] font-semibold text-white"
            >
              <User width={16} height={16} /> Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}

function AccountChip({
  dark,
  hydrated,
  account,
}: {
  dark: boolean
  hydrated: boolean
  account: { name: string; avatarColor: string; role: string } | null
}) {
  if (!hydrated) return <span className="hidden h-9 w-9 sm:block" />
  const href =
    !account ? '/login' : account.role === 'customer' ? '/account' : account.role === 'farmer' ? '/farmer' : '/support'
  return (
    <Link
      href={href}
      aria-label={account ? `Account: ${account.name}` : 'Sign in'}
      className={cn(
        'hidden h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-300 sm:flex',
        account
          ? 'text-white'
          : dark
            ? 'text-white/80 hover:bg-white/10'
            : 'text-[#3D332A] hover:bg-[rgba(33,26,18,0.05)]',
      )}
      style={account ? { background: account.avatarColor } : undefined}
    >
      {account ? account.name.charAt(0) : <User width={18} height={18} />}
    </Link>
  )
}

/** Compact search overlay trigger — full palette arrives with phase 02. */
export function HeaderSearchSlot() {
  return <SearchAutocomplete className="hidden" category="All" />
}
