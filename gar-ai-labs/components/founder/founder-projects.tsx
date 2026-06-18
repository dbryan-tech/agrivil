import { Reveal } from '@/components/company/reveal'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'

const PROJECTS = [
  {
    name: 'ergodicity-kit',
    desc: 'A toolkit for diagnosing non-ergodicity in time-series and comparing time-average vs ensemble-average estimators.',
    accent: '#ff6b7a',
    tag: 'Python',
  },
  {
    name: 'pathwise',
    desc: 'Trajectory-based evaluation metrics for forecasting models — scoring along the path actually taken, drawdowns included.',
    accent: '#2f81f7',
    tag: 'Library',
  },
  {
    name: 'oneshot-sim',
    desc: 'A simulator for one-shot, irreversible decision problems with absorbing states and ruin conditions.',
    accent: '#fdb927',
    tag: 'Simulator',
  },
  {
    name: 'gar-benchmarks',
    desc: 'Open benchmark suite for path-dependent prediction, with reproducible baselines and calibration reports.',
    accent: '#0a0a0a',
    tag: 'Datasets',
  },
]

export function FounderProjects() {
  return (
    <section id="projects" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-jetbrains text-xs font-bold uppercase tracking-tight text-[#2f81f7]">
              / Projects
            </span>
            <h2 className="mt-4 font-onest text-3xl font-bold tracking-tight text-[#0a0a0a] md:text-5xl">
              Built in the open.
            </h2>
          </div>
          <a
            href="https://github.com/GarAI-Labs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#0a0a0a] bg-white px-4 py-2 font-jetbrains text-xs font-bold uppercase tracking-tight text-[#0a0a0a] transition-transform hover:-translate-y-0.5"
          >
            <GithubIcon className="size-4" />
            View all on GitHub
          </a>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <a
                href="https://github.com/GarAI-Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border-[3px] border-[#0a0a0a] bg-white p-6 shadow-[6px_6px_0px_0px_#0a0a0a] transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-md border-2 border-[#0a0a0a] px-2 py-0.5 font-jetbrains text-[11px] font-bold uppercase tracking-tight"
                    style={{
                      backgroundColor: p.accent,
                      color: p.accent === '#fdb927' ? '#0a0a0a' : '#ffffff',
                    }}
                  >
                    {p.tag}
                  </span>
                  <ArrowUpRight className="size-5 text-[#0a0a0a] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-4 font-jetbrains text-lg font-bold text-[#0a0a0a]">
                  {p.name}
                </h3>
                <p className="mt-2 font-onest leading-relaxed text-[#393939]">
                  {p.desc}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
