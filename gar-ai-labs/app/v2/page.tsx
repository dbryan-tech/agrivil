import type { Metadata } from 'next'
import { LabHeader } from '@/components/v2/lab-header'
import { LabHero } from '@/components/v2/lab-hero'
import { LabPremise } from '@/components/v2/lab-premise'
import { LabVectors } from '@/components/v2/lab-vectors'
import { LabDemo } from '@/components/v2/lab-demo'
import { LabOutput } from '@/components/v2/lab-output'
import { LabFounder } from '@/components/v2/lab-founder'
import { LabFooter } from '@/components/v2/lab-footer'

export const metadata: Metadata = {
  title: 'Gar AI Labs — Non-Ergodic Predictive Intelligence',
  description:
    'A research instrument for predicting the path, not the average. Gar AI Labs studies time-aware inference, one-shot decisions and path-dependent risk.',
}

export default function V2Page() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] font-sans text-[#14130f] antialiased selection:bg-[#E8A24A] selection:text-[#14130f] dark:bg-[#0c0c0d] dark:text-[#f4f1ea]">
      <LabHeader />
      <main>
        <LabHero />
        <LabPremise />
        <LabVectors />
        <LabDemo />
        <LabOutput />
        <LabFounder />
      </main>
      <LabFooter />
    </div>
  )
}
