'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function SignalBand() {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-border bg-[#0a0b0f] text-white">
      {/* duotone editorial imagery */}
      <Image
        src="/stock/premise.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-35 grayscale"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a0b0f] via-[#0a0b0f]/85 to-[#0a0b0f]/40"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-brand"
          >
            <span className="size-2 bg-brand" aria-hidden="true" />
            The premise
          </motion.span>
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-8 font-display text-3xl font-bold uppercase leading-[1.02] tracking-[-0.02em] text-balance md:text-6xl"
          >
            Ergodicity is the quiet assumption behind almost every model — that
            time and probability <span className="text-brand">agree</span>. For
            the decisions that matter most, they don&apos;t.
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-white/55"
          >
            Ewoke Lenny Bryan — Founder &amp; Principal Researcher
          </motion.p>
        </div>
      </div>
    </section>
  )
}
