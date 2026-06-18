import Link from 'next/link'
import { testimonials } from '@/lib/golden-acres/data'
import { Quote, ArrowRight } from 'lucide-react'

export function TestimonialsCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="ga-eyebrow text-primary">Loved across Ghana</p>
        <h2 className="ga-display mx-auto mt-3 max-w-2xl text-balance text-4xl text-foreground sm:text-5xl">
          Families and chefs who switched to{' '}
          <span className="ga-serif font-normal text-primary">fresh</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <Quote className="h-7 w-7 text-[var(--ga-gold-soft)]" />
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground">
              {t.quote}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ga-field)] text-base font-bold text-[var(--ga-cream)]">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.location}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div
        className="grain relative mt-16 overflow-hidden rounded-[2rem] px-6 py-16 text-center text-[var(--ga-cream)] sm:px-12"
        style={{
          backgroundColor: 'var(--ga-ink-deep)',
          backgroundImage:
            'radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--ga-field) 45%, transparent), transparent 60%)',
        }}
      >
        <p className="ga-eyebrow relative z-[2] text-[var(--ga-lime)]">Fresh, on your schedule</p>
        <h2 className="ga-display relative z-[2] mx-auto mt-3 max-w-2xl text-balance text-3xl sm:text-5xl">
          Taste the difference{' '}
          <span className="ga-serif font-normal text-[var(--ga-lime)]">fresh</span> makes
        </h2>
        <p className="relative z-[2] mx-auto mt-4 max-w-xl text-[var(--ga-cream)]/80">
          Your first order ships free. Pay securely with Mobile Money, and meet the farmer
          behind every basket.
        </p>
        <div className="relative z-[2] mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="ga-press group inline-flex items-center gap-2 rounded-full bg-[var(--ga-lime)] px-7 py-3.5 text-base font-bold text-[var(--ga-ink-deep)]"
          >
            Start shopping
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmer"
            className="ga-press inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-base font-semibold transition-colors hover:bg-white/10"
          >
            I&apos;m a farmer
          </Link>
        </div>
      </div>
    </section>
  )
}
