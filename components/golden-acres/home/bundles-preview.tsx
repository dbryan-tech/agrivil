import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { bundles } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { ArrowRight, Repeat } from 'lucide-react'

export function BundlesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ga-eyebrow text-primary">Curated boxes</p>
          <h2 className="ga-display mt-3 text-4xl text-foreground sm:text-5xl">
            Bundles &amp; <span className="ga-serif font-normal text-primary">subscriptions</span>
          </h2>
        </div>
        <Link
          href="/bundles"
          className="group inline-flex items-center gap-2 text-base font-bold text-primary hover:underline"
        >
          See all boxes
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {bundles.slice(0, 3).map((bundle) => (
          <Link
            key={bundle.id}
            href={`/bundles#${bundle.slug}`}
            className="ga-card-hover group flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
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
              <h3 className="text-lg font-bold text-foreground">{bundle.name}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {bundle.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-extrabold text-foreground">
                  {formatGHS(bundle.price)}
                  {bundle.frequency !== 'one-time' && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {' '}
                      / delivery
                    </span>
                  )}
                </span>
                <span className="text-sm font-semibold text-[var(--ga-gold)] group-hover:underline">
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
