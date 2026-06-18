import { ArrowUpRight } from 'lucide-react'
import { LabReveal } from '@/components/v2/lab-reveal'

const VECTORS = [
  {
    id: '001',
    title: 'Time-Aware Inference',
    tag: 'inference',
    body: 'Models that condition on where a system has been — its full trajectory — not just where similar systems tend to sit on average.',
  },
  {
    id: '002',
    title: 'One-Shot Decision Models',
    tag: 'decisions',
    body: 'Optimizing for outcomes you only get to experience once. No resets, no ensemble do-overs, no comfortable law of large numbers.',
  },
  {
    id: '003',
    title: 'Path-Dependent Risk',
    tag: 'risk',
    body: 'Quantifying ruin, absorption and irreversibility — the catastrophic failure modes that expected-value thinking quietly averages away.',
  },
  {
    id: '004',
    title: 'Generative Trajectories',
    tag: 'simulation',
    body: 'Simulating plausible futures as whole paths, then reasoning over their geometry to anticipate where a system is genuinely headed.',
  },
]

export function LabVectors() {
  return (
    <section
      id="research"
      className="border-t border-[#14130f]/12 px-5 py-24 dark:border-white/10 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <LabReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-5 font-rounded text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#14130f]/70 dark:text-white/70">
                02 — Research vectors
              </p>
              <h2 className="max-w-2xl text-balance font-grotesk text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#14130f] dark:text-[#f4f1ea]">
                Four directions, one obsession.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#14130f]/70 dark:text-[#f4f1ea]/70">
              Each program attacks the gap between the average outcome and the
              outcome that is actually realized.
            </p>
          </div>
        </LabReveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-[#14130f]/15 bg-[#14130f]/15 dark:border-white/12 dark:bg-white/10 sm:grid-cols-2">
          {VECTORS.map((v, i) => (
            <LabReveal key={v.id} delay={i * 0.06} className="h-full">
              <article className="group relative flex h-full flex-col gap-5 bg-[#fbfaf6] p-8 transition-colors hover:bg-[#f4f1ea] dark:bg-[#141416] dark:hover:bg-[#1a1a1c] sm:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-rounded text-sm tabular-nums text-[#C07A16] dark:text-[#E8A24A]">
                    {v.id}
                  </span>
                  <ArrowUpRight className="size-5 text-[#14130f]/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#14130f] dark:text-white/30 dark:group-hover:text-[#f4f1ea]" />
                </div>
                <h3 className="font-grotesk text-2xl font-semibold leading-tight text-[#14130f] dark:text-[#f4f1ea] sm:text-3xl">
                  {v.title}
                </h3>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-[#14130f]/60 dark:text-[#f4f1ea]/60">
                  {v.body}
                </p>
                <span className="mt-auto inline-flex w-fit items-center gap-2 border-t border-dashed border-[#14130f]/20 pt-4 font-rounded text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#14130f]/70 dark:border-white/15 dark:text-white/70">
                  <span className="size-1.5 bg-[#C07A16] dark:bg-[#E8A24A]" />
                  {v.tag}
                </span>
              </article>
            </LabReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
