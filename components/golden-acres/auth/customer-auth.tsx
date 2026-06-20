'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles, KeyRound, CheckCircle2 } from 'lucide-react'
import {
  signInWithPassword,
  signUpWithPassword,
  requestEmailVerification,
  verifyEmailCode,
  DEMO,
} from '@/lib/golden-acres/auth'
import { useSession } from './session-context'
import { SocialButtons, useSocialProviders } from './social-buttons'

export function CustomerAuth({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/account'
  const { signIn } = useSession()
  const socialProviders = useSocialProviders()
  const hasSocial = (socialProviders?.length ?? 0) > 0

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // After a successful signup we move into an email verification step.
  const [verifying, setVerifying] = useState(false)

  const done = () => router.push(next)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    if (mode === 'signup') {
      const res = await signUpWithPassword({ name, email, password })
      if (!res.ok) {
        setBusy(false)
        setError(res.error ?? 'Something went wrong.')
        return
      }
      // Better Auth signs the user in on signup. Fire off a verification code
      // and move into the verify step (skippable — verification isn't blocking).
      signIn()
      await requestEmailVerification(email)
      setBusy(false)
      setVerifying(true)
      return
    }
    const res = await signInWithPassword(email, password, 'customer')
    setBusy(false)
    if (res.ok) {
      signIn()
      done()
    } else {
      setError(res.error ?? 'Something went wrong.')
    }
  }

  function fillDemo() {
    setEmail(DEMO.customer.email)
    setPassword(DEMO.customer.password)
  }

  if (verifying) {
    return <VerifyEmailStep email={email} onDone={done} onSkip={done} />
  }

  return (
    <div className="ga-rise">
      <h1 className="ga-display text-3xl font-semibold text-foreground">
        {mode === 'signup' ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {mode === 'signup'
          ? 'Join AgriVil and get fresh produce delivered across Accra.'
          : 'Sign in to track orders, manage boxes, and check out faster.'}
      </p>

      {hasSocial && (
        <>
          <div className="mt-6">
            <SocialButtons role="customer" />
          </div>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && (
          <Field icon={<User className="h-4 w-4" />} label="Full name">
            <input
              className="ga-input pl-10"
              placeholder="Akua Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </Field>
        )}
        <Field icon={<Mail className="h-4 w-4" />} label="Email">
          <input
            type="email"
            className="ga-input pl-10"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field icon={<Lock className="h-4 w-4" />} label="Password">
          <input
            type={show ? 'text' : 'password'}
            className="ga-input pl-10 pr-10"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
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

        {mode === 'login' && (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-field hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

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
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <button
        type="button"
        onClick={fillDemo}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-gold hover:underline"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Use demo credentials
      </button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-field hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to AgriVil?{' '}
            <Link href="/signup" className="font-bold text-field hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Are you a farmer?{' '}
        <Link href="/farmer/login" className="font-semibold text-field hover:underline">
          Farmer sign in
        </Link>
      </p>
    </div>
  )
}

function VerifyEmailStep({
  email,
  onDone,
  onSkip,
}: {
  email: string
  onDone: () => void
  onSkip: () => void
}) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await verifyEmailCode(email, code.trim())
    setBusy(false)
    if (res.ok) {
      onDone()
    } else {
      setError(res.error ?? 'Invalid or expired code.')
    }
  }

  async function resend() {
    setResending(true)
    setError(null)
    setNotice(null)
    const res = await requestEmailVerification(email)
    setResending(false)
    setNotice(res.ok ? 'A fresh code is on its way.' : null)
    if (!res.ok) setError(res.error ?? 'Could not resend the code.')
  }

  return (
    <div className="ga-rise">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-field/10 text-field">
        <Mail className="h-6 w-6" />
      </span>
      <h1 className="ga-display mt-4 text-3xl font-semibold text-foreground">Verify your email</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
        Enter it below to confirm your account.
      </p>

      {notice && (
        <p className="mt-4 rounded-lg bg-field/10 px-3 py-2 text-sm font-medium text-field" role="status">
          {notice}
        </p>
      )}

      <form onSubmit={verify} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Verification code</span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <KeyRound className="h-4 w-4" />
            </span>
            <input
              inputMode="numeric"
              className="ga-input pl-10 tracking-[0.4em]"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
          </span>
        </label>

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
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Verify email
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="font-semibold text-field hover:underline disabled:opacity-60"
        >
          {resending ? 'Sending…' : 'Resend code'}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </button>
      </div>
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
