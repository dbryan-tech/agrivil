import Link from 'next/link'
import { Sprout, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="ga-root flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <div className="ga-fade-up flex max-w-md flex-col items-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-field text-cream">
          <Sprout className="size-8" />
        </div>
        <p className="mt-8 font-serif text-7xl font-bold text-gold">404</p>
        <h1 className="mt-3 text-balance font-serif text-3xl font-semibold text-foreground">
          This patch is bare
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          The page you&apos;re looking for has been harvested or never grew here. Let&apos;s get you
          back to fresh ground.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="ga-press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-field px-6 font-bold text-cream"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
          <Link
            href="/shop"
            className="ga-press inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 font-bold text-foreground"
          >
            <Search className="size-4" /> Browse the market
          </Link>
        </div>
      </div>
    </main>
  )
}
