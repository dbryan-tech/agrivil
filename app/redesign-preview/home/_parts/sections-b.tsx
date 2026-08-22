import Link from 'next/link'
import { Section, HairRow, StatGrid, DarkBand } from '@/components/golden-acres/system'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { recipes, bundles } from '@/lib/golden-acres/data'
import { testimonials } from '@/lib/golden-acres/data'

/** Mechanism — four numbered steps as hairline rows. */
export function HowItWorks() {
  const steps = [
    {
      title: 'Harvested at dawn',
      desc: 'Partner farmers pick to order — nothing sits in cold storage for days.',
    },
    {
      title: 'Graded at the Tema hub',
      desc: 'FEFO batching, weight confirmed, cold-chain packed within hours.',
    },
    {
      title: 'Delivered in your window',
      desc: 'Choose a delivery slot; vetted riders bring it cold to your GhanaPostGPS address.',
    },
    {
      title: 'Farmers paid in 48 hours',
      desc: '85% of every purchase goes to the grower — guaranteed, via Mobile Money.',
    },
  ]
  return (
    <Section
      id="how-it-works"
      label="How AgriVil works"
      title="Four steps. No middlemen."
      lede="A short, cold path from the farm that grew your food to the table that needs it."
    >
      <div>
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-[rgba(33,26,18,0.08)] py-4 sm:gap-x-8 sm:py-6"
          >
            <span className="ga-index text-[13px] font-semibold text-[#8A7E72]">
              0{i + 1}
            </span>
            <div className="sm:grid sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-8">
              <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-[#211A12] sm:text-[19px]">
                {s.title}
              </h3>
              <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-[#5C5247] sm:mt-0">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/** Recipes + bundles — two-panel editorial teaser. */
export function KitchenTeaser() {
  const recipe = recipes[0]
  const boxBundles = bundles.slice(0, 2)
  return (
    <Section
      id="kitchen"
      label="Cook & save"
      title="Shop the recipe, not the aisle."
      lede="Every dish maps to real produce on the market — add all ingredients to your basket in one tap."
      action={{ href: '/recipes', label: 'Browse recipes' }}
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Recipe lead */}
        <Link href={`/recipes/${recipe.id}`} className="group block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-[rgba(33,26,18,0.05)]">
            <SmartImage
              src={recipe.image}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </div>
          <p className="mt-4 text-[13px] font-semibold text-[#7A3F1C]">
            {recipe.category ?? 'Ghanaian classic'} · {recipe.time}
          </p>
          <h3 className="ga-display-title mt-1 text-[26px] text-[#211A12] transition-colors duration-300 group-hover:text-[#7A3F1C]">
            {recipe.name}
          </h3>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[#5C5247]">
            {recipe.description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0B3B25]">
            Shop the ingredients
            <span aria-hidden>→</span>
          </span>
        </Link>

        {/* Bundle column */}
        <div className="flex flex-col justify-center">
          <div className="border-t border-[rgba(33,26,18,0.08)]">
            {boxBundles.map((b) => (
              <HairRow
                key={b.id}
                href={`/bundles#${b.slug}`}
                title={b.name}
                description={b.description}
                meta={b.frequency === 'one-time' ? `GH₵${b.price}` : `GH₵${b.price} / ${b.frequency}`}
              />
            ))}
          </div>
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-[#5C5247]">
            Subscribe to a weekly or biweekly box and never run out of staples.
            Pause, skip or cancel anytime — no lock-in, no small print.
          </p>
          <Link
            href="/bundles"
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-[6px] transition-colors hover:text-[#072618]"
          >
            See all boxes
          </Link>
        </div>
      </div>
    </Section>
  )
}

/** Testimonials as quiet editorial quotes over hairlines (no quote cards). */
export function Voices() {
  return (
    <Section
      id="voices"
      label="Voices"
      title="Families and chefs who switched to fresh."
    >
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.id} className="border-t border-[rgba(33,26,18,0.12)] pt-5">
            <blockquote className="ga-serif text-[17px] leading-relaxed text-[#211A12]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-[13px] text-[#8A7E72]">
              {t.name} · {t.location}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

/** Closing dark band — dual CTA (shop / sell). */
export function ClosingBand() {
  return (
    <DarkBand
      eyebrow="Fresh, on your schedule"
      title="Taste what tomorrow's harvest could be."
      lede="Your first order ships free across the Accra pilot zone. Pay with Mobile Money, meet the farmer behind every basket."
      action={{ href: '/shop', label: 'Start shopping' }}
      secondaryAction={{ href: '/sell', label: "I'm a farmer — sell with us" }}
    >
      <div className="mt-16">
        <StatGrid
          tone="cream"
          stats={[
            { value: '40%', label: 'Less food waste vs. open-market chains' },
            { value: '+35%', label: 'Higher net income for partner farmers' },
            { value: '100%', label: 'Orders traceable to their farm' },
          ]}
        />
      </div>
    </DarkBand>
  )
}
