'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from './session-context'
import { SocialButtons } from './social-buttons'
import { signInWithPassword, DEMO } from '@/lib/golden-acres/auth'
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react'

export function StaffAuth() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/support'
  const { signIn } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const done = () => router.push(next)

  async function submit() {
    setBusy(true)
    setError(null)
    const res = await signInWithPassword(email, password, 'staff')
    setBusy(false)
    if (res.ok) {
      signIn()
      done()
    } else setError(res.error ?? 'Access denied. Check your credentials.')
  }

  function fillDemo() {
    setEmail(DEMO.staff.email)
    setPassword(DEMO.staff.password)
    setError(null)
  }

  return (
    <div className="ga-rise w-full">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-field text-cream">
        <ShieldCheck className="size-6" />
      </div>
      <h1 className="mt-5 ga-display text-3xl font-semibold text-foreground">Staff console</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Sign in to access operations, support, and analytics tools.
      </p>

      {error && (
        <p className="ga-fade-up mt-5 rounded-xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground">Work email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@goldenacres.gh"
            className="ga-input mt-1.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="ga-input mt-1.5"
          />
        </div>
        <button
          type="button"
          disabled={busy || !email || !password}
          onClick={submit}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-field text-base font-bold text-cream disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : 'Sign in'}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with
        <span className="h-px flex-1 bg-border" />
      </div>
      <SocialButtons role="staff" />

      <button
        type="button"
        onClick={fillDemo}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-gold hover:underline"
      >
        <Sparkles className="size-3.5" />
        Use demo credentials
      </button>
    </div>
  )
}
