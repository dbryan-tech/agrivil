'use client'

// Recently-viewed browse history.
// ---------------------------------------------------------------------------
// This is genuinely ephemeral, per-device UI state (a browsing trail), so
// localStorage is the appropriate store — it is NOT catalog or account data.
// We persist only product IDs and resolve them against the live catalog so the
// rail always reflects current price/stock.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
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

  const record = useCallback((productId: string) => {
    // Read the freshest history straight from storage so we don't depend on
    // effect ordering (a child's record effect can fire before our hydrate
    // effect). localStorage is the single source of truth here.
    let current: string[] = []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) current = parsed.filter((x) => typeof x === 'string')
      }
    } catch {
      // ignore malformed storage
    }
    const next = [productId, ...current.filter((id) => id !== productId)].slice(0, MAX)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage may be unavailable (private mode) — keep in-memory only
    }
    setIds(next)
  }, [])

  const clear = useCallback(() => persist([]), [persist])

  return <Ctx.Provider value={{ ids, record, clear }}>{children}</Ctx.Provider>
}

/** Low-level access to the recently-viewed context (ids + record + clear). */
export function useRecentlyViewedCtx(): RecentlyViewedCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRecentlyViewedCtx must be used within RecentlyViewedProvider')
  return ctx
}

/**
 * Records a product view exactly once per mount (e.g. on a product page).
 * Safe to call unconditionally at the top of a component.
 */
export function useRecordView(productId: string | undefined) {
  const { record } = useRecentlyViewedCtx()
  useEffect(() => {
    if (productId) record(productId)
  }, [productId, record])
}

/**
 * Returns the recently-viewed products resolved against the live catalog,
 * most-recent first. Pass an `excludeId` (e.g. the current product) to omit it.
 */
export function useRecentlyViewed(excludeId?: string): Product[] {
  const { ids } = useRecentlyViewedCtx()
  const { liveProducts } = useDataStore()
  return useMemo(() => {
    const byId = new Map(liveProducts.map((p) => [p.id, p]))
    const out: Product[] = []
    for (const id of ids) {
      if (id === excludeId) continue
      const p = byId.get(id)
      if (p) out.push(p)
    }
    return out
  }, [ids, liveProducts, excludeId])
}
