import Link from 'next/link'
import { testimonials } from '@/lib/golden-acres/data'
import { Quote, ArrowRight } from 'lucide-react'

export function TestimonialsCta() {
  return (
    <section className="mx-auto max-w-7xl px-2 py-7 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-2xl text-center">
        <span className="ga-kicker text-xs font-extrabold text-[#7A3F1C]">Loved across Ghana</span>
        <h2 className="ga-headline mx-auto mt-2 max-w-2xl text-balance text-2xl font-black text-[#211A12] sm:text-3xl">
          Families and chefs who switched to <em className="text-[#0B3B25]">fresh</em>
        </h2>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col justify-between rounded-[20px] border border-black/[0.04] bg-white p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
          >
            <div>
              <Quote className="h-5 w-5 text-[#7A3F1C]" />
              <blockquote className="ga-serif mt-2.5 text-sm not-italic leading-relaxed text-[#211A12]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
            <figcaption className="mt-4 flex items-center gap-2.5 border-t border-black/[0.05] pt-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3B25] text-xs font-extrabold text-white">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-xs font-extrabold text-[#211A12]">{t.name}</p>
                <p className="text-[11px] font-semibold text-[#5C5247]">{t.location}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div
        className="grain relative mt-7 overflow-hidden rounded-[24px] px-4 py-8 text-center text-[#FAF9F6] sm:px-8"
        style={{
          backgroundColor: '#1A0F06',
          backgroundImage:
            'radial-gradient(120% 90% at 50% -10%, rgba(11, 59, 37, 0.45), transparent 60%)',
        }}
      >
        <p className="ga-kicker relative z-[2] text-xs font-extrabold text-[#F0A81E]">Fresh, on your schedule</p>
        <h2 className="ga-headline relative z-[2] mx-auto mt-2 max-w-2xl text-balance text-2xl font-black sm:text-3xl">
          Taste the difference{' '}
          <span className="ga-serif font-normal text-[#F0A81E]">fresh</span> makes
        </h2>
        <p className="relative z-[2] mx-auto mt-2 max-w-xl text-xs sm:text-sm text-[#FAF9F6]/85">
          Your first order ships free. Pay securely with Mobile Money, and meet the farmer
          behind every basket.
        </p>
        <div className="relative z-[2] mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="ga-press group inline-flex items-center gap-2 rounded-full bg-[#F0A81E] px-7 py-3.5 text-sm font-black text-[#211A12] shadow-sm hover:bg-[#F59E0B]"
          >
            Start shopping
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/farmer"
            className="ga-press inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            I&apos;m a farmer
          </Link>
        </div>
      </div>
    </section>
  )
}
