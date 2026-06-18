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
    <section className="bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border lg:aspect-auto">
            <SmartImage
              src="/golden-acres/story-harvest.jpg"
              alt="Hands holding freshly harvested vegetables with soil still on them"
              fill
              label="Harvest close-up"
              className="h-full w-full"
            />
          </div>
          <div>
            <p className="ga-eyebrow text-primary">How it works</p>
            <h2 className="ga-display mt-3 text-balance text-4xl text-foreground sm:text-5xl">
              From their soil to your{' '}
              <span className="ga-serif font-normal text-primary">kitchen</span>
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              No middlemen, no warehouses sitting on produce for days. Just a short, cold
              path from the farm that grew it to the table that needs it.
            </p>
            <ol className="mt-8 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-[var(--ga-field)] ring-1 ring-border">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      <span className="text-[var(--ga-gold)]">{i + 1}.</span> {s.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
