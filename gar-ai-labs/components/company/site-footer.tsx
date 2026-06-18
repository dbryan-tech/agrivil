import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-[#0a0b0f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-brand">
              <span className="size-2 bg-brand" aria-hidden="true" />
              005 — Contact
            </span>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-balance md:text-6xl">
              Building for a world that happens once.
            </h2>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-white/65">
              Collaborations, research correspondence, and questions are
              welcome. We reply to everything that is real.
            </p>
            <a
              href="mailto:research@garailabs.com"
              className="group mt-8 inline-flex items-center gap-2 bg-brand px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              research@garailabs.com
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <Image
              src="/gar-logo-dark.png"
              alt="Gar AI Labs"
              width={120}
              height={120}
              className="size-16"
            />
            <nav className="flex flex-col gap-3 md:items-end">
              <Link
                href="/founder"
                className="link-underline self-start font-mono text-xs uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white md:self-end"
              >
                About the founder
              </Link>
              <a
                href="https://github.com/GarAI-Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
              >
                <GithubIcon className="size-3.5" />
                github.com/GarAI-Labs
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="overflow-hidden border-t border-white/10">
        <p className="select-none whitespace-nowrap px-6 py-8 text-center font-display text-[18vw] font-extrabold uppercase leading-none tracking-[-0.04em] text-white/[0.06] md:text-[16vw]">
          GAR AI LABS
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Gar AI Labs</span>
          <span>Pioneering Non-Ergodic Predictive Intelligence</span>
        </div>
      </div>
    </footer>
  )
}
