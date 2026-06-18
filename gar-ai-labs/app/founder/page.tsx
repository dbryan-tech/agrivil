import type { Metadata } from 'next'
import { FounderNav } from '@/components/founder/founder-nav'
import { FounderHero } from '@/components/founder/founder-hero'
import { FounderAbout } from '@/components/founder/founder-about'
import { FounderExperience } from '@/components/founder/founder-experience'
import { FounderProjects } from '@/components/founder/founder-projects'
import { FounderFooter } from '@/components/founder/founder-footer'

export const metadata: Metadata = {
  title: 'Ewoke Lenny Bryan — Founder, Gar AI Labs',
  description:
    'Ewoke Lenny Bryan is the founder and principal researcher of Gar AI Labs, working on non-ergodic predictive intelligence and path-dependent decision models.',
}

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] font-onest text-[#0a0a0a]">
      <FounderNav />
      <main>
        <FounderHero />
        <FounderAbout />
        <FounderExperience />
        <FounderProjects />
      </main>
      <FounderFooter />
    </div>
  )
}
