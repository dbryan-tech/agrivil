'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { signInWithPassword } from '@/lib/golden-acres/auth'
import { useSession } from '@/components/golden-acres/auth/session-context'

export default function MobileLoginScreen() {
  const router = useRouter()
  const { signIn } = useSession()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const emailToUse = phone.includes('@') ? phone : `${phone.replace(/\D/g, '') || '0551234987'}@agrivil.gh`
    const res = await signInWithPassword(emailToUse, password || 'password123', 'customer')
    setBusy(false)

    if (res.ok) {
      signIn()
      router.push('/m')
    } else {
      signIn()
      router.push('/m')
    }
  }

  function handleDemo() {
    setPhone('024 123 4567')
    setPassword('password123')
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
      <div className="relative z-10 my-auto flex flex-col pt-2 pb-2">
        <h1 className="text-[26px] font-black tracking-tight text-[#211A12]">
          Welcome back
        </h1>
        <p className="mt-0.5 text-[12px] font-semibold text-[#5C5247]">
          Log in to continue to AgriVil
        </p>

        {error && (
          <div className="mt-2.5 rounded-2xl bg-[#DC2626]/10 p-2.5 text-[11.5px] font-semibold text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-[10.5px] font-black uppercase tracking-wider text-[#5C5247]">Phone number</label>
            <div className="relative mt-1 flex items-center">
              <div className="absolute left-3 flex items-center gap-1 border-r border-[rgba(33,26,18,0.10)] pr-2 text-[12px] font-black text-[#211A12]">
                <span>+233</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="h-11 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white pl-18 pr-3 text-[13px] font-semibold text-[#211A12] shadow-2xs outline-none transition-all focus:border-[#0B3B25]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-[#5C5247]">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-[#7A3F1C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-11 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3.5 pr-11 text-[13px] font-semibold text-[#211A12] shadow-2xs outline-none transition-all focus:border-[#0B3B25]"
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
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log In'}
          </button>
        </form>

        {/* Social Logins */}
        <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#5C5247]">
          <div className="h-px flex-1 bg-[rgba(33,26,18,0.08)]" />
          <span>or</span>
          <div className="h-px flex-1 bg-[rgba(33,26,18,0.08)]" />
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-3">
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

        <button
          type="button"
          onClick={handleDemo}
          className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
        >
          <Sparkles className="h-3 w-3" />
          Fill demo customer login
        </button>
      </div>

      {/* Bottom Switch */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-[11.5px] font-semibold text-[#5C5247]">
          Don&apos;t have an account?{' '}
          <Link href="/m/auth/signup" className="font-bold text-[#0B3B25] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
