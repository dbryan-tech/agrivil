import { Sprout, PackageCheck, Truck, HeartHandshake } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { Reveal } from '@/components/golden-acres/reveal'

const steps = [
  {
    icon: Sprout,
    title: "Farmers list the day's harvest",
    desc: "Local growers post what's ready — by weight, with real photos, from their phone.",
  },
  {
    icon: PackageCheck,
    title: 'We match you to the nearest farm',
    desc: 'MarketPlace Match routes your order to farms closest to you for peak freshness.',
  },
  {
    icon: Truck,
    title: 'Cold-chain delivery, on schedule',
    desc: 'Vetted couriers carry your order in temperature-safe packaging to your door.',
  },
  {
    icon: HeartHandshake,
    title: 'Freshness promise',
    desc: 'Not happy with a batch? Report it in seconds for an instant Mobile Money refund.',
  },
]

export function FreshnessStory() {
  return (
    <section className="bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] lg:aspect-[4/5]">
              <SmartImage
                src="/golden-acres/story-harvest.jpg"
                alt="Hands holding freshly harvested vegetables with soil still on them"
                fill
                label="Harvest close-up"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex items-center gap-4">
              <span className="ga-index text-sm font-black text-[#7A3F1C]">04</span>
              <div className="ga-rule" />
              <span className="ga-kicker shrink-0 font-extrabold text-[#5C5247]">How It Works</span>
            </div>
            <h2 className="ga-headline mt-5 text-balance text-4xl font-black text-[#211A12] sm:text-5xl">
              From their soil to your <em className="text-[#0B3B25]">kitchen</em>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[#5C5247]">
              No middlemen, no warehouses sitting on produce for days. Just a short, cold
              path from the farm that grew it to the table that needs it.
            </p>
            <ol className="relative mt-8 space-y-1">
              {/* connecting line through the step markers */}
              <span
                aria-hidden
                className="absolute left-[1.375rem] top-6 bottom-6 w-px bg-gradient-to-b from-[#0B3B25]/40 via-black/10 to-transparent"
              />
              {steps.map((s, i) => (
                <li key={s.title} className="group relative flex gap-4 rounded-2xl p-2.5 transition-colors duration-300 hover:bg-white/60">
                  <div className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0B3B25] shadow-xs ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-extrabold text-[#211A12]">
                      <span className="text-[#F0A81E]">{i + 1}.</span> {s.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#5C5247]">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
