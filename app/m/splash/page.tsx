'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Sprout, ArrowRight } from 'lucide-react'

export default function MobileSplashScreen() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#1E5D3B] px-6 py-10 text-white sm:px-8">
      {/* Background Graphic Watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Image
          src="/golden-acres/hero-farmer.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10" />

      {/* Center Brand Identity */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#A3E635] text-[#144028] shadow-2xl">
          <Sprout className="h-11 w-11 stroke-[2.5]" />
        </div>

        <h1 className="ga-headline mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          AgriVil
        </h1>
        <p className="mt-2 max-w-xs text-xs font-semibold tracking-wider uppercase text-[#A3E635]">
          Farm fresh · Market smart · Delivered with care
        </p>
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 space-y-3 pb-4">
        <Link
          href="/m/onboarding/welcome"
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#A3E635] text-base font-extrabold text-[#144028] shadow-lg transition-transform hover:scale-[1.02]"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          href="/m/auth/login"
          className="ga-press flex h-14 w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-base font-bold text-white backdrop-blur-xs hover:bg-white/20"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
