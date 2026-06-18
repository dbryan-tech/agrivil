'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Sprout } from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { ProductDetail } from '@/components/golden-acres/shop/product-detail'
import type { Farmer, Product } from '@/lib/golden-acres/types'

// Client overlay for the product detail page. The server resolves seed products
// statically; this resolves the slug against the live store so runtime listings
// (added by farmers this session) are reachable too. Falls back to the seed
// product/farmer passed in when present.
export function ProductDetailLive({
  slug,
  seedProduct,
  seedFarmer,
  seedRelated,
}: {
  slug: string
  seedProduct: Product | null
  seedFarmer: Farmer | null
  seedRelated: Product[]
}) {
  const { liveProducts, getFarmer } = useDataStore()

  const product = useMemo(
    () => liveProducts.find((p) => p.slug === slug) ?? seedProduct ?? null,
    [liveProducts, slug, seedProduct],
  )

  const farmer = useMemo(
    () => (product ? getFarmer(product.farmerId) ?? seedFarmer : seedFarmer),
    [product, getFarmer, seedFarmer],
  )

  const related = useMemo(() => {
    if (!product) return seedRelated
    const live = liveProducts.filter(
      (p) => p.category === product.category && p.id !== product.id,
    )
    return (live.length > 0 ? live : seedRelated).slice(0, 4)
  }, [product, liveProducts, seedRelated])

  // Competing farmer offers for the same canonical product (matched by name).
  const offers = useMemo(() => {
    if (!product) return []
    const name = product.name.trim().toLowerCase()
    return liveProducts.filter(
      (p) => p.name.trim().toLowerCase() === name && p.status !== 'delisted',
    )
  }, [product, liveProducts])

  if (!product || !farmer) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Sprout className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="ga-display mt-5 text-2xl font-semibold text-foreground">
          Produce not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This listing may have sold out or been removed. Browse the rest of
          today&apos;s harvest instead.
        </p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-field px-6 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  return <ProductDetail product={product} farmer={farmer} related={related} offers={offers} />
}
