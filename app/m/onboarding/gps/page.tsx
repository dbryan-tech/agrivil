'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Crosshair, ArrowLeft, Loader2 } from 'lucide-react'
import { validateGhanaPostGPS } from '@/lib/golden-acres/api'

export default function GpsSetupScreen() {
  const router = useRouter()
  const [gpsCode, setGpsCode] = useState('GA-143-3586')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!gpsCode.trim()) {
      setError('Please enter a valid GhanaPostGPS code.')
      return
    }

    setLoading(true)
    setError(null)
    const res = await validateGhanaPostGPS(gpsCode.trim())
    setLoading(false)

    if (res.valid) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ga_user_gps', gpsCode.trim())
        localStorage.setItem('ga_user_area', res.area || 'KNUST, Kumasi, Ashanti Region')
      }
      router.push(`/m/onboarding/confirm-area?code=${encodeURIComponent(gpsCode.trim())}&area=${encodeURIComponent(res.area || 'KNUST, Kumasi, Ashanti Region')}`)
    } else {
      setError('Invalid GhanaPostGPS code. Example: GA-143-3586')
    }
  }

  function handleAutoLocate() {
    setGpsCode('GA-143-3586')
    setError(null)
  }

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#FAF7F0] px-6 py-6 sm:px-8">
      {/* Top Header Bar */}
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

      {/* Center Body Content */}
      <div className="relative z-10 my-auto flex flex-col pt-4">
        <div className="max-w-xs">
          <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17] sm:text-4xl">
            Add your <br />
            <span className="text-[#0F7A43]">GhanaPostGPS</span>
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[#6E6A63]">
            This helps our riders find you accurately.
          </p>
        </div>

        {/* Input Card Container */}
        <form onSubmit={handleContinue} className="mt-8 rounded-3xl border border-[#E0DACB] bg-white p-5 shadow-xs">
          <div>
            <label className="text-xs font-semibold text-[#6E6A63]">
              Enter GhanaPostGPS address
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                value={gpsCode}
                onChange={(e) => {
                  setGpsCode(e.target.value.toUpperCase())
                  if (error) setError(null)
                }}
                placeholder="GA-143-3586"
                className="h-14 w-full rounded-2xl border border-[#E0DACB] bg-[#FAF7F0]/40 px-4 pr-12 text-base font-bold tracking-wider text-[#2B1F17] outline-none transition-all focus:border-[#0F7A43] focus:ring-2 focus:ring-[#0F7A43]/20 uppercase"
              />
              <button
                type="button"
                onClick={handleAutoLocate}
                title="Detect GPS location"
                className="ga-press absolute top-1/2 right-3 -translate-y-1/2 rounded-xl p-2 text-[#0F7A43] hover:bg-[#FAF7F0]"
              >
                <Crosshair className="h-5 w-5" />
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs font-medium text-[#DC2626]">{error}</p>
            )}
          </div>

          <div className="mt-4 pt-1">
            <a
              href="https://ghanapostgps.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-[#7A3F1C] underline underline-offset-2 hover:opacity-80"
            >
              How do I get my GhanaPostGPS?
            </a>
          </div>
        </form>
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 space-y-3 pb-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-base font-bold text-white shadow-md transition-all hover:bg-[#0B3B25] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue'}
        </button>

        <Link
          href="/m"
          className="ga-press flex h-12 w-full items-center justify-center text-sm font-bold text-[#7A3F1C] transition-colors hover:text-[#2B1F17]"
        >
          I&apos;ll do this later
        </Link>
      </div>
    </div>
  )
}
