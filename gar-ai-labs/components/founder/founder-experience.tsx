import { Reveal } from '@/components/company/reveal'

const TIMELINE = [
  {
    period: '2024 — Now',
    role: 'Founder & Principal Researcher',
    org: 'Gar AI Labs',
    note: 'Leading research into non-ergodic predictive intelligence. Building open simulators and benchmarks for path-dependent forecasting.',
    accent: '#ff6b7a',
  },
  {
    period: '2021 — 2024',
    role: 'Machine Learning Researcher',
    org: 'Applied Inference Group',
    note: 'Time-aware probabilistic models for high-stakes, low-repetition decision problems across finance and operations.',
    accent: '#2f81f7',
  },
  {
    period: '2019 — 2021',
    role: 'Research Engineer',
    org: 'Independent / Open Source',
    note: 'Shipped tooling for trajectory-based evaluation and contributed to several open probabilistic-programming libraries.',
    accent: '#fdb927',
  },
]

export function FounderExperience() {
  return (
    <section id="experience" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-jetbrains text-xs font-bold uppercase tracking-tight text-[#2f81f7]">
            / Experience
          </span>
          <h2 className="mt-4 font-onest text-3xl font-bold tracking-tight text-[#0a0a0a] md:text-5xl">
            The path so far.
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-5">
          {TIMELINE.map((item, i) => (
            <Reveal key={item.period} delay={i * 0.06}>
              <article className="grid gap-4 rounded-2xl border-[3px] border-[#0a0a0a] bg-white p-6 shadow-[6px_6px_0px_0px_#0a0a0a] md:grid-cols-[auto_1fr] md:gap-8 md:p-8">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-[#0a0a0a]"
                    style={{ backgroundColor: item.accent }}
                    aria-hidden="true"
                  />
                  <span className="font-jetbrains text-sm font-bold uppercase tracking-tight text-[#0a0a0a]">
                    {item.period}
                  </span>
                </div>
                <div>
                  <h3 className="font-onest text-xl font-bold text-[#0a0a0a] md:text-2xl">
                    {item.role}
                  </h3>
                  <p className="font-jetbrains text-sm font-bold uppercase tracking-tight text-[#2f81f7]">
                    {item.org}
                  </p>
                  <p className="mt-3 max-w-2xl font-onest leading-relaxed text-[#393939]">
                    {item.note}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
