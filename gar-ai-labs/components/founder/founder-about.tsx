import { Reveal } from '@/components/company/reveal'

const TAGS = [
  'Non-Ergodic Theory',
  'Probabilistic ML',
  'Time-Series',
  'Risk Modeling',
  'Open Source',
  'Research Engineering',
]

export function FounderAbout() {
  return (
    <section id="about" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-jetbrains text-xs font-bold uppercase tracking-tight text-[#2f81f7]">
            / About
          </span>
          <h2 className="mt-4 max-w-3xl font-onest text-3xl font-bold leading-tight tracking-tight text-[#0a0a0a] md:text-5xl">
            I care about the difference between{' '}
            <span className="bg-[#fdb927] px-2 text-[#0a0a0a]">on average</span>{' '}
            and <span className="bg-[#ff6b7a] px-2 text-white">over time</span>.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border-[3px] border-[#0a0a0a] bg-white p-6 shadow-[6px_6px_0px_0px_#0a0a0a]">
              <p className="font-onest leading-relaxed text-[#393939]">
                My work sits at the seam where statistics meets lived
                consequence. Classical ML averages over imagined parallel
                worlds; I build models that respect the single, irreversible
                path a real system actually walks. That shift — from ensemble to
                trajectory — changes what counts as a good prediction.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border-[3px] border-[#0a0a0a] bg-white p-6 shadow-[6px_6px_0px_0px_#0a0a0a]">
              <p className="font-onest leading-relaxed text-[#393939]">
                I founded Gar AI Labs to chase that idea in the open — releasing
                simulators, benchmarks, and methods anyone can stress-test. I
                care less about leaderboard wins and more about models that keep
                you solvent when the world refuses to repeat itself.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-6 flex flex-wrap gap-3">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-lg border-2 border-[#0a0a0a] bg-white px-3 py-1.5 font-jetbrains text-xs font-bold uppercase tracking-tight text-[#0a0a0a]"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
