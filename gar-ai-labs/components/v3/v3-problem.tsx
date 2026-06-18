'use client'

import { motion } from 'framer-motion'

const problemStates = [
  {
    title: 'Ergodic Assumption',
    problem: 'Traditional ML treats history as a representative sample of the future.',
    reality: 'Markets crash. Weather breaks. Human behavior shifts.',
  },
  {
    title: 'Time-Blind Models',
    problem: 'Standard predictors don&apos;t encode path-dependency or temporal context.',
    reality: 'The 100th occurrence is not like the first. Context matters.',
  },
  {
    title: 'One-Shot Worlds',
    problem: 'Many real systems have few or unique historical examples.',
    reality: 'Pandemics, wars, technological ruptures—no training data exists.',
  },
]

export function V3Problem() {
  return (
    <section className="bg-white dark:bg-neutral-950 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-20"
        >
          <h2 className="font-mono-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
            The Problem
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-4 max-w-2xl font-mono">
            Predictive systems are built on a lie: that the past repeats. It doesn't.
          </p>
        </motion.div>

        {/* Problem grid */}
        <div className="space-y-6">
          {problemStates.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
              className="group border-2 border-neutral-200 dark:border-neutral-800 p-6 hover:border-teal transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-1 h-1 bg-teal rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-mono-display text-xl font-bold text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 mt-2">{item.problem}</p>
                  <p className="text-sm text-teal font-mono mt-2">→ {item.reality}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
