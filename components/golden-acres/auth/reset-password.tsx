'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react'
import { resetPassword } from '@/lib/golden-acres/auth'
import { ErrorNote } from './forgot-password'

/**
 * Token reset (redesigned, docs/redesign/03 §2).
 * Better Auth lands here with ?token=…; invalid/expired links get a designed
 * recovery state. resetPassword() call unchanged.
 */
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
      setError('Those passwords don\u2019t match. Re-enter them to continue.')
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
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(15,122,67,0.3)] text-[#0F7A43]">
          <CheckCircle2 width={20} height={20} />
        </span>
        <h1 className="ga-display-title mt-5 text-[clamp(26px,3vw,36px)] text-[#211A12]">
          Password updated.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
          Your password has been changed. Sign in with your new password.
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

  if (invalidLink) {
    return (
      <div className="ga-rise">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(185,28,28,0.3)] text-[#B91C1C]">
          <AlertTriangle width={20} height={20} />
        </span>
        <h1 className="ga-display-title mt-5 text-[clamp(26px,3vw,36px)] text-[#211A12]">
          Link expired.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
          This password reset link is invalid or has expired — they are
          single-use for your security. Request a fresh one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E]"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="ga-rise">
      <p className="text-[13px] font-semibold text-[#7A3F1C]">Account recovery</p>
      <h1 className="ga-display-title mt-2 text-[clamp(26px,3vw,36px)] text-[#211A12]">
        Choose a new password.
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
        Pick something strong you haven&apos;t used before.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        {/* New password */}
        <div>
          <label htmlFor="rp-password" className="block text-[13px] font-medium text-[#3D332A]">
            New password
          </label>
          <span className="relative mt-1 block">
            <input
              id="rp-password"
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
        </div>

        <UnderlineConfirm
          value={confirm}
          onChange={setConfirm}
          mismatch={
            confirm.length > 0 && confirm !== password
              ? 'Passwords don\u2019t match yet.'
              : null
          }
        />

        {error && <ErrorNote>{error}</ErrorNote>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {busy && <Loader2 width={16} height={16} className="animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  )
}

/** Confirm-password underline field with inline mismatch feedback. */
function UnderlineConfirm({
  value,
  onChange,
  mismatch,
}: {
  value: string
  onChange: (v: string) => void
  mismatch: string | null
}) {
  return (
    <div>
      <label htmlFor="rp-confirm" className="block text-[13px] font-medium text-[#3D332A]">
        Confirm password
      </label>
      <input
        id="rp-confirm"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Re-enter your new password"
        autoComplete="new-password"
        required
        aria-invalid={Boolean(mismatch)}
        aria-describedby={mismatch ? 'rp-confirm-error' : undefined}
        className={`mt-1 w-full border-0 border-b bg-transparent pb-2 text-[16px] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2 ${
          mismatch
            ? 'border-[#B91C1C] focus:border-[#B91C1C]'
            : 'border-[rgba(33,26,18,0.15)] focus:border-[#0B3B25]'
        }`}
      />
      {mismatch && (
        <p id="rp-confirm-error" role="alert" className="mt-1.5 text-[12px] text-[#B91C1C]">
          {mismatch}
        </p>
      )}
    </div>
  )
}
