import { Section, StatGrid, ProductCard, HairRow } from '@/components/golden-acres/system'
import { featuredProducts, farmers, productFarmer } from '@/lib/golden-acres/data'
import { SmartImage } from '@/components/golden-acres/smart-image'

export { NewHomeHero } from './new-home-hero'

/**
 * Proof strip — quiet numbers over hairlines (marketing stats are hardcoded
 * placeholders until analytics exist; marked clearly).
 */
export function ProofStrip() {
  return (
    <Section label="Today in Ghana" title="A shorter path from soil to supper." lede="Every order placed before dawn is picked, graded and cold-chain dispatched the same day.">
      <StatGrid
        stats={[
          { value: '200+', label: 'Partnered smallholder farms' },
          { value: '12h', label: 'Average harvest-to-door time' },
          { value: '48h', label: 'Guaranteed farmer payouts' },
          { value: '98%', label: 'On-time cold-chain delivery' },
        ]}
      />
    </Section>
  )
}

/** Featured produce — editorial grid of the elevated product cards. */
export function FeaturedProduce() {
  const picks = featuredProducts.slice(0, 4)
  return (
    <Section
      id="featured"
      label="Featured harvest"
      title="Picked this morning."
      lede="Live listings from the day's harvest — priced by weight, freshness dated, farmer named."
      action={{ href: '/shop', label: 'Shop all produce' }}
    >
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {picks.map((p) => {
          const f = productFarmer(p)
          return (
            <ProductCard
              key={p.id}
              href={`/shop/${p.slug}`}
              image={p.image}
              name={p.name}
              farmName={f.farmName}
              price={p.priceMin}
              per={p.variableWeight ? '/ kg est.' : `/${p.unit}`}
              rating={p.rating}
              reviewCount={p.reviewCount}
            />
          )
        })}
      </div>
    </Section>
  )
}

/** Farmer spotlight — full-bleed portrait left, story right, directory rows below. */
export function FarmerSpotlightNew() {
  const lead = farmers[0]
  const rest = farmers.slice(1, 5)
  return (
    <Section
      id="farmers"
      label="The growers"
      title="Every order has a face behind it."
      lede="Smallholder farms across nine regions of Ghana, each verified, each paid within 48 hours."
      action={{ href: '/farmers', label: 'Meet all farmers' }}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        {/* Lead portrait */}
        <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-[rgba(33,26,18,0.05)] shadow-[0_2px_4px_rgba(33,26,18,0.05),0_16px_40px_rgba(33,26,18,0.09)]">
          <SmartImage
            src={lead.photo}
            alt={`${lead.name}, ${lead.farmName}`}
            fill
            className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/80">
              {lead.region} · since {lead.joinedYear}
            </p>
            <p className="ga-display-title mt-1 text-[26px] text-white">{lead.name}</p>
            <p className="mt-0.5 text-[13px] text-white/85">{lead.farmName}</p>
          </div>
        </div>

        {/* Directory rows */}
        <div className="flex flex-col justify-center">
          <div className="border-t border-[rgba(33,26,18,0.08)]">
            {rest.map((farmer, i) => (
              <HairRow
                key={farmer.id}
                index={`0${i + 1}`}
                href={`/farmers/${farmer.slug}`}
                title={farmer.name}
                description={farmer.farmName}
                meta={`${farmer.region} · ★ ${farmer.rating}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
