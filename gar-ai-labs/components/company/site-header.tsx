'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const NAV = [
  { label: 'Research', href: '#research' },
  { label: 'Approach', href: '#approach' },
  { label: 'Founder', href: '/founder' },
  { label: 'Contact', href: '#contact' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Gar AI Labs home"
        >
          <span className="relative size-8 shrink-0">
            <Image
              src="/gar-logo.png"
              alt=""
              fill
              priority
              sizes="32px"
              className="object-contain dark:hidden"
            />
            <Image
              src="/gar-logo-dark.png"
              alt=""
              fill
              priority
              sizes="32px"
              className="hidden object-contain dark:block"
            />
          </span>
          <span className="font-display text-lg font-extrabold uppercase leading-none tracking-tight">
            Gar AI Labs
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="#contact"
            className="group hidden items-center gap-2 bg-brand px-4 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-brand-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <span className="size-1.5 bg-brand-foreground" aria-hidden="true" />
            Get in touch
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* mobile nav row */}
      <nav className="flex items-center gap-6 overflow-x-auto border-t border-border px-6 py-2.5 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
