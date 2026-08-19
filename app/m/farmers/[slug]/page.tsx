'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Leaf,
  Droplets,
  ShieldCheck,
  X,
  Share2,
  Sparkles,
  Calendar,
  Truck,
  Check,
  Send,
} from 'lucide-react'
import { farmers, products } from '@/lib/golden-acres/data'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { cn } from '@/lib/utils'

export default function MobileFarmerProfileScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const router = useRouter()

  const farmer =
    farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const farmProducts = products.filter(
    (p) =>
      p.farmerId === farmer.id ||
      p.farmerName?.toLowerCase().includes(farmer.name.toLowerCase()) ||
      p.farmerName?.toLowerCase().includes(farmer.farmName.toLowerCase())
  )

  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'harvest' | 'story' | 'reviews' | 'location'>('overview')
  const [showContactModal, setShowContactModal] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  // Mock Reviews
  const reviews = [
    {
      author: 'Akosua Boakye',
      location: 'KNUST, Kumasi',
      rating: 5,
      date: '2 days ago',
      comment: 'The Roma tomatoes and sweet plantain were incredibly fresh. You can tell they were picked the same morning.',
    },
    {
      author: 'Kofi Mensah',
      location: 'Ahodwo, Kumasi',
      rating: 5,
      date: '1 week ago',
      comment: 'Great quality and clean produce. Packaging was cold and spotless.',
    },
    {
      author: 'Ebenezer Osei',
      location: 'Asokwa, Kumasi',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good produce and prompt delivery from the local farm hub.',
    },
  ]

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessageSent(true)
    setTimeout(() => {
      setMessageSent(false)
      setShowContactModal(false)
    }, 1500)
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-28 text-[#2B1F17]">
      {/* 1. Header Bar */}
      <header
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between p-3 sm:p-4 bg-[#FAF7F0]/80 backdrop-blur-md border-b border-[#E0DACB]/50"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: farmer.name, url: window.location.href }).catch(() => {})
              }
            }}
            aria-label="Share"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setFollowing(!following)}
            aria-label="Follow farm"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                following ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
              )}
            />
          </button>
        </div>
      </header>

      {/* 2. Hero Farmer Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2B1F17] mt-12">
        <Image
          src={farmer.photo}
          alt={farmer.name}
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1F17] via-[#2B1F17]/40 to-transparent" />

        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0F7A43] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
            <CheckCircle2 className="h-3 w-3" /> Verified Ghana Grower
          </span>
          <h1 className="ga-headline mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {farmer.farmName || farmer.name}
          </h1>
          <p className="mt-0.5 text-xs text-white/90">
            {farmer.name} · {farmer.town}, {farmer.region}
          </p>
        </div>
      </div>

      {/* 3. Interactive Tab Navigation */}
      <div className="sticky top-12 z-30 border-b border-[#E0DACB] bg-[#FAF7F0]">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 sm:px-4 py-2">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'harvest', label: `Harvest (${farmProducts.length || 4})` },
            { key: 'story', label: 'Story & Methods' },
            { key: 'reviews', label: `Reviews (${farmer.reviewCount})` },
            { key: 'location', label: 'Location & Hub' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={cn(
                'ga-press flex shrink-0 items-center rounded-full px-3.5 py-1 text-xs font-bold transition-all',
                activeTab === t.key
                  ? 'bg-[#0F7A43] text-white shadow-xs'
                  : 'border border-[#E0DACB] bg-white text-[#2B1F17]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tab Contents */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Trust Metrics Strip */}
            <div className="flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs text-center">
              <div className="flex flex-1 flex-col items-center border-r border-[#E0DACB]">
                <div className="flex items-center gap-1 text-sm font-extrabold text-[#2B1F17]">
                  <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>{farmer.rating}</span>
                </div>
                <span className="text-[10px] text-[#6E6A63]">{farmer.reviewCount} Reviews</span>
              </div>

              <div className="flex flex-1 flex-col items-center border-r border-[#E0DACB]">
                <span className="text-sm font-extrabold text-[#0F7A43]">0.8 km</span>
                <span className="text-[10px] text-[#6E6A63]">Delivery Radius</span>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <span className="text-sm font-extrabold text-[#7A3F1C]">
                  {farmer.joinedYear ? `Since ${farmer.joinedYear}` : '100% Organic'}
                </span>
                <span className="text-[10px] text-[#6E6A63]">Fair Trade</span>
              </div>
            </div>

            {/* About Card */}
            <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
                About the Farm
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#2B1F17]">
                {farmer.bio}
              </p>

              {/* 4 Value Pillars */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#E0DACB]/60 pt-3">
                <div className="flex items-center gap-2 rounded-2xl bg-[#FAF7F0] p-2.5">
                  <Leaf className="h-4 w-4 text-[#0F7A43]" />
                  <div>
                    <span className="block text-[11px] font-extrabold text-[#2B1F17]">Sustainable</span>
                    <span className="text-[9px] text-[#6E6A63]">Eco-friendly soil</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-[#FAF7F0] p-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#0F7A43]" />
                  <div>
                    <span className="block text-[11px] font-extrabold text-[#2B1F17]">Pesticide-Free</span>
                    <span className="text-[9px] text-[#6E6A63]">Natural control</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-[#FAF7F0] p-2.5">
                  <Sparkles className="h-4 w-4 text-[#0F7A43]" />
                  <div>
                    <span className="block text-[11px] font-extrabold text-[#2B1F17]">Hand Picked</span>
                    <span className="text-[9px] text-[#6E6A63]">At dawn freshness</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-[#FAF7F0] p-2.5">
                  <Truck className="h-4 w-4 text-[#0F7A43]" />
                  <div>
                    <span className="block text-[11px] font-extrabold text-[#2B1F17]">Cold-Chain</span>
                    <span className="text-[9px] text-[#6E6A63]">Hub dispatched</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preview of Harvest */}
            <div>
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
                  Freshly Listed Harvest
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('harvest')}
                  className="text-xs font-bold text-[#7A3F1C] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(farmProducts.length > 0 ? farmProducts : products.slice(0, 4)).map((product) => (
                  <MobileProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HARVEST TAB */}
        {activeTab === 'harvest' && (
          <div>
            <div className="pb-2">
              <h2 className="text-sm font-extrabold text-[#2B1F17]">
                Available Harvest ({farmProducts.length || products.slice(0, 4).length})
              </h2>
              <p className="text-[10px] text-[#6E6A63]">Harvested directly from {farmer.farmName || farmer.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {(farmProducts.length > 0 ? farmProducts : products.slice(0, 4)).map((product) => (
                <MobileProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* STORY & METHODS TAB */}
        {activeTab === 'story' && (
          <div className="space-y-3">
            <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Heritage &amp; Story
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#2B1F17]">
                {farmer.story || farmer.bio}
              </p>
            </div>

            <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Cultivation Standards
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {(farmer.methods || ['Hand-harvested at dawn', 'Drip irrigation', 'Composting', 'Low-spray']).map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F0] px-3 py-1 text-xs font-bold text-[#0F7A43] border border-[#E0DACB]"
                  >
                    <Leaf className="h-3 w-3" /> {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2B1F17]">{farmer.rating}</h2>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-[#7A3F1C]">
                    <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#6E6A63]">
                  Based on {farmer.reviewCount} verified orders
                </span>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-2.5">
              {reviews.map((rev, i) => (
                <div key={i} className="rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#2B1F17]">{rev.author}</span>
                    <span className="text-[10px] text-[#6E6A63]">{rev.date}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#0F7A43]">{rev.location}</span>
                  <p className="mt-1.5 text-xs text-[#2B1F17]">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCATION & HUB TAB */}
        {activeTab === 'location' && (
          <div className="space-y-3">
            <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6E6A63]">Farm Location</span>
                <span className="font-bold text-[#2B1F17]">{farmer.town}, {farmer.region}</span>
              </div>
              <div className="flex justify-between border-t border-[#E0DACB]/60 pt-2">
                <span className="text-[#6E6A63]">GhanaPostGPS</span>
                <span className="font-extrabold text-[#0F7A43]">{farmer.pickupGPS || 'AK-102-4481'}</span>
              </div>
              <div className="flex justify-between border-t border-[#E0DACB]/60 pt-2">
                <span className="text-[#6E6A63]">Distance to KNUST Hub</span>
                <span className="font-bold text-[#2B1F17]">0.8 km</span>
              </div>
            </div>

            <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-[#EBE6DA]">
              <Image
                src="/golden-acres/hero-farmer.jpg"
                alt="Farm map"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-[#0F7A43] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {farmer.farmName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sticky Action Footer */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-[#E0DACB] bg-[#FAF7F0]/95 p-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="ga-press flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          <MessageSquare className="h-4 w-4" />
          Contact Grower / Inquire Harvest
        </button>
      </div>

      {/* 6. Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#E0DACB] pb-3">
              <h3 className="text-base font-extrabold text-[#2B1F17]">Message {farmer.name}</h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="rounded-full p-1 text-[#6E6A63] hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {messageSent ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0F7A43] text-white">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h4 className="mt-3 text-sm font-extrabold text-[#2B1F17]">Message Sent!</h4>
                <p className="mt-1 text-xs text-[#6E6A63]">The grower will reply via your Agrivil notifications.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="mt-3 space-y-3">
                <p className="text-xs text-[#6E6A63]">
                  Ask about upcoming harvests, custom bulk crate orders, or farm visit schedules.
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="Write your message here..."
                  className="w-full rounded-2xl border border-[#E0DACB] bg-[#FAF7F0] p-3 text-xs outline-none focus:border-[#0F7A43]"
                />
                <button
                  type="submit"
                  className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
