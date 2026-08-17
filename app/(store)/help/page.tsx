import type { Metadata } from 'next'
import { HelpCenter } from '@/components/golden-acres/help/help-center'

export const metadata: Metadata = {
  title: 'Help Center & Support Desk | AgriVil',
  description:
    'Instant assistance for orders, perishable quality guarantees, Mobile Money payments, and live encrypted support tickets.',
}

export default function HelpPage() {
  return <HelpCenter />
}
