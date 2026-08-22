'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff, KeyRound, CheckCircle2, Mail } from 'lucide-react'
import {
  signInWithPassword,
  signUpWithPassword,
  requestEmailVerification,
  verifyEmailCode,
  DEMO,
} from '@/lib/golden-acres/auth'
import { useSession } from './session-context'
import { SocialButtons, useSocialProviders } from './social-buttons'
import { UnderlineField } from '@/components/golden-acres/system'
import { cn } from '@/lib/utils'

/**
 * Customer auth (redesigned, docs/redesign/03 §2.2–2.3).
 * Social buttons first as equal-weight rows; email form on UnderlineField
 * grammar; trust microcopy under sensitive fields. All Better Auth calls
 * (signInWithPassword / signUpWithPassword / verification) unchanged.
 */
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
    setError(null)
  }

  if (verifying) {
    return <VerifyEmailStep email={email} onDone={done} onSkip={done} />
  }

  return (
    <div className="ga-rise">
      <p className="text-[13px] font-semibold text-[#7A3F1C]">
        {mode === 'signup' ? 'Join the market' : 'Welcome back'}
      </p>
      <h1 className="ga-display-title mt-2 text-[clamp(28px,3vw,38px)] text-[#211A12]">
        {mode === 'signup' ? 'Create your account.' : 'Your market is open.'}
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
        {mode === 'signup'
          ? 'Fresh produce from Ghanaian growers, delivered cold across Accra.'
          : 'Sign in to track orders, manage boxes, and check out faster.'}
      </p>

      {hasSocial && (
        <>
          <div className="mt-8">
            <SocialButtons role="customer" />
          </div>

          <div className="my-7 flex items-center gap-4 text-[12px] font-medium text-[#B7AC9E]">
            <span className="h-px flex-1 bg-[rgba(33,26,18,0.10)]" />
            or with email
            <span className="h-px flex-1 bg-[rgba(33,26,18,0.10)]" />
          </div>
        </>
      )}

      <form onSubmit={submit} className="space-y-6" noValidate={false}>
        {mode === 'signup' && (
          <UnderlineField
            id="ca-name"
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Akua Mensah"
            autoComplete="name"
          />
        )}
        <UnderlineField
          id="ca-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
        />

        {/* Password with show/hide + live checklist only while focused-and-empty */}
        <PasswordField
          id="ca-password"
          value={password}
          onChange={setPassword}
          show={show}
          setShow={setShow}
          isNew={mode === 'signup'}
        />

        {mode === 'signup' && (
          <p className="text-[12px] leading-relaxed text-[#8A7E72]">
            We&apos;ll text you delivery updates and MoMo receipts on the number
            you add later — nothing else.
          </p>
        )}

        {mode === 'login' && (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-[#5C5247] underline decoration-[rgba(92,82,71,0.35)] underline-offset-4 transition-colors hover:text-[#211A12]"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {error && (
          <p
            className="rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13.5px] font-medium leading-relaxed text-[#B91C1C]"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold tracking-[-0.01em] text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {busy && <Loader2 width={16} height={16} className="animate-spin" />}
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <button
        type="button"
        onClick={fillDemo}
        className="ga-index mt-5 w-full text-center text-[12px] font-medium text-[#B7AC9E] transition-colors hover:text-[#5C5247]"
      >
        Use demo credentials
      </button>

      <p className="mt-8 border-t border-[rgba(33,26,18,0.08)] pt-6 text-center text-[13.5px] text-[#5C5247]">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 transition-colors hover:decoration-[#0B3B25]"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to AgriVil?{' '}
            <Link
              href="/signup"
              className="font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 transition-colors hover:decoration-[#0B3B25]"
            >
              Create an account
            </Link>
          </>
        )}
      </p>

      <p className="mt-4 text-center text-[13px] text-[#8A7E72]">
        Are you a farmer?{' '}
        <Link
          href="/farmer/login"
          className="font-medium text-[#7A3F1C] underline decoration-[rgba(122,63,28,0.35)] underline-offset-4 transition-colors hover:decoration-[#7A3F1C]"
        >
          Farmer sign in
        </Link>
      </p>
    </div>
  )
}

/* ------------------------- Password field ------------------------------ */

function PasswordField({
  id,
  value,
  onChange,
  show,
  setShow,
  isNew,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  show: boolean
  setShow: (fn: (s: boolean) => boolean) => void
  isNew: boolean
}) {
  const [focused, setFocused] = useState(false)
  const rules = [
    { label: '8+ characters', ok: value.length >= 8 },
    { label: 'One number', ok: /\d/.test(value) },
  ]
  const showChecklist = isNew && focused && value.length === 0

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#3D332A]">
        Password
      </label>
      <span className="relative mt-1 block">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          autoComplete={isNew ? 'new-password' : 'current-password'}
          aria-describedby={showChecklist ? `${id}-checklist` : undefined}
          className="w-full border-0 border-b bg-transparent pb-2 pr-9 text-[16px] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2 focus:border-[#0B3B25] border-[rgba(33,26,18,0.15)]"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#8A7E72] transition-colors hover:text-[#211A12]"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
        </button>
      </span>

      {showChecklist ? (
        <ul id={`${id}-checklist`} className="mt-2.5 space-y-1.5">
          {rules.map((r) => (
            <li
              key={r.label}
              className={cn(
                'flex items-center gap-2 text-[12px] transition-colors',
                r.ok ? 'text-[#0F7A43]' : 'text-[#B7AC9E]',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'flex h-3.5 w-3.5 items-center justify-center rounded-full border',
                  r.ok ? 'border-[#0F7A43]' : 'border-[rgba(33,26,18,0.2)]',
                )}
              >
                {r.ok && <CheckCircle2 width={10} height={10} />}
              </span>
              {r.label}
            </li>
          ))}
        </ul>
      ) : (
        isNew && (
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#8A7E72]">
            At least 8 characters with a number.
          </p>
        )
      )}
    </div>
  )
}

/* ------------------------- Email verification -------------------------- */

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
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(11,59,37,0.25)] text-[#0B3B25]">
        <Mail width={20} height={20} />
      </span>
      <h1 className="ga-display-title mt-5 text-[clamp(26px,3vw,36px)] text-[#211A12]">
        Verify your email.
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
        We sent a 6-digit code to{' '}
        <span className="font-semibold text-[#211A12]">{email}</span>. Enter it
        below to confirm your account.
      </p>

      {notice && (
        <p className="mt-5 rounded-xl bg-[rgba(15,122,67,0.08)] px-4 py-3 text-[13.5px] font-medium text-[#0F7A43]" role="status">
          {notice}
        </p>
      )}

      <form onSubmit={verify} className="mt-7 space-y-6">
        <label className="block">
          <span className="text-[13px] font-medium text-[#3D332A]">Verification code</span>
          <input
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
            aria-label="6-digit verification code"
            className="ga-index mt-1 w-full border-0 border-b bg-transparent pb-2 text-[22px] tracking-[0.45em] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2 focus:border-[#0B3B25] border-[rgba(33,26,18,0.15)]"
          />
        </label>

        {error && (
          <p
            className="rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13.5px] font-medium text-[#B91C1C]"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {busy ? (
            <Loader2 width={16} height={16} className="animate-spin" />
          ) : (
            <KeyRound width={16} height={16} />
          )}
          Verify email
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-[13px]">
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="font-medium text-[#5C5247] underline decoration-[rgba(92,82,71,0.35)] underline-offset-4 transition-colors hover:text-[#211A12] disabled:opacity-50"
        >
          {resending ? 'Sending…' : 'Resend code'}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="font-medium text-[#8A7E72] transition-colors hover:text-[#211A12]"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
