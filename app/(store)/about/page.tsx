import { SmartImage } from '@/components/golden-acres/smart-image'
import {
  Section,
  StatGrid,
  Accordion,
  HairRow,
  PillLink,
  TextLink,
  DarkBand,
} from '@/components/golden-acres/system'
import { farmers } from '@/lib/golden-acres/data'

/**
 * REDESIGN PREVIEW — About page (docs/redesign/01 §4).
 * Long-form editorial: manifesto lede → proof stats → mechanism story →
 * values as numbered rows → farmer faces → FAQ accordion. Content sits on
 * the canvas; the only elevated unit is the closing dark band.
 */
export default function AboutRedesignPreview() {
  const lead = farmers[0]
  return (
    <main className="bg-[#F7F5F0] text-[#211A12]">
      {/* Manifesto */}
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">About AgriVil</p>
        <h1 className="ga-display-hero mt-4 text-[clamp(38px,5vw,72px)]">
          Fresh from Ghana&apos;s soil, delivered cold to your door.
        </h1>
        <div className="ga-serif mt-8 space-y-5 text-[19px] leading-relaxed text-[#3D332A]">
          <p>
            In Ghana, up to 40% of fresh food spoils before it ever reaches an urban
            kitchen — lost to fragmented logistics, missing cold chains, and
            middlemen who pay farmers weeks late.
          </p>
          <p>
            AgriVil was founded under Golden Acres Ghana to close that gap: a
            modern, high-speed bridge between rural smallholders and urban
            families. Farmers list what they harvest; we grade it at a cold hub in
            Tema and deliver it to your door within hours. Eighty-five percent of
            every purchase goes back to the grower, paid within 48 hours.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <PillLink href="/shop">Shop today&apos;s harvest</PillLink>
          <TextLink href="/sell">Apply as a grower</TextLink>
        </div>
      </section>

      {/* Proof */}
      <Section label="The record so far" title="What shortening the path changes." topRule>
        <StatGrid
          stats={[
            { value: '40%', label: 'Less food waste than open-market chains' },
            { value: '+35%', label: 'Higher net income for partner farmers' },
            { value: '12h', label: 'Average harvest-to-door time' },
            { value: '100%', label: 'Orders traceable to their farm' },
          ]}
        />
      </Section>

      {/* Values as numbered rows */}
      <Section
        label="Why our model works"
        title="Engineered for Ghana."
        lede="Four design decisions that make freshness and fairness the same system."
      >
        <div>
          {[
            {
              title: 'Direct-from-farm sourcing',
              desc: 'Every listing names its farmer, region, and harvest window. No anonymous supply chain.',
            },
            {
              title: 'FEFO cold-chain batching',
              desc: 'First-expired-first-out grading at the Tema hub means nothing waits until it wilts.',
            },
            {
              title: 'Variable-weight honesty',
              desc: 'You pay an estimate at checkout; final weight is confirmed at packing. Never pay for air.',
            },
            {
              title: '48-hour payout guarantee',
              desc: 'Farmers are paid by Mobile Money within two days — enforced by SOPs, not promises.',
            },
          ].map((v, i) => (
            <div
              key={v.title}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-[rgba(33,26,18,0.08)] py-4 sm:gap-x-8 sm:py-6"
            >
              <span className="ga-index text-[13px] font-semibold text-[#8A7E72]">0{i + 1}</span>
              <div className="sm:grid sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8">
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-[#211A12] sm:text-[19px]">
                  {v.title}
                </h3>
                <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-[#5C5247] sm:mt-0">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* A face on it */}
      <Section label="Putting farmers first" title="When you buy, you know who grew it." tone="alt">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:items-center">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-[rgba(33,26,18,0.05)] shadow-[0_2px_4px_rgba(33,26,18,0.05),0_16px_40px_rgba(33,26,18,0.09)]">
            <SmartImage
              src={lead.photo}
              alt={`${lead.name}, ${lead.farmName}`}
              fill
              className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="ga-display-title text-[24px] text-white">{lead.name}</p>
              <p className="mt-0.5 text-[13px] text-white/85">
                {lead.farmName} · {lead.region}
              </p>
            </div>
          </div>
          <div>
            <blockquote className="ga-serif text-[21px] leading-relaxed text-[#211A12]">
              &ldquo;Before, middlemen decided my price at the farm gate. Now the
              city comes to me — and I am paid before the week ends.&rdquo;
            </blockquote>
            <p className="mt-4 text-[13px] font-medium text-[#8A7E72]">
              {lead.name.split(' ')[0]} · {lead.farmName}, {lead.town}
            </p>
            <div className="mt-9 border-t border-[rgba(33,26,18,0.08)]">
              <HairRow href="/farmers" title="Meet all our growers" description="Verified profiles, real farms, honest reviews" />
              <HairRow href="/sell" title="Farm with us" description="Apply to sell — listing is free, forever" />
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section label="Questions" title="The short version.">
        <Accordion
          defaultOpen={0}
          items={[
            {
              title: 'Where do you deliver?',
              content:
                'Across the Greater Accra pilot zone today, with new areas added monthly. Enter your GhanaPostGPS address anywhere on the site to check your zone.',
            },
            {
              title: 'How does variable-weight pricing work?',
              content:
                'Produce is priced per kilo. You pay an estimate at checkout; at packing we weigh your exact basket and settle the difference — never more than the quoted range.',
            },
            {
              title: 'What if something arrives spoiled?',
              content:
                'Report it in the app within 24 hours for an instant Mobile Money refund. No photos of receipts, no forms.',
            },
            {
              title: 'How are farmers vetted?',
              content:
                'Each grower completes KYC verification, agrees to standard operating procedures, and is reviewed after every delivery. Repeated SOP violations end the partnership.',
            },
          ]}
        />
      </Section>

      {/* Closing */}
      <DarkBand
        eyebrow="Fresh, on your schedule"
        title="Taste the difference fresh makes."
        action={{ href: '/shop', label: 'Start shopping' }}
        secondaryAction={{ href: '/sell', label: 'Apply as a grower' }}
      />
    </main>
  )
}
