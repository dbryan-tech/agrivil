import Link from 'next/link'
import { Sprout, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const COLS = [
  {
    title: 'Shop',
    links: [
      { label: 'All produce', href: '/shop' },
      { label: 'Vegetables', href: '/shop?category=Vegetables' },
      { label: 'Fruits', href: '/shop?category=Fruits' },
      { label: 'Bundles & boxes', href: '/shop?category=Bundles' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our farmers', href: '/farmers' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Freshness promise', href: '/#freshness' },
      { label: 'Sell with us', href: '/farmers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Delivery areas', href: '/#match' },
      { label: 'Track an order', href: '/checkout' },
      { label: 'Returns & refunds', href: '/#freshness' },
      { label: 'Contact us', href: '/#contact' },
    ],
  },
]

export function GaFooter() {
  return (
    <footer className="ga-dark grain relative overflow-hidden">
      <div className="relative z-[2] mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6">
        {/* Newsletter / CTA row */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="ga-eyebrow text-[var(--ga-lime)]">Stay fresh</p>
            <h2 className="ga-display mt-3 text-pretty text-3xl leading-[1.05] sm:text-4xl">
              Get the harvest list <span className="text-[var(--ga-lime)]">before</span> it
              sells out.
            </h2>
          </div>
          <form className="flex w-full max-w-md items-center gap-2">
            <input
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm font-medium text-white outline-none placeholder:text-white/40 focus:border-[var(--ga-lime)]"
            />
            <button
              type="submit"
              className="ga-press flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-[var(--ga-lime)] px-5 text-sm font-bold text-[var(--ga-ink-deep)]"
            >
              Join <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ga-lime)]">
                <Sprout className="h-5 w-5 text-[var(--ga-ink-deep)]" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="ga-display text-xl">AgriVil</span>
                <span className="ga-eyebrow mt-1 text-[9px] text-white/50">
                  by Golden Acres Ghana
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Ghana&apos;s virtual farmers&apos; market — fresh, perishable produce delivered
              direct from local farms to your door.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/75">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[var(--ga-lime)]" /> Accra, Ghana
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[var(--ga-lime)]" /> +233 30 000 0000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[var(--ga-lime)]" /> hello@agrivil.gh
              </li>
            </ul>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="ga-eyebrow text-white/50">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/75 transition-colors hover:text-[var(--ga-lime)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized wordmark */}
        <div className="pointer-events-none select-none border-t border-white/10 pt-8">
          <p className="ga-display text-[18vw] leading-[0.8] text-white/[0.04] lg:text-[12rem]">
            AgriVil
          </p>
        </div>

        <div className="-mt-4 flex flex-col items-center justify-between gap-3 text-sm text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} AgriVil, managed under Golden Acres Ghana. Grown in Ghana.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/#" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/#" className="transition-colors hover:text-white">
              Terms
            </Link>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--ga-lime)]" />
              Mobile Money ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
