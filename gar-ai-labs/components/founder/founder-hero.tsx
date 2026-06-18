'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'

export function FounderHero() {
  return (
    <section className="px-4 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block rounded-lg border-2 border-[#0a0a0a] bg-white px-3 py-1 font-jetbrains text-xs font-bold uppercase text-[#0a0a0a]">
            Founder &amp; Principal Researcher
          </span>

          <h1 className="mt-6 font-onest text-5xl font-bold leading-[1.05] tracking-tight text-[#0a0a0a] md:text-6xl">
            Hi, I&apos;m{' '}
            <span className="inline-block -rotate-1 rounded-md bg-[#ff6b7a] px-3 py-1 text-white">
              Ewoke Lenny
            </span>{' '}
            <span className="inline-block rotate-1 rounded-md bg-[#2f81f7] px-3 py-1 text-white">
              Bryan
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-pretty font-onest text-lg leading-relaxed text-[#393939]">
            I build predictive systems for a world that only happens once.
            Founder of Gar AI Labs, where I research non-ergodic learning and
            decision models for path-dependent processes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-lg border-2 border-[#0a0a0a] bg-[#0a0a0a] px-5 py-3 font-jetbrains text-sm font-bold uppercase text-white shadow-[5px_5px_0px_0px_#0a0a0a] transition-transform hover:-translate-y-0.5"
            >
              Get in touch
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://github.com/GarAI-Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-[#0a0a0a] bg-white px-5 py-3 font-jetbrains text-sm font-bold uppercase text-[#0a0a0a] transition-transform hover:-translate-y-0.5"
            >
              <GithubIcon className="size-4" />
              GarAI-Labs
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-xs"
        >
          <div className="rounded-full border-[3px] border-[#0a0a0a] bg-[#fdb927] p-4 shadow-[10px_10px_0px_0px_#0a0a0a]">
            <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-[#0a0a0a] bg-[#0a0a0a]">
              <Image
                src="/founder-portrait.jpeg"
                alt="Portrait of Ewoke Lenny Bryan"
                fill
                priority
                sizes="(max-width: 768px) 18rem, 20rem"
                className="object-cover object-[80%_16%]"
              />
            </div>
          </div>
          <p className="mt-4 text-center font-jetbrains text-xs font-bold uppercase tracking-tight text-[#0a0a0a]">
            Ewoke Lenny Bryan
          </p>
        </motion.div>
      </div>
    </section>
  )
}
