import type { Metadata } from 'next'
import { farmers, products } from '@/lib/golden-acres/data'
import { FarmerProfileLive } from '@/components/golden-acres/farmers/farmer-profile-live'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const farmer = farmers.find((f) => f.slug === slug)
  if (!farmer) {
    return {
      title: 'Farmer Profile — AgriVil',
      description: 'Meet local Ghanaian farmers partnering with Golden Acres Ghana.',
    }
  }

  return {
    title: `${farmer.name} (${farmer.farmName}) — Fresh Produce Grower | AgriVil`,
    description: `${farmer.bio} Located in ${farmer.town}, ${farmer.region}. Discover fresh harvest delivered direct to Accra.`,
    openGraph: {
      title: `${farmer.name} — ${farmer.farmName} | AgriVil`,
      description: farmer.story,
      images: [{ url: farmer.photo, width: 600, height: 600, alt: farmer.name }],
    },
  }
}

export default async function FarmerPage({ params }: PageProps) {
  const { slug } = await params
  const farmer = farmers.find((f) => f.slug === slug) ?? null
  const farmerCatalog = farmer
    ? products.filter((p) => p.farmerId === farmer.id && p.status !== 'delisted')
    : []

  const jsonLd = farmer
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: farmer.farmName,
        image: farmer.photo,
        description: farmer.story,
        address: {
          '@type': 'PostalAddress',
          addressLocality: farmer.town,
          addressRegion: farmer.region,
          addressCountry: 'GH',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: farmer.rating,
          reviewCount: farmer.reviewCount,
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
      <FarmerProfileLive slug={slug} farmer={farmer} catalog={farmerCatalog} />
    </>
  )
}
