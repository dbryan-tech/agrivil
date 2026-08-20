import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { bundles } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { ArrowRight, Repeat } from 'lucide-react'

export function BundlesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex items-center gap-4">
        <span className="ga-index text-sm font-black text-[#7A3F1C]">06</span>
        <div className="ga-rule" />
        <span className="ga-kicker shrink-0 font-extrabold text-[#5C5247]">Curated Boxes</span>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="ga-headline max-w-xl text-balance text-4xl font-black text-[#211A12] sm:text-5xl">
          Bundles &amp; <em className="text-[#0B3B25]">subscriptions</em>
        </h2>
        <Link
          href="/bundles"
          className="group inline-flex items-center gap-2 pb-1 text-sm font-extrabold text-[#0B3B25] hover:text-[#072618]"
        >
          <span className="link-underline">See all boxes</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {bundles.slice(0, 3).map((bundle) => (
          <Link
            key={bundle.id}
            href={`/bundles#${bundle.slug}`}
            className="ga-card-hover group flex flex-col justify-between overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
          >
            <div className="ga-zoom relative aspect-[16/10] overflow-hidden">
              <SmartImage src={bundle.image} alt={bundle.name} fill className="object-cover" />
              {bundle.frequency !== 'one-time' && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#F0A81E] px-2.5 py-1 text-[11px] font-black capitalize text-[#211A12] shadow-xs">
                  <Repeat className="h-3 w-3 stroke-[2.5]" />
                  {bundle.frequency}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="ga-headline text-xl font-black text-[#211A12] group-hover:text-[#0B3B25] transition-colors">{bundle.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5C5247]">
                {bundle.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3.5">
                <span className="ga-headline text-2xl font-black text-[#211A12]">
                  {formatGHS(bundle.price)}
                  {bundle.frequency !== 'one-time' && (
                    <span className="ga-index text-xs font-normal text-[#5C5247]">
                      {' '}
                      / delivery
                    </span>
                  )}
                </span>
                <span className="ga-kicker text-[10px] font-bold text-[#7A3F1C]">
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
