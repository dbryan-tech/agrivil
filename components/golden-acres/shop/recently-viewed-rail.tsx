'use client'

import { ProductRail } from '@/components/golden-acres/shop/product-rail'
import { useRecentlyViewed } from '@/components/golden-acres/store/recently-viewed'

/**
 * Self-contained recently-viewed rail. Renders nothing until the visitor
 * has browsed at least a couple of products this session.
 */
export function RecentlyViewedRail({ className }: { className?: string }) {
  const products = useRecentlyViewed()
  if (products.length < 2) return null
  return (
    <ProductRail
      className={className}
      title="Recently viewed"
      subtitle="Jump back to products you looked at"
      products={products}
    />
  )
}
