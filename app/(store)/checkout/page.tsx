import type { Metadata } from 'next'
import { CheckoutFlow } from '@/components/golden-acres/checkout/checkout-flow'

export const metadata: Metadata = {
  title: 'Checkout — AgriVil',
  description:
    'Confirm your fresh produce order with scheduled delivery and Mobile Money or card payment.',
}

export default function CheckoutPage() {
  return <CheckoutFlow />
}
