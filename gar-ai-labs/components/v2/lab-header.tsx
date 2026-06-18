'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BentoToggle } from '@/components/v2/bento-toggle'

const NAV = [
  { label: 'Premise', href: '#premise' },
  { label: 'Research', href: '#research' },
  { label: 'Lab', href: '#lab' },
  { label: 'Output', href: '#output' },
  { label: 'Founder', href: '/founder' },
]

export function LabHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#14130f]/12 bg-[#f4f1ea]/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0c0c0d]/80">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Gar AI Labs home"
        >
          <span className="relative size-7 shrink-0">
            <Image
              src="/gar-logo.png"
              alt=""
              fill
              sizes="28px"
              className="object-contain dark:hidden"
            />
            <Image
              src="/gar-logo-dark.png"
              alt=""
              fill
              sizes="28px"
              className="hidden object-contain dark:block"
            />
          </span>
          <span className="font-grotesk text-[0.95rem] font-bold uppercase leading-none tracking-tight text-[#14130f] dark:text-[#f4f1ea]">
            Gar AI Labs
          </span>
          <span className="hidden font-rounded text-xs font-bold uppercase tracking-wide text-[#14130f]/70 dark:text-white/70 md:inline">
            / non-ergodic systems
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-rounded text-sm font-bold uppercase tracking-wide text-[#14130f]/80 transition-colors hover:text-[#14130f] dark:text-white/80 dark:hover:text-[#f4f1ea]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 font-rounded text-xs font-bold uppercase tracking-wide text-[#14130f]/80 dark:text-white/80 sm:inline-flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C07A16] opacity-75 dark:bg-[#E8A24A]" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#C07A16] dark:bg-[#E8A24A]" />
            </span>
            Live
          </span>
          <BentoToggle />
          <Link
            href="#contact"
            className="hidden rounded-xl bg-[#14130f] px-4 py-2.5 font-rounded text-sm font-extrabold uppercase tracking-wide text-[#f4f1ea] transition-transform hover:-translate-y-0.5 dark:bg-[#E8A24A] dark:text-[#14130f] sm:inline-block"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  )
}
