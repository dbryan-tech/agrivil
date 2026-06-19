'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, Leaf, Store, TrendingUp, X } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { buildSuggestions, POPULAR_SEARCHES, type Suggestion } from '@/lib/golden-acres/search'
import { formatGHS } from '@/lib/golden-acres/format'

const RECENT_KEY = 'ga-recent-searches-v1'
const MAX_RECENT = 5

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (Array.isArray(p)) return p.filter((x) => typeof x === 'string').slice(0, MAX_RECENT)
    }
  } catch {
    /* ignore */
  }
  return []
}

function pushRecent(term: string) {
  const t = term.trim()
  if (!t) return
  try {
    const cur = loadRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())
    localStorage.setItem(RECENT_KEY, JSON.stringify([t, ...cur].slice(0, MAX_RECENT)))
  } catch {
    /* ignore */
  }
}

export function SearchAutocomplete({
  className,
  inputClassName,
  placeholder = 'Search fresh tomatoes, plantain, pepper, yam…',
  category = 'All',
  leadingSlot,
  rounded = true,
  autoFocus = false,
}: {
  className?: string
  inputClassName?: string
  placeholder?: string
  category?: string
  /** e.g. the category <select> rendered inside the pill */
  leadingSlot?: React.ReactNode
  rounded?: boolean
  autoFocus?: boolean
}) {
  const router = useRouter()
  const { liveProducts, farmers } = useDataStore()

  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState<string[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => setRecent(loadRecent()), [])

  // debounce the query feeding the suggestion engine
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120)
    return () => clearTimeout(t)
  }, [query])

  const suggestions = useMemo<Suggestion[]>(
    () => buildSuggestions(debounced, { products: liveProducts, farmers }),
    [debounced, liveProducts, farmers],
  )

  const showEmptyState = query.trim().length < 2
  // flat list of selectable rows for keyboard nav
  const rows: { type: 'term' | 'suggestion'; value: string | Suggestion }[] = showEmptyState
    ? [
        ...recent.map((r) => ({ type: 'term' as const, value: r })),
        ...POPULAR_SEARCHES.map((p) => ({ type: 'term' as const, value: p as string })),
      ]
    : suggestions.map((s) => ({ type: 'suggestion' as const, value: s }))

  // close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function goToShop(q: string) {
    pushRecent(q)
    setRecent(loadRecent())
    setOpen(false)
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (category !== 'All') params.set('category', category)
    router.push(`/shop${params.toString() ? `?${params}` : ''}`)
  }

  function pickSuggestion(s: Suggestion) {
    setOpen(false)
    if (s.kind === 'product') {
      pushRecent(s.label)
      router.push(`/shop/${s.slug}`)
    } else if (s.kind === 'farm') {
      router.push(`/farmers/${s.slug}`)
    } else {
      setOpen(false)
      router.push(`/shop?category=${encodeURIComponent(s.label)}`)
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, rows.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    } else if (e.key === 'Enter') {
      if (active >= 0 && rows[active]) {
        const r = rows[active]
        if (r.type === 'term') goToShop(r.value as string)
        else pickSuggestion(r.value as Suggestion)
      } else {
        goToShop(query)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          goToShop(query)
        }}
        className={`flex h-full w-full items-center overflow-hidden border border-primary/40 bg-secondary/40 transition-[border-color,box-shadow] duration-300 focus-within:border-primary/80 focus-within:ga-elev-1 ${
          rounded ? 'rounded-full' : 'rounded-2xl'
        }`}
      >
        {leadingSlot}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          aria-label="Search produce"
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
          className={`h-full flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 ${inputClassName ?? ''}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setOpen(true)
            }}
            aria-label="Clear search"
            className="flex h-full items-center px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="ga-press flex h-full items-center justify-center bg-primary px-5 text-primary-foreground"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Dropdown */}
      {open && rows.length > 0 && (
        <div className="ga-elev-3 absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card py-2">
          {showEmptyState ? (
            <>
              {recent.length > 0 && (
                <div className="px-2 pb-1">
                  <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Recent
                  </p>
                  {recent.map((term, i) => (
                    <SuggestionButton
                      key={`r-${term}`}
                      active={active === i}
                      onClick={() => goToShop(term)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{term}</span>
                    </SuggestionButton>
                  ))}
                </div>
              )}
              <div className="px-2">
                <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Popular
                </p>
                {POPULAR_SEARCHES.map((term, i) => (
                  <SuggestionButton
                    key={`p-${term}`}
                    active={active === recent.length + i}
                    onClick={() => goToShop(term)}
                  >
                    <TrendingUp className="h-4 w-4 text-[var(--ga-star)]" />
                    <span className="font-medium text-foreground">{term}</span>
                  </SuggestionButton>
                ))}
              </div>
            </>
          ) : (
            <div className="px-2">
              {suggestions.map((s, i) => (
                <SuggestionRow
                  key={`${s.kind}-${s.label}-${i}`}
                  s={s}
                  active={active === i}
                  onClick={() => pickSuggestion(s)}
                />
              ))}
              <button
                type="button"
                onClick={() => goToShop(query)}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-primary hover:bg-secondary"
              >
                <Search className="h-4 w-4" />
                Search for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SuggestionButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
        active ? 'bg-secondary' : 'hover:bg-secondary/60'
      }`}
    >
      {children}
    </button>
  )
}

function SuggestionRow({
  s,
  active,
  onClick,
}: {
  s: Suggestion
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${
        active ? 'bg-secondary' : 'hover:bg-secondary/60'
      }`}
    >
      {s.kind === 'product' && (
        <>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
            <SmartImage src={s.image} alt={s.label} fill className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-foreground">{s.label}</span>
            <span className="block truncate text-xs text-muted-foreground">{s.sublabel}</span>
          </span>
          <span className="shrink-0 text-sm font-bold text-foreground">{formatGHS(s.priceFrom)}</span>
        </>
      )}
      {s.kind === 'category' && (
        <>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-foreground">{s.label}</span>
            <span className="block text-xs text-muted-foreground">Category · {s.count} items</span>
          </span>
        </>
      )}
      {s.kind === 'farm' && (
        <>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-card">
            <SmartImage src={s.image} alt={s.label} fill className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-foreground">{s.label}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Store className="h-3 w-3" /> {s.sublabel}
            </span>
          </span>
        </>
      )}
    </button>
  )
}
