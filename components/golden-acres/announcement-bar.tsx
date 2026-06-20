'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Megaphone, Tag, AlertTriangle } from 'lucide-react'
import useSWR from 'swr'
import {
  getActiveAnnouncement,
  type Announcement,
} from '@/app/actions/announcements'

const DISMISS_KEY = 'ga-announcement-dismissed'

const TONE_STYLES: Record<
  Announcement['tone'],
  { bg: string; fg: string; icon: typeof Megaphone }
> = {
  info: { bg: 'var(--ga-field-deep)', fg: 'var(--ga-cream)', icon: Megaphone },
  promo: { bg: 'var(--ga-copper-deep)', fg: 'var(--ga-cream)', icon: Tag },
  warning: { bg: 'var(--ga-deal)', fg: '#fff', icon: AlertTriangle },
}

export function AnnouncementBar() {
  const { data } = useSWR('active-announcement', () => getActiveAnnouncement(), {
    revalidateOnFocus: false,
  })
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  // Read the dismissed banner id once on mount (session-scoped via localStorage).
  useEffect(() => {
    try {
      setDismissedId(localStorage.getItem(DISMISS_KEY))
    } catch {
      /* ignore */
    }
  }, [])

  if (!data || !data.active) return null
  if (dismissedId === data.id) return null

  const tone = TONE_STYLES[data.tone] ?? TONE_STYLES.info
  const Icon = tone.icon

  function dismiss() {
    if (!data) return
    try {
      localStorage.setItem(DISMISS_KEY, data.id)
    } catch {
      /* ignore */
    }
    setDismissedId(data.id)
  }

  return (
    <div
      className="relative flex items-center justify-center gap-2 px-10 py-2 text-center text-xs font-semibold sm:text-sm"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
      role="region"
      aria-label="Site announcement"
    >
      <Icon className="hidden h-4 w-4 shrink-0 opacity-90 sm:block" />
      <p className="text-pretty leading-snug">
        {data.message}
        {data.ctaLabel && data.ctaHref && (
          <Link
            href={data.ctaHref}
            className="ml-2 inline-flex items-center gap-1 underline decoration-2 underline-offset-2 hover:opacity-80"
          >
            {data.ctaLabel}
          </Link>
        )}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-black/15"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
