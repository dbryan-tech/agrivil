import { SiteHeader } from '@/components/company/site-header'
import { Hero } from '@/components/company/hero'
import { ResearchSection } from '@/components/company/research-section'
import { SignalBand } from '@/components/company/signal-band'
import { ApproachSection } from '@/components/company/approach-section'
import { FounderTeaser } from '@/components/company/founder-teaser'
import { SiteFooter } from '@/components/company/site-footer'

export default function GarReferencePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <ResearchSection />
        <SignalBand />
        <ApproachSection />
        <FounderTeaser />
      </main>
      <SiteFooter />
    </div>
  )
}
