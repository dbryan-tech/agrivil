import { Sprout, PackageCheck, Truck, HeartHandshake } from 'lucide-react'
import { SmartImage } from '@/components/golden-acres/smart-image'

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
    <section className="bg-secondary/60 transition-all duration-700">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="ga-card-hover relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/50 lg:aspect-auto transition-all duration-500">
            <SmartImage
              src="/golden-acres/story-harvest.jpg"
              alt="Hands holding freshly harvested vegetables with soil still on them"
              fill
              label="Harvest close-up"
              className="h-full w-full transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div>
            <div className="ga-fade-in flex items-center gap-4 transition-all duration-500">
              <span className="ga-index text-sm text-[var(--ga-terracotta)] transition-colors duration-300">04</span>
              <div className="ga-rule transition-all duration-300" />
              <span className="ga-kicker shrink-0 text-muted-foreground transition-colors duration-300">How It Works</span>
            </div>
            <h2 className="ga-headline ga-fade-in mt-6 text-balance text-5xl text-foreground sm:text-6xl transition-all duration-700" style={{ animationDelay: '0.1s' }}>
              From their soil to your <em className="transition-colors duration-300">kitchen</em>
            </h2>
            <p className="ga-fade-in mt-4 max-w-xl leading-relaxed text-muted-foreground transition-all duration-700" style={{ animationDelay: '0.2s' }}>
              No middlemen, no warehouses sitting on produce for days. Just a short, cold
              path from the farm that grew it to the table that needs it.
            </p>
            <ol className="mt-8 space-y-6 ga-stagger">
              {steps.map((s, i) => (
                <li key={s.title} className="ga-fade-in flex gap-4 transition-all duration-500" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
                  <div className="ga-scale-interactive flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-[var(--ga-field)] ring-1 ring-border/50 shadow-sm transition-all duration-300 hover:shadow-md">
                    <s.icon className="h-5 w-5 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground transition-colors duration-300">
                      <span className="text-[var(--ga-gold)] transition-colors duration-300">{i + 1}.</span> {s.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
