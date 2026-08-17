import Link from 'next/link'
import { Sprout, ShoppingBasket, Search, ArrowRight, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Sprout className="h-10 w-10" />
      </div>

      <span className="ga-eyebrow mt-6 text-primary">404 Error</span>
      <h1 className="ga-display mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Harvest not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
        The page or produce listing you’re looking for may have moved, sold out, or
        never existed on our farm map.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link
          href="/shop"
          className="ga-press inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary"
        >
          <ShoppingBasket className="h-4 w-4" /> Browse Shop
        </Link>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-left sm:w-full sm:max-w-md">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Popular destinations
        </p>
        <ul className="mt-3 divide-y divide-border text-sm">
          <li>
            <Link
              href="/shop?category=Vegetables"
              className="flex items-center justify-between py-2.5 font-medium text-foreground transition-colors hover:text-primary"
            >
              <span>Fresh Vegetables</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link
              href="/bundles"
              className="flex items-center justify-between py-2.5 font-medium text-foreground transition-colors hover:text-primary"
            >
              <span>Weekly Staples &amp; Boxes</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link
              href="/farmers"
              className="flex items-center justify-between py-2.5 font-medium text-foreground transition-colors hover:text-primary"
            >
              <span>Meet Our Local Farmers</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link
              href="/help"
              className="flex items-center justify-between py-2.5 font-medium text-foreground transition-colors hover:text-primary"
            >
              <span>Customer Help &amp; Support</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
