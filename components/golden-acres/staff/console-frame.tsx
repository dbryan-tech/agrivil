'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * ConsoleFrame — the single staff shell (docs/redesign/05 §2).
 * One frame across /admin, ops, and support so the three sub-systems read as
 * one calm control room: left-rail nav (quiet text rows, quiet count badges),
 * environment pill, user chip. Light-mode only; ink-on-canvas with hairlines.
 */

export interface StaffNavItem {
  key: string
  label: string
  /** Quiet count shown right-aligned; 0/undefined hides it. */
  badge?: number
  /** When true the badge renders in alert tone (needs action NOW). */
  attention?: boolean
}

export function ConsoleFrame({
  product,
  userName,
  userRole,
  nav,
  activeKey,
  onNavigate,
  liveLabel = 'Live · Greater Accra pilot',
  children,
}: {
  /** Sub-system name under the wordmark, e.g. "Admin console". */
  product: string
  userName: string
  userRole: string
  nav: StaffNavItem[]
  activeKey: string
  onNavigate: (key: string) => void
  liveLabel?: string
  children: ReactNode
}) {
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-dvh flex-col bg-[#F7F5F0] lg:flex-row lg:overflow-hidden lg:h-dvh">
      {/* ---------------- Desktop left rail ---------------- */}
      <aside className="hidden shrink-0 flex-col border-r border-[rgba(33,26,18,0.08)] bg-[#FAF9F6] lg:flex lg:w-60">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5 border-b border-[rgba(33,26,18,0.08)] px-5 py-4">
          <span className="relative block h-8 w-8 shrink-0 overflow-hidden">
            <Image
              src="/agrivil-mark.svg"
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[14.5px] font-semibold tracking-[-0.01em] text-[#211A12]">
              AgriVil <span className="font-normal text-[#8A7E72]">Ghana</span>
            </span>
            <span className="block truncate text-[11px] text-[#8A7E72]">{product}</span>
          </span>
        </div>

        {/* Env pill */}
        <div className="border-b border-[rgba(33,26,18,0.08)] px-5 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(15,122,67,0.3)] px-2.5 py-1 text-[11px] font-medium text-[#0F7A43]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0F7A43]/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0F7A43]" />
            </span>
            {liveLabel}
          </span>
        </div>

        {/* Nav */}
        <nav aria-label="Console sections" className="flex-1 overflow-y-auto px-3 py-3">
          <ul>
            {nav.map((item) => {
              const active = item.key === activeKey
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.key)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex w-full items-center justify-between gap-2 border-b border-transparent px-2.5 py-2.5 text-left text-[13.5px] transition-colors duration-300',
                      active
                        ? 'font-semibold text-[#211A12]'
                        : 'font-medium text-[#8A7E72] hover:text-[#3D332A]',
                    )}
                  >
                    <span
                      className={cn(
                        'block max-w-[9rem] truncate border-b pb-0.5',
                        active && 'border-[#211A12]',
                      )}
                    >
                      {item.label}
                    </span>
                    {item.badge != null && item.badge > 0 && (
                      <span
                        className={cn(
                          'ga-index flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10.5px] font-semibold',
                          item.attention
                            ? 'bg-[#B91C1C] text-white'
                            : active
                              ? 'bg-[#211A12] text-white'
                              : 'bg-[rgba(33,26,18,0.08)] text-[#5C5247]',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User chip */}
        <div className="border-t border-[rgba(33,26,18,0.08)] p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-[12px] font-semibold text-white">
              {initials}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-semibold text-[#211A12]">
                {userName}
              </span>
              <span className="block truncate text-[11px] text-[#8A7E72]">{userRole}</span>
            </span>
          </div>
        </div>
      </aside>

      {/* ---------------- Main column ---------------- */}
      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center gap-2.5 border-b border-[rgba(33,26,18,0.08)] bg-[#FAF9F6] px-4 py-3 lg:hidden">
          <span className="relative block h-7 w-7 shrink-0 overflow-hidden">
            <Image
              src="/agrivil-mark.svg"
              alt="AgriVil"
              width={28}
              height={28}
              className="h-full w-full object-contain"
            />
          </span>
          <p className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.01em] text-[#211A12]">
            {product}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,122,67,0.3)] px-2 py-0.5 text-[10px] font-medium text-[#0F7A43]">
            Live
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-[10.5px] font-semibold text-white">
            {initials}
          </span>
        </header>

        {/* Mobile nav strip */}
        <nav
          aria-label="Console sections"
          className="flex gap-x-5 overflow-x-auto border-b border-[rgba(33,26,18,0.08)] bg-[#FAF9F6] px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:hidden"
        >
          {nav.map((item) => {
            const active = item.key === activeKey
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'shrink-0 whitespace-nowrap border-b pb-1.5 pt-1 text-[13px] transition-colors duration-300',
                  active
                    ? 'border-[#211A12] font-semibold text-[#211A12]'
                    : 'border-transparent font-medium text-[#8A7E72]',
                )}
              >
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span className="ga-index ml-1 text-[11px] text-[#B45309]">{item.badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

/** Shared page-header grammar inside the console: copper label + display title + lede. */
export function ConsoleHeader({
  title,
  lede,
  aside,
}: {
  title: ReactNode
  lede?: ReactNode
  aside?: ReactNode
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="ga-display-title text-[clamp(24px,2.6vw,34px)] text-[#211A12]">{title}</h1>
        {lede && <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#8A7E72]">{lede}</p>}
      </div>
      {aside}
    </header>
  )
}
