import type { Metadata } from 'next'
import { WaitlistBody } from './_parts/waitlist-body'

export const metadata: Metadata = {
  title: 'Join the Waitlist — AgriVil',
  description:
    "We're expanding across Greater Accra. Join the waitlist and be first to know when we deliver to your area.",
}

export default function WaitlistPage() {
  return <WaitlistBody />
}
