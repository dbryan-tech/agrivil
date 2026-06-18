import { LabReveal } from '@/components/v2/lab-reveal'

const COMPARE = [
  {
    tag: 'Ensemble average',
    head: 'What happens across many parallel worlds.',
    body: 'Run a system a thousand times and average the results. Clean, tractable — and experienced by no one in particular.',
  },
  {
    tag: 'Time average',
    head: 'What happens to you, along one path.',
    body: 'The single sequence you actually live through. Order matters, losses compound, and some doors close for good.',
  },
]

export function LabPremise() {
  return (
    <section
      id="premise"
      className="border-t border-[#14130f]/12 px-5 py-24 dark:border-white/10 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <LabReveal>
          <p className="mb-10 font-rounded text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#14130f]/70 dark:text-white/70">
            01 — Premise
          </p>
        </LabReveal>

        <LabReveal delay={0.05}>
          <h2 className="max-w-4xl text-balance font-grotesk text-[clamp(2rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.02em] text-[#14130f] dark:text-[#f4f1ea]">
            The average never{' '}
            <span className="text-[#C07A16] dark:text-[#E8A24A]">
              happens
            </span>{' '}
            to anyone.
          </h2>
        </LabReveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <LabReveal delay={0.1}>
            <div className="space-y-6 text-base leading-relaxed text-[#14130f]/70 dark:text-[#f4f1ea]/70 sm:text-lg">
              <p>
                Most machine learning optimizes the{' '}
                <span className="font-medium text-[#14130f] dark:text-[#f4f1ea]">
                  ensemble average
                </span>{' '}
                — the expected outcome over many imagined repetitions of the
                world. But people, markets, organisms and machines do not live
                in the ensemble. They live in time, along a single,
                irreversible trajectory.
              </p>
              <p>
                When a process is{' '}
                <span className="font-medium text-[#14130f] dark:text-[#f4f1ea]">
                  non-ergodic
                </span>
                , the time average and the ensemble average part ways. The
                expected value can look healthy while the path that is actually
                taken runs straight into ruin. We build models that take the
                path seriously.
              </p>
            </div>
          </LabReveal>

          <LabReveal delay={0.15}>
            <div className="grid gap-px overflow-hidden rounded-sm border border-[#14130f]/15 bg-[#14130f]/15 dark:border-white/12 dark:bg-white/10 sm:grid-cols-2">
              {COMPARE.map((c) => (
                <div
                  key={c.tag}
                  className="flex flex-col gap-3 bg-[#fbfaf6] p-6 dark:bg-[#141416]"
                >
                  <span className="font-rounded text-[0.62rem] uppercase tracking-[0.18em] text-[#C07A16] dark:text-[#E8A24A]">
                    {c.tag}
                  </span>
                  <h3 className="font-grotesk text-lg font-semibold leading-tight text-[#14130f] dark:text-[#f4f1ea]">
                    {c.head}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#14130f]/60 dark:text-[#f4f1ea]/60">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </LabReveal>
        </div>
      </div>
    </section>
  )
}
