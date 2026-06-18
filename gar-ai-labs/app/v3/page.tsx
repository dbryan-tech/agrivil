import type { Metadata } from 'next'
import { V3Page } from '@/components/v3/v3-page'

export const metadata: Metadata = {
  title: 'Gar AI Labs — v3 | Non-Ergodic Predictive Intelligence',
  description: 'Every path diverges. Only once. We predict unfolding non-ergodic systems.',
}

export default function Page() {
  return <V3Page />
}
