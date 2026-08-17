import type { Metadata } from 'next'
import { CheckoutFlow } from '@/components/golden-acres/checkout/checkout-flow'

export const metadata: Metadata = {
  title: 'Secure Checkout — Mobile Money & Card | AgriVil',
  description:
    'Complete your order with GhanaPostGPS digital address delivery, scheduled arrival time slots, and Mobile Money or card payment.',
}

export default function CheckoutPage() {
  return <CheckoutFlow />
}
