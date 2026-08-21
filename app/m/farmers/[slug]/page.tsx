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
    <div className="relative min-h-dvh bg-[#FAF9F6] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* ========================================================
          1. FULL-BLEED TOP HERO BANNER (Bleeds to edges & top)
         ======================================================== */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] overflow-hidden rounded-b-[32px] bg-[#211A12] shadow-xs">
        <Image
          src={farmer.photo}
          alt={farmer.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.05] opacity-90 transition-transform select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Floating Top Navigation Header */}
        <header
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-1.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.4]" />
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setFollowing(!following)}
              aria-label="Follow farm"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  following ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#211A12]'
                )}
              />
            </button>
          </div>
        </header>

        {/* Banner Farm Name */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            <CheckCircle2 className="h-2.5 w-2.5" /> Verified Ghana Grower
          </span>
          <h1 className="mt-1 text-[22px] font-black tracking-tight text-white sm:text-2xl">
            {farmer.farmName || farmer.name}
          </h1>
        </div>
      </div>

      {/* 2. Circular Avatar Overlapping the Banner */}
      <div className="relative -mt-10 flex flex-col items-center px-4 text-center z-20">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-[#FAF9F6] bg-white shadow-md">
          <Image
            src={farmer.photo}
            alt={farmer.name}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="mt-1.5 text-[17px] font-black text-[#211A12]">
          {farmer.name}
        </h2>
        <p className="text-[12px] font-semibold text-[#7A3F1C]">
          {farmer.town}, {farmer.region} · {farmer.distanceKm || 12}km from you
        </p>
      </div>

      {/* 3. Interactive Tab Navigation (No visible bottom divider line) */}
      <div className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md pt-2">
        <div className="flex gap-1.5 overflow-x-auto px-1.5 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                'flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-[11.5px] font-extrabold transition-all active:scale-95 shadow-2xs',
                activeTab === t.key
                  ? 'bg-[#0B3B25] text-white shadow-xs'
                  : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tab Contents */}
      <div className="px-1.5 pt-2.5 space-y-2.5">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-2.5">
            {/* Trust Metrics Strip */}
            <div className="flex items-center justify-between rounded-[24px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] text-center">
              <div className="flex flex-1 flex-col items-center border-r border-[rgba(33,26,18,0.08)]">
                <div className="flex items-center gap-1 text-[13px] font-black text-[#211A12]">
                  <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                  <span>{farmer.rating}</span>
                </div>
                <span className="text-[9.5px] font-semibold text-[#5C5247]">{farmer.reviewCount} Reviews</span>
              </div>

              <div className="flex flex-1 flex-col items-center border-r border-[rgba(33,26,18,0.08)]">
                <span className="text-[13px] font-black text-[#0B3B25]">0.8 km</span>
                <span className="text-[9.5px] font-semibold text-[#5C5247]">Delivery Radius</span>
              </div>

              <div className="flex flex-1 flex-col items-center">
                <span className="text-[13px] font-black text-[#7A3F1C]">
                  {farmer.joinedYear ? `Since ${farmer.joinedYear}` : '100% Organic'}
                </span>
                <span className="text-[9.5px] font-semibold text-[#5C5247]">Fair Trade</span>
              </div>
            </div>

            {/* About Section (Direct on background, zero card box) */}
            <div className="pt-1 space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                About the Farm
              </h2>
              <p className="text-[12.5px] leading-relaxed text-[#211A12] font-semibold">
                {farmer.bio}
              </p>

              {/* 4 Value Pillars (Clean direct inline list, zero card boxes) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1.5">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-[#0B3B25] shrink-0" />
                  <div>
                    <span className="block text-[11.5px] font-black text-[#211A12]">Sustainable</span>
                    <span className="text-[9.5px] text-[#5C5247] font-semibold">Eco-friendly soil</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0B3B25] shrink-0" />
                  <div>
                    <span className="block text-[11.5px] font-black text-[#211A12]">Pesticide-Free</span>
                    <span className="text-[9.5px] text-[#5C5247] font-semibold">Natural control</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0B3B25] shrink-0" />
                  <div>
                    <span className="block text-[11.5px] font-black text-[#211A12]">Hand Picked</span>
                    <span className="text-[9.5px] text-[#5C5247] font-semibold">At dawn freshness</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#0B3B25] shrink-0" />
                  <div>
                    <span className="block text-[11.5px] font-black text-[#211A12]">Cold-Chain</span>
                    <span className="text-[9.5px] text-[#5C5247] font-semibold">Hub dispatched</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preview of Harvest */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-1.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                  Freshly Listed Harvest
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('harvest')}
                  className="text-[11px] font-bold text-[#7A3F1C] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
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
              <h2 className="text-[13.5px] font-extrabold text-[#211A12]">
                Available Harvest ({farmProducts.length || products.slice(0, 4).length})
              </h2>
              <p className="text-[10.5px] font-semibold text-[#5C5247]">Harvested directly from {farmer.farmName || farmer.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {(farmProducts.length > 0 ? farmProducts : products.slice(0, 4)).map((product) => (
                <MobileProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* STORY & METHODS TAB (Direct on background, zero card boxes) */}
        {activeTab === 'story' && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                Heritage &amp; Story
              </h2>
              <p className="text-[12.5px] leading-relaxed text-[#211A12] font-semibold">
                {farmer.story || farmer.bio}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[rgba(33,26,18,0.06)]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                Cultivation Standards
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(farmer.methods || ['Hand-harvested at dawn', 'Drip irrigation', 'Composting', 'Low-spray']).map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#0B3B25] border border-[rgba(33,26,18,0.08)] shadow-2xs"
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
          <div className="space-y-2.5">
            <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] font-black text-[#211A12]">{farmer.rating}</h2>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#7A3F1C]">
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#5C5247]">
                  Based on {farmer.reviewCount} verified orders
                </span>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-2">
              {reviews.map((rev, i) => (
                <div key={i} className="rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-extrabold text-[#211A12]">{rev.author}</span>
                    <span className="text-[10px] font-semibold text-[#5C5247]">{rev.date}</span>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#0B3B25]">{rev.location}</span>
                  <p className="mt-1 text-[11.5px] text-[#5C5247] font-medium leading-snug">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCATION & HUB TAB */}
        {activeTab === 'location' && (
          <div className="space-y-2.5">
            <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#5C5247] font-medium">Farm Location</span>
                <span className="font-bold text-[#211A12]">{farmer.town}, {farmer.region}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(33,26,18,0.06)] pt-1.5">
                <span className="text-[#5C5247] font-medium">GhanaPostGPS</span>
                <span className="font-extrabold text-[#0B3B25]">{farmer.pickupGPS || 'AK-102-4481'}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(33,26,18,0.06)] pt-1.5">
                <span className="text-[#5C5247] font-medium">Distance to KNUST Hub</span>
                <span className="font-bold text-[#211A12]">0.8 km</span>
              </div>
            </div>

            <div className="relative h-44 w-full overflow-hidden rounded-[24px] bg-[#EBE6DA]">
              <Image
                src="/golden-acres/hero-farmer.jpg"
                alt="Farm map"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-[#0B3B25] px-3 py-1.5 text-[11.5px] font-black text-white shadow-lg flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {farmer.farmName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sticky Action Footer */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-1.5 pt-2.5 pb-[clamp(16px,2.5vh,22px)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setShowContactModal(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <MessageSquare className="h-4 w-4" />
          Contact Grower / Inquire Harvest
        </button>
      </div>

      {/* 6. Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-t-[28px] bg-white p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] pb-2.5">
              <h3 className="text-[15px] font-black text-[#211A12]">Message {farmer.name}</h3>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="rounded-full p-1 text-[#5C5247] hover:bg-black/5"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {messageSent ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0B3B25] text-white">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <h4 className="mt-2 text-[14px] font-extrabold text-[#211A12]">Message Sent!</h4>
                <p className="mt-0.5 text-[11.5px] text-[#5C5247]">The grower will reply via your Agrivil notifications.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="mt-2.5 space-y-2.5">
                <p className="text-[11.5px] text-[#5C5247] font-medium">
                  Ask about upcoming harvests, custom bulk crate orders, or farm visit schedules.
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="Write your message here..."
                  className="w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-[#F7F5F0] p-3 text-[12.5px] outline-none focus:border-[#0B3B25]"
                />
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[12.5px] font-extrabold text-white shadow-xs active:scale-95 transition-transform"
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
