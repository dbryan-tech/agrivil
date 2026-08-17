import type { Metadata } from 'next'
import { CompareView } from '@/components/golden-acres/compare/compare-view'

export const metadata: Metadata = {
  title: 'Compare produce · Golden Acres Ghana',
  description:
    'Compare fresh produce side by side — price, farm, freshness, ratings and more — to pick the perfect basket.',
}

export default function ComparePage() {
  return <CompareView />
}
