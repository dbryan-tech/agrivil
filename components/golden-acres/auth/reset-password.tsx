'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import { resetPassword } from '@/lib/golden-acres/auth'

export function ResetPassword() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const errorParam = params.get('error')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Better Auth redirects here with ?error=invalid_token when the link is bad.
  const invalidLink = !token || errorParam

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    setError(null)
    const res = await resetPassword(token, password)
    setBusy(false)
    if (res.ok) {
      setDone(true)
    } else {
      setError(res.error ?? 'Could not reset your password.')
    }
  }

  if (done) {
    return (
      <div className="ga-rise">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-field/10 text-field">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h1 className="ga-display mt-4 text-3xl font-semibold text-foreground">Password updated</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your password has been changed. Sign in with your new password.
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-field text-base font-bold text-cream transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  if (invalidLink) {
    return (
      <div className="ga-rise">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 text-clay">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="ga-display mt-4 text-3xl font-semibold text-foreground">Link expired</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This password reset link is invalid or has expired. Request a fresh one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-field text-base font-bold text-cream transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="ga-rise">
      <h1 className="ga-display text-3xl font-semibold text-foreground">Choose a new password</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Pick something strong you haven&apos;t used before.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field icon={<Lock className="h-4 w-4" />} label="New password">
          <input
            type={show ? 'text' : 'password'}
            className="ga-input pl-10 pr-10"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>
        <Field icon={<Lock className="h-4 w-4" />} label="Confirm password">
          <input
            type={show ? 'text' : 'password'}
            className="ga-input pl-10"
            placeholder="Re-enter your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Field>

        {error && (
          <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm font-medium text-clay" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-field text-base font-bold text-cream transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  )
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </span>
    </label>
  )
}
