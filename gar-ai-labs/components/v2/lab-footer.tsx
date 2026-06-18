import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'
import { LabReveal } from '@/components/v2/lab-reveal'

export function LabFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[#14130f]/12 bg-[#14130f] px-5 pt-24 text-[#f4f1ea] dark:border-white/10 dark:bg-[#0a0a0b] sm:px-8 sm:pt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <LabReveal>
          <p className="font-rounded text-[0.7rem] uppercase tracking-[0.24em] text-[#E8A24A]">
            06 — Get in touch
          </p>
          <h2 className="mt-6 max-w-3xl text-balance font-grotesk text-[clamp(2rem,5vw,4rem)] font-bold uppercase leading-[0.98] tracking-[-0.02em]">
            Working on systems that only happen once?
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#f4f1ea]/65">
            We collaborate with researchers and teams facing irreversible,
            path-dependent decisions. Tell us about the path you are trying to
            predict.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="mailto:research@garailabs.com"
              className="group inline-flex items-center gap-2 rounded-sm bg-[#E8A24A] px-6 py-3.5 font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-[#14130f] transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              research@garailabs.com
            </a>
            <a
              href="https://github.com/GarAI-Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3.5 font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-[#f4f1ea] transition-colors hover:border-white"
            >
              <GithubIcon className="size-4" />
              GitHub
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </LabReveal>

        {/* giant wordmark */}
        <div className="mt-24 overflow-hidden border-t border-white/10 pt-10">
          <p className="select-none text-center font-grotesk text-[clamp(2.8rem,15vw,13rem)] font-bold uppercase leading-[0.85] tracking-[-0.03em] text-[#f4f1ea]">
            Gar AI Labs
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 font-rounded text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#f4f1ea]/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Gar AI Labs — Research Division</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#E8A24A]" />
            Non-ergodic predictive intelligence
          </span>
          <span className="flex items-center gap-5">
            <Link href="/" className="transition-colors hover:text-[#f4f1ea]">
              Index
            </Link>
            <Link
              href="/founder"
              className="transition-colors hover:text-[#f4f1ea]"
            >
              Founder
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
