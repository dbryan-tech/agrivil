import { Reveal } from './reveal'

const PRINCIPLES = [
  {
    k: 'Survival before average',
    v: 'A model that maximizes expected return but ignores ruin is optimizing a world you never live in. We score along the surviving path.',
  },
  {
    k: 'Order is information',
    v: 'Sequence, timing, and irreversibility carry signal. We refuse to shuffle data that the real process never shuffles.',
  },
  {
    k: 'Open by default',
    v: 'Methods, simulators, and benchmarks are released in the open so results can be reproduced, stressed, and trusted.',
  },
]

export function ApproachSection() {
  return (
    <section id="approach" className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand">
            003 — Approach
          </span>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-balance md:text-6xl">
            Principles we will not trade for a better benchmark.
          </h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.08}>
              <div className="group relative flex h-full flex-col gap-4 bg-background p-8">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <span className="font-mono text-xs text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-semibold uppercase tracking-tight">
                  {p.k}
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {p.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
