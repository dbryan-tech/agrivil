import { VideoHero } from '@/components/golden-acres/home/video-hero'
import { HeroPromo, TrustStrip } from '@/components/golden-acres/home/hero-promo'
import { CategoryTiles } from '@/components/golden-acres/home/category-tiles'
import { DealsRail } from '@/components/golden-acres/home/deals-rail'
import { FeaturedProduce } from '@/components/golden-acres/home/featured-produce'
import { FreshnessStory } from '@/components/golden-acres/home/freshness-story'
import { MatchTeaser } from '@/components/golden-acres/home/match-teaser'
import { BundlesPreview } from '@/components/golden-acres/home/bundles-preview'
import { RecipesPreview } from '@/components/golden-acres/home/recipes-preview'
import { FarmerSpotlight } from '@/components/golden-acres/home/farmer-spotlight'
import { TestimonialsCta } from '@/components/golden-acres/home/testimonials-cta'
import { Reveal } from '@/components/golden-acres/reveal'

export default function HomePage() {
  return (
    <>
      <VideoHero />
      <HeroPromo />
      <TrustStrip />
      <CategoryTiles />
      <DealsRail />
      <Reveal>
        <FeaturedProduce />
      </Reveal>
      <Reveal>
        <FreshnessStory />
      </Reveal>
      <Reveal>
        <MatchTeaser />
      </Reveal>
      <Reveal>
        <BundlesPreview />
      </Reveal>
      <Reveal>
        <RecipesPreview />
      </Reveal>
      <Reveal>
        <FarmerSpotlight />
      </Reveal>
      <Reveal>
        <TestimonialsCta />
      </Reveal>
    </>
  )
}
