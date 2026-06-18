'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react'
import { requestPasswordResetOtp, resetPasswordWithOtp } from '@/lib/golden-acres/auth'

type Step = 'email' | 'reset' | 'done'

export function ForgotPassword() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await requestPasswordResetOtp(email)
    setBusy(false)
    if (res.ok) {
      setStep('reset')
      setNotice(`We sent a 6-digit code to ${email}. It expires in 10 minutes.`)
    } else {
      setError(res.error ?? 'Could not send a reset code.')
    }
  }

  async function resetNow(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await resetPasswordWithOtp(email, code.trim(), password)
    setBusy(false)
    if (res.ok) {
      setStep('done')
    } else {
      setError(res.error ?? 'Could not reset your password.')
    }
  }

  if (step === 'done') {
    return (
      <div className="ga-rise">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-field/10 text-field">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h1 className="ga-display mt-4 text-3xl font-semibold text-foreground">Password updated</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your password has been changed. You can now sign in with your new password.
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

  return (
    <div className="ga-rise">
      <h1 className="ga-display text-3xl font-semibold text-foreground">
        {step === 'email' ? 'Reset your password' : 'Enter your code'}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {step === 'email'
          ? "Enter the email on your account and we'll send a verification code."
          : 'Enter the code we emailed you, then choose a new password.'}
      </p>

      {notice && (
        <p className="mt-4 rounded-lg bg-field/10 px-3 py-2 text-sm font-medium text-field" role="status">
          {notice}
        </p>
      )}

      {step === 'email' ? (
        <form onSubmit={sendCode} className="mt-6 space-y-4">
          <Field icon={<Mail className="h-4 w-4" />} label="Email">
            <input
              type="email"
              className="ga-input pl-10"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
            Send reset code
          </button>
        </form>
      ) : (
        <form onSubmit={resetNow} className="mt-6 space-y-4">
          <Field icon={<KeyRound className="h-4 w-4" />} label="Verification code">
            <input
              inputMode="numeric"
              className="ga-input pl-10 tracking-[0.4em]"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
          </Field>
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

          <button
            type="button"
            onClick={() => {
              setStep('email')
              setError(null)
              setNotice(null)
            }}
            className="flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className="font-bold text-field hover:underline">
          Back to sign in
        </Link>
      </p>
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
