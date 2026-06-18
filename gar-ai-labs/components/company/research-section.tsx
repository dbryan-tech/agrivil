'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Reveal } from './reveal'

const RESEARCH = [
  {
    index: '001',
    title: 'Non-Ergodic Learning',
    body: 'Estimators and objectives built for processes whose time-average diverges from their ensemble-average. We model what happens to a single trajectory, not an imaginary population of parallel worlds.',
    img: '/stock/research-1.png',
  },
  {
    index: '002',
    title: 'Time-Aware Inference',
    body: 'Inference that respects ordering, absorbing states, and irreversibility. Risk is evaluated along the path actually taken — drawdowns, ruin, and lock-in are treated as first-class, not noise.',
    img: '/stock/research-2.png',
  },
  {
    index: '003',
    title: 'One-Shot Decision Models',
    body: 'Decision frameworks for choices that cannot be repeated. We optimize for survivable outcomes under deep uncertainty rather than expected value over hypothetical resamples.',
    img: '/stock/research-3.png',
  },
  {
    index: '004',
    title: 'Predictive Infrastructure',
    body: 'Open tooling for path-dependent forecasting: simulators, calibration suites, and evaluation metrics that score models on the geometry of real trajectories.',
    img: '/stock/hero-atmosphere.png',
  },
]

export function ResearchSection() {
  const [active, setActive] = useState<number | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 28 })
  const y = useSpring(my, { stiffness: 220, damping: 28 })

  return (
    <section
      id="research"
      className="relative border-b border-border bg-background"
      onMouseMove={(e) => {
        mx.set(e.clientX)
        my.set(e.clientY)
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand">
              002 — Research
            </span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-balance md:text-6xl">
              Four directions, one premise: the world does not repeat itself.
            </h2>
          </div>
        </Reveal>

        <div className="border-t border-border">
          {RESEARCH.map((item, i) => (
            <Reveal key={item.index} delay={i * 0.05}>
              <article
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group relative grid gap-4 border-b border-border py-8 transition-colors md:grid-cols-[auto_1fr_2fr] md:items-baseline md:gap-10 md:px-2"
              >
                {/* hover wash */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-0 origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <span className="relative font-mono text-xs text-brand">
                  {item.index}
                </span>
                <h3 className="relative font-display text-2xl font-semibold uppercase tracking-tight transition-colors duration-300 group-hover:text-background md:text-4xl">
                  {item.title}
                </h3>
                <div className="relative">
                  <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-background/80">
                    {item.body}
                  </p>
                  {/* mobile inline thumbnail */}
                  <div className="mt-5 aspect-[16/9] w-full overflow-hidden border border-border md:hidden">
                    <Image
                      src={item.img}
                      alt=""
                      width={640}
                      height={360}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* floating cursor-follow image preview (desktop) */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="preview"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          >
            <div className="relative h-56 w-80 overflow-hidden border border-brand/40 shadow-2xl">
              <Image
                src={RESEARCH[active].img}
                alt=""
                fill
                sizes="320px"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-brand/10 mix-blend-multiply" />
              <span className="absolute left-3 top-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white">
                {RESEARCH[active].index}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
