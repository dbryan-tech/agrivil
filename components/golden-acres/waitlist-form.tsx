'use client'

import { useState } from 'react'
import { joinWaitlist } from '@/lib/golden-acres/api'
import { Loader2, MapPin, Check, Users } from 'lucide-react'

export function WaitlistForm({
  area,
  ghanaPostGPS,
  compact = false,
}: {
  area?: string
  ghanaPostGPS?: string
  compact?: boolean
}) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<null | {
    position: number
    areaInterest: number
    message: string
  }>(null)

  async function submit() {
    if (!name || !contact) return
    setBusy(true)
    const res = await joinWaitlist({ name, contact, area, ghanaPostGPS })
    setBusy(false)
    if (res.ok) setDone(res)
  }

  if (done) {
    return (
      <div className="ga-scale-in rounded-2xl border border-leaf/30 bg-leaf/10 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-leaf text-cream">
          <Check className="size-6" />
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">You&apos;re on the list</h3>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{done.message}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold text-foreground">
          <Users className="size-4 text-gold" />
          {done.areaInterest} neighbours already waiting
        </div>
      </div>
    )
  }

  return (
    <div className={compact ? '' : 'rounded-2xl border border-border bg-card p-6'}>
      {!compact && (
        <>
          <div className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <MapPin className="size-5" />
          </div>
          <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">
            Not quite there yet
          </h3>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            {area
              ? `We don't deliver to ${area} yet — but we're growing fast. Join the waitlist and we'll bring fresh produce to your door soon.`
              : "We're not in your area yet, but we're expanding across Greater Accra. Join the waitlist and be first to know."}
          </p>
        </>
      )}
      <div className="mt-5 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="ga-input"
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Phone or email"
          className="ga-input"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !name || !contact}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-field font-bold text-cream disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : 'Join the waitlist'}
        </button>
      </div>
    </div>
  )
}
