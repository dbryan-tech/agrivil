'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll-reveal wrapper. Children start hidden (translated + faded) and
 * animate in once the element scrolls into view. Honors prefers-reduced-motion
 * via the CSS guard in globals.css.
 *
 * The system-tier reveal for the redesigned web surfaces: slower, calmer,
 * with an optional stagger for child sequences.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
  once?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.01, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      // @ts-expect-error generic tag ref
      ref={ref}
      className={cn('ga-reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
