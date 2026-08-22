'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Plus } from './atoms'

/**
 * Hairline accordion — no boxes, no chevron circles.
 * Rows separated by rules; the Plus glyph rotates 45° when open; content
 * animates via grid-template-rows 0fr→1fr (no height hacks).
 */
export function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: { title: string; content: ReactNode }[]
  className?: string
  /** Index opened by default; -1 = all closed. */
  defaultOpen?: number
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  return (
    <div className={cn('border-b border-[rgba(33,26,18,0.08)]', className)}>
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div
            key={item.title}
            className="border-t border-[rgba(33,26,18,0.08)]"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="group flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
            >
              <span
                className={cn(
                  'text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300 sm:text-[17px]',
                  open
                    ? 'text-[#0B3B25]'
                    : 'text-[#211A12] group-hover:text-[#7A3F1C]',
                )}
              >
                {item.title}
              </span>
              <Plus open={open} />
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pr-8 text-[14px] leading-relaxed text-[#5C5247] sm:pr-12">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * TextTabs — filter/navigation tabs with the quiet grammar.
 * Active = ink with an ink underline; idle = tertiary gray. No backgrounds.
 */
export function TextTabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-x-6 gap-y-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'shrink-0 border-b pb-2 text-[13px] font-medium transition-colors duration-300',
              active
                ? 'border-[#211A12] text-[#211A12]'
                : 'border-transparent text-[#8A7E72] hover:text-[#3D332A]',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
