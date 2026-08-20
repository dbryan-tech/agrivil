import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

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
        <Image
          src={image || '/golden-acres/hero-farmer.jpg'}
          alt={imageAlt}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B25] via-[#0B3B25]/80 to-[#0B3B25]/35" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden">
              <Image
                src="/agrivil-mark.svg"
                alt="AgriVil Emblem"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[20px] font-black tracking-[0.2em] text-white">
                AGRIVIL
              </span>
              <span className="mt-0.5 text-[8.5px] font-bold tracking-[0.14em] uppercase text-[#F0A81E]">
                Farm Fresh · Market Smart
              </span>
            </div>
          </Link>
          <div className="ga-rise max-w-md">
            <p className="ga-eyebrow font-extrabold text-[#DF8821]">{eyebrow}</p>
            <h2 className="ga-display mt-3 text-pretty text-4xl leading-[1.05] text-white">{headline}</h2>
            <ul className="mt-8 space-y-4">
              {points.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#DF8821]">
                    {p.icon}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/70">Fresh from Ghana&apos;s farms, to your door.</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8 bg-[#FAF7F2]">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden">
              <Image
                src="/agrivil-mark.svg"
                alt="AgriVil Emblem"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[18px] font-black tracking-[0.2em] text-[#0B3B25]">
                AGRIVIL
              </span>
              <span className="mt-0.5 text-[8px] font-bold tracking-[0.14em] uppercase text-[#7A3F1C]">
                Farm Fresh · Market Smart
              </span>
            </div>
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
