import { HomeHero } from '@/components/golden-acres/home/home-hero'
import { MarketHero } from '@/components/golden-acres/home/market-hero'
import { FarmerField } from '@/components/golden-acres/home/farmer-field'
import { FeaturedProduce } from '@/components/golden-acres/home/featured-produce'
import { FreshnessStory } from '@/components/golden-acres/home/freshness-story'
import { MatchTeaser } from '@/components/golden-acres/home/match-teaser'
import { BundlesPreview } from '@/components/golden-acres/home/bundles-preview'
import { FarmerSpotlight } from '@/components/golden-acres/home/farmer-spotlight'
import { TestimonialsCta } from '@/components/golden-acres/home/testimonials-cta'
import { Reveal } from '@/components/golden-acres/reveal'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Reveal>
        <MarketHero />
      </Reveal>
      <Reveal>
        <FarmerField />
      </Reveal>
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
        <FarmerSpotlight />
      </Reveal>
      <Reveal>
        <TestimonialsCta />
      </Reveal>
    </>
  )
}
