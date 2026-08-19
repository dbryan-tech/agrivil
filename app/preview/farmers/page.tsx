'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  MapPin,
  Truck,
  Leaf,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PreviewBottomNav } from '@/app/preview/_lib/premium'

const FARMERS_DATA = [
  {
    id: 'f1',
    name: 'Auntie Ama Owusu',
    farm: "Ama's Garden",
    region: 'Eastern Region (Koforidua)',
    distance: '85 km to Tema Hub',
    photo: '/golden-acres/farmers/auntie-ama.jpg',
    cert: 'GhanaGAP Certified',
    rating: 4.9,
    reviews: 212,
    methods: ['Hand-harvested at dawn', 'Crop rotation', 'Drip irrigation'],
    activeListings: ['Roma Tomatoes', 'Scotch Bonnet', 'Garden Eggs'],
    story: 'Farming red-earth soil outside Koforidua for over 30 years with traditional low-spray methods.',
  },
  {
    id: 'f2',
    name: 'Kwame Mensah',
    farm: 'Mensah Family Farm',
    region: 'Ashanti Region (Ejisu)',
    distance: '250 km to Tema Hub',
    photo: '/golden-acres/farmers/kwame-mensah.jpg',
    cert: 'Smallholder Verified',
    rating: 4.8,
    reviews: 148,
    methods: ['Shade-cured plantain', 'Hand-graded tubers', 'Manual weeding'],
    activeListings: ['Pona White Yam', 'Ripe Plantain', 'Cassava'],
    story: 'Specialising in roots and tubers, employing 8 full-time village youth with cold-chain dispatch.',
  },
  {
    id: 'f3',
    name: 'Esi Boateng',
    farm: 'Green Leaf Collective',
    region: 'Greater Accra (Prampram)',
    distance: '40 km to Tema Hub',
    photo: '/golden-acres/farmers/esi-boateng.jpg',
    cert: 'Certified Organic',
    rating: 4.8,
    reviews: 176,
    methods: ['Same-day harvest', 'Shade-net nurseries', 'Women-led collective'],
    activeListings: ['Crisphead Lettuce', 'Green Cabbage', 'Kontomire'],
    story: 'Leading a 12-woman collective delivering freshly picked leafy greens within 4 hours of harvest.',
  },
  {
    id: 'f4',
    name: 'Yaw Darko',
    farm: 'Darko Organics',
    region: 'Volta Region (Ho Hills)',
    distance: '170 km to Tema Hub',
    photo: '/golden-acres/farmers/yaw-darko.jpg',
    cert: 'Certified Organic',
    rating: 4.9,
    reviews: 121,
    methods: ['Neem pest control', 'On-site compost', 'Pick-every-other-day'],
    activeListings: ['Tender Okra', 'Aubergine', 'Green Chilli'],
    story: 'Organic pioneer in Volta hills supplying chemical-free vegetables to Accra and Kumasi.',
  },
  {
    id: 'f5',
    name: 'Adwoa Sarpong',
    farm: 'Sunrise Fields',
    region: 'Bono Region (Techiman)',
    distance: '340 km to Tema Hub',
    photo: '/golden-acres/farmers/adwoa-sarpong.jpg',
    cert: 'GhanaGAP Certified',
    rating: 4.7,
    reviews: 98,
    methods: ['Solar-powered storage', 'Furrow irrigation', 'Record-kept yields'],
    activeListings: ['Techiman Red Onions', 'Fresh Maize', 'Cowpeas'],
    story: 'Running a large family staple farm with solar-assisted drying and storage.',
  },
]

export default function MobileFarmersScreen() {
  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(220px,38vh,340px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative px-5 pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#211A12]">
            Farmer Collective
          </h1>
          <p className="text-[12px] font-bold text-[#5C5247]">
            100% fair trade direct smallholder network
          </p>
        </div>
        <Link
          href="/preview/home"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.10)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </header>

      {/* Farmers List */}
      <div className="relative mt-4 px-5 space-y-4">
        {FARMERS_DATA.map((farmer) => (
          <div
            key={farmer.id}
            className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
          >
            {/* Top Row: Photo + Name + Rating */}
            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs">
                <Image
                  src={farmer.photo}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] font-extrabold text-[#211A12]">
                    {farmer.name}
                  </h3>
                  <ShieldCheck className="h-4 w-4 text-[#0B3B25]" />
                </div>
                <p className="text-[12px] font-bold text-[#7A3F1C]">
                  {farmer.farm} · {farmer.region}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold text-[#5C5247]">
                  <span className="flex items-center gap-0.5 text-[#7A3F1C]">
                    <Star className="h-3 w-3 fill-[#7A3F1C]" /> {farmer.rating}
                  </span>
                  <span>·</span>
                  <span>{farmer.distance}</span>
                </div>
              </div>
            </div>

            {/* Farm Story */}
            <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#3D332A]">
              {farmer.story}
            </p>

            {/* Methods Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {farmer.methods.map((m, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-[#5C5247] border border-[rgba(33,26,18,0.06)]"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Active Produce Listings */}
            <div className="mt-3.5 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-3">
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#0B3B25]">
                <Leaf className="h-3.5 w-3.5" />
                <span>Listings: {farmer.activeListings.join(', ')}</span>
              </div>
              <Link
                href="/preview/home"
                className="text-[11px] font-extrabold text-[#7A3F1C] hover:underline"
              >
                Shop Farm →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <PreviewBottomNav active="home" />
    </div>
  )
}
