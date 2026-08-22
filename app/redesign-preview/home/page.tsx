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
import { SiteHeader } from './_parts/site-header'
import { SiteFooter } from './_parts/site-footer'
import { CartProvider } from '@/components/golden-acres/cart-context'

/**
 * REDESIGN PREVIEW — home page with chrome (docs/redesign/01).
 * `?flat=1` fixes hero height for full-page captures.
 * CartProvider is provided here because this preview route sits outside the
 * (store) layout that normally supplies it to the header.
 */
export default async function HomeRedesignPreview({
  searchParams,
}: {
  searchParams: Promise<{ flat?: string; header?: string }>
}) {
  const { flat, header } = await searchParams
  return (
    <CartProvider>
      <div className="bg-[#F7F5F0] text-[#211A12]">
        <SiteHeader forceDark={header === 'dark'} />
        <main>
          <NewHomeHero compact={flat === '1'} />
          <ProofStrip />
          <FeaturedProduce />
          <FarmerSpotlightNew />
          <HowItWorks />
          <KitchenTeaser />
          <Voices />
          <ClosingBand />
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}
