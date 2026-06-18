'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const TITLE_LINES = [
  { text: 'Non-Ergodic', accent: false },
  { text: 'Predictive', accent: true },
  { text: 'Intelligence', accent: false },
]

const STATS = [
  { k: '∞', v: 'Non-repeating trajectories modeled' },
  { k: '100%', v: 'Open methods & benchmarks' },
  { k: '001', v: 'Founder-led research studio' },
]

export function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden bg-[#0a0b0f] text-white">
      {/* full-bleed duotone atmosphere */}
      <Image
        src="/stock/hero-atmosphere.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0b0f] via-[#0a0b0f]/70 to-[#0a0b0f]/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a0b0f] via-transparent to-transparent"
      />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 md:pt-36">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <span className="size-2 bg-brand" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/60">
            Gar AI Labs / 001
          </span>
          <span className="h-px w-16 bg-white/20" />
        </motion.div>

        <h1 className="font-display text-[clamp(2.9rem,11vw,11rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.03em]">
          {TITLE_LINES.map((line, i) => (
            <span key={line.text} className="block overflow-hidden">
              <motion.span
                className={
                  line.accent
                    ? 'inline-block text-brand'
                    : 'inline-block'
                }
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.95,
                  delay: 0.1 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg"
          >
            Most machine learning assumes the future is a shuffled copy of the
            past. The real world rarely is. We build predictive systems for
            one-shot, path-dependent processes — where the average over time and
            the average over outcomes are not the same.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link
              href="#research"
              className="group inline-flex items-center gap-2 whitespace-nowrap bg-brand px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore research
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/founder"
              className="group inline-flex items-center gap-2 whitespace-nowrap border border-white/25 py-3 pl-5 pr-6 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#0a0b0f]"
            >
              Meet the founder
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* editorial stats band */}
        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-3"
        >
          {STATS.map((s) => (
            <div
              key={s.v}
              className="flex items-baseline gap-4 bg-[#0a0b0f]/80 px-6 py-6 backdrop-blur-sm"
            >
              <dt className="font-display text-4xl font-bold leading-none tracking-tight text-brand">
                {s.k}
              </dt>
              <dd className="font-mono text-[0.7rem] uppercase leading-snug tracking-[0.14em] text-white/55">
                {s.v}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
    </section>
  )
}
