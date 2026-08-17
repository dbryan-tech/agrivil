'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Leaf,
  Droplets,
  ShieldCheck,
  Plus,
  Check,
} from 'lucide-react'
import { farmers, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

export default function MobileFarmerProfileScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const router = useRouter()
  const { add } = useCart()

  const farmer =
    farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const farmProducts = products.filter(
    (p) =>
      p.farmerId === farmer.id ||
      p.farmerName?.toLowerCase() === farmer.name.toLowerCase()
  )

  const [following, setFollowing] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  function handleQuickAdd(e: React.MouseEvent, product: (typeof products)[0]) {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-28 text-[#2B1F17]">
      {/* 1. Header Bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between p-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-sm border border-[#E0DACB]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFollowing(!following)}
            aria-label="Follow farm"
            className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-sm border border-[#E0DACB]"
          >
            <Heart
              className={cn(
                'h-5 w-5',
                following ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
              )}
            />
          </button>
        </div>
      </div>

      {/* 2. Hero Farmer Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2B1F17]">
        <Image
          src={farmer.photo}
          alt={farmer.name}
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1F17] via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1E5D3B] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
            <CheckCircle2 className="h-3 w-3" /> Verified Ghana Grower
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white">{farmer.name}</h1>
          <p className="text-xs text-white/80">{farmer.farmName}</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* 3. Farm Quick Stats Card */}
        <div className="grid grid-cols-3 gap-2 rounded-3xl border border-[#E0DACB] bg-white p-3 text-center shadow-xs">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-sm font-extrabold text-[#1E5D3B]">
              <Star className="h-3.5 w-3.5 fill-[#E67A2E] text-[#E67A2E]" /> {farmer.rating}
            </span>
            <span className="text-[10px] text-[#6E6A63]">{farmer.reviewCount || 42} reviews</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#E0DACB]">
            <span className="text-sm font-extrabold text-[#2B1F17]">
              {farmer.town}
            </span>
            <span className="text-[10px] text-[#6E6A63]">{farmer.region}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-[#8A6B3D]">
              {farmer.joinedYear || '2024'}
            </span>
            <span className="text-[10px] text-[#6E6A63]">Member since</span>
          </div>
        </div>

        {/* 3. Farm Bio / Story */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-5 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#8A6B3D]">
            About the Farm
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#2B1F17]">
            {farmer.bio ||
              'We are a dedicated local family farm committed to growing safe, organic, healthy and natural vegetables and tubers for Ghanaian households.'}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E0DACB] pt-3 text-[10px] font-bold text-[#2B1F17]">
            <div className="flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-[#1E5D3B]" />
              <span>Sustainable</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1E5D3B]" />
              <span>Pesticide Free</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-[#1E5D3B]" />
              <span>Well Irrigated</span>
            </div>
          </div>
        </div>

        {/* 4. Products Harvested by this Farm */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Products from this farm ({farmProducts.length || products.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(farmProducts.length > 0 ? farmProducts : products.slice(0, 4)).map(
              (prod) => {
                const isAdded = addedId === prod.id
                return (
                  <Link
                    key={prod.id}
                    href={`/m/product/${prod.slug}`}
                    className="ga-press group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs"
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-2 truncate text-xs font-extrabold text-[#2B1F17]">
                        {prod.name}
                      </h3>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1">
                      <span className="text-xs font-extrabold text-[#1E5D3B]">
                        {formatGHS(prod.priceMin)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, prod)}
                        className={cn(
                          'ga-press flex h-7 w-7 items-center justify-center rounded-full text-white shadow-xs transition-colors',
                          isAdded
                            ? 'bg-[#144028]'
                            : 'bg-[#1E5D3B] hover:bg-[#144028]'
                        )}
                        aria-label={`Add ${prod.name} to basket`}
                      >
                        {isAdded ? (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </Link>
                )
              }
            )}
          </div>
        </div>
      </div>

      {/* Floating Contact/Order Action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white p-4 shadow-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-xs font-bold text-white shadow-sm hover:bg-[#144028]"
        >
          <Phone className="h-4 w-4" />
          <span>Contact Farmer</span>
        </button>
      </div>

      {/* Contact Sheet Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <h3 className="text-base font-extrabold text-[#2B1F17]">
              Contact {farmer.name}
            </h3>
            <p className="mt-1 text-xs text-[#6E6A63]">
              Reach out directly regarding harvest schedules and bulk crates.
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href="tel:+233240000000"
                className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-xs font-bold text-white shadow-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Call Farm Hub (+233 24 000 0000)</span>
              </a>
              <a
                href="https://wa.me/233240000000"
                className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#E0DACB] bg-[#F4F1EA] text-xs font-bold text-[#2B1F17]"
              >
                <MessageSquare className="h-4 w-4 text-[#1E5D3B]" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="ga-press flex h-10 w-full items-center justify-center text-xs font-bold text-[#6E6A63]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
