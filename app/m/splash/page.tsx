'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function MobileSplashScreen() {
  const router = useRouter()
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 25
      })
    }, 400)

    const timer = setTimeout(() => {
      router.push('/m/onboarding/welcome')
    }, 2200)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#0F7A43] px-6 py-10 text-white sm:px-8">
      {/* Background Cinematic Farm View */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/golden-acres/hero-farmer.jpg"
          alt="Agrivil Fresh Farm Harvest"
          fill
          priority
          className="object-cover object-center brightness-90"
        />
        {/* Soft emerald brand gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F7A43]/40 via-transparent to-[#0B3B25]/95" />
      </div>

      {/* Top Status Bar Spacer */}
      <div className="relative z-10 pt-2" />

      {/* Center Brand Identity */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        {/* 3-leaf Agrivil emblem */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/95 p-3.5 text-[#0F7A43] shadow-2xl backdrop-blur-sm">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
          >
            <path
              d="M24 6C24 6 22 17 15 22C8 27 6 36 6 36C6 36 15 35 21 28C27 21 24 6 24 6Z"
              fill="#0F7A43"
            />
            <path
              d="M24 6C24 6 26 17 33 22C40 27 42 36 42 36C42 36 33 35 27 28C21 21 24 6 24 6Z"
              fill="#3F8A4F"
            />
            <path
              d="M24 16C24 16 21 27 21 34C21 39 24 42 24 42C24 42 27 39 27 34C27 27 24 16 24 16Z"
              fill="#0F7A43"
            />
          </svg>
        </div>

        <h1 className="ga-headline mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-md">
          Agrivil
        </h1>
        <p className="mt-2.5 max-w-xs text-sm font-medium tracking-wide text-white/90 drop-shadow">
          Farm fresh. Market smart. Delivered with care.
        </p>
      </div>

      {/* Bottom Loading / Manual Navigation */}
      <div className="relative z-10 flex flex-col items-center space-y-4 pb-6">
        {/* Subtle Minimalist Circular Spinner */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>

        <Link
          href="/m/onboarding/welcome"
          className="text-xs font-semibold text-white/75 transition-colors hover:text-white"
        >
          Tap here if not redirected automatically
        </Link>
      </div>
    </div>
  )
}
