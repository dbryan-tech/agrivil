'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export function V3Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* Divergence background image */}
      <div className="absolute inset-0">
        <Image
          src="/divergence-hero.png"
          alt="Diverging paths visualization"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

      {/* Content */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Scrolling headline */}
        <motion.div
          style={{ y, opacity }}
          className="max-w-4xl space-y-4"
        >
          <div className="font-mono-display text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight">
            <span>Every path</span>
            <br />
            <span className="relative">
              <span className="text-teal">diverges</span>
              <span className="absolute -inset-2 border-2 border-teal pointer-events-none" />
            </span>
            <br />
            <span>Only once.</span>
          </div>
          <p className="text-lg md:text-xl text-gray-300 font-mono mt-6 max-w-2xl mx-auto">
            Non-ergodic systems evolve uniquely. We predict their unfolding.
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <svg className="w-6 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
