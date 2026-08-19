'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Leaf, Truck, ShieldCheck, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlideData {
  id: number
  titlePrefix: string
  titleHighlight: string
  subtitle: string
  image: string
  imageAlt: string
  badge?: string
}

const ONBOARDING_SLIDES: SlideData[] = [
  {
    id: 1,
    titlePrefix: 'Welcome to',
    titleHighlight: 'Agrivil',
    subtitle: "Ghana's freshest harvest, delivered to your door.",
    image: '/golden-acres/bundle-box.png',
    imageAlt: 'Fresh produce harvest basket',
    badge: '100% Farm Fresh',
  },
  {
    id: 2,
    titlePrefix: 'Welcome to',
    titleHighlight: 'Agrivil',
    subtitle: 'delivered from local farmers to your door.',
    image: '/golden-acres/bundle-box.png',
    imageAlt: 'Ghana fresh vegetable & fruit basket',
    badge: 'Morning Harvest',
  },
  {
    id: 3,
    titlePrefix: 'Direct From',
    titleHighlight: 'Local Growers',
    subtitle: 'Harvested at dawn across Ashanti, Eastern & Greater Accra.',
    image: '/golden-acres/hero-farmer.jpg',
    imageAlt: 'Local Ghanaian grower in the field',
    badge: 'Fair Trade Payout',
  },
  {
    id: 4,
    titlePrefix: 'Fast Cold-Chain',
    titleHighlight: 'Doorstep Delivery',
    subtitle: 'Temperature-controlled dispatch straight from pack hub to you.',
    image: '/golden-acres/delivery.png',
    imageAlt: 'Express farm delivery courier',
    badge: 'Same-Day Dispatch',
  },
]

export default function MobileOnboardingScreen() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Touch gesture tracking
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 40

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % ONBOARDING_SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + ONBOARDING_SLIDES.length) % ONBOARDING_SLIDES.length)
  }, [])

  // Auto-play timer (advances every 3.8s unless paused by touch)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 3800)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Touch swipe event handlers
  function handleTouchStart(e: React.TouchEvent) {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false)
      return
    }
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    // Resume auto-play after 3 seconds of inactivity
    setTimeout(() => setIsPaused(false), 3000)
    touchStartX.current = null
    touchEndX.current = null
  }

  const activeSlide = ONBOARDING_SLIDES[currentSlide]

  return (
    <div
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#FAF7F0] px-5 py-6 sm:px-8 text-[#2B1F17] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
      }}
    >
      {/* 1. Top Bar with Skip */}
      <div className="relative z-20 flex items-center justify-end">
        <Link
          href="/m"
          className="ga-press text-xs font-bold tracking-wide text-[#6E6A63] transition-colors hover:text-[#2B1F17]"
        >
          Skip
        </Link>
      </div>

      {/* 2. Slide Show Hero Content */}
      <div className="relative z-10 my-auto flex flex-col items-start text-left pt-2">
        {/* Animated Headline & Subtitle */}
        <div key={`text-${currentSlide}`} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h1 className="ga-headline text-3xl font-extrabold tracking-tight text-[#2B1F17] sm:text-4xl">
            {activeSlide.titlePrefix} <br />
            <span className="text-[#0F7A43]">{activeSlide.titleHighlight}</span>
          </h1>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#6E6A63] max-w-xs sm:text-sm">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* Hero Visual Area with Warm Glow */}
        <div className="relative mx-auto mt-6 flex h-64 w-full max-w-xs items-center justify-center sm:h-72">
          {/* Ambient Glow */}
          <div className="absolute inset-4 rounded-full bg-[#0F7A43]/5 blur-2xl" />

          {/* Slide Visual Transition */}
          <div
            key={`img-${currentSlide}`}
            className="relative h-full w-full flex items-center justify-center animate-in zoom-in-95 fade-in duration-300"
          >
            {activeSlide.id === 3 ? (
              <div className="relative h-56 w-56 overflow-hidden rounded-3xl border-2 border-[#E0DACB] shadow-xl">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#0F7A43] px-2.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                  {activeSlide.badge}
                </span>
              </div>
            ) : (
              <div className="relative h-56 w-56 sm:h-64 sm:w-64 flex items-center justify-center">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Indicators & Action Footer */}
      <div className="relative z-20 space-y-4 pt-2">
        {/* 4 Indicators Dots (Slideshow Pagination) */}
        <div className="flex items-center justify-center gap-2 pb-1">
          {ONBOARDING_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentSlide(idx)
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 3000)
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                currentSlide === idx
                  ? 'w-6 bg-[#0F7A43]'
                  : 'w-2 bg-[#D5CEBD] hover:bg-[#A8A294]'
              )}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => router.push('/m/onboarding/how-it-works')}
            className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md transition-all hover:bg-[#0B3B25]"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => router.push('/m/auth/login')}
            className="ga-press flex h-12 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-white text-xs font-bold text-[#2B1F17] shadow-xs hover:bg-[#FAF7F0]"
          >
            I have an account
          </button>
        </div>
      </div>
    </div>
  )
}
