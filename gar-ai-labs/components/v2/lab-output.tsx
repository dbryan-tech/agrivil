import { ArrowUpRight } from 'lucide-react'
import { LabReveal } from '@/components/v2/lab-reveal'

const OUTPUT = [
  {
    year: '2025',
    title: 'Time-Average Optimality Under Irreversible Dynamics',
    tag: 'Preprint',
  },
  {
    year: '2025',
    title: 'Why Expected Value Misleads One-Shot Agents',
    tag: 'Note',
  },
  {
    year: '2024',
    title: 'Trajectory Geometry for Predictive Control',
    tag: 'Preprint',
  },
  {
    year: '2024',
    title: 'Absorption Risk in Sequential Decision Systems',
    tag: 'Talk',
  },
]

export function LabOutput() {
  return (
    <section
      id="output"
      className="border-t border-[#14130f]/12 px-5 py-24 dark:border-white/10 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <LabReveal>
          <p className="mb-5 font-rounded text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#14130f]/70 dark:text-white/70">
            04 — Selected output
          </p>
          <h2 className="max-w-2xl text-balance font-grotesk text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold uppercase leading-[1] tracking-[-0.02em] text-[#14130f] dark:text-[#f4f1ea]">
            Notes from the frontier.
          </h2>
        </LabReveal>

        <div className="mt-12 border-t border-[#14130f]/15 dark:border-white/12">
          {OUTPUT.map((o, i) => (
            <LabReveal key={o.title} delay={i * 0.05}>
              <a
                href="#contact"
                className="group flex items-center gap-5 border-b border-[#14130f]/15 py-6 transition-colors hover:bg-[#fbfaf6] dark:border-white/12 dark:hover:bg-[#141416] sm:gap-8 sm:py-7"
              >
                <span className="font-rounded text-sm font-medium tabular-nums text-[#14130f]/70 dark:text-white/70">
                  {o.year}
                </span>
                <h3 className="flex-1 text-pretty font-grotesk text-lg font-medium leading-snug text-[#14130f] transition-colors group-hover:text-[#C07A16] dark:text-[#f4f1ea] dark:group-hover:text-[#E8A24A] sm:text-2xl">
                  {o.title}
                </h3>
                <span className="hidden shrink-0 rounded-sm border border-[#14130f]/25 px-2.5 py-1 font-rounded text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#14130f]/70 dark:border-white/20 dark:text-white/70 sm:inline-block">
                  {o.tag}
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-[#14130f]/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#14130f] dark:text-white/30 dark:group-hover:text-[#f4f1ea]" />
              </a>
            </LabReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
