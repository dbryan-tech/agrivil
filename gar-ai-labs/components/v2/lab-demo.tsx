import { LabReveal } from '@/components/v2/lab-reveal'
import { DivergenceLab } from '@/components/v2/divergence-lab'

export function LabDemo() {
  return (
    <section
      id="lab"
      className="border-t border-[#14130f]/12 bg-[#efebe1] px-5 py-24 dark:border-white/10 dark:bg-[#0a0a0b] sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <LabReveal>
            <p className="mb-5 font-rounded text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#14130f]/70 dark:text-white/70">
              03 — Live lab
            </p>
            <h2 className="text-balance font-grotesk text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#14130f] dark:text-[#f4f1ea]">
              Watch one seed become many lives.
            </h2>
          </LabReveal>
          <LabReveal delay={0.1}>
            <p className="max-w-lg text-pretty text-base leading-relaxed text-[#14130f]/65 dark:text-[#f4f1ea]/65">
              Every trajectory below starts from the{' '}
              <span className="font-medium text-[#14130f] dark:text-[#f4f1ea]">
                same state
              </span>{' '}
              under the same model. The dashed line is the ensemble mean — the
              tidy average. The amber line is the single path that actually got
              realized. Run it again: same model, a different life every time.
            </p>
          </LabReveal>
        </div>

        <LabReveal delay={0.15}>
          <div className="mt-12">
            <DivergenceLab />
          </div>
        </LabReveal>
      </div>
    </section>
  )
}
