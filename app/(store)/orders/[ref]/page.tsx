import type { Metadata } from 'next'
import { OrderTracking } from '@/components/golden-acres/tracking/order-tracking'

interface PageProps {
  params: Promise<{ ref: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ref } = await params
  return {
    title: `Track Order #${ref} — Live Delivery | AgriVil`,
    description: `Real-time GPS delivery tracking, 3PL dispatch updates, and Proof of Delivery for order #${ref}.`,
  }
}

export default async function OrderPage({ params }: PageProps) {
  const { ref } = await params
  return <OrderTracking reference={ref} />
}
