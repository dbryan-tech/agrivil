import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const COLS = [
  {
    title: 'Shop',
    links: [
      { label: 'All produce', href: '/shop' },
      { label: 'Vegetables', href: '/shop?category=Vegetables' },
      { label: 'Fruits', href: '/shop?category=Fruits' },
      { label: 'Boxes & subscriptions', href: '/bundles' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our farmers', href: '/farmers' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'About AgriVil', href: '/about' },
      { label: 'Sell with us', href: '/sell' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '/help' },
      { label: 'Delivery areas', href: '/local' },
      { label: 'Track an order', href: '/orders' },
      { label: 'Join the waitlist', href: '/waitlist' },
    ],
  },
]

/**
 * SiteFooter — deep forest-green full-bleed band (docs/redesign/01 §3.7).
 * Cream typographic columns, wordmark lockup, newsletter underline field,
 * legal row. The one place rich color grounds the page.
 */
export function SiteFooter() {
  return (
    <footer className="w-full bg-[#0B3B25] text-[#FAF9F6]">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        {/* Newsletter row */}
        <div className="flex flex-col gap-8 border-b border-white/12 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <h2 className="ga-display-title text-[clamp(26px,3vw,38px)] text-[#FAF9F6]">
              Get the harvest list before it sells out.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#FAF9F6]/65">
              One email each morning with what&apos;s fresh, what&apos;s scarce, and
              what&apos;s priced right.
            </p>
          </div>
          <form className="flex w-full max-w-sm items-end gap-4" action="/waitlist">
            <div className="flex-1">
              <label htmlFor="footer-email" className="block text-[13px] font-medium text-[#FAF9F6]/70">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@email.com"
                className="mt-1 w-full border-0 border-b border-[rgba(250,249,246,0.3)] bg-transparent pb-2 text-[15px] text-[#FAF9F6] outline-none transition-colors duration-300 placeholder:text-[#FAF9F6]/35 focus:border-[#FAF9F6]"
              />
            </div>
            <button
              type="submit"
              aria-label="Subscribe"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(250,249,246,0.35)] transition-colors duration-300 hover:bg-[#FAF9F6]/10"
            >
              <ArrowRight width={17} height={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            {/* Typographic wordmark lockup */}
            <Link href="/" className="inline-flex items-baseline gap-2.5" aria-label="AgriVil home">
              <span className="text-[19px] font-bold tracking-[0.02em] text-[#FAF9F6]">AgriVil</span>
              <span aria-hidden className="h-3 w-px bg-[#FAF9F6]/30" />
              <span className="text-[11px] text-[#FAF9F6]/55">Ghana</span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[#FAF9F6]/60">
              Ghana&apos;s virtual farmers&apos; market — fresh, perishable produce
              delivered direct from local farms to your door.
            </p>
            <p className="ga-index mt-6 text-[13px] text-[#FAF9F6]/45">
              Accra · Tema · Kumasi
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[13px] font-semibold text-[#FAF9F6]/50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[#FAF9F6]/75 transition-colors duration-200 hover:text-[#FAF9F6]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal row */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/12 pt-7 text-[12px] text-[#FAF9F6]/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} AgriVil · Golden Acres Ghana. Grown in Ghana.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-[#FAF9F6]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#FAF9F6]">Terms</Link>
            <span>MoMo ready</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
