import {
  NewHomeHero,
  ProofStrip,
  FeaturedProduce,
  FarmerSpotlightNew,
} from './_parts/sections-a'
import {
  HowItWorks,
  KitchenTeaser,
  Voices,
  ClosingBand,
} from './_parts/sections-b'

/**
 * REDESIGN PREVIEW — home page (docs/redesign/01-brand-marketing.md)
 * Narrative order: Belief (hero) → Proof (stats) → Product (featured)
 * → People (farmers) → Mechanism (how it works) → Lifestyle (kitchen)
 * → Community (voices) → Action (closing band).
 *
 * `?flat=1` renders the hero at a fixed height so full-page captures and
 * print review show every section without viewport-relative sizing.
 * The real `app/(store)/page.tsx` is untouched until owner approval.
 */
export default async function HomeRedesignPreview({
  searchParams,
}: {
  searchParams: Promise<{ flat?: string }>
}) {
  const { flat } = await searchParams
  return (
    <main className="bg-[#F7F5F0] text-[#211A12]">
      <NewHomeHero compact={flat === '1'} />
      <ProofStrip />
      <FeaturedProduce />
      <FarmerSpotlightNew />
      <HowItWorks />
      <KitchenTeaser />
      <Voices />
      <ClosingBand />
    </main>
  )
}
