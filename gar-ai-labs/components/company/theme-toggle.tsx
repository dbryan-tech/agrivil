'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" strokeWidth={1.75} />
        ) : (
          <Moon className="size-4" strokeWidth={1.75} />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  )
}
