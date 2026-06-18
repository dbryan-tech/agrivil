import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { bundles } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { ArrowRight, Repeat } from 'lucide-react'

export function BundlesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex items-center gap-4">
        <span className="ga-index text-sm text-[var(--ga-terracotta)]">06</span>
        <div className="ga-rule" />
        <span className="ga-kicker shrink-0 text-muted-foreground">Curated Boxes</span>
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="ga-headline max-w-xl text-balance text-5xl text-foreground sm:text-6xl">
          Bundles &amp; <em>subscriptions</em>
        </h2>
        <Link
          href="/bundles"
          className="group inline-flex items-center gap-2 pb-2 text-base font-semibold text-primary"
        >
          <span className="link-underline">See all boxes</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {bundles.slice(0, 3).map((bundle) => (
          <Link
            key={bundle.id}
            href={`/bundles#${bundle.slug}`}
            className="ga-card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="ga-zoom relative aspect-[16/10] overflow-hidden">
              <SmartImage src={bundle.image} alt={bundle.name} fill className="object-cover" />
              {bundle.frequency !== 'one-time' && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--ga-lime)] px-2.5 py-1 text-xs font-bold capitalize text-[var(--ga-ink-deep)]">
                  <Repeat className="h-3 w-3" />
                  {bundle.frequency}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="ga-headline text-2xl text-foreground">{bundle.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {bundle.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
                <span className="ga-headline text-2xl text-foreground">
                  {formatGHS(bundle.price)}
                  {bundle.frequency !== 'one-time' && (
                    <span className="ga-index text-xs font-normal text-muted-foreground">
                      {' '}
                      / delivery
                    </span>
                  )}
                </span>
                <span className="ga-kicker text-[10px] text-[var(--ga-terracotta)]">
                  {bundle.items.length} items
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
