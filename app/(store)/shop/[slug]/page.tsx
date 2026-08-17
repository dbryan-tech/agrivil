import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products, farmers } from '@/lib/golden-acres/data'
import { ProductDetailLive } from '@/components/golden-acres/shop/product-detail-live'
import { formatGHS } from '@/lib/golden-acres/format'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) {
    return {
      title: 'Produce Item — AgriVil',
      description: 'Fresh farm-to-door perishable produce from local Ghanaian growers.',
    }
  }

  const farmer = farmers.find((f) => f.id === product.farmerId)
  const price = formatGHS(product.priceMin)
  const farmName = farmer ? ` from ${farmer.farmName}` : ''

  return {
    title: `${product.name} — ${price}/${product.unit} | AgriVil`,
    description: `Fresh ${product.name}${farmName}. ${product.description} Delivered cold to your door in Accra.`,
    openGraph: {
      title: `${product.name} — Fresh Local Harvest | AgriVil`,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const seedProduct = products.find((p) => p.slug === slug) ?? null
  const seedFarmer = seedProduct
    ? farmers.find((f) => f.id === seedProduct.farmerId) ?? null
    : null

  const seedRelated = seedProduct
    ? products
        .filter((p) => p.category === seedProduct.category && p.id !== seedProduct.id)
        .slice(0, 4)
    : []

  // Schema.org structured data for SEO
  const jsonLd = seedProduct
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: seedProduct.name,
        image: seedProduct.image,
        description: seedProduct.description,
        category: seedProduct.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'GHS',
          price: seedProduct.priceMin,
          availability:
            seedProduct.status === 'in-stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        },
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailLive
        slug={slug}
        seedProduct={seedProduct}
        seedFarmer={seedFarmer}
        seedRelated={seedRelated}
      />
    </>
  )
}
