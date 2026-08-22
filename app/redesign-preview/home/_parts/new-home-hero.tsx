import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * HomeHero — cinematic full-bleed hero (redesign 01).
 * Replaces VideoHero + HeroPromo: one belief statement over a graded
 * farm video, content anchored bottom-left, masked line reveals.
 */
export function NewHomeHero({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className="relative isolate flex items-end overflow-hidden bg-[#0B1F16]"
      style={compact ? { minHeight: 720 } : { minHeight: '88svh' }}
    >
      {/* Video layer */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/golden-acres/hero-horizontal.png"
        >
          <source src="/golden-acres/video/farm-hero.mp4" type="video/mp4" />
        </video>
        {/* single cinematic scrim anchored bottom-left where copy lives */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(102deg, rgba(8,26,18,0.88) 0%, rgba(8,26,18,0.55) 38%, rgba(8,26,18,0.12) 68%, transparent 100%), linear-gradient(0deg, rgba(8,26,18,0.82) 0%, rgba(8,26,18,0.15) 42%, transparent 70%), linear-gradient(180deg, rgba(8,26,18,0.6) 0%, rgba(8,26,18,0.25) 10%, transparent 22%)',
          }}
        />
      </div>

      {/* Copy — bottom-left anchor */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-40 sm:px-8 sm:pb-24">
        <p className="ga-fade-up text-[13px] font-semibold tracking-[0.02em] text-white/75 [animation-delay:80ms]">
          Accra · Tema · Kumasi — harvested hours ago
        </p>
        <h1 className="ga-display-hero mt-4 text-[clamp(44px,7vw,92px)] text-white">
          <span className="ga-line">
            <span className="ga-line-inner">The farmers&apos; market,</span>
          </span>
          <span className="ga-line">
            <span className="ga-line-inner" style={{ animationDelay: '140ms' }}>
              perfected.
            </span>
          </span>
        </h1>
        <p className="ga-fade-up mt-6 max-w-xl text-[16px] leading-relaxed text-white/85 [animation-delay:320ms] sm:text-lg">
          Shop today&apos;s harvest from verified Ghanaian growers. Priced by weight,
          delivered cold, paid with Mobile Money.
        </p>

        <div className="ga-fade-up mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:420ms]">
          <PillLink href="/shop" label="Shop the harvest" />
          <TextLink href="/farmers" label="Meet the farmers" />
        </div>

        {/* quiet trust row */}
        <div className="ga-fade-up mt-12 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-white/15 pt-5 text-[13px] font-medium text-white/70 [animation-delay:520ms]">
          <span>Picked at dawn</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
          <span>Cold-chain to your door</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
          <span>Instant MoMo refunds</span>
        </div>
      </div>
    </section>
  )
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FAF9F6] px-7 text-[15px] font-semibold tracking-[-0.01em] text-[#211A12] transition-all duration-300 hover:bg-white active:scale-[0.98]"
    >
      {label}
      <ArrowRight
        width={17}
        height={17}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  )
}

function TextLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-white/90 underline decoration-white/35 decoration-1 underline-offset-[7px] transition-colors duration-300 hover:text-white hover:decoration-white/80"
    >
      {label}
    </Link>
  )
}
