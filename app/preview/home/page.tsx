'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  ShoppingBag,
  Search,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import {
  MobileProduceCardRich,
  PackageBoxes3D,
  PreviewBottomNav,
} from '@/app/preview/_lib/premium'

const CATEGORIES = [
  { id: 'all', label: 'All Fresh' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'tubers', label: 'Tubers & Roots' },
  { id: 'spices', label: 'Spices & Herbs' },
  { id: 'grains', label: 'Grains & Legumes' },
]

const FEATURED_PRODUCE = [
  {
    id: 'p1',
    slug: 'roma-tomatoes',
    name: 'Roma Tomatoes',
    farmName: 'Darko Organics',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
    unit: '1 kg',
    price: 9.48,
    rating: 4.9,
    reviews: 121,
    organic: true,
    freshness: 'USE SOON',
    freshnessColor: '#E65100',
    offerCount: 6,
  },
  {
    id: 'p2',
    slug: 'crisphead-lettuce',
    name: 'Crisphead Lettuce',
    farmName: 'Green Leaf Collective',
    image: '/golden-acres/produce/crisphead-lettuce.png',
    unit: 'each',
    price: 9.44,
    rating: 4.9,
    reviews: 41,
    organic: true,
    freshness: 'JUST HARVESTED',
    freshnessColor: '#0B3B25',
    offerCount: 6,
  },
  {
    id: 'p3',
    slug: 'green-cabbage',
    name: 'Green Cabbage',
    farmName: 'Green Leaf Collective',
    image: '/golden-acres/produce/green-cabbage.png',
    unit: '1.2 kg',
    price: 8.40,
    rating: 4.8,
    reviews: 176,
    organic: true,
    freshness: 'JUST HARVESTED',
    freshnessColor: '#0B3B25',
    offerCount: 2,
  },
  {
    id: 'p4',
    slug: 'kontomire',
    name: 'Kontomire (Cocoyam Leaves)',
    farmName: 'Green Leaf Collective',
    image: '/golden-acres/produce/kontomire.png',
    unit: 'bunch',
    price: 6.00,
    rating: 4.8,
    reviews: 176,
    organic: true,
    freshness: 'FRESH',
    freshnessColor: '#F59E0B',
    offerCount: 3,
  },
  {
    id: 'p5',
    slug: 'fresh-maize',
    name: 'Fresh Maize (Corn)',
    farmName: 'Savannah Grains',
    image: '/golden-acres/produce/fresh-maize.png',
    unit: 'each',
    price: 2.65,
    rating: 4.9,
    reviews: 41,
    organic: false,
    freshness: 'USE SOON',
    freshnessColor: '#E65100',
    offerCount: 6,
  },
  {
    id: 'p6',
    slug: 'white-yam',
    name: 'Pona White Yam Tuber',
    farmName: 'Mensah Family Farm',
    image: '/golden-acres/produce/white-yam.png',
    unit: '3 kg tuber',
    price: 22.00,
    rating: 4.8,
    reviews: 148,
    organic: false,
    freshness: 'JUST HARVESTED',
    freshnessColor: '#0B3B25',
    offerCount: 4,
  },
]

const FEATURED_FARMERS = [
  {
    id: 'f1',
    name: 'Auntie Ama Owusu',
    farm: "Ama's Garden",
    location: 'Koforidua (85km to Hub)',
    photo: '/golden-acres/farmers/auntie-ama.jpg',
    specialty: 'Roma Tomatoes & Peppers',
    rating: 4.9,
  },
  {
    id: 'f2',
    name: 'Kwame Mensah',
    farm: 'Mensah Family Farm',
    location: 'Ejisu (250km to Hub)',
    photo: '/golden-acres/farmers/kwame-mensah.jpg',
    specialty: 'White Yam & Plantain',
    rating: 4.8,
  },
  {
    id: 'f3',
    name: 'Esi Boateng',
    farm: 'Green Leaf Collective',
    location: 'Prampram (40km to Hub)',
    photo: '/golden-acres/farmers/esi-boateng.jpg',
    specialty: 'Lettuce & Kontomire',
    rating: 4.8,
  },
]

export default function MobileHomeScreen() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(2)

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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(200px,36vh,320px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* 1. Header Bar: Location, Greeting & Action Badges */}
      <header className="relative px-[clamp(14px,2.4vw,20px)] pt-[clamp(8px,1.4vh,16px)] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[clamp(11px,1.4vh,12.5px)] font-bold text-[#5C5247]">
            Direct from Ghana's Farms
          </span>
          <div className="flex items-center gap-1.5 mt-0.5 cursor-pointer">
            <MapPin className="h-4 w-4 text-[#0B3B25] stroke-[2.5]" />
            <h1 className="text-[clamp(15px,2vh,18px)] font-extrabold tracking-tight text-[#211A12]">
              KNUST Campus, Kumasi
            </h1>
            <ChevronDown className="h-3.5 w-3.5 text-[#5C5247] stroke-[2.5]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/preview/cart"
            aria-label="Basket"
            className="relative flex h-[clamp(36px,4.5vh,42px)] w-[clamp(36px,4.5vh,42px)] items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0B3B25] px-1 text-[9px] font-black text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Search Bar */}
      <div className="relative mt-[clamp(10px,1.6vh,16px)] px-[clamp(14px,2.4vw,20px)]">
        <div className="flex h-[clamp(44px,5.5vh,50px)] w-full items-center rounded-full bg-white px-[clamp(12px,1.8vw,16px)] shadow-[0_2px_8px_rgba(33,26,18,0.04)] border border-[rgba(33,26,18,0.10)] transition-all focus-within:ring-2 focus-within:ring-[#7A3F1C]">
          <Search className="h-[clamp(16px,2.2vh,19px)] w-[clamp(16px,2.2vh,19px)] text-[#5C5247] stroke-[2.3] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm fresh produce, tubers, spices..."
            className="w-full bg-transparent pl-2.5 text-[clamp(13px,1.65vh,15px)] font-medium text-[#211A12] placeholder:text-[#7A6E61] outline-none"
          />
        </div>
      </div>

      {/* 3. Hero Promo Card: Fresh Harvest Cold-Chain Guarantee */}
      <div className="relative mt-[clamp(12px,1.8vh,18px)] px-[clamp(14px,2.4vw,20px)]">
        <div className="relative overflow-hidden rounded-[clamp(24px,3vh,30px)] bg-[#FAF9F6] p-[clamp(16px,2.2vh,22px)] shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-center justify-between">
            <div className="max-w-[62%]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#0B3B25]">
                <Sparkles className="h-3 w-3" /> Dawn Harvest
              </span>
              <h2 className="mt-1.5 text-[clamp(16px,2.2vh,20px)] font-extrabold tracking-tight text-[#211A12] leading-tight">
                Picked Today at Dawn. Delivered Cold.
              </h2>
              <p className="mt-1 text-[clamp(11.5px,1.45vh,13px)] font-semibold text-[#5C5247]">
                Zero warehouse middleman. 100% fair prices to Ghanaian farmers.
              </p>
              <Link
                href="/preview/categories"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0B3B25] px-4 py-1.5 text-[12px] font-extrabold text-white shadow-sm active:scale-95 transition-transform"
              >
                <span>Shop Today's Harvest</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="shrink-0 -mr-2">
              <PackageBoxes3D size={92} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Category Pills */}
      <div className="relative mt-[clamp(12px,1.8vh,18px)] flex gap-[clamp(6px,1vw,10px)] overflow-x-auto px-[clamp(14px,2.4vw,20px)] pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-[clamp(14px,2vw,18px)] py-[clamp(6px,0.9vh,9px)] text-[clamp(12px,1.55vh,14px)] font-bold tracking-tight transition-all',
                active
                  ? 'bg-[#211A12] text-[#F7F5F0] shadow-xs'
                  : 'bg-[#FAF9F6] text-[#3D332A] border border-[rgba(33,26,18,0.10)] shadow-2xs hover:bg-white'
              )}
            >
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* 5. Fresh Produce Grid with Web-Matched Rich Product Cards */}
      <div className="relative mt-[clamp(12px,1.8vh,18px)] px-[clamp(14px,2.4vw,20px)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[clamp(16px,2.2vh,19px)] font-extrabold tracking-tight text-[#211A12]">
              Today's Fresh Produce
            </h3>
            <p className="text-[clamp(11px,1.4vh,12.5px)] font-semibold text-[#5C5247]">
              Compare smallholder farm prices &amp; freshness
            </p>
          </div>
          <Link
            href="/preview/categories"
            className="text-[clamp(12px,1.5vh,13.5px)] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-2 gap-[clamp(10px,1.8vw,14px)]">
          {FEATURED_PRODUCE.map((prod) => (
            <MobileProduceCardRich
              key={prod.id}
              id={prod.id}
              slug={prod.slug}
              name={prod.name}
              farmName={prod.farmName}
              image={prod.image}
              price={prod.price}
              unit={prod.unit}
              rating={prod.rating}
              reviews={prod.reviews}
              organic={prod.organic}
              freshness={prod.freshness}
              freshnessColor={prod.freshnessColor}
              offerCount={prod.offerCount}
              onAddToCart={() => setCartCount((c) => c + 1)}
            />
          ))}
        </div>
      </div>

      {/* 6. Farmer Collective Spotlight */}
      <div className="relative mt-[clamp(16px,2.2vh,24px)] px-[clamp(14px,2.4vw,20px)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[clamp(16px,2.2vh,19px)] font-extrabold tracking-tight text-[#211A12]">
              Meet The Farmers
            </h3>
            <p className="text-[clamp(11px,1.4vh,12.5px)] font-semibold text-[#5C5247]">
              Transparent smallholder network
            </p>
          </div>
          <Link
            href="/preview/farmers"
            className="text-[clamp(12px,1.5vh,13.5px)] font-bold text-[#7A3F1C] hover:underline"
          >
            Explore
          </Link>
        </div>

        <div className="space-y-3">
          {FEATURED_FARMERS.map((farmer) => (
            <Link
              key={farmer.id}
              href="/preview/farmers"
              className="block active:scale-[0.985] transition-transform"
            >
              <div className="flex items-center gap-3.5 rounded-[clamp(20px,2.6vh,26px)] bg-[#FAF9F6] p-3.5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs border border-[rgba(33,26,18,0.10)]">
                  <Image
                    src={farmer.photo}
                    alt={farmer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[14px] font-extrabold text-[#211A12]">
                      {farmer.name}
                    </h4>
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0B3B25]" />
                  </div>
                  <p className="text-[12px] font-bold text-[#7A3F1C]">
                    {farmer.farm}
                  </p>
                  <p className="text-[11px] font-semibold text-[#5C5247] truncate">
                    {farmer.specialty} · {farmer.location}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#5C5247] shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <PreviewBottomNav active="home" cartCount={cartCount} />
    </div>
  )
}
