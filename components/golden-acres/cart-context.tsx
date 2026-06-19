'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/golden-acres/types'
import { products as catalog } from '@/lib/golden-acres/data'

const STORAGE_KEY = 'ga-cart-v1'

export interface CartLine {
  product: Product
  qty: number
}

interface CartCtx {
  lines: CartLine[]
  count: number
  subtotalEstimate: number
  add: (product: Product, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  lastAdded: string | null
  /** mini-cart drawer */
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const Ctx = createContext<CartCtx | null>(null)

// Estimated line price: variable-weight items use est weight × price/kg,
// fixed-unit items use their flat unit price.
export function unitEstimate(product: Product): number {
  return product.variableWeight
    ? product.estWeightKg * product.pricePerKg
    : product.priceMin
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [lastAdded, setLastAdded] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  // Rehydrate basket from localStorage (store ids + qty, resolve products).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved: { id: string; qty: number }[] = JSON.parse(raw)
        const restored = saved
          .map(({ id, qty }) => {
            const product = catalog.find((p) => p.id === id)
            return product ? { product, qty } : null
          })
          .filter((l): l is CartLine => l !== null)
        if (restored.length) setLines(restored)
      }
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true)
  }, [])

  // Persist on change (after initial hydrate, so we don't clobber storage).
  useEffect(() => {
    if (!hydrated) return
    const slim = lines.map((l) => ({ id: l.product.id, qty: l.qty }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
  }, [lines, hydrated])

  const add: CartCtx['add'] = (product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id)
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + qty } : l,
        )
      }
      return [...prev, { product, qty }]
    })
    setLastAdded(product.id)
    setDrawerOpen(true)
    setTimeout(() => setLastAdded((id) => (id === product.id ? null : id)), 1600)
  }

  const setQty: CartCtx['setQty'] = (productId, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.product.id !== productId)
        : prev.map((l) => (l.product.id === productId ? { ...l, qty } : l)),
    )
  }

  const remove: CartCtx['remove'] = (productId) =>
    setLines((prev) => prev.filter((l) => l.product.id !== productId))

  const clear = () => setLines([])

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0)
    const subtotalEstimate = lines.reduce(
      (s, l) => s + unitEstimate(l.product) * l.qty,
      0,
    )
    return {
      lines,
      count,
      subtotalEstimate,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }
  }, [lines, lastAdded, drawerOpen])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
