'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { GithubIcon } from '@/components/github-icon'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export function FounderNav() {
  return (
    <div className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl border-[3px] border-[#0a0a0a] bg-white px-4 py-3 shadow-[6px_6px_0px_0px_#0a0a0a]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-[#0a0a0a] bg-[#fdb927] px-3 py-1.5 font-jetbrains text-xs font-bold uppercase tracking-tight text-[#0a0a0a] transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="size-3.5" />
          Gar AI Labs
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-onest text-sm font-medium text-[#0a0a0a] transition-colors hover:text-[#2f81f7]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/GarAI-Labs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="inline-flex size-9 items-center justify-center rounded-lg border-2 border-[#0a0a0a] bg-[#0a0a0a] text-white transition-transform hover:-translate-y-0.5"
        >
          <GithubIcon className="size-4" />
        </a>
      </nav>
    </div>
  )
}
