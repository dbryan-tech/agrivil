'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  ShieldCheck,
  Plus,
  Check,
} from 'lucide-react'
import { farmers, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { cn } from '@/lib/utils'

export default function MobileFarmerProfileScreen({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { add } = useCart()

  const farmer =
    farmers.find((f) => f.slug === resolvedParams.slug) || farmers[0]

  const farmProducts = products.filter(
    (p) =>
      p.farmerId === farmer.id ||
      p.farmerName.toLowerCase().includes(farmer.name.toLowerCase())
  )

  const [saved, setSaved] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  function handleQuickAdd(e: React.MouseEvent, p: (typeof products)[0]) {
    e.preventDefault()
    e.stopPropagation()
    add(p, 1)
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-28 text-[#2B1F17]">
      {/* Top Floating App Bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between p-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-md backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            aria-label="Save farmer"
            className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-md backdrop-blur-md"
          >
            <Heart
              className={cn(
                'h-5 w-5',
                saved ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
              )}
            />
          </button>
        </div>
      </div>

      {/* 1. Farm Photo Banner */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-white shadow-xs">
        <Image
          src={farmer.photo}
          alt={farmer.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5">
            <h1 className="ga-headline text-2xl font-extrabold">{farmer.name}</h1>
            <CheckCircle2 className="h-4 w-4 fill-[#A3E635] text-[#144028]" />
          </div>
          <p className="text-xs text-white/90">{farmer.region} · 0.8 km away</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#FBBF24]">
            <Star className="h-3.5 w-3.5 fill-[#FBBF24]" />
            <span className="font-bold text-white">{farmer.rating}</span>
            <span className="text-white/80">({farmer.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* 2. Farm Stats Strip */}
        <div className="grid grid-cols-3 gap-2 rounded-3xl border border-[#E0DACB] bg-white p-3.5 text-center shadow-xs">
          <div>
            <span className="text-base font-extrabold text-[#1E5D3B]">12+</span>
            <p className="text-[10px] font-semibold text-[#6E6A63]">Years Farming</p>
          </div>
          <div className="border-x border-[#E0DACB]">
            <span className="text-base font-extrabold text-[#1E5D3B]">6</span>
            <p className="text-[10px] font-semibold text-[#6E6A63]">Family Members</p>
          </div>
          <div>
            <span className="text-base font-extrabold text-[#1E5D3B]">5+</span>
            <p className="text-[10px] font-semibold text-[#6E6A63]">Locally Grown</p>
          </div>
        </div>

        {/* 3. Farm Story & Values */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
            From our farm to your table
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#6E6A63]">
            {farmer.bio ||
              'We are a dedicated local family farm committed to growing safe, organic, healthy and natural vegetables and tubers for Ghanaian households.'}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E0DACB]/60 pt-3 text-[10px] font-bold text-[#2B1F17]">
            <div className="flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-[#1E5D3B]" />
              <span>Sustainable</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1E5D3B]" />
              <span>Pesticide Free</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">💧</span>
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
            {(farmProducts.length > 0 ? farmProducts : products.slice(0, 4)).map((product) => {
              const isAdded = addedId === product.id
              return (
                <Link
                  key={product.id}
                  href={`/m/product/${product.slug}`}
                  className="ga-press group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2.5">
                    <h3 className="truncate text-xs font-extrabold text-[#2B1F17]">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E5D3B]">
                        {formatGHS(product.priceMin)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={cn(
                          'ga-press flex h-7 w-7 items-center justify-center rounded-full text-white',
                          isAdded ? 'bg-[#A3E635] text-[#144028]' : 'bg-[#1E5D3B]'
                        )}
                      >
                        {isAdded ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Plus className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Contact / Follow Action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white/95 p-4 shadow-xl backdrop-blur-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-sm font-bold text-white shadow-md hover:bg-[#144028]"
        >
          <Phone className="h-4 w-4" />
          Contact {farmer.name}
        </button>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <h3 className="text-base font-extrabold text-[#2B1F17]">
              Contact {farmer.name}
            </h3>
            <p className="mt-1 text-xs text-[#6E6A63]">
              Direct communication for bulk harvests or farm visits.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href="tel:+233241234567"
                className="ga-press flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-sm font-bold text-white shadow-sm"
              >
                <Phone className="h-4 w-4" />
                Call +233 24 123 4567
              </a>
              <a
                href="https://wa.me/233241234567"
                target="_blank"
                rel="noopener noreferrer"
                className="ga-press flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-[#E0DACB] bg-white text-sm font-bold text-[#1E5D3B]"
              >
                <MessageSquare className="h-4 w-4" />
                Message on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="ga-press flex h-11 w-full items-center justify-center text-xs font-bold text-[#6E6A63]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
