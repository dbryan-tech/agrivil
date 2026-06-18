'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { NotificationBell } from '@/components/golden-acres/notifications/notification-bell'
import {
  ShoppingBasket,
  MapPin,
  Menu,
  X,
  Wheat,
  User,
  Package,
  Repeat,
  LogOut,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Heart,
  ChevronDown,
  Headphones,
  Store,
  Truck,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useCart } from './cart-context'
import { useSession } from './auth/session-context'

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Leafy Greens',
  'Grains & Legumes',
  'Herbs & Spices',
] as const

const PRIMARY_NAV = [
  { href: '/shop', label: 'All Produce' },
  { href: '/bundles', label: 'Boxes & Subscriptions' },
  { href: '/farmers', label: 'Our Farmers' },
  { href: '/local', label: 'Shop Local' },
]

export function GaHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (cat !== 'All') params.set('category', cat)
    router.push(`/shop${params.toString() ? `?${params}` : ''}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-header text-header-foreground">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6">
          <Link href="/local" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">Deliver to</span>
            <span className="font-semibold underline-offset-2 hover:underline">Accra Pilot · GA-183</span>
          </Link>
          <nav className="flex items-center gap-4 font-medium">
            <Link href="/farmer" className="hidden items-center gap-1.5 hover:opacity-80 sm:flex">
              <Store className="h-3.5 w-3.5" /> Sell on AgriVil
            </Link>
            <Link href="/account" className="hidden items-center gap-1.5 hover:opacity-80 sm:flex">
              <Truck className="h-3.5 w-3.5" /> Track order
            </Link>
            <Link href="/help" className="flex items-center gap-1.5 hover:opacity-80">
              <Headphones className="h-3.5 w-3.5" /> Help
            </Link>
          </nav>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="AgriVil home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:rotate-[-8deg]">
              <Wheat className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="ga-headline text-xl leading-none text-foreground">AgriVil</span>
              <span className="ga-kicker mt-1 text-[8px] tracking-[0.16em] text-muted-foreground">
                by Golden Acres
              </span>
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={submitSearch}
            className="hidden h-11 flex-1 items-center overflow-hidden rounded-full border-2 border-primary/80 bg-card md:flex"
          >
            <div className="relative flex h-full items-center border-r border-border">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                aria-label="Search category"
                className="h-full cursor-pointer appearance-none bg-secondary/60 pl-4 pr-9 text-sm font-semibold text-secondary-foreground outline-none"
              >
                <option value="All">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fresh tomatoes, plantain, pepper, yam…"
              className="h-full flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-full items-center justify-center bg-primary px-5 text-primary-foreground transition-colors hover:bg-field-deep"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
            <NotificationBell />
            <WishlistLink />
            <AccountControl />
            <Link
              href="/checkout"
              className="ga-press relative ml-1 flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-field-deep"
            >
              <ShoppingBasket className="h-5 w-5" />
              <span className="hidden lg:inline">Basket</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={submitSearch} className="px-4 pb-3 md:hidden">
          <div className="flex h-11 items-center overflow-hidden rounded-full border-2 border-primary/80 bg-card">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fresh produce…"
              className="h-full flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" aria-label="Search" className="flex h-full items-center bg-primary px-4 text-primary-foreground">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Category nav strip */}
      <div className="border-b border-border bg-card/95 backdrop-blur">
        <div className="ga-rail mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative whitespace-nowrap px-3 py-2.5 text-sm font-semibold transition-colors',
                  active ? 'text-primary' : 'text-foreground/70 hover:text-foreground',
                )}
              >
                {item.label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
          <span className="mx-1 h-4 w-px shrink-0 bg-border" />
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <nav className="border-b border-border bg-card px-4 py-3 md:hidden">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-semibold text-foreground hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          <MobileAccountLinks onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </header>
  )
}

function WishlistLink() {
  const { account } = useSession()
  if (account?.role !== 'customer') return null
  return (
    <Link
      href="/account"
      aria-label="Saved items"
      className="hidden h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary sm:flex"
    >
      <Heart className="h-5 w-5" />
    </Link>
  )
}

function AccountControl() {
  const { account, hydrated, signOut } = useSession()
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!hydrated) return <span className="hidden h-11 w-24 rounded-full bg-secondary sm:block" />

  if (!account) {
    return (
      <Link
        href="/login"
        className="hidden h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:inline-flex"
      >
        <User className="h-5 w-5" />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-medium text-muted-foreground">Hello, sign in</span>
          <span className="text-sm font-bold">Account</span>
        </span>
      </Link>
    )
  }

  // Non-customers get a quick link to their workspace.
  if (account.role !== 'customer') {
    const dest = account.role === 'farmer' ? '/farmer' : '/support'
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setMenu((m) => !m)}
          className="flex h-11 items-center gap-2 rounded-full px-2 pr-3 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          <Monogram account={account} />
          <span className="hidden sm:inline">{account.name.split(' ')[0]}</span>
        </button>
        {menu && (
          <Menu_
            onClose={() => setMenu(false)}
            items={[
              { href: dest, label: account.role === 'farmer' ? 'Farmer Portal' : 'Ops Console', icon: LayoutDashboard },
            ]}
            onSignOut={signOut}
          />
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setMenu((m) => !m)}
        className="flex h-11 items-center gap-2 rounded-full px-2 pr-3 text-sm font-semibold text-foreground hover:bg-secondary"
        aria-label="Account menu"
      >
        <Monogram account={account} />
        <span className="hidden sm:inline">{account.name.split(' ')[0]}</span>
      </button>
      {menu && (
        <Menu_
          onClose={() => setMenu(false)}
          items={[
            { href: '/account', label: 'My Account', icon: User },
            { href: '/account', label: 'Orders', icon: Package },
            { href: '/account', label: 'My Boxes', icon: Repeat },
            { href: '/help', label: 'Help & Support', icon: LifeBuoy },
          ]}
          onSignOut={signOut}
        />
      )}
    </div>
  )
}

function Monogram({ account }: { account: { name: string; avatarColor: string } }) {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-cream"
      style={{ background: account.avatarColor }}
    >
      {account.name.charAt(0)}
    </span>
  )
}

function Menu_({
  items,
  onSignOut,
  onClose,
}: {
  items: { href: string; label: string; icon: typeof User }[]
  onSignOut: () => void
  onClose: () => void
}) {
  return (
    <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      {items.map((it, i) => (
        <Link
          key={i}
          href={it.href}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          <it.icon className="h-4 w-4 text-muted-foreground" />
          {it.label}
        </Link>
      ))}
      <button
        onClick={() => {
          onClose()
          onSignOut()
        }}
        className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-sm font-semibold text-clay hover:bg-clay/10"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  )
}

function MobileAccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const { account, hydrated, signOut } = useSession()
  if (!hydrated) return null

  if (!account) {
    return (
      <div className="mt-2 flex gap-2 border-t border-border pt-3">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex-1 rounded-lg border border-field/30 py-3 text-center text-base font-semibold text-field"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          onClick={onNavigate}
          className="flex-1 rounded-lg bg-field py-3 text-center text-base font-bold text-cream"
        >
          Sign up
        </Link>
      </div>
    )
  }

  const dest =
    account.role === 'customer' ? '/account' : account.role === 'farmer' ? '/farmer' : '/support'
  const label =
    account.role === 'customer'
      ? 'My Account'
      : account.role === 'farmer'
        ? 'Farmer Portal'
        : 'Ops Console'

  return (
    <div className="mt-2 border-t border-border pt-3">
      <Link
        href={dest}
        onClick={onNavigate}
        className="block rounded-lg px-3 py-3 text-base font-semibold text-foreground hover:bg-secondary"
      >
        {label}
      </Link>
      <button
        onClick={() => {
          onNavigate()
          signOut()
        }}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-clay"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  )
}
