'use client'

// Recently-viewed browse history.
// ---------------------------------------------------------------------------
// This is genuinely ephemeral, per-device UI state (a browsing trail), so
// localStorage is the appropriate store — it is NOT catalog or account data.
// We persist only product IDs and resolve them against the live catalog so the
// rail always reflects current price/stock.

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Product } from '@/lib/golden-acres/types'

const STORAGE_KEY = 'ga-recently-viewed-v1'
const MAX = 12

interface RecentlyViewedCtx {
  /** product IDs, most-recent first */
  ids: string[]
  record: (productId: string) => void
  clear: () => void
}

const Ctx = createContext<RecentlyViewedCtx | null>(null)

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([])

  // hydrate once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === 'string').slice(0, MAX))
      }
    } catch {
      // ignore malformed storage
    }
  }, [])

  const persist = useCallback((next: string[]) => {
    setIds(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage may be unavailable (private mode) — keep in-memory only
    }
  }, [])

  const record = useCallback(
    (productId: string) => {
      setIds((prev) => {
        const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    [],
  )

  const clear = useCallback(() => persist([]), [persist])

  return <Ctx.Provider value={{ ids, record, clear }}>{children}</Ctx.Provider>
}

export function useRecentlyViewed(): RecentlyViewedCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}

/** Resolve the recorded IDs against a product list, preserving recency order. */
export function resolveRecent(ids: string[], products: Product[], excludeId?: string): Product[] {
  const byId = new Map(products.map((p) => [p.id, p]))
  const out: Product[] = []
  for (const id of ids) {
    if (id === excludeId) continue
    const p = byId.get(id)
    if (p && p.status !== 'delisted') out.push(p)
  }
  return out
}
