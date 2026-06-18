import { FarmerProfileLive } from '@/components/golden-acres/farmers/farmer-profile-live'
import { farmers, products } from '@/lib/golden-acres/data'

export function generateStaticParams() {
  return farmers.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const farmer = farmers.find((f) => f.slug === slug)
  if (!farmer) return { title: 'Farmer — AgriVil' }
  return {
    title: `${farmer.name} · ${farmer.farmName} — AgriVil`,
    description: farmer.bio,
  }
}

export default async function FarmerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Seed farmer resolved on the server; runtime-registered farmers are
  // resolved client-side by the live overlay using the slug.
  const farmer = farmers.find((f) => f.slug === slug) ?? null
  const catalog = farmer
    ? products.filter((p) => p.farmerId === farmer.id && p.status !== 'delisted')
    : []

  return <FarmerProfileLive slug={slug} farmer={farmer} catalog={catalog} />
}
