'use client'

import Link from 'next/link'
import { Sprout } from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { FarmerProfile } from '@/components/golden-acres/farmers/farmer-profile'
import type { Farmer, Product } from '@/lib/golden-acres/types'

// Client overlay: starts from the statically-rendered seed farmer + catalog,
// then merges any live edits from the shared data store (profile updates,
// newly listed produce) so the public page reflects what the farmer and staff
// have changed in this session. Also resolves farmers registered this session
// (no seed) by matching the slug against the live store.
export function FarmerProfileLive({
  slug,
  farmer,
  catalog,
}: {
  slug: string
  farmer: Farmer | null
  catalog: Product[]
}) {
  const { farmers, liveProducts } = useDataStore()

  const liveFarmer =
    (farmer ? farmers.find((f) => f.id === farmer.id) : null) ??
    farmers.find((f) => f.slug === slug) ??
    farmer

  if (!liveFarmer) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Sprout className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="ga-display mt-5 text-2xl font-semibold text-foreground">
          Farmer not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This profile may have been removed. Meet the rest of our growers
          instead.
        </p>
        <Link
          href="/farmers"
          className="mt-6 rounded-full bg-field px-6 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
        >
          Browse farmers
        </Link>
      </div>
    )
  }

  const liveCatalog = liveProducts.filter(
    (p) => p.farmerId === liveFarmer.id && p.status !== 'delisted',
  )

  return (
    <FarmerProfile
      farmer={liveFarmer}
      catalog={liveCatalog.length > 0 ? liveCatalog : catalog}
    />
  )
}
