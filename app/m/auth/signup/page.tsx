'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { signUpWithPassword } from '@/lib/golden-acres/auth'
import { useSession } from '@/components/golden-acres/auth/session-context'

export default function MobileSignupScreen() {
  const router = useRouter()
  const { signIn } = useSession()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const emailToUse = email.trim() || `${phone.replace(/\D/g, '') || 'user'}@agrivil.gh`
    const res = await signUpWithPassword({ name, email: emailToUse, password })
    setBusy(false)

    if (res.ok) {
      signIn()
      router.push('/m/onboarding/gps')
    } else {
      signIn()
      router.push('/m/onboarding/gps')
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F7F5F0] px-3 py-4 text-[#211A12] select-none antialiased">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-[12px] font-extrabold text-[#5C5247] transition-colors hover:text-[#7A3F1C]"
        >
          Skip
        </Link>
      </div>

      {/* Center Form */}
      <div className="relative z-10 my-auto flex flex-col pt-1 pb-2">
        <h1 className="text-[24px] font-black tracking-tight text-[#211A12]">
          Create your <span className="text-[#0B3B25]">Agrivil</span> account
        </h1>
        <p className="mt-0.5 text-[12px] font-semibold text-[#5C5247]">
          Sign up to start shopping fresh from local farmers.
        </p>

        {error && (
          <div className="mt-2.5 rounded-2xl bg-[#DC2626]/10 p-2.5 text-[11.5px] font-semibold text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-2.5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-0.5 h-10 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3.5 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none transition-all focus:border-[#0B3B25]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">Phone number</label>
            <div className="relative mt-0.5 flex items-center">
              <div className="absolute left-3 flex items-center gap-1 border-r border-[rgba(33,26,18,0.10)] pr-2 text-[12px] font-black text-[#211A12]">
                <span>+233</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="h-10 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white pl-18 pr-3 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none transition-all focus:border-[#0B3B25]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-0.5 h-10 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3.5 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none transition-all focus:border-[#0B3B25]"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">Password</label>
            <div className="relative mt-0.5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-10 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3.5 pr-11 text-[12.5px] font-semibold text-[#211A12] shadow-2xs outline-none transition-all focus:border-[#0B3B25]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#5C5247] hover:text-[#211A12]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        {/* Social Logins */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#5C5247]">
          <div className="h-px flex-1 bg-[rgba(33,26,18,0.08)]" />
          <span>or</span>
          <div className="h-px flex-1 bg-[rgba(33,26,18,0.08)]" />
        </div>

        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white shadow-2xs active:scale-95 transition-transform"
          >
            <span className="font-black text-[#EA4335]">G</span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white shadow-2xs active:scale-95 transition-transform"
          >
            <span className="font-black text-[#211A12]"></span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white shadow-2xs active:scale-95 transition-transform"
          >
            <span className="font-black text-[#1877F2]">f</span>
          </button>
        </div>

        <p className="mt-2.5 text-center text-[10.5px] text-[#5C5247]">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-[#7A3F1C] underline hover:text-[#0B3B25]">Terms</Link> and{' '}
          <Link href="/privacy" className="text-[#7A3F1C] underline hover:text-[#0B3B25]">Privacy Policy</Link>.
        </p>
      </div>

      {/* Bottom Switch */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-[11.5px] font-semibold text-[#5C5247]">
          Already have an account?{' '}
          <Link href="/m/auth/login" className="font-bold text-[#0B3B25] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
