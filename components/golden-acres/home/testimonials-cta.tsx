import Link from 'next/link'
import { testimonials } from '@/lib/golden-acres/data'
import { Quote, ArrowRight } from 'lucide-react'

export function TestimonialsCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="ga-kicker font-extrabold text-[#7A3F1C]">Loved across Ghana</span>
        <h2 className="ga-headline mx-auto mt-3 max-w-2xl text-balance text-4xl font-black text-[#211A12] sm:text-5xl">
          Families and chefs who switched to <em className="text-[#0B3B25]">fresh</em>
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col justify-between rounded-[24px] border border-black/[0.04] bg-white p-7 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
          >
            <div>
              <Quote className="h-7 w-7 text-[#7A3F1C]" />
              <blockquote className="ga-serif mt-4 text-base not-italic leading-relaxed text-[#211A12]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-black/[0.05] pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3B25] text-sm font-extrabold text-white">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#211A12]">{t.name}</p>
                <p className="text-xs font-semibold text-[#5C5247]">{t.location}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div
        className="grain relative mt-14 overflow-hidden rounded-[28px] px-6 py-14 text-center text-[#FAF9F6] sm:px-12"
        style={{
          backgroundColor: '#1A0F06',
          backgroundImage:
            'radial-gradient(120% 90% at 50% -10%, rgba(11, 59, 37, 0.45), transparent 60%)',
        }}
      >
        <p className="ga-kicker relative z-[2] font-extrabold text-[#F0A81E]">Fresh, on your schedule</p>
        <h2 className="ga-headline relative z-[2] mx-auto mt-3 max-w-2xl text-balance text-4xl font-black sm:text-5xl">
          Taste the difference{' '}
          <span className="ga-serif font-normal text-[#F0A81E]">fresh</span> makes
        </h2>
        <p className="relative z-[2] mx-auto mt-3 max-w-xl text-[#FAF9F6]/85 text-sm sm:text-base">
          Your first order ships free. Pay securely with Mobile Money, and meet the farmer
          behind every basket.
        </p>
        <div className="relative z-[2] mt-7 flex flex-wrap items-center justify-center gap-4">
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
