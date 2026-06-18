'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  Bell,
  Package,
  Headphones,
  Award,
  Sparkles,
  Wallet,
  Check,
  Inbox,
} from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { useSession } from '@/components/golden-acres/auth/session-context'
import {
  getNotificationsForPhone,
  markNotificationsReadForPhone,
} from '@/app/actions/notifications'
import type { Notification, NotificationKind } from '@/lib/golden-acres/types'

const KIND_META: Record<
  NotificationKind,
  { icon: typeof Bell; color: string; bg: string }
> = {
  order: { icon: Package, color: '#4f7d2f', bg: '#e2efd2' },
  support: { icon: Headphones, color: '#2f6d7d', bg: '#d2e8ef' },
  reward: { icon: Award, color: '#9a6a00', bg: '#f7eccf' },
  promo: { icon: Sparkles, color: '#c0492e', bg: '#f3ddd5' },
  payout: { icon: Wallet, color: '#2f6d4f', bg: '#d2efe0' },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - Date.parse(iso)
  const min = Math.round(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.round(hr / 24)
  return `${d}d ago`
}

// Combine the authoritative DB feed with client-only (seeded/demo) notifications.
// DB rows win on id collisions; everything is sorted newest-first.
function mergeNotifications(
  dbItems: Notification[],
  localItems: Notification[],
): Notification[] {
  const seen = new Set(dbItems.map((n) => n.id))
  const combined = [...dbItems, ...localItems.filter((n) => !seen.has(n.id))]
  return combined.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  )
}

export function NotificationBell() {
  const { notificationsFor, markNotificationsRead } = useDataStore()
  const { account } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const phone = account?.role === 'customer' ? account.phone : undefined

  // DB-backed feed, polled so delivery events (written by the 3PL webhook)
  // surface in near-real-time. Falls back gracefully if the fetch fails.
  const { data: dbItems, mutate } = useSWR<Notification[]>(
    phone ? ['notifications', phone] : null,
    () => getNotificationsForPhone(phone as string),
    { refreshInterval: 10000, revalidateOnFocus: true, fallbackData: [] },
  )

  // Merge DB notifications with any client-only (seeded/demo) ones, newest first,
  // de-duplicated by id so a notification persisted server-side isn't shown twice.
  const localItems = phone ? notificationsFor(phone) : []
  const merged = mergeNotifications(dbItems ?? [], localItems)
  const items = merged
  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Only customers get the in-app feed.
  if (!phone) return null

  function markAllRead() {
    if (!phone) return
    markNotificationsRead(phone) // local/demo notifications
    // Optimistically clear DB unread, then persist.
    mutate(
      (cur) => (cur ?? []).map((n) => ({ ...n, read: true })),
      { revalidate: false },
    )
    markNotificationsReadForPhone(phone).catch(() => mutate())
  }

  function toggle() {
    const next = !open
    setOpen(next)
    // Opening clears the unread badge after a short beat so the user sees it.
    if (next && unread > 0 && phone) {
      window.setTimeout(markAllRead, 1200)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--ga-terracotta)] px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(92vw,22rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="ga-display font-semibold text-foreground">Notifications</p>
            {unread > 0 && phone && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-semibold text-field"
              >
                <Check className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto">
              {items.map((n) => {
                const m = KIND_META[n.kind]
                const Icon = m.icon
                const body = (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{ background: m.bg, color: m.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {n.title}
                      </p>
                      <p className="text-sm leading-snug text-muted-foreground">
                        {n.body}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground/70">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--ga-terracotta)]" />
                    )}
                  </div>
                )
                return (
                  <li
                    key={n.id}
                    className={n.read ? '' : 'bg-secondary/40'}
                  >
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className="block transition-colors hover:bg-secondary/60"
                      >
                        {body}
                      </Link>
                    ) : (
                      body
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-4 py-10 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                You&apos;re all caught up.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
