'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'ga-compare-v1'
const MAX_COMPARE = 4

interface CompareCtx {
  /** product ids queued for comparison (max 4) */
  ids: string[]
  count: number
  isComparing: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  /** true when the user has hit the 4-item cap */
  full: boolean
  max: number
}

const Ctx = createContext<CompareCtx | null>(null)

/**
 * Cross-product comparison tray. Lets shoppers queue up to 4 products from
 * anywhere in the catalog and view them side-by-side on /compare. Persisted to
 * localStorage so the selection survives navigation and reloads.
 */
export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as string[]
        if (Array.isArray(saved)) setIds(saved.slice(0, MAX_COMPARE))
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      /* quota */
    }
  }, [ids, hydrated])

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }, [])

  const remove = useCallback(
    (id: string) => setIds((prev) => prev.filter((p) => p !== id)),
    [],
  )

  const clear = useCallback(() => setIds([]), [])

  const value = useMemo<CompareCtx>(
    () => ({
      ids,
      count: ids.length,
      isComparing: (id: string) => ids.includes(id),
      toggle,
      remove,
      clear,
      full: ids.length >= MAX_COMPARE,
      max: MAX_COMPARE,
    }),
    [ids, toggle, remove, clear],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCompare(): CompareCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
