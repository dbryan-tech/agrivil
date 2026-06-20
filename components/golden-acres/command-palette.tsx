'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Store,
  Users,
  Package,
  Heart,
  Award,
  Home,
  ShoppingBasket,
  CornerDownLeft,
  Leaf,
} from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { products as catalog, farmers as allFarmers } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { productEstimate } from '@/lib/golden-acres/data'

interface Cmd {
  id: string
  label: string
  sub?: string
  icon: typeof Search
  image?: string
  price?: number
  href: string
  group: 'Pages' | 'Products' | 'Farms'
}

const PAGE_COMMANDS: Cmd[] = [
  { id: 'p-home', label: 'Home', icon: Home, href: '/', group: 'Pages' },
  { id: 'p-shop', label: 'Shop all produce', icon: Store, href: '/shop', group: 'Pages' },
  { id: 'p-farmers', label: 'Meet the farmers', icon: Users, href: '/farmers', group: 'Pages' },
  { id: 'p-bundles', label: 'Bundles & boxes', icon: ShoppingBasket, href: '/bundles', group: 'Pages' },
  { id: 'p-orders', label: 'My orders', icon: Package, href: '/account?tab=orders', group: 'Pages' },
  { id: 'p-wishlist', label: 'My favorites', icon: Heart, href: '/account?tab=favorites', group: 'Pages' },
  { id: 'p-rewards', label: 'Rewards & points', icon: Award, href: '/account?tab=rewards', group: 'Pages' },
]

/**
 * Global command palette (⌘K / Ctrl-K). Provides instant fuzzy access to
 * pages, products and farms from anywhere in the storefront — the kind of
 * power-user navigation expected of a polished, industry-grade marketplace.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Global hotkey
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const results = useMemo<Cmd[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return PAGE_COMMANDS
    const pages = PAGE_COMMANDS.filter((c) => c.label.toLowerCase().includes(q))
    const products: Cmd[] = catalog
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6)
      .map((p) => ({
        id: 'prod-' + p.id,
        label: p.name,
        sub: p.category,
        icon: Leaf,
        image: p.image,
        price: productEstimate(p),
        href: `/shop/${p.slug}`,
        group: 'Products',
      }))
    const farms: Cmd[] = allFarmers
      .filter((f) => f.farmName.toLowerCase().includes(q) || f.region.toLowerCase().includes(q))
      .slice(0, 4)
      .map((f) => ({
        id: 'farm-' + f.id,
        label: f.farmName,
        sub: `${f.region} · ${f.name}`,
        icon: Users,
        href: `/farmers/${f.slug}`,
        group: 'Farms',
      }))
    return [...pages, ...products, ...farms]
  }, [query])

  useEffect(() => setActive(0), [query])

  function go(cmd: Cmd) {
    setOpen(false)
    router.push(cmd.href)
  }

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active])
    }
  }

  if (!open) return null

  // Group results for display
  const groups: Cmd['group'][] = ['Pages', 'Products', 'Farms']

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="ga-scale-in w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onListKey}
            placeholder="Search produce, farms or pages…"
            className="h-14 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No matches for “{query}”
            </p>
          )}
          {groups.map((group) => {
            const items = results.filter((r) => r.group === group)
            if (items.length === 0) return null
            return (
              <div key={group} className="mb-1">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {group}
                </p>
                {items.map((cmd) => {
                  const idx = results.indexOf(cmd)
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.id}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(cmd)}
                      className={[
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        idx === active ? 'bg-primary/10' : 'hover:bg-secondary/50',
                      ].join(' ')}
                    >
                      {cmd.image ? (
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-secondary/40">
                          <SmartImage src={cmd.image} alt="" fill className="object-cover" />
                        </span>
                      ) : (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-muted-foreground">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                      )}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {cmd.label}
                        </span>
                        {cmd.sub && (
                          <span className="truncate text-xs text-muted-foreground">{cmd.sub}</span>
                        )}
                      </span>
                      {cmd.price !== undefined && (
                        <span className="ga-price shrink-0 text-sm text-foreground">
                          {formatGHS(cmd.price)}
                        </span>
                      )}
                      {idx === active && (
                        <CornerDownLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border px-1 py-0.5 font-bold">↑↓</kbd> navigate
            <kbd className="ml-2 rounded border border-border px-1 py-0.5 font-bold">↵</kbd> open
          </span>
          <span className="font-semibold">Golden Acres</span>
        </div>
      </div>
    </div>
  )
}
