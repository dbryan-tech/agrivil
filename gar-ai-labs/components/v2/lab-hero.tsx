'use client'

import Link from 'next/link'
import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { TrajectoryField } from '@/components/v2/trajectory-field'
import { DivergenceSculpture } from '@/components/v2/divergence-sculpture'

const READOUTS = [
  { k: 'Paths', v: '1,024' },
  { k: 'Horizon', v: 't \u2192 \u221e' },
  { k: 'Mode', v: 'Non-ergodic' },
  { k: 'Status', v: 'Live' },
]

const headline = ['Predict', 'the path,', 'not the', 'average.']

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

export function LabHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const figureY = useSpring(rawY, springConfig)
  const rawScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.88])
  const figureScale = useSpring(rawScale, springConfig)
  const figureOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* live trajectory field */}
      <TrajectoryField className="absolute inset-0 -z-10 h-full w-full" />
      {/* readability scrim */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f4f1ea]/30 via-[#f4f1ea]/55 to-[#f4f1ea] dark:from-[#0c0c0d]/30 dark:via-[#0c0c0d]/55 dark:to-[#0c0c0d]" />

      {/* corner ticks */}
      <div className="pointer-events-none absolute left-8 top-20 hidden font-rounded text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#14130f]/65 dark:text-white/65 sm:block">
        x0 = seed · t0
      </div>
      <div className="pointer-events-none absolute right-8 top-20 hidden text-right font-rounded text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#14130f]/65 dark:text-white/65 sm:block">
        est. 2025 — research division
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 items-center px-5 py-28 sm:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          {/* left: copy */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-3 font-rounded text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#B26C0E] dark:text-[#E8A24A]"
            >
              <span className="h-px w-8 bg-[#B26C0E] dark:bg-[#E8A24A]" />
              Non-ergodic predictive intelligence
            </motion.p>

            <h1 className="font-grotesk text-[clamp(2.6rem,7vw,7rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-[#14130f] dark:text-[#f4f1ea]">
              {headline.map((word, i) => (
                <span key={word} className="block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {i === 3 ? (
                      <span className="text-[#B26C0E] dark:text-[#E8A24A]">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-[#14130f]/75 dark:text-[#f4f1ea]/75 sm:text-lg"
            >
              Gar AI Labs builds predictive intelligence for worlds that happen
              once. We model the trajectory a system actually takes — not the
              comfortable fiction of its long-run average.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                href="#research"
                className="group inline-flex items-center gap-2 rounded-sm bg-[#14130f] px-6 py-3.5 font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-[#f4f1ea] transition-transform hover:-translate-y-0.5 dark:bg-[#E8A24A] dark:text-[#14130f]"
              >
                Explore the research
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#lab"
                className="group inline-flex items-center gap-2 rounded-sm border border-[#14130f]/30 px-6 py-3.5 font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-[#14130f] transition-colors hover:border-[#14130f] dark:border-white/30 dark:text-[#f4f1ea] dark:hover:border-white"
              >
                Run the lab
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* right: glass humanoid */}
          <motion.div
            style={{ y: figureY, scale: figureScale, opacity: figureOpacity }}
            className="relative order-1 flex h-[42vh] min-h-[320px] items-center justify-center lg:order-2 lg:h-[68vh]"
          >
            {/* pulsing amber glow halo (GiGi-style) */}
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 size-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8A24A]/30 blur-[90px] dark:bg-[#E8A24A]/25"
              animate={{ scale: [0.85, 1, 0.85], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 18,
                delay: 0.3,
              }}
              className="h-full w-full"
            >
              <DivergenceSculpture className="h-full w-full" />
            </motion.div>
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-rounded text-[0.62rem] font-bold uppercase tracking-wide text-[#14130f]/65 dark:text-white/65 sm:text-xs">
              one seed · divergent futures
            </div>
          </motion.div>
        </div>
      </div>

      {/* instrument readout bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 border-t border-[#14130f]/15 dark:border-white/12"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 sm:grid-cols-4">
          {READOUTS.map((r, i) => (
            <div
              key={r.k}
              className={[
                'flex items-baseline justify-between gap-2 px-5 py-4 sm:px-8',
                i < READOUTS.length - 1
                  ? 'border-b border-[#14130f]/15 dark:border-white/12 sm:border-b-0 sm:border-r'
                  : '',
                i % 2 === 0
                  ? 'border-r border-[#14130f]/15 dark:border-white/12 sm:border-r'
                  : '',
              ].join(' ')}
            >
              <span className="font-rounded text-xs font-bold uppercase tracking-wide text-[#14130f]/75 dark:text-white/75">
                {r.k}
              </span>
              <span className="font-rounded text-base font-extrabold tabular-nums text-[#14130f] dark:text-[#f4f1ea]">
                {r.v}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
