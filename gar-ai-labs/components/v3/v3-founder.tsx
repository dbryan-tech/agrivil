'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function V3Founder() {
  return (
    <section className="bg-neutral-100 dark:bg-neutral-900 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Portrait */}
          <div>
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              <div className="absolute inset-0 bg-teal" />
              <div className="relative inset-0 aspect-square overflow-hidden">
                <Image
                  src="/founder-portrait.jpeg"
                  alt="Ewoke Lenny Bryan"
                  fill
                  className="object-cover object-[80%_16%]"
                />
              </div>
            </div>
          </div>

          {/* Vision text */}
          <div>
            <h2 className="font-mono-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Ewoke Lenny Bryan
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Founder & Lead Researcher
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-mono text-sm">
              "Most predictions fail because they assume the world repeats. It doesn't. Every crisis, every market shift, every human decision creates a path that will never occur again. We're building AI that understands this—that thrives in divergence, not repetition."
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm font-mono mb-8">
              PhD in Physics, 15+ years in predictive systems. Previously led ML research at <span className="text-teal">→</span> research lab.
            </p>
            <Link
              href="/founder"
              className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 font-mono-display font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
            >
              Full Profile
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
