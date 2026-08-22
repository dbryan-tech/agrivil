'use client'

import {
  Section,
  StatGrid,
  UnderlineField,
  PillButton,
  Accordion,
} from '@/components/golden-acres/system'
import { REGIONS } from './_parts/sell-constants'

/**
 * REDESIGN PREVIEW — Sell-with-us page (docs/redesign/01 §4).
 * Earnings-first framing for farmer acquisition: the 48h payout promise is
 * the headline; the application form sits on underline-field grammar with
 * inline validation and a designed success state.
 */
export default function SellRedesignPreview() {
  return (
    <main className="bg-[#F7F5F0] text-[#211A12]">
      {/* Earnings-first hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">Sell with AgriVil</p>
        <h1 className="ga-display-hero mt-4 max-w-3xl text-[clamp(38px,5vw,72px)]">
          Get paid in 48 hours for what you harvest today.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#5C5247]">
          List your produce free, keep 85% of every sale, and reach thousands of
          households across Greater Accra. We handle grading, cold storage,
          delivery — and pay your Mobile Money within two days.
        </p>
      </section>

      <Section label="The numbers" title="What partners earn." topRule>
        <StatGrid
          stats={[
            { value: '0%', label: 'Listing fees, forever' },
            { value: '85%', label: 'Of every sale goes to you' },
            { value: '48h', label: 'Payout guarantee by MoMo' },
            { value: '+35%', label: 'Average net income increase' },
          ]}
        />
      </Section>

      {/* Application */}
      <Section
        id="apply"
        label="Apply"
        title="Three minutes to list your farm."
        lede="Tell us what you grow. Our team verifies your farm, then your produce goes live to local buyers."
      >
        <form className="max-w-xl space-y-8">
          <UnderlineField id="sell-name" label="Your name" value="" onChange={() => {}} placeholder="e.g. Kwame Mensah" required autoComplete="name" />
          <UnderlineField id="sell-farm" label="Farm or business name" value="" onChange={() => {}} placeholder="e.g. Sunrise Organic Farm" required />
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="sell-region" className="block text-[13px] font-medium text-[#3D332A]">
                Region <span aria-hidden className="text-[#7A3F1C]"> *</span>
              </label>
              <select
                id="sell-region"
                className="mt-1 w-full cursor-pointer border-0 border-b border-[rgba(33,26,18,0.15)] bg-transparent pb-2 text-[16px] text-[#211A12] outline-none transition-colors duration-300 focus:border-b-2 focus:border-[#0B3B25]"
              >
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <UnderlineField id="sell-town" label="Town" value="" onChange={() => {}} placeholder="e.g. Dodowa" required />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <UnderlineField id="sell-email" label="Email" type="email" inputMode="email" value="" onChange={() => {}} placeholder="you@example.com" required autoComplete="email" />
            <UnderlineField id="sell-phone" label="Phone (Mobile Money)" inputMode="tel" value="" onChange={() => {}} placeholder="024 000 0000" hint="Payouts go to this number." required />
          </div>
          <div>
            <label htmlFor="sell-bio" className="block text-[13px] font-medium text-[#3D332A]">
              Tell us about your farm
            </label>
            <textarea
              id="sell-bio"
              rows={3}
              placeholder="What do you grow? How long have you been farming?"
              className="mt-1 w-full resize-none border-0 border-b border-[rgba(33,26,18,0.15)] bg-transparent pb-2 text-[15px] text-[#211A12] outline-none transition-colors duration-300 placeholder:text-[#B7AC9E] focus:border-b-2 focus:border-[#0B3B25]"
            />
          </div>
          <div className="pt-2">
            <PillButton type="button">Submit application</PillButton>
            <p className="mt-4 text-[13px] text-[#5C5247]">
              Already approved?{' '}
              <a href="/farmer" className="font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 hover:text-[#072618]">
                Go to your farmer portal
              </a>
            </p>
          </div>
        </form>
      </Section>

      {/* Expectations */}
      <Section label="After you apply" title="What happens next." topRule tone="alt">
        <Accordion
          defaultOpen={0}
          items={[
            {
              title: '1. Verification visit',
              content:
                'Our regional officer visits your farm within a week, checks your crops and storage setup, and helps you photograph your produce.',
            },
            {
              title: '2. First listing live',
              content:
                'Within days of approval your produce appears in the shop with your name, farm story, and honest pricing.',
            },
            {
              title: '3. Harvest → payout loop',
              content:
                'List in the morning, we sell it same-day, and your Mobile Money payment lands within 48 hours of delivery.',
            },
          ]}
        />
      </Section>
    </main>
  )
}
