'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Loader2,
  CheckCircle2,
  Sprout,
  TrendingUp,
  Wallet,
  ShieldCheck,
} from 'lucide-react'
import {
  submitSellerApplication,
  type SellApplicationInput,
} from '@/app/actions/farmer-kyc'
import type { GhanaRegion } from '@/lib/golden-acres/types'

const REGIONS: GhanaRegion[] = [
  'Greater Accra',
  'Eastern',
  'Ashanti',
  'Volta',
  'Central',
  'Bono',
  'Northern',
  'Upper East',
  'Upper West',
]

const PERKS = [
  { icon: TrendingUp, title: 'Reach more buyers', body: 'List your harvest to thousands of households across Accra.' },
  { icon: Wallet, title: 'Fast MoMo payouts', body: 'Get paid directly to your mobile money after every delivery.' },
  { icon: ShieldCheck, title: 'Verified seller badge', body: 'Build trust with a verified profile customers recognise.' },
]

export function SellApplicationForm() {
  const [form, setForm] = useState<SellApplicationInput>({
    name: '',
    farmName: '',
    region: 'Greater Accra',
    town: '',
    email: '',
    phone: '',
    bio: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function set<K extends keyof SellApplicationInput>(k: K, v: SellApplicationInput[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const res = await submitSellerApplication(form)
    setSubmitting(false)
    if (res.ok) setDone(true)
    else setError(res.error ?? 'Something went wrong. Please try again.')
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ga-leaf)]/15">
          <CheckCircle2 className="h-7 w-7 text-[var(--ga-leaf)]" />
        </div>
        <h2 className="ga-display mt-4 text-2xl font-bold text-foreground">
          Application received
        </h2>
        <p className="mt-2 text-pretty text-muted-foreground">
          Thanks, {form.name.split(' ')[0] || 'farmer'}! Our team will review{' '}
          <span className="font-semibold text-foreground">{form.farmName}</span> and
          reach out at {form.email} once you&apos;re verified.
        </p>
        <Link
          href="/shop"
          className="ga-scale-interactive mt-6 inline-flex rounded-xl bg-[var(--ga-field-deep)] px-5 py-2.5 text-sm font-bold text-[var(--ga-cream)]"
        >
          Browse the market
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* Pitch */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ga-gold)]/15 px-3 py-1 text-sm font-bold text-[var(--ga-copper-deep)]">
          <Sprout className="h-4 w-4" /> Sell on AgriVil
        </span>
        <h1 className="ga-display mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl">
          Grow your farm business with AgriVil
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Join Ghana&apos;s farm-to-door marketplace. Apply in minutes — once our
          team verifies your farm, your produce goes live to local buyers.
        </p>
        <ul className="mt-6 space-y-4">
          {PERKS.map((p) => {
            const Icon = p.icon
            return (
              <li key={p.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ga-leaf)]/12 text-[var(--ga-leaf)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-foreground">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="h-fit rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <h2 className="ga-display text-xl font-bold text-foreground">
          Apply to sell
        </h2>
        <div className="mt-5 space-y-4">
          <Field label="Your name" required>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="ga-input w-full"
              placeholder="e.g. Kwame Mensah"
            />
          </Field>
          <Field label="Farm / business name" required>
            <input
              required
              value={form.farmName}
              onChange={(e) => set('farmName', e.target.value)}
              className="ga-input w-full"
              placeholder="e.g. Sunrise Organic Farm"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Region" required>
              <select
                value={form.region}
                onChange={(e) => set('region', e.target.value as GhanaRegion)}
                className="ga-input w-full"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Town" required>
              <input
                required
                value={form.town}
                onChange={(e) => set('town', e.target.value)}
                className="ga-input w-full"
                placeholder="e.g. Dodowa"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="ga-input w-full"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone" required>
              <input
                required
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="ga-input w-full"
                placeholder="024 000 0000"
              />
            </Field>
          </div>
          <Field label="Tell us about your farm">
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              rows={3}
              className="ga-input w-full resize-none"
              placeholder="What do you grow? How long have you been farming?"
            />
          </Field>
        </div>

        {error && (
          <p className="mt-3 text-sm font-semibold text-[var(--ga-deal)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="ga-scale-interactive mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ga-leaf)] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            'Submit application'
          )}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Already approved?{' '}
          <Link href="/farmer" className="font-bold text-foreground underline-offset-2 hover:underline">
            Go to your farmer portal
          </Link>
        </p>
      </form>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-foreground">
        {label}
        {required && <span className="text-[var(--ga-deal)]"> *</span>}
      </span>
      {children}
    </label>
  )
}
