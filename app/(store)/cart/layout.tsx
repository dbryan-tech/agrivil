import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Basket — AgriVil',
  description: 'Review your fresh produce basket before checkout.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
