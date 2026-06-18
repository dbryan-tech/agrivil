'use client'

import { motion } from 'framer-motion'

const metrics = [
  { label: 'Prediction Accuracy', value: '89%', subtext: 'on unseen temporal domains' },
  { label: 'Data Efficiency', value: '6x', subtext: 'vs. standard methods' },
  { label: 'One-Shot Success Rate', value: '72%', subtext: 'with <10 examples' },
  { label: 'Active Research', value: '4', subtext: 'funded research initiatives' },
]

export function V3Research() {
  return (
    <section className="bg-white dark:bg-neutral-950 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="font-mono-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
            Research Outcomes
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-mono mb-20 max-w-2xl">
            Measurable results in prediction accuracy, data efficiency, and real-world impact.
          </p>

          {/* Metric grid */}
          <div className="grid md:grid-cols-4 gap-4">
            {metrics.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="border-2 border-neutral-200 dark:border-neutral-800 p-6 group hover:border-teal transition-colors"
              >
                <div className="font-mono-display text-3xl font-bold text-teal mb-1">{m.value}</div>
                <div className="font-mono-display text-sm font-bold text-neutral-900 dark:text-white">{m.label}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-mono">{m.subtext}</div>
              </motion.div>
            ))}
          </div>

          {/* Research areas */}
          <div className="mt-20 grid md:grid-cols-2 gap-6">
            {[
              { title: 'Temporal Topology', desc: 'Understanding how system geometry shifts over time.' },
              { title: 'Ergodic Breaking', desc: 'Detecting and modeling transitions in system behavior.' },
              { title: 'Sparse Learning', desc: 'Efficient prediction from minimal or unique data.' },
              { title: 'Decision Dynamics', desc: 'How choices shape future prediction landscapes.' },
            ].map((area, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="border-l-4 border-teal pl-6 py-4"
              >
                <h4 className="font-mono-display font-bold text-neutral-900 dark:text-white">{area.title}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-mono">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
