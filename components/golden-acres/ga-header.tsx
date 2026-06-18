'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useCart } from './cart-context'
import { useSession } from './auth/session-context'

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/bundles', label: 'Boxes' },
  { href: '/farmers', label: 'Our Farmers' },
  { href: '/local', label: 'Shop Local' },
]

export function GaHeader() {
  const pathname = usePathname()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'ga-header-blur sticky top-0 z-50 border-b',
        scrolled
          ? 'border-border bg-background/80 shadow-[0_8px_30px_-18px_rgba(8,22,15,0.5)] backdrop-blur-xl'
          : 'border-transparent bg-background/40 backdrop-blur-md',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6',
          scrolled ? 'h-14' : 'h-[4.5rem]',
        )}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="AgriVil home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:rotate-[-8deg]">
            <Wheat className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="ga-display text-xl leading-none text-foreground">AgriVil</span>
            <span className="ga-eyebrow mt-1 text-[9px] text-muted-foreground">
              by Golden Acres
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary transition-all duration-300',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground lg:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Accra pilot
          </span>

          <NotificationBell />

          <AccountControl />

          <Link
            href="/checkout"
            className="ga-sheen ga-press relative flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <ShoppingBasket className="h-5 w-5" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
          {NAV.map((item) => (
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

  if (!hydrated) return <span className="hidden h-10 w-20 rounded-full bg-secondary sm:block" />

  if (!account) {
    return (
      <Link
        href="/login"
        className="hidden h-10 items-center gap-1.5 rounded-full border border-field/30 px-4 text-sm font-semibold text-field transition-colors hover:bg-secondary sm:inline-flex"
      >
        <User className="h-4 w-4" />
        Sign in
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
          className="flex h-10 items-center gap-2 rounded-full border border-border px-2 pr-3 text-sm font-semibold text-foreground hover:bg-secondary"
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
        className="flex h-10 items-center gap-2 rounded-full border border-border px-2 pr-3 text-sm font-semibold text-foreground hover:bg-secondary"
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
      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-cream"
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
