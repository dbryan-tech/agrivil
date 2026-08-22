'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from './session-context'
import { SocialButtons } from './social-buttons'
import { signInWithPassword, DEMO } from '@/lib/golden-acres/auth'
import { UnderlineField } from '@/components/golden-acres/system'
import { Loader2 } from 'lucide-react'

/**
 * Staff auth (redesigned, docs/redesign/03 §2).
 * Same shell grammar as customer auth — quiet, serious, no decorative chrome.
 * signInWithPassword(…, 'staff') call unchanged.
 */
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

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
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
      <p className="text-[13px] font-semibold text-[#7A3F1C]">Internal systems</p>
      <h1 className="ga-display-title mt-2 text-[clamp(26px,3vw,36px)] text-[#211A12]">
        Staff console.
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
        Sign in to access operations, support, and analytics tools.
      </p>

      <form
        onSubmit={(e) => submit(e)}
        className="mt-8 space-y-6"
      >
        <UnderlineField
          id="st-email"
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@goldenacres.gh"
          autoComplete="email"
          inputMode="email"
        />
        <UnderlineField
          id="st-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

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
          disabled={busy || !email || !password}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#211A12] text-[15px] font-semibold text-[#FAF9F6] transition-all duration-300 hover:bg-[#33291C] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          {busy && <Loader2 width={16} height={16} className="animate-spin" />}
          Sign in
        </button>
      </form>

      <div className="my-7 flex items-center gap-4 text-[12px] font-medium text-[#B7AC9E]">
        <span className="h-px flex-1 bg-[rgba(33,26,18,0.10)]" />
        or continue with
        <span className="h-px flex-1 bg-[rgba(33,26,18,0.10)]" />
      </div>
      <SocialButtons role="staff" />

      <button
        type="button"
        onClick={fillDemo}
        className="ga-index mt-5 w-full text-center text-[12px] font-medium text-[#B7AC9E] transition-colors hover:text-[#5C5247]"
      >
        Use demo credentials
      </button>

      <p className="mt-8 border-t border-[rgba(33,26,18,0.08)] pt-5 text-[11.5px] leading-relaxed text-[#B7AC9E]">
        Staff access is logged and audited. Actions inside the console are
        attributed to your account.
      </p>
    </div>
  )
}
