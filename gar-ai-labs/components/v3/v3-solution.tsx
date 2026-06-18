'use client'

import { motion } from 'framer-motion'

export function V3Solution() {
  return (
    <section className="bg-teal text-neutral-900 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="font-mono-display text-5xl md:text-6xl font-bold leading-tight mb-6">
            Our Approach
          </h2>
          <p className="text-lg font-mono max-w-2xl mb-16">
            We build predictive models that embrace divergence, encode temporal uniqueness, and thrive in low-data regimes.
          </p>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Path-Aware Learning',
                desc: 'Models that encode historical trajectory, not just state. Every decision carries its context.',
              },
              {
                num: '02',
                title: 'Time-Dependent Inference',
                desc: 'Predictions shift with time. The 50th event differs from the first. We account for it.',
              },
              {
                num: '03',
                title: 'One-Shot Capability',
                desc: 'Predict on novel, unseen scenarios. Our methods work with minimal or unique examples.',
              },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="border-2 border-neutral-900/20 p-6"
              >
                <div className="font-mono-display text-4xl font-bold mb-3 opacity-40">{pillar.num}</div>
                <h3 className="font-mono-display text-xl font-bold mb-2">{pillar.title}</h3>
                <p className="text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
