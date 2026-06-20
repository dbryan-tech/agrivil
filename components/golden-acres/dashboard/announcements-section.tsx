'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Megaphone,
  Plus,
  Trash2,
  Loader2,
  Tag,
  AlertTriangle,
  Check,
} from 'lucide-react'
import {
  listAnnouncements,
  createAnnouncement,
  setAnnouncementActive,
  deleteAnnouncement,
  type Announcement,
  type AnnouncementTone,
} from '@/app/actions/announcements'

const TONES: { id: AnnouncementTone; label: string; icon: typeof Megaphone }[] = [
  { id: 'info', label: 'Info', icon: Megaphone },
  { id: 'promo', label: 'Promo', icon: Tag },
  { id: 'warning', label: 'Warning', icon: AlertTriangle },
]

export function AnnouncementsSection() {
  const { data, isLoading, mutate } = useSWR('admin-announcements', () =>
    listAnnouncements(),
  )
  const [message, setMessage] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaHref, setCtaHref] = useState('')
  const [tone, setTone] = useState<AnnouncementTone>('info')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!message.trim()) {
      setError('Message is required.')
      return
    }
    setSaving(true)
    setError(null)
    const res = await createAnnouncement({
      message,
      ctaLabel: ctaLabel || undefined,
      ctaHref: ctaHref || undefined,
      tone,
    })
    setSaving(false)
    if (res.ok) {
      setMessage('')
      setCtaLabel('')
      setCtaHref('')
      setTone('info')
      mutate()
    } else {
      setError(res.error ?? 'Could not create announcement.')
    }
  }

  async function toggle(a: Announcement) {
    await setAnnouncementActive(a.id, !a.active)
    mutate()
  }

  async function remove(id: string) {
    await deleteAnnouncement(id)
    mutate()
  }

  const announcements = data ?? []
  const activeCount = announcements.filter((a) => a.active).length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="ga-display text-2xl font-bold text-foreground">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Broadcast a banner across the storefront. The most recent active
          banner is shown to shoppers.
        </p>
      </header>

      {/* Create form */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Plus className="h-4 w-4" /> New announcement
        </h2>
        <div className="mt-4 space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            maxLength={240}
            placeholder="e.g. Free delivery this weekend on orders over GH₵100"
            className="ga-input w-full resize-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Button label (optional)"
              className="ga-input"
            />
            <input
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="Link, e.g. /shop (optional)"
              className="ga-input"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Tone:
            </span>
            {TONES.map((t) => {
              const Icon = t.icon
              const active = tone === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[var(--ga-field-deep)] text-[var(--ga-cream)]'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              )
            })}
          </div>
          {error && (
            <p className="text-xs font-semibold text-[var(--ga-deal)]">{error}</p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="ga-scale-interactive inline-flex items-center gap-2 rounded-xl bg-[var(--ga-field-deep)] px-5 py-2.5 text-sm font-bold text-[var(--ga-cream)] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Megaphone className="h-4 w-4" />
            )}
            Publish announcement
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            All announcements
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {activeCount} active
          </span>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="ga-skeleton h-20 rounded-xl border border-border"
              />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <Megaphone className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-semibold text-foreground">
              No announcements yet
            </p>
            <p className="text-xs text-muted-foreground">
              Publish one above to greet shoppers across the storefront.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        a.tone === 'promo'
                          ? 'bg-[var(--ga-copper-deep)]/15 text-[var(--ga-copper-deep)]'
                          : a.tone === 'warning'
                            ? 'bg-[var(--ga-deal)]/15 text-[var(--ga-deal)]'
                            : 'bg-[var(--ga-field-deep)]/15 text-[var(--ga-field-deep)]'
                      }`}
                    >
                      {a.tone}
                    </span>
                    {a.active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ga-leaf)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ga-leaf)]">
                        <Check className="h-3 w-3" /> Live
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">
                    {a.message}
                  </p>
                  {a.ctaLabel && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      CTA: {a.ctaLabel} → {a.ctaHref}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(a)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
                  >
                    {a.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label="Delete announcement"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-[var(--ga-deal)]/10 hover:text-[var(--ga-deal)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
