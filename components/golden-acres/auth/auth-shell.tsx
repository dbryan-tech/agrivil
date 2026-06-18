import Link from 'next/link'
import type { ReactNode } from 'react'
import { Wheat } from 'lucide-react'

export interface AuthShellProps {
  image: string
  imageAlt: string
  eyebrow: string
  headline: string
  points: { icon: ReactNode; label: string }[]
  children: ReactNode
}

export function AuthShell({
  image,
  imageAlt,
  eyebrow,
  headline,
  points,
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Editorial brand panel */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={image || '/placeholder.svg'} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ga-ink-deep)] via-[var(--ga-ink-deep)]/75 to-[var(--ga-ink-deep)]/25" />
        <div className="relative flex h-full flex-col justify-between p-10 text-cream">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Wheat className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="ga-display text-xl">AgriVil</span>
              <span className="ga-eyebrow mt-1 text-[9px] text-cream/70">by Golden Acres</span>
            </span>
          </Link>
          <div className="ga-rise max-w-md">
            <p className="ga-eyebrow text-[var(--ga-lime)]">{eyebrow}</p>
            <h2 className="ga-display mt-3 text-pretty text-4xl leading-[1.05]">{headline}</h2>
            <ul className="mt-8 space-y-4">
              {points.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-cream/90">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-[var(--ga-lime)]">
                    {p.icon}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-cream/60">Fresh from Ghana&apos;s farms, to your door.</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-field text-cream">
              <Wheat className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="ga-display text-xl font-semibold text-field">AgriVil</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
