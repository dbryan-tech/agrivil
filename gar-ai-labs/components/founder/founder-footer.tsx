import Link from 'next/link'
import { Reveal } from '@/components/company/reveal'
import { ArrowUpRight, Mail } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'

export function FounderFooter() {
  return (
    <footer id="contact" className="px-4 pb-10">
      <Reveal>
        <section className="mx-auto max-w-5xl rounded-3xl border-[3px] border-[#0a0a0a] bg-[#0a0a0a] p-8 text-white md:p-14">
          <span className="font-jetbrains text-xs font-bold uppercase tracking-tight text-[#fdb927]">
            / Contact
          </span>
          <h2 className="mt-4 max-w-2xl font-onest text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Let&apos;s talk about{' '}
            <span className="inline-block -rotate-1 rounded-md bg-[#ff6b7a] px-2 text-white">
              hard
            </span>{' '}
            prediction problems.
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:lenny@garailabs.com"
              className="group inline-flex items-center gap-2 rounded-lg border-2 border-white bg-[#fdb927] px-5 py-3 font-jetbrains text-sm font-bold uppercase text-[#0a0a0a] transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              lenny@garailabs.com
            </a>
            <a
              href="https://github.com/GarAI-Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-5 py-3 font-jetbrains text-sm font-bold uppercase text-white transition-colors hover:bg-white hover:text-[#0a0a0a]"
            >
              <GithubIcon className="size-4" />
              github.com/GarAI-Labs
            </a>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 font-jetbrains text-xs uppercase tracking-tight text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Ewoke Lenny Bryan</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-[#fdb927]"
            >
              Back to Gar AI Labs
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </section>
      </Reveal>
    </footer>
  )
}
