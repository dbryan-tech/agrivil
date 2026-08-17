'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AgriVil Application Error]:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="ga-display mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Something didn’t load quite right
      </h1>
      <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground">
        We encountered an unexpected error while loading this harvest data. Our
        engineering team has been notified.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Try Again
        </button>
        <Link
          href="/"
          className="ga-press inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-secondary"
        >
          <Home className="h-3.5 w-3.5" /> Back to Storefront
        </Link>
      </div>
    </div>
  )
}
