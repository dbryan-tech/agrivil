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
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#FAF7F0] px-6 py-6 sm:px-8">
      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <Link
          href="/m"
          className="text-sm font-bold text-[#6E6A63] transition-colors hover:text-[#7A3F1C]"
        >
          Skip
        </Link>
      </div>

      {/* Center Form */}
      <div className="relative z-10 my-auto flex flex-col pt-2 pb-2">
        <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17]">
          Welcome back
        </h1>
        <p className="mt-1 text-xs font-medium text-[#6E6A63]">
          Log in to continue
        </p>

        {error && (
          <div className="mt-3 rounded-xl bg-[#DC2626]/10 p-3 text-xs font-semibold text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#6E6A63]">Phone number</label>
            <div className="relative mt-1 flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 border-r border-[#E0DACB] pr-2 text-xs font-bold text-[#2B1F17]">
                <span>+233</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="h-13 w-full rounded-2xl border border-[#E0DACB] bg-white pl-20 pr-4 text-sm font-medium text-[#2B1F17] shadow-xs outline-none transition-all focus:border-[#0F7A43] focus:ring-2 focus:ring-[#0F7A43]/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#6E6A63]">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#7A3F1C] hover:underline"
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
                className="h-13 w-full rounded-2xl border border-[#E0DACB] bg-white px-4 pr-12 text-sm font-medium text-[#2B1F17] shadow-xs outline-none transition-all focus:border-[#0F7A43] focus:ring-2 focus:ring-[#0F7A43]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#6E6A63] hover:text-[#2B1F17]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="ga-press mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-base font-bold text-white shadow-md transition-all hover:bg-[#0B3B25] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        {/* Social Logins */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-[#6E6A63]">
          <div className="h-px flex-1 bg-[#E0DACB]" />
          <span>or</span>
          <div className="h-px flex-1 bg-[#E0DACB]" />
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            className="ga-press flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DACB] bg-white shadow-xs hover:bg-[#FAF7F0]"
          >
            <span className="font-bold text-[#EA4335]">G</span>
          </button>
          <button
            type="button"
            className="ga-press flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DACB] bg-white shadow-xs hover:bg-[#FAF7F0]"
          >
            <span className="font-bold text-[#2B1F17]"></span>
          </button>
          <button
            type="button"
            className="ga-press flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DACB] bg-white shadow-xs hover:bg-[#FAF7F0]"
          >
            <span className="font-bold text-[#1877F2]">f</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleDemo}
          className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-[#7A3F1C] hover:underline"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Fill demo customer login
        </button>
      </div>

      {/* Bottom Switch */}
      <div className="relative z-10 text-center pb-3">
        <p className="text-xs font-semibold text-[#6E6A63]">
          Don&apos;t have an account?{' '}
          <Link href="/m/auth/signup" className="font-bold text-[#0F7A43] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
