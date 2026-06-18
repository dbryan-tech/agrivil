'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function BentoToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-white text-[#0a0a0a] shadow-[3px_3px_0_0_#0a0a0a] transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:border-[#383838] dark:bg-[#191919] dark:text-[#fafafa] dark:shadow-[3px_3px_0_0_#000]"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" strokeWidth={2} />
        ) : (
          <Moon className="size-4" strokeWidth={2} />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  )
}
