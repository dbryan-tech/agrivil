import Link from 'next/link'
import Image from 'next/image'
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
    <footer className="relative overflow-hidden bg-[#1A0F06] text-[#FAF9F6]">
      <div className="relative z-[2] mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6">
        {/* Newsletter / CTA row */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="ga-kicker font-extrabold text-[#F0A81E]">Stay fresh</p>
            <h2 className="ga-headline mt-2 text-pretty text-3xl font-black leading-[1.08] sm:text-4xl">
              Get the harvest list <span className="text-[#F0A81E]">before</span> it
              sells out.
            </h2>
          </div>
          <form className="group flex w-full max-w-md items-center gap-2">
            <input
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm font-medium text-white outline-none transition-[border-color,background-color] duration-300 placeholder:text-white/40 focus:border-[#F0A81E] focus:bg-white/10"
            />
            <button
              type="submit"
              className="ga-press ga-sheen flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-[#F0A81E] px-6 text-sm font-black text-[#211A12] shadow-sm hover:bg-[#F59E0B]"
            >
              Join <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden">
                <Image
                  src="/agrivil-mark.svg"
                  alt="AgriVil Emblem"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[20px] font-black tracking-[0.2em] text-white">
                  AGRIVIL
                </span>
                <span className="mt-0.5 text-[8.5px] font-bold tracking-[0.14em] uppercase text-[#F0A81E]">
                  Farm Fresh · Market Smart
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Ghana&apos;s virtual farmers&apos; market — fresh, perishable produce delivered
              direct from local farms to your door.
            </p>
            
            {/* Trust badge seal */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/10 max-w-xs">
              <Image
                src="/agrivil-stamp.svg"
                alt="AgriVil Farm Fresh Guarantee"
                width={48}
                height={48}
                className="h-12 w-12 shrink-0"
              />
              <div className="text-xs">
                <div className="font-bold text-white">Direct-from-Farm Cold Chain</div>
                <div className="text-[11px] text-white/60">FEFO Batched &amp; Fair Farmer Payouts</div>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#F0A81E]" /> Accra, Ghana
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#F0A81E]" /> +233 30 000 0000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#F0A81E]" /> hello@agrivil.gh
              </li>
            </ul>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="ga-kicker font-extrabold text-white/50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="inline-block text-sm font-medium text-white/75 transition-colors duration-200 hover:text-[#F0A81E]"
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
        <div className="pointer-events-none select-none border-t border-white/10 pt-6">
          <p className="ga-headline text-[18vw] leading-[0.8] text-white/[0.04] lg:text-[12rem]">
            AgriVil
          </p>
        </div>

        <div className="-mt-4 flex flex-col items-center justify-between gap-3 text-xs text-white/60 sm:flex-row">
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
              <span className="inline-block h-2 w-2 rounded-full bg-[#0B3B25]" />
              Mobile Money ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
