'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react'
import { requestPasswordResetOtp, resetPasswordWithOtp } from '@/lib/golden-acres/auth'
import { UnderlineField } from '@/components/golden-acres/system'

type Step = 'email' | 'reset' | 'done'

/**
 * Forgot password (redesigned, docs/redesign/03 §2).
 * Three quiet steps: email → code+new password → done. All auth calls
 * (requestPasswordResetOtp / resetPasswordWithOtp) unchanged.
 */
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
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(15,122,67,0.3)] text-[#0F7A43]">
          <CheckCircle2 width={20} height={20} />
        </span>
        <h1 className="ga-display-title mt-5 text-[clamp(26px,3vw,36px)] text-[#211A12]">
          Password updated.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
          Your password has been changed. You can now sign in with your new
          password — all other sessions were signed out for safety.
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98]"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="ga-rise">
      <p className="text-[13px] font-semibold text-[#7A3F1C]">Account recovery</p>
      <h1 className="ga-display-title mt-2 text-[clamp(26px,3vw,36px)] text-[#211A12]">
        {step === 'email' ? 'Reset your password.' : 'Enter your code.'}
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
        {step === 'email'
          ? "Enter the email on your account and we'll send a verification code."
          : 'Enter the code we emailed you, then choose a new password.'}
      </p>

      {notice && (
        <p className="mt-6 rounded-xl bg-[rgba(15,122,67,0.08)] px-4 py-3 text-[13.5px] font-medium leading-relaxed text-[#0F7A43]" role="status">
          {notice}
        </p>
      )}

      {step === 'email' ? (
        <form onSubmit={sendCode} className="mt-8 space-y-6">
          <UnderlineField
            id="fp-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            required
          />

          {error && (
            <ErrorNote>{error}</ErrorNote>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {busy && <Loader2 width={16} height={16} className="animate-spin" />}
            Send reset code
          </button>
        </form>
      ) : (
        <form onSubmit={resetNow} className="mt-8 space-y-6">
          <label className="block">
            <span className="text-[13px] font-medium text-[#3D332A]">Verification code</span>
            <input
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              aria-label="6-digit reset code"
              className="ga-index mt-1 w-full border-0 border-b bg-transparent pb-2 text-[22px] tracking-[0.45em] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2 focus:border-[#0B3B25] border-[rgba(33,26,18,0.15)]"
            />
          </label>

          {/* New password with show/hide */}
          <div>
            <label htmlFor="fp-password" className="block text-[13px] font-medium text-[#3D332A]">
              New password
            </label>
            <span className="relative mt-1 block">
              <input
                id="fp-password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full border-0 border-b border-[rgba(33,26,18,0.15)] bg-transparent pb-2 pr-9 text-[16px] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2 focus:border-[#0B3B25]"
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
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#8A7E72]">
              Sessions on other devices expire automatically. Review them any
              time in Account → Security.
            </p>
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {busy && <Loader2 width={16} height={16} className="animate-spin" />}
            Update password
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('email')
              setError(null)
              setNotice(null)
            }}
            className="mx-auto flex items-center gap-1.5 text-[13px] font-medium text-[#8A7E72] transition-colors hover:text-[#211A12]"
          >
            <ArrowLeft width={14} height={14} />
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-10 border-t border-[rgba(33,26,18,0.08)] pt-6 text-center text-[13.5px] text-[#5C5247]">
        Remembered it?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 transition-colors hover:decoration-[#0B3B25]"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13.5px] font-medium leading-relaxed text-[#B91C1C]"
      role="alert"
    >
      {children}
    </p>
  )
}
