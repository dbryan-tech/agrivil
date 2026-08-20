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
      <div className="mx-auto max-w-xl rounded-[28px] border border-black/[0.04] bg-white p-8 text-center shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B3B25]/10">
          <CheckCircle2 className="h-7 w-7 text-[#0B3B25]" />
        </div>
        <h2 className="ga-headline mt-4 text-2xl font-black text-[#211A12]">
          Application received
        </h2>
        <p className="mt-2 text-pretty text-sm text-[#5C5247]">
          Thanks, {form.name.split(' ')[0] || 'farmer'}! Our team will review{' '}
          <span className="font-bold text-[#211A12]">{form.farmName}</span> and
          reach out at {form.email} once you&apos;re verified.
        </p>
        <Link
          href="/shop"
          className="ga-press mt-6 inline-flex rounded-full bg-[#0B3B25] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-[#072618]"
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0A81E]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#7A3F1C]">
          <Sprout className="h-4 w-4" /> Sell on AgriVil
        </span>
        <h1 className="ga-headline mt-4 text-balance text-3xl font-black text-[#211A12] sm:text-4xl">
          Grow your farm business with AgriVil
        </h1>
        <p className="mt-3 text-pretty text-sm sm:text-base leading-relaxed text-[#5C5247]">
          Join Ghana&apos;s farm-to-door marketplace. Apply in minutes — once our
          team verifies your farm, your produce goes live to local buyers.
        </p>
        <ul className="mt-6 space-y-4">
          {PERKS.map((p) => {
            const Icon = p.icon
            return (
              <li key={p.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-black text-[#211A12]">{p.title}</p>
                  <p className="text-xs sm:text-sm text-[#5C5247]">{p.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="h-fit rounded-[28px] border border-black/[0.04] bg-white p-6 sm:p-8 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
      >
        <h2 className="ga-headline text-xl font-black text-[#211A12]">
          Apply to sell
        </h2>
        <div className="mt-5 space-y-4">
          <Field label="Your name" required>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
              placeholder="e.g. Kwame Mensah"
            />
          </Field>
          <Field label="Farm / business name" required>
            <input
              required
              value={form.farmName}
              onChange={(e) => set('farmName', e.target.value)}
              className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
              placeholder="e.g. Sunrise Organic Farm"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Region" required>
              <select
                value={form.region}
                onChange={(e) => set('region', e.target.value as GhanaRegion)}
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-bold text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
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
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
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
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone" required>
              <input
                required
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] px-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20"
                placeholder="024 000 0000"
              />
            </Field>
          </div>
          <Field label="Tell us about your farm">
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-black/[0.08] bg-[#F7F5F0] p-4 text-sm font-medium text-[#211A12] outline-none transition-all focus:border-[#0B3B25] focus:bg-white focus:ring-2 focus:ring-[#0B3B25]/20 resize-none"
              placeholder="What do you grow? How long have you been farming?"
            />
          </Field>
        </div>

        {error && (
          <p className="mt-3 text-xs font-bold text-[#D6402C]">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="ga-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] px-5 py-3.5 text-sm font-black text-white shadow-sm hover:bg-[#072618] disabled:opacity-50 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            'Submit application'
          )}
        </button>
        <p className="mt-3 text-center text-xs text-[#5C5247]">
          Already approved?{' '}
          <Link href="/farmer" className="font-extrabold text-[#0B3B25] underline-offset-2 hover:underline">
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
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-[#5C5247]">
        {label}
        {required && <span className="text-[#D6402C]"> *</span>}
      </span>
      {children}
    </label>
  )
}
