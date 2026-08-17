import type { Metadata } from 'next'
import { CompareView } from '@/components/golden-acres/compare/compare-view'

export const metadata: Metadata = {
  title: 'Compare Produce Side-by-Side | AgriVil',
  description:
    'Compare price per kg, variable weight estimates, farm sources, growing methods, and shelf life across competing farmer offers.',
}

export default function ComparePage() {
  return <CompareView />
}
