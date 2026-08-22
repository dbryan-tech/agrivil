'use client'

import { useState } from 'react'
import {
  Reveal,
  Section,
  HairRow,
  StatGrid,
  UnderlineField,
  PillButton,
  PillLink,
  TextLink,
  Price,
  RatingStars,
  Accordion,
  TextTabs,
  ProductCard,
  DarkBand,
} from '@/components/golden-acres/system'
import { products, productFarmer } from '@/lib/golden-acres/data'

const featured = products.slice(0, 4)

export default function SystemGalleryPage() {
  const [tab, setTab] = useState('all')
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#211A12]">
      {/* ============ HERO TYPE SPECIMEN ============ */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">
          Design system gallery
        </p>
        <h1 className="ga-display-hero mt-4 text-[clamp(44px,7vw,92px)]">
          <span className="ga-line">
            <span className="ga-line-inner">The farmers&apos; market,</span>
          </span>
          <span className="ga-line">
            <span className="ga-line-inner" style={{ animationDelay: '140ms' }}>
              perfected.
            </span>
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-[clamp(17px,1.6vw,21px)] leading-relaxed text-[#5C5247]">
          One page, every primitive. Type, color, elevation, motion — the whole
          grammar that every redesigned AgriVil surface inherits.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <PillLink href="#primitives">Explore the primitives</PillLink>
          <TextLink href="/emu">Open in device frame</TextLink>
        </div>
      </section>

      {/* ============ STAT GRID ============ */}
      <Section
        id="stats"
        label="StatGrid"
        title="Numbers over hairlines."
        lede="Display-size tabular figures. No icons, no chips, no boxes — the data is the design."
      >
        <StatGrid
          stats={[
            { value: '1,200+', label: 'Partner farms across Ghana' },
            { value: '48h', label: 'Guaranteed farmer payouts' },
            { value: '6h', label: 'Average harvest-to-door time' },
            { value: '98%', label: 'On-time cold-chain delivery' },
          ]}
        />
      </Section>

      {/* ============ PRODUCT CARDS ============ */}
      <Section
        id="products"
        label="ProductCard"
        title="The one elevated unit."
        lede="Soft floating surface on the canvas: near-invisible border, whisper shadow, 4:5 image shell, copper farm attribution, tabular price."
        action={{ href: '/shop', label: 'Shop the harvest' }}
      >
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => {
            const farmer = productFarmer(p)
            return (
              <ProductCard
                key={p.id}
                href={`/shop/${p.slug}`}
                image={p.image}
                name={p.name}
                farmName={farmer.farmName}
                price={p.priceMin}
                per={p.variableWeight ? '/ kg est.' : `/${p.unit}`}
                rating={p.rating}
                reviewCount={p.reviewCount}
              />
            )
          })}
        </div>
      </Section>

      {/* ============ HAIR ROWS ============ */}
      <Section
        id="rows"
        label="HairRow"
        title="Links, not cards."
        lede="Directory and list grammar: hairline-topped rows, numbered in tabular figures, whole row is the target, title warms to copper on hover."
      >
        <div>
          <HairRow
            index="01"
            href="/farmers/akosua-organic"
            title="Akosua's Organic Garden"
            description="Certified organic vegetables · Greater Accra"
            meta="18 listings"
          />
          <HairRow
            index="02"
            href="/farmers/ejisu-farms"
            title="Ejisu Valley Farms"
            description="Roots, tubers & plantain · Ashanti"
            meta="24 listings"
          />
          <HairRow
            index="03"
            href="/farmers/volta-rice"
            title="Volta Paddy Collective"
            description="Perfumed rice & grains · Volta"
            meta="9 listings"
          />
          <HairRow
            index="04"
            href="/farmers/coastal-gold"
            title="Coastal Gold Pineapples"
            description="Sugarloaf pineapple · Central"
            meta="6 listings"
          />
        </div>
      </Section>

      {/* ============ FORMS + ATOMS ============ */}
      <Section
        id="forms"
        label="UnderlineField · Price · RatingStars · TextTabs"
        title="Inputs without boxes."
        lede="Underline fields with inline validation, sentence-case labels. Prices and ratings always render through their atoms."
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-7">
            <UnderlineField
              id="demo-name"
              label="Full name"
              value=""
              onChange={() => {}}
              placeholder="Ama Serwaa"
              autoComplete="name"
            />
            <UnderlineField
              id="demo-gps"
              label="GhanaPostGPS address"
              value=""
              onChange={() => {}}
              placeholder="GA-183-4250"
              hint="Find it in the GhanaPostGPS app — it looks like GA-183-4250."
            />
            <UnderlineField
              id="demo-error"
              label="Phone number"
              value="020"
              onChange={() => {}}
              inputMode="tel"
              error="Enter the full 10-digit number, e.g. 024 123 4567."
            />
            <div className="flex flex-wrap gap-3 pt-2">
              <PillButton size="md">Add to basket</PillButton>
              <PillButton size="md" variant="quiet">
                Secondary
              </PillButton>
              <PillButton size="md" variant="dark">
                On dark
              </PillButton>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-baseline gap-6">
                <Price amount={11} size="lg" per="/ kg" />
                <Price amount={95} size="md" per="/ bag" />
                <Price amount={6} size="sm" per="/ bunch" />
              </div>
              <RatingStars rating={4.8} count={132} size="md" />
              <RatingStars rating={3} size="sm" />
            </div>
            <div>
              <TextTabs
                tabs={[
                  { label: 'All produce', value: 'all' },
                  { label: 'Vegetables', value: 'veg' },
                  { label: 'Fruits', value: 'fruit' },
                  { label: 'Roots & tubers', value: 'roots' },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>
            <Accordion
              defaultOpen={0}
              items={[
                {
                  title: 'How does variable-weight pricing work?',
                  content:
                    'You pay an estimate at checkout. At packing, we weigh your exact produce and the final price settles — you never pay for air.',
                },
                {
                  title: 'Where does the produce come from?',
                  content:
                    'Directly from verified smallholder farms. Every listing names its farmer, region and harvest window.',
                },
                {
                  title: 'What if something is not fresh?',
                  content:
                    'Report it in the app within 24 hours. Refunds are instant for spoiled or missing items — no photos-of-receipts dance.',
                },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ============ DARK BAND ============ */}
      <DarkBand
        eyebrow="DarkBand"
        title="Sell with us. Get paid in 48 hours."
        lede="The cinematic full-bleed band for the moments that matter — farmer acquisition, seasonal campaigns, the closing argument."
        action={{ href: '/sell', label: 'Start selling' }}
        secondaryAction={{ href: '/about', label: 'How AgriVil works' }}
      >
        <div className="mt-14">
          <StatGrid
            tone="cream"
            stats={[
              { value: '0%', label: 'Listing fees, forever' },
              { value: '48h', label: 'Payout guarantee' },
              { value: '3,100+', label: 'Farmers earning weekly' },
            ]}
          />
        </div>
      </DarkBand>

      {/* ============ REVEAL DEMO ============ */}
      <Section
        id="reveal"
        label="Reveal"
        title="Motion is calm and physical."
        lede="26px rise, 900ms quintic ease, once per element, always reduced-motion safe. Scroll up and down — every section on this page uses it."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {['Inspect', 'Understand', 'Deliver'].map((word, i) => (
            <Reveal key={word} delay={i * 120}>
              <div className="border-t-2 border-[#0B3B25] pt-4">
                <span className="ga-index text-[12px] text-[#8A7E72]">
                  0{i + 1}
                </span>
                <p className="ga-display-title mt-1 text-[24px]">{word}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <footer className="border-t border-[rgba(33,26,18,0.08)]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <p className="text-[13px] text-[#8A7E72]">
            AgriVil design system · docs/redesign/00-design-system.md · preview
            only, not indexed
          </p>
        </div>
      </footer>
    </main>
  )
}
