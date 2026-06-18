import { ProductDetailLive } from '@/components/golden-acres/shop/product-detail-live'
import { products, productFarmer } from '@/lib/golden-acres/data'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return { title: 'Produce — AgriVil' }
  return {
    title: `${product.name} — AgriVil`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Resolve seed data on the server when available; the live overlay also
  // resolves runtime listings added by farmers during the session.
  const seedProduct = products.find((p) => p.slug === slug) ?? null
  const seedFarmer = seedProduct ? productFarmer(seedProduct) : null
  const seedRelated = seedProduct
    ? products
        .filter((p) => p.category === seedProduct.category && p.id !== seedProduct.id)
        .slice(0, 4)
    : []

  return (
    <ProductDetailLive
      slug={slug}
      seedProduct={seedProduct}
      seedFarmer={seedFarmer}
      seedRelated={seedRelated}
    />
  )
}
