import type { Metadata } from 'next'
import { OrderTracking } from '@/components/golden-acres/tracking/order-tracking'

export const metadata: Metadata = {
  title: 'Track your order · AgriVil',
  description: 'Live tracking for your AgriVil delivery.',
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ ref: string }>
}) {
  const { ref } = await params
  return <OrderTracking reference={decodeURIComponent(ref)} />
}
