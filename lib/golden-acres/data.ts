// Golden Acres — mock dataset (Ghana). Realistic stand-in for the live
// catalog, farmers, orders and analytics until real integrations land.
import type {
  Farmer,
  Product,
  Bundle,
  Recipe,
  Order,
  LedgerEntry,
  CacClvPoint,
  SpoilageRow,
  DemandForecastPoint,
  KpiSummary,
  SeriesPoint,
  DeliverySlot,
  GeoPoint,
  GhanaRegion,
  SupportTicket,
} from './types'
import { generateOffers } from './catalog-gen'

export const regions: GhanaRegion[] = [
  'Greater Accra',
  'Eastern',
  'Ashanti',
  'Volta',
  'Central',
  'Bono',
  'Northern',
  'Upper East',
  'Upper West',
]

// Aggregation hub — all delivery distances are measured from here.
export const HUB = {
  name: 'Golden Acres Hub — Tema',
  location: { lat: 5.696, lng: -0.0166 } as GeoPoint,
}

// Pilot delivery geo-fence (Greater Accra metro areas we currently serve).
export const PILOT_AREAS = [
  'East Legon',
  'Cantonments',
  'Airport Residential',
  'Osu',
  'Labone',
  'Spintex',
  'Tema',
  'Adenta',
  'Madina',
  'Dansoman',
]

// Areas outside the Greater Accra pilot geo-fence (waitlist demand capture).
export const OUT_OF_ZONE_AREAS = [
  'Kumasi',
  'Takoradi',
  'Cape Coast',
  'Tamale',
  'Koforidua',
  'Sunyani',
  'Ho',
  'Techiman',
]

export const farmers: Farmer[] = [
  {
    id: 'f1',
    slug: 'auntie-ama',
    name: 'Auntie Ama Owusu',
    farmName: "Ama's Garden",
    photo: '/golden-acres/farmers/auntie-ama.jpg',
    bio: 'Third-generation vegetable grower famous for the sweetest Roma tomatoes in the Eastern Region.',
    story:
      "Auntie Ama has farmed the same red-earth plot outside Koforidua for over thirty years, a craft passed down from her grandmother. She still hand-picks every tomato at dawn so it reaches the hub before the heat of the day. \u201cA tomato remembers how it was treated,\u201d she likes to say. Her beds are rotated with legumes each season to keep the soil alive without heavy chemicals.",
    methods: ['Hand-harvested at dawn', 'Crop rotation', 'Drip irrigation', 'Low-spray'],
    certifications: ['GhanaGAP Certified'],
    region: 'Eastern',
    town: 'Koforidua',
    pickupGPS: 'EN-052-8841',
    location: { lat: 6.094, lng: -0.2597 },
    farmToHubRadiusKm: 85,
    rating: 4.9,
    reviewCount: 212,
    joinedYear: 2021,
    onTimeRate: 0.97,
  },
  {
    id: 'f2',
    slug: 'kwame-mensah',
    name: 'Kwame Mensah',
    farmName: 'Mensah Family Farm',
    photo: '/golden-acres/farmers/kwame-mensah.jpg',
    bio: 'Roots-and-tubers specialist growing yam, plantain and cassava on family land in Ejisu.',
    story:
      'Kwame left a logistics job in Kumasi to take over his family\u2019s farm in Ejisu, bringing a planner\u2019s discipline to the harvest calendar. He grades every yam tuber by hand and cures plantain in shade so it ripens evenly on the journey to Accra. His farm employs eight people from his village year-round.',
    methods: ['Shade-cured plantain', 'Hand-graded tubers', 'Manual weeding'],
    certifications: [],
    region: 'Ashanti',
    town: 'Ejisu',
    pickupGPS: 'AK-389-1120',
    location: { lat: 6.711, lng: -1.466 },
    farmToHubRadiusKm: 250,
    rating: 4.7,
    reviewCount: 148,
    joinedYear: 2022,
    onTimeRate: 0.94,
  },
  {
    id: 'f3',
    slug: 'esi-boateng',
    name: 'Esi Boateng',
    farmName: 'Green Leaf Collective',
    photo: '/golden-acres/farmers/esi-boateng.jpg',
    bio: 'Young agronomist leading a women-run collective growing crisp leafy greens near Prampram.',
    story:
      'Esi studied agronomy at Legon and returned home to organise twelve women growers into the Green Leaf Collective. They specialise in the most fragile, fast-spoiling greens \u2014 lettuce, cabbage and kontomire \u2014 which is exactly why cold-chain delivery matters so much to them. Harvest happens the same morning your order is packed.',
    methods: ['Same-day harvest', 'Shade-net nurseries', 'Women-led collective'],
    certifications: ['Certified Organic'],
    region: 'Greater Accra',
    town: 'Prampram',
    pickupGPS: 'GA-447-2098',
    location: { lat: 5.715, lng: 0.099 },
    farmToHubRadiusKm: 40,
    rating: 4.8,
    reviewCount: 176,
    joinedYear: 2023,
    onTimeRate: 0.98,
  },
  {
    id: 'f4',
    slug: 'yaw-darko',
    name: 'Yaw Darko',
    farmName: 'Darko Organics',
    photo: '/golden-acres/farmers/yaw-darko.jpg',
    bio: 'Certified-organic grower of okra, aubergine and chillies in the lush Volta hills.',
    story:
      'Yaw converted his family plots near Ho to full organic certification in 2020, betting that Accra\u2019s kitchens would pay for produce grown without synthetic chemicals. He composts on-site and uses neem as his only pest control. His okra is picked young and tender every other day.',
    methods: ['Fully organic', 'On-site compost', 'Neem pest control', 'Pick-every-other-day'],
    certifications: ['Certified Organic', 'GhanaGAP Certified'],
    region: 'Volta',
    town: 'Ho',
    pickupGPS: 'VH-110-7765',
    location: { lat: 6.611, lng: 0.471 },
    farmToHubRadiusKm: 170,
    rating: 4.9,
    reviewCount: 121,
    joinedYear: 2022,
    onTimeRate: 0.95,
  },
  {
    id: 'f5',
    slug: 'adwoa-sarpong',
    name: 'Adwoa Sarpong',
    farmName: 'Sunrise Fields',
    photo: '/golden-acres/farmers/adwoa-sarpong.jpg',
    bio: 'Large-acreage grower of onions, maize and beans in the breadbasket town of Techiman.',
    story:
      'Adwoa runs one of the larger family operations in Bono, supplying staples that store well and travel far. She invested in solar-powered storage so her onions and beans reach market without waste. She mentors younger farmers on record-keeping and fair pricing.',
    methods: ['Solar-powered storage', 'Furrow irrigation', 'Record-kept yields'],
    certifications: ['GhanaGAP Certified'],
    region: 'Bono',
    town: 'Techiman',
    pickupGPS: 'BT-901-4432',
    location: { lat: 7.583, lng: -1.938 },
    farmToHubRadiusKm: 340,
    rating: 4.6,
    reviewCount: 98,
    joinedYear: 2023,
    onTimeRate: 0.92,
  },
  {
    id: 'f6',
    slug: 'kojo-asante',
    name: 'Kojo Asante',
    farmName: 'Asante Riverside',
    photo: '/golden-acres/farmers/kojo-asante.jpg',
    bio: 'Fruit and herb grower along the Central Region coast — pineapple, watermelon and ginger.',
    story:
      'Kojo\u2019s riverside farm near Winneba catches the coastal breeze that makes his pineapples extra sweet. He harvests fruit at peak ripeness rather than for shipping durability \u2014 possible only because Golden Acres gets it to your door within a day. His ginger and lemongrass are local-chef favourites.',
    methods: ['Peak-ripeness harvest', 'River-fed irrigation', 'Agroforestry borders'],
    certifications: [],
    region: 'Central',
    town: 'Winneba',
    pickupGPS: 'CW-228-5567',
    location: { lat: 5.351, lng: -0.623 },
    farmToHubRadiusKm: 70,
    rating: 4.8,
    reviewCount: 134,
    joinedYear: 2021,
    onTimeRate: 0.96,
  },
  {
    id: 'f7',
    slug: 'mahama-sulemana',
    name: 'Mahama Sulemana',
    farmName: 'Savannah Grains',
    photo: '/golden-acres/farmers/mahama-sulemana.jpg',
    bio: 'Elder cereal farmer cultivating rice, sorghum and millet on the Tamale plains for over fifty years.',
    story:
      "Old Mahama has read the northern skies for half a century, planting with the first rains and harvesting his rice and sorghum by hand the way his father taught him. \u201cThe land is patient, so a farmer must be patient too,\u201d he says. He is one of the most respected elders in his community and is now onboarding with Golden Acres to bring savannah grains to southern kitchens \u2014 his first listings arrive next harvest.",
    methods: ['Rain-fed cultivation', 'Hand-harvested', 'Traditional seed-saving', 'Sun-dried grain'],
    certifications: [],
    region: 'Northern',
    town: 'Tamale',
    pickupGPS: 'NT-204-6610',
    location: { lat: 9.4008, lng: -0.8393 },
    farmToHubRadiusKm: 620,
    rating: 4.9,
    reviewCount: 41,
    joinedYear: 2025,
    onTimeRate: 0.93,
  },
  {
    id: 'f8',
    slug: 'hawa-azumah',
    name: 'Hawa Azumah',
    farmName: 'Bolga Women\u2019s Collective',
    photo: '/golden-acres/farmers/hawa-azumah.jpg',
    bio: 'Matriarch leading an Upper East women\u2019s group growing groundnuts, bambara beans and shea.',
    story:
      'Hawa leads a forty-woman collective outside Bolgatanga that has pooled land and labour for three decades. They grow drought-hardy groundnuts and bambara beans and gather shea nuts from the wild parkland, processing butter the slow traditional way. Joining Golden Acres means a fairer price reaches the women who actually grow the food \u2014 their staples list opens this season.',
    methods: ['Women-led collective', 'Drought-hardy varieties', 'Wild-gathered shea', 'Hand-processed'],
    certifications: ['Fair-Trade Group'],
    region: 'Upper East',
    town: 'Bolgatanga',
    pickupGPS: 'UB-118-3390',
    location: { lat: 10.7856, lng: -0.8514 },
    farmToHubRadiusKm: 760,
    rating: 4.8,
    reviewCount: 33,
    joinedYear: 2025,
    onTimeRate: 0.91,
  },
  {
    id: 'f9',
    slug: 'fati-abukari',
    name: 'Fati Abukari',
    farmName: 'Sissala Garden',
    photo: '/golden-acres/farmers/fati-abukari.jpg',
    bio: 'Smallholder vegetable grower who cycles her dawn harvest to the Wa collection point each morning.',
    story:
      'Fati works a tidy irrigated plot in the Sissala district, growing tomatoes, pepper and leafy greens through the dry season. Every morning she loads her harvest onto her bicycle and rides the red-earth road to the collection point before the sun gets high. \u201cFresh means today, not yesterday,\u201d she insists. She is finalising her first listings with Golden Acres now.',
    methods: ['Dry-season irrigation', 'Dawn harvest', 'Low-spray', 'Same-day collection'],
    certifications: [],
    region: 'Upper West',
    town: 'Wa',
    pickupGPS: 'XW-330-7741',
    location: { lat: 10.0607, lng: -2.5019 },
    farmToHubRadiusKm: 680,
    rating: 4.7,
    reviewCount: 19,
    joinedYear: 2025,
    onTimeRate: 0.9,
  },
  {
    id: 'f10',
    slug: 'adzaho-brothers',
    name: 'Selorm & Edem Adzaho',
    farmName: 'Adzaho Brothers Rice',
    photo: '/golden-acres/farmers/adzaho-brothers.jpg',
    bio: 'Two brothers running an irrigated rice paddy in the Volta lowlands, harvested by sickle at peak ripeness.',
    story:
      'Selorm and Edem inherited their paddy near Weta and run it as a tight two-man operation, cutting the rice by sickle exactly when the heads turn gold. They mill in small batches so the rice reaches you fragrant and fresh rather than sitting in a warehouse. The brothers are joining Golden Acres to sell their aromatic local rice directly \u2014 listings coming this milling season.',
    methods: ['Irrigated paddy', 'Sickle-harvested at peak', 'Small-batch milling', 'No bleaching'],
    certifications: [],
    region: 'Volta',
    town: 'Weta',
    pickupGPS: 'VW-512-2208',
    location: { lat: 6.1667, lng: 0.95 },
    farmToHubRadiusKm: 210,
    rating: 4.8,
    reviewCount: 27,
    joinedYear: 2025,
    onTimeRate: 0.92,
  },
]

// Helper to build expiry dates relative to "today" so FEFO stays meaningful.
const today = new Date()
function inDays(n: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

// Hand-authored anchor listings — each canonical product's flagship offer.
const baseProducts: Product[] = [
  {
    id: 'p1', slug: 'roma-tomatoes', name: 'Roma Tomatoes', category: 'Vegetables',
    farmerId: 'f1', image: '/golden-acres/produce/roma-tomatoes.png', unit: 'kg',
    variableWeight: true, estWeightKg: 1, pricePerKg: 12, priceMin: 10.8, priceMax: 13.2,
    refrigerationRequired: true, shelfLifeDays: 6, expiryDate: inDays(6), stockKg: 120,
    lowStockThreshold: 20, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Bestseller', 'Cold-chain'], description: 'Firm, sweet Roma tomatoes, hand-picked at dawn — ideal for stews and shito.',
  },
  {
    id: 'p2', slug: 'scotch-bonnet', name: 'Scotch Bonnet Peppers', category: 'Herbs & Spices',
    farmerId: 'f1', image: '/golden-acres/produce/scotch-bonnet.png', unit: 'kg',
    variableWeight: true, estWeightKg: 0.5, pricePerKg: 28, priceMin: 12.6, priceMax: 15.4,
    refrigerationRequired: true, shelfLifeDays: 8, expiryDate: inDays(8), stockKg: 40,
    lowStockThreshold: 8, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Hot'], description: 'Blazing-hot, fragrant scotch bonnets — the soul of Ghanaian cooking.',
  },
  {
    id: 'p3', slug: 'garden-eggs', name: 'Garden Eggs', category: 'Vegetables',
    farmerId: 'f1', image: '/golden-acres/produce/garden-eggs.png', unit: 'kg',
    variableWeight: true, estWeightKg: 1, pricePerKg: 9, priceMin: 8.1, priceMax: 9.9,
    refrigerationRequired: true, shelfLifeDays: 7, expiryDate: inDays(7), stockKg: 18,
    lowStockThreshold: 20, status: 'low', organic: false, season: 'Year-round',
    tags: ['Low stock'], description: 'Tender white garden eggs, perfect for abomu and stews.',
  },
  {
    id: 'p4', slug: 'ripe-plantain', name: 'Ripe Plantain', category: 'Fruits',
    farmerId: 'f2', image: '/golden-acres/produce/ripe-plantain.png', unit: 'bunch',
    variableWeight: false, estWeightKg: 2.5, pricePerKg: 0, priceMin: 18, priceMax: 18,
    refrigerationRequired: false, shelfLifeDays: 7, expiryDate: inDays(7), stockKg: 60,
    lowStockThreshold: 10, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Bestseller'], description: 'Shade-cured plantain, ripening evenly — for kelewele and red-red.',
  },
  {
    id: 'p5', slug: 'white-yam', name: 'White Yam Tuber', category: 'Roots & Tubers',
    farmerId: 'f2', image: '/golden-acres/produce/white-yam.png', unit: 'each',
    variableWeight: true, estWeightKg: 2.5, pricePerKg: 8, priceMin: 18, priceMax: 22,
    refrigerationRequired: false, shelfLifeDays: 21, expiryDate: inDays(21), stockKg: 200,
    lowStockThreshold: 25, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Stores well'], description: 'Hand-graded puna yam tubers — fluffy when boiled or pounded.',
  },
  {
    id: 'p6', slug: 'cassava', name: 'Cassava', category: 'Roots & Tubers',
    farmerId: 'f2', image: '/golden-acres/produce/cassava.png', unit: 'kg',
    variableWeight: true, estWeightKg: 1, pricePerKg: 6, priceMin: 5.4, priceMax: 6.6,
    refrigerationRequired: false, shelfLifeDays: 5, expiryDate: inDays(5), stockKg: 90,
    lowStockThreshold: 15, status: 'in-stock', organic: false, season: 'Year-round',
    tags: [], description: 'Freshly dug cassava for fufu, banku and gari.',
  },
  {
    id: 'p7', slug: 'crisphead-lettuce', name: 'Crisphead Lettuce', category: 'Leafy Greens',
    farmerId: 'f3', image: '/golden-acres/produce/crisphead-lettuce.png', unit: 'each',
    variableWeight: false, estWeightKg: 0.4, pricePerKg: 0, priceMin: 10, priceMax: 10,
    refrigerationRequired: true, shelfLifeDays: 5, expiryDate: inDays(5), stockKg: 50,
    lowStockThreshold: 10, status: 'in-stock', organic: true, season: 'Year-round',
    tags: ['Organic', 'Cold-chain'], description: 'Crisp, same-day-harvested lettuce heads from the women-led collective.',
  },
  {
    id: 'p8', slug: 'green-cabbage', name: 'Green Cabbage', category: 'Leafy Greens',
    farmerId: 'f3', image: '/golden-acres/produce/green-cabbage.png', unit: 'each',
    variableWeight: true, estWeightKg: 1.2, pricePerKg: 7, priceMin: 7.6, priceMax: 9.2,
    refrigerationRequired: true, shelfLifeDays: 10, expiryDate: inDays(10), stockKg: 70,
    lowStockThreshold: 12, status: 'in-stock', organic: true, season: 'Year-round',
    tags: ['Organic'], description: 'Dense, sweet cabbage heads — great raw, steamed or in jollof slaw.',
  },
  {
    id: 'p9', slug: 'kontomire', name: 'Kontomire (Cocoyam Leaves)', category: 'Leafy Greens',
    farmerId: 'f3', image: '/golden-acres/produce/kontomire.png', unit: 'bunch',
    variableWeight: false, estWeightKg: 0.5, pricePerKg: 0, priceMin: 6, priceMax: 6,
    refrigerationRequired: true, shelfLifeDays: 3, expiryDate: inDays(3), stockKg: 30,
    lowStockThreshold: 8, status: 'in-stock', organic: true, season: 'Year-round',
    tags: ['Organic', 'Very perishable'], description: 'Tender cocoyam leaves for palava sauce — harvested the morning we pack it.',
  },
  {
    id: 'p10', slug: 'okra', name: 'Okra', category: 'Vegetables',
    farmerId: 'f4', image: '/golden-acres/produce/okra.png', unit: 'kg',
    variableWeight: true, estWeightKg: 0.5, pricePerKg: 14, priceMin: 6.3, priceMax: 7.7,
    refrigerationRequired: true, shelfLifeDays: 5, expiryDate: inDays(4), stockKg: 35,
    lowStockThreshold: 8, status: 'in-stock', organic: true, season: 'Year-round',
    tags: ['Organic'], description: 'Young, tender okra picked every other day — for okro stew and soups.',
  },
  {
    id: 'p11', slug: 'aubergine', name: 'Aubergine', category: 'Vegetables',
    farmerId: 'f4', image: '/golden-acres/produce/aubergine.png', unit: 'kg',
    variableWeight: true, estWeightKg: 1, pricePerKg: 11, priceMin: 9.9, priceMax: 12.1,
    refrigerationRequired: true, shelfLifeDays: 7, expiryDate: inDays(7), stockKg: 28,
    lowStockThreshold: 10, status: 'in-stock', organic: true, season: 'Year-round',
    tags: ['Organic'], description: 'Glossy purple aubergines, organically grown in the Volta hills.',
  },
  {
    id: 'p12', slug: 'green-chilli', name: 'Green Chilli', category: 'Herbs & Spices',
    farmerId: 'f4', image: '/golden-acres/produce/green-chilli.png', unit: 'kg',
    variableWeight: true, estWeightKg: 0.3, pricePerKg: 24, priceMin: 6.5, priceMax: 7.9,
    refrigerationRequired: true, shelfLifeDays: 6, expiryDate: inDays(6), stockKg: 0,
    lowStockThreshold: 6, status: 'delisted', organic: true, season: 'Year-round',
    tags: ['Organic', 'Out of stock'], description: 'Fresh green chillies with a clean, bright heat.',
  },
  {
    id: 'p13', slug: 'red-onions', name: 'Red Onions', category: 'Vegetables',
    farmerId: 'f5', image: '/golden-acres/produce/red-onions.png', unit: 'kg',
    variableWeight: true, estWeightKg: 1, pricePerKg: 10, priceMin: 9, priceMax: 11,
    refrigerationRequired: false, shelfLifeDays: 30, expiryDate: inDays(30), stockKg: 300,
    lowStockThreshold: 40, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Stores well'], description: 'Pungent red onions from Techiman — the base of every Ghanaian pot.',
  },
  {
    id: 'p14', slug: 'fresh-maize', name: 'Fresh Maize (Corn)', category: 'Grains & Legumes',
    farmerId: 'f5', image: '/golden-acres/produce/fresh-maize.png', unit: 'each',
    variableWeight: false, estWeightKg: 0.4, pricePerKg: 0, priceMin: 3, priceMax: 3,
    refrigerationRequired: true, shelfLifeDays: 4, expiryDate: inDays(4), stockKg: 120,
    lowStockThreshold: 20, status: 'in-stock', organic: false, season: 'Jun – Sep',
    tags: ['Seasonal'], description: 'Sweet, milky maize cobs — roast them or boil for a snack.',
  },
  {
    id: 'p15', slug: 'cowpeas', name: 'Cowpeas (Beans)', category: 'Grains & Legumes',
    farmerId: 'f5', image: '/golden-acres/produce/cowpeas.png', unit: 'kg',
    variableWeight: false, estWeightKg: 1, pricePerKg: 16, priceMin: 16, priceMax: 16,
    refrigerationRequired: false, shelfLifeDays: 180, expiryDate: inDays(180), stockKg: 220,
    lowStockThreshold: 30, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Stores well', 'Protein'], description: 'Dried cowpeas for red-red, waakye and gari-and-beans.',
  },
  {
    id: 'p16', slug: 'sweet-pineapple', name: 'Sweet Pineapple', category: 'Fruits',
    farmerId: 'f6', image: '/golden-acres/produce/sweet-pineapple.png', unit: 'each',
    variableWeight: true, estWeightKg: 1.5, pricePerKg: 9, priceMin: 12, priceMax: 15,
    refrigerationRequired: false, shelfLifeDays: 7, expiryDate: inDays(7), stockKg: 80,
    lowStockThreshold: 12, status: 'in-stock', organic: false, season: 'Year-round',
    tags: ['Bestseller'], description: 'Coastal-grown sugarloaf pineapple, harvested at peak ripeness.',
  },
  {
    id: 'p17', slug: 'watermelon', name: 'Watermelon', category: 'Fruits',
    farmerId: 'f6', image: '/golden-acres/produce/watermelon.png', unit: 'each',
    variableWeight: true, estWeightKg: 4, pricePerKg: 5, priceMin: 18, priceMax: 24,
    refrigerationRequired: false, shelfLifeDays: 12, expiryDate: inDays(12), stockKg: 60,
    lowStockThreshold: 10, status: 'in-stock', organic: false, season: 'Year-round',
    tags: [], description: 'Juicy, deep-red watermelons — sweetened by the coastal breeze.',
  },
  {
    id: 'p18', slug: 'fresh-ginger', name: 'Fresh Ginger', category: 'Herbs & Spices',
    farmerId: 'f6', image: '/golden-acres/produce/fresh-ginger.png', unit: 'kg',
    variableWeight: true, estWeightKg: 0.3, pricePerKg: 22, priceMin: 5.9, priceMax: 7.3,
    refrigerationRequired: false, shelfLifeDays: 21, expiryDate: inDays(21), stockKg: 45,
    lowStockThreshold: 8, status: 'in-stock', organic: false, season: 'Year-round',
    tags: [], description: 'Knobbly, aromatic ginger root for teas, marinades and shito.',
  },
]

// Full catalog = hand-authored anchors + deterministically generated farmer
// offers (the same product sold by several farmers competing on price/freshness).
// ~45 canonical items × multiple sellers ≈ 200+ live listings.
export const products: Product[] = [...baseProducts, ...generateOffers()]

export const bundles: Bundle[] = [
  {
    id: 'b1', slug: 'weekly-staples', name: 'Weekly Staples Box',
    description: 'The everyday essentials a Ghanaian kitchen runs on — tomatoes, onions, pepper, plantain and yam — restocked every week.',
    image: '/golden-acres/bundle-box.png', type: 'staples',
    items: [
      { productId: 'p1', qty: 2 }, { productId: 'p13', qty: 1 },
      { productId: 'p2', qty: 1 }, { productId: 'p4', qty: 1 }, { productId: 'p5', qty: 1 },
    ],
    price: 95, frequency: 'weekly', serves: 'Feeds 3–4', popular: true,
  },
  {
    id: 'b2', slug: 'jollof-night', name: 'Jollof Night Recipe Kit',
    description: 'Everything for a perfect pot of jollof — measured produce plus a recipe card. Just add rice and protein.',
    image: '/golden-acres/produce/roma-tomatoes.png', type: 'recipe-kit',
    items: [
      { productId: 'p1', qty: 3 }, { productId: 'p13', qty: 1 },
      { productId: 'p2', qty: 1 }, { productId: 'p18', qty: 1 },
    ],
    price: 68, frequency: 'one-time', serves: 'Feeds 4–6',
  },
  {
    id: 'b3', slug: 'organic-greens', name: 'Organic Greens Box',
    description: 'A weekly haul of certified-organic leafy greens and vegetables from our Volta and Prampram growers.',
    image: '/golden-acres/produce/green-cabbage.png', type: 'organic',
    items: [
      { productId: 'p7', qty: 2 }, { productId: 'p8', qty: 1 },
      { productId: 'p9', qty: 1 }, { productId: 'p10', qty: 1 }, { productId: 'p11', qty: 1 },
    ],
    price: 82, frequency: 'weekly', serves: 'Feeds 2–3',
  },
  {
    id: 'b4', slug: 'fruit-basket', name: 'Coastal Fruit Basket',
    description: 'Sweet pineapple, watermelon and seasonal fruit from the Central coast — a refreshing weekly treat.',
    image: '/golden-acres/produce/sweet-pineapple.png', type: 'seasonal',
    items: [
      { productId: 'p16', qty: 2 }, { productId: 'p17', qty: 1 },
    ],
    price: 58, frequency: 'biweekly', serves: 'Feeds 4–5',
  },
  {
    id: 'b5', slug: 'red-red-kit', name: 'Red-Red Recipe Kit',
    description: 'Cowpeas, ripe plantain, onions and pepper for the ultimate red-red — with a recipe card from Auntie Ama.',
    image: '/golden-acres/produce/ripe-plantain.png', type: 'recipe-kit',
    items: [
      { productId: 'p15', qty: 1 }, { productId: 'p4', qty: 1 },
      { productId: 'p13', qty: 1 }, { productId: 'p2', qty: 1 },
    ],
    price: 54, frequency: 'one-time', serves: 'Feeds 4',
  },
]

export const recipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Classic Ghana Jollof',
    image: '/golden-acres/recipes/ghana-jollof.png',
    time: '45 min',
    productIds: ['p1', 'p13', 'p2'],
    category: 'Rice & grains',
    serves: 'Serves 4',
    difficulty: 'Medium',
    description:
      'The crown jewel of any Ghanaian gathering — smoky, long-grain rice simmered in a rich tomato, onion and pepper base until every grain is deeply flavoured.',
    ingredients: [
      { productId: 'p1', qty: 1, note: 'blended ripe' },
      { productId: 'p13', qty: 1, note: 'one for blending, one sliced' },
      { productId: 'p2', qty: 1, note: 'to taste — start with half' },
    ],
    steps: [
      'Blend the tomatoes, half the onions and the scotch bonnet into a smooth pepper base.',
      'Heat oil and fry the sliced onions until golden, then stir in tomato paste and cook for 2–3 minutes.',
      'Pour in the blended base and fry on medium heat until the oil rises and the raw smell is gone (about 12–15 min).',
      'Add stock, seasoning and your washed rice, stir once, then cover tightly and cook on low until the rice is tender.',
      'Let it sit off the heat for 5 minutes, then fluff gently and serve hot.',
    ],
    tip: 'For that signature party-jollof smokiness, let the bottom catch very lightly before the final steam.',
  },
  {
    id: 'r2',
    name: 'Red-Red with Fried Plantain',
    image: '/golden-acres/recipes/red-red.png',
    time: '40 min',
    productIds: ['p15', 'p4', 'p13'],
    category: 'Stews & soups',
    serves: 'Serves 3–4',
    difficulty: 'Easy',
    description:
      'A beloved black-eyed pea stew cooked in red palm oil, served with sweet, caramelised fried plantain. Hearty, naturally plant-based comfort food.',
    ingredients: [
      { productId: 'p15', qty: 2, note: 'soaked overnight' },
      { productId: 'p4', qty: 2, note: 'very ripe, for frying' },
      { productId: 'p13', qty: 1, note: 'diced' },
    ],
    steps: [
      'Boil the soaked cowpeas until soft but not mushy, then drain and set aside.',
      'Fry diced onions in palm oil until soft, add blended pepper and tomato, and simmer into a thick sauce.',
      'Fold the beans into the sauce, season, and let everything simmer together for 10 minutes.',
      'Meanwhile, slice the ripe plantain and fry in hot oil until golden on both sides.',
      'Serve the red-red hot alongside the fried plantain.',
    ],
    tip: 'The riper the plantain, the sweeter the contrast against the savoury beans.',
  },
  {
    id: 'r3',
    name: 'Kontomire Palava Sauce',
    image: '/golden-acres/recipes/kontomire-palava.png',
    time: '35 min',
    productIds: ['p9', 'p3', 'p2'],
    category: 'Stews & soups',
    serves: 'Serves 4',
    difficulty: 'Medium',
    description:
      'Cocoyam leaves stewed with melon seeds, garden eggs and palm oil into a deep, earthy green sauce — a classic of Ghanaian home cooking.',
    ingredients: [
      { productId: 'p9', qty: 2, note: 'washed and shredded' },
      { productId: 'p3', qty: 1, note: 'boiled and mashed' },
      { productId: 'p2', qty: 1, note: 'to taste' },
    ],
    steps: [
      'Boil and shred the kontomire leaves, then squeeze out excess water.',
      'Boil the garden eggs until soft and mash them into a rough paste.',
      'Fry onions in palm oil, add blended pepper, and cook down for a few minutes.',
      'Stir in ground melon seeds (agushie) if using, the mashed garden eggs and the kontomire.',
      'Simmer for 10–12 minutes until thick, then serve with yam, rice or kenkey.',
    ],
    tip: 'Squeeze the boiled leaves well — too much water and the sauce turns thin.',
  },
  {
    id: 'r4',
    name: 'Garden Egg Stew',
    image: '/golden-acres/recipes/garden-egg-stew.png',
    time: '30 min',
    productIds: ['p3', 'p1', 'p13'],
    category: 'Stews & soups',
    serves: 'Serves 3',
    difficulty: 'Easy',
    description:
      'A quick, rustic stew of boiled garden eggs mashed into a fragrant tomato-onion base — simple, satisfying and ready in half an hour.',
    ingredients: [
      { productId: 'p3', qty: 2, note: 'boiled until soft' },
      { productId: 'p1', qty: 1, note: 'blended' },
      { productId: 'p13', qty: 1, note: 'sliced' },
    ],
    steps: [
      'Boil the garden eggs until tender, then peel and mash roughly.',
      'Fry sliced onions in oil until soft, then add the blended tomatoes.',
      'Cook the tomato base down until thick and the oil separates.',
      'Stir in the mashed garden eggs, season to taste, and simmer for 8 minutes.',
      'Serve hot with boiled yam, plantain or rice.',
    ],
    tip: 'A handful of smoked fish stirred in at the end lifts the whole dish.',
  },
  {
    id: 'r5',
    name: 'Spicy Grilled Corn',
    image: '/golden-acres/recipes/grilled-corn.png',
    time: '20 min',
    productIds: ['p14', 'p2', 'p18'],
    category: 'Street food',
    serves: 'Serves 2',
    difficulty: 'Easy',
    description:
      'Roadside-style charred maize brushed with a smoky pepper-ginger glaze — the taste of a Ghanaian evening by the grill.',
    ingredients: [
      { productId: 'p14', qty: 2, note: 'husked' },
      { productId: 'p2', qty: 1, note: 'finely ground' },
      { productId: 'p18', qty: 1, note: 'grated, for the glaze' },
    ],
    steps: [
      'Husk the maize and pat dry.',
      'Mix ground scotch bonnet, grated ginger, a little oil and salt into a glaze.',
      'Grill the corn over medium coals, turning often, until charred in spots.',
      'Brush generously with the glaze in the last few minutes of grilling.',
      'Serve hot, traditionally with a wedge of coconut.',
    ],
    tip: 'No grill? A dry cast-iron pan over high heat gives a great char too.',
  },
  {
    id: 'r6',
    name: 'Pineapple Ginger Cooler',
    image: '/golden-acres/recipes/pineapple-ginger.png',
    time: '15 min',
    productIds: ['p16', 'p18'],
    category: 'Sides & snacks',
    serves: 'Makes 1.5L',
    difficulty: 'Easy',
    description:
      'A bright, zingy blend of fresh pineapple and ginger — refreshing, naturally sweet and a Ghanaian party favourite.',
    ingredients: [
      { productId: 'p16', qty: 1, note: 'ripe, peeled and chopped' },
      { productId: 'p18', qty: 1, note: 'peeled' },
    ],
    steps: [
      'Blend the pineapple and ginger with a little water until smooth.',
      'Strain through a fine sieve into a jug.',
      'Sweeten to taste and top up with cold water to 1.5 litres.',
      'Chill thoroughly and serve over ice.',
    ],
    tip: 'Use the pineapple core too — it holds a lot of sweetness.',
  },
]

// ---- Delivery slots (next 6 days) ----
export const deliverySlots: DeliverySlot[] = [
  { id: 's1', date: inDays(1), window: '08:00 – 11:00', capacityRemaining: 6 },
  { id: 's2', date: inDays(1), window: '14:00 – 17:00', capacityRemaining: 0 },
  { id: 's3', date: inDays(2), window: '08:00 – 11:00', capacityRemaining: 9 },
  { id: 's4', date: inDays(2), window: '14:00 – 17:00', capacityRemaining: 4 },
  { id: 's5', date: inDays(3), window: '08:00 – 11:00', capacityRemaining: 12 },
  { id: 's6', date: inDays(3), window: '14:00 – 17:00', capacityRemaining: 7 },
]

// ---- Orders (CS / ops surface) ----
export const orders: Order[] = [
  {
    id: 'o1', reference: 'GA-24817', customerName: 'Nana Adjei', customerPhone: '+233 24 555 0142',
    status: 'out-for-delivery', placedAt: inDays(0) + 'T06:40:00',
    payment: { method: 'momo-mtn', status: 'paid' },
    address: { ghanaPostGPS: 'GA-183-4250', area: 'East Legon', region: 'Greater Accra', lat: 5.636, lng: -0.166 },
    slot: { date: inDays(0), window: '14:00 – 17:00' },
    items: [
      { productId: 'p1', name: 'Roma Tomatoes', farmerId: 'f1', qty: 2, unit: 'kg', estWeightKg: 2, finalWeightKg: 2.1, priceEstimate: 24, priceFinal: 25.2, refrigerationRequired: true },
      { productId: 'p4', name: 'Ripe Plantain', farmerId: 'f2', qty: 1, unit: 'bunch', estWeightKg: 2.5, priceEstimate: 18, priceFinal: 18, refrigerationRequired: false },
    ],
    subtotalEstimate: 42, subtotalFinal: 43.2, deliveryFee: 15, total: 58.2,
    threePL: {
      trackingNumber: 'SWFT-7781294', driverId: 'D-204', driverName: 'Ibrahim Salifu', vehicle: 'Refrigerated van · GR 4821-22',
      refrigeration: true, status: 'out-for-delivery',
      events: [
        { ts: inDays(0) + 'T06:45:00', status: 'placed', note: 'Order confirmed and paid (MoMo).' },
        { ts: inDays(0) + 'T07:30:00', status: 'picking', note: 'Picking at Tema hub (FEFO).' },
        { ts: inDays(0) + 'T09:10:00', status: 'packed', note: 'Packed with ice packs (cold-chain).' },
        { ts: inDays(0) + 'T10:05:00', status: 'tracking-assigned', note: 'Assigned to driver Ibrahim Salifu.' },
        { ts: inDays(0) + 'T13:20:00', status: 'out-for-delivery', note: 'Out for delivery — 3 stops ahead.', location: 'Spintex Rd' },
      ],
    },
    fault: 'None', refunds: [],
  },
  {
    id: 'o2', reference: 'GA-24816', customerName: 'Akosua Frimpong', customerPhone: '+233 20 555 0199',
    status: 'delivered', placedAt: inDays(-1) + 'T08:10:00',
    payment: { method: 'card', status: 'paid' },
    address: { ghanaPostGPS: 'GA-201-7788', area: 'Cantonments', region: 'Greater Accra', lat: 5.578, lng: -0.175 },
    slot: { date: inDays(-1), window: '08:00 – 11:00' },
    items: [
      { productId: 'p7', name: 'Crisphead Lettuce', farmerId: 'f3', qty: 2, unit: 'each', estWeightKg: 0.8, priceEstimate: 20, priceFinal: 20, refrigerationRequired: true },
      { productId: 'p10', name: 'Okra', farmerId: 'f4', qty: 1, unit: 'kg', estWeightKg: 0.5, finalWeightKg: 0.48, priceEstimate: 7, priceFinal: 6.7, refrigerationRequired: true },
      { productId: 'p16', name: 'Sweet Pineapple', farmerId: 'f6', qty: 2, unit: 'each', estWeightKg: 3, priceEstimate: 26, priceFinal: 27.5, refrigerationRequired: false },
    ],
    subtotalEstimate: 53, subtotalFinal: 54.2, deliveryFee: 12, total: 66.2,
    threePL: {
      trackingNumber: 'SWFT-7780981', driverId: 'D-118', driverName: 'Comfort Mensah', vehicle: 'Refrigerated van · GR 1190-21',
      refrigeration: true, status: 'delivered',
      events: [
        { ts: inDays(-1) + 'T08:15:00', status: 'placed', note: 'Order confirmed and paid (card).' },
        { ts: inDays(-1) + 'T09:00:00', status: 'packed', note: 'Packed with cold-chain.' },
        { ts: inDays(-1) + 'T10:35:00', status: 'delivered', note: 'Delivered — POD captured.', location: 'Cantonments' },
      ],
      pod: { photo: '/golden-acres/delivery.png', signature: 'A. Frimpong', geo: { lat: 5.578, lng: -0.175 }, capturedAt: inDays(-1) + 'T10:35:00' },
    },
    fault: 'None', refunds: [],
  },
  {
    id: 'o3', reference: 'GA-24809', customerName: 'Kofi Boadu', customerPhone: '+233 27 555 0123',
    status: 'delivered', placedAt: inDays(-2) + 'T07:50:00',
    payment: { method: 'momo-vodafone', status: 'partial-refund' },
    address: { ghanaPostGPS: 'GA-339-1042', area: 'Spintex', region: 'Greater Accra', lat: 5.625, lng: -0.108 },
    slot: { date: inDays(-2), window: '14:00 – 17:00' },
    items: [
      { productId: 'p9', name: 'Kontomire', farmerId: 'f3', qty: 2, unit: 'bunch', estWeightKg: 1, priceEstimate: 12, priceFinal: 12, refrigerationRequired: true },
      { productId: 'p5', name: 'White Yam Tuber', farmerId: 'f2', qty: 1, unit: 'each', estWeightKg: 2.5, finalWeightKg: 2.4, priceEstimate: 20, priceFinal: 19.4, refrigerationRequired: false },
    ],
    subtotalEstimate: 32, subtotalFinal: 31.4, deliveryFee: 14, total: 33.4,
    threePL: {
      trackingNumber: 'SWFT-7780540', driverId: 'D-118', driverName: 'Comfort Mensah', vehicle: 'Refrigerated van · GR 1190-21',
      refrigeration: true, status: 'delivered',
      events: [
        { ts: inDays(-2) + 'T08:00:00', status: 'placed', note: 'Order confirmed and paid (MoMo).' },
        { ts: inDays(-2) + 'T15:40:00', status: 'delivered', note: 'Delivered late — kontomire wilted in transit.', location: 'Spintex' },
      ],
      pod: { photo: '/golden-acres/delivery.png', signature: 'K. Boadu', geo: { lat: 5.625, lng: -0.108 }, capturedAt: inDays(-2) + 'T15:40:00' },
    },
    fault: '3PL',
    refunds: [
      { id: 'rf1', amount: 12, reason: 'Kontomire wilted — late delivery beyond cold-chain window.', fault: '3PL', type: 'partial', issuedAt: inDays(-2) + 'T16:30:00' },
    ],
  },
  {
    id: 'o4', reference: 'GA-24820', customerName: 'Ama Serwaa', customerPhone: '+233 24 555 0177',
    status: 'picking', placedAt: inDays(0) + 'T07:05:00',
    payment: { method: 'momo-mtn', status: 'paid' },
    address: { ghanaPostGPS: 'GA-155-9920', area: 'Osu', region: 'Greater Accra', lat: 5.557, lng: -0.182 },
    slot: { date: inDays(0), window: '14:00 – 17:00' },
    items: [
      { productId: 'p8', name: 'Green Cabbage', farmerId: 'f3', qty: 1, unit: 'each', estWeightKg: 1.2, priceEstimate: 9, refrigerationRequired: true },
      { productId: 'p13', name: 'Red Onions', farmerId: 'f5', qty: 2, unit: 'kg', estWeightKg: 2, priceEstimate: 20, refrigerationRequired: false },
      { productId: 'p2', name: 'Scotch Bonnet Peppers', farmerId: 'f1', qty: 1, unit: 'kg', estWeightKg: 0.5, priceEstimate: 14, refrigerationRequired: true },
    ],
    subtotalEstimate: 43, deliveryFee: 13, total: 56,
    threePL: {
      trackingNumber: null, driverId: null, driverName: null, vehicle: null,
      refrigeration: true, status: 'picking',
      events: [
        { ts: inDays(0) + 'T07:10:00', status: 'placed', note: 'Order confirmed and paid (MoMo).' },
        { ts: inDays(0) + 'T07:45:00', status: 'picking', note: 'Picking at Tema hub (FEFO).' },
      ],
    },
    fault: 'None', refunds: [],
  },
  {
    id: 'o5', reference: 'GA-24795', customerName: 'Selorm Agbeko', customerPhone: '+233 50 555 0166',
    status: 'cancelled', placedAt: inDays(-3) + 'T09:20:00',
    payment: { method: 'card', status: 'refunded' },
    address: { ghanaPostGPS: 'CR-410-2231', area: 'Kasoa', region: 'Central', lat: 5.534, lng: -0.426 },
    slot: { date: inDays(-3), window: '08:00 – 11:00' },
    items: [
      { productId: 'p17', name: 'Watermelon', farmerId: 'f6', qty: 1, unit: 'each', estWeightKg: 4, priceEstimate: 22, refrigerationRequired: false },
    ],
    subtotalEstimate: 22, deliveryFee: 0, total: 0,
    threePL: {
      trackingNumber: null, driverId: null, driverName: null, vehicle: null,
      refrigeration: false, status: 'cancelled',
      events: [
        { ts: inDays(-3) + 'T09:25:00', status: 'placed', note: 'Order placed.' },
        { ts: inDays(-3) + 'T09:40:00', status: 'cancelled', note: 'Outside pilot delivery zone — auto-cancelled, full refund.' },
      ],
    },
    fault: 'Hub',
    refunds: [
      { id: 'rf2', amount: 22, reason: 'Address outside pilot geo-fence. Full refund.', fault: 'Hub', type: 'full', issuedAt: inDays(-3) + 'T09:45:00' },
    ],
  },
]

// ---- Farmer ledger (Auntie Ama) ----
export const ledger: LedgerEntry[] = [
  { id: 'l1', farmerId: 'f3', date: inDays(-1), orderRef: 'GA-24816', grossSales: 180, commission: 27, sopPenalty: 0, netPayout: 153, payoutStatus: 'scheduled', payoutTimestamp: inDays(1) + 'T10:35:00' },
  { id: 'l2', farmerId: 'f3', date: inDays(-2), orderRef: 'GA-24809', grossSales: 96, commission: 14.4, sopPenalty: 0, netPayout: 81.6, payoutStatus: 'paid', payoutTimestamp: inDays(0) + 'T15:40:00' },
  { id: 'l3', farmerId: 'f3', date: inDays(-3), orderRef: 'GA-24788', grossSales: 240, commission: 36, sopPenalty: 12, netPayout: 192, payoutStatus: 'paid', payoutTimestamp: inDays(-1) + 'T11:10:00' },
  { id: 'l4', farmerId: 'f3', date: inDays(-5), orderRef: 'GA-24771', grossSales: 312, commission: 46.8, sopPenalty: 0, netPayout: 265.2, payoutStatus: 'paid', payoutTimestamp: inDays(-3) + 'T09:00:00' },
  { id: 'l5', farmerId: 'f3', date: inDays(-7), orderRef: 'GA-24750', grossSales: 144, commission: 21.6, sopPenalty: 0, netPayout: 122.4, payoutStatus: 'paid', payoutTimestamp: inDays(-5) + 'T14:20:00' },
]

// ---- BI / KPI series ----
export const kpiSummary: KpiSummary = {
  gmv: 486200,
  gmvDeltaPct: 18.4,
  activeCustomers: 3120,
  customersDeltaPct: 12.1,
  onTimeRate: 0.944,
  onTimeDeltaPct: 2.3,
  avgSpoilageRate: 0.038,
  spoilageDeltaPct: -1.1,
}

export const cacClvSeries: CacClvPoint[] = [
  { month: 'Jan', cac: 42, clv: 180 },
  { month: 'Feb', cac: 40, clv: 205 },
  { month: 'Mar', cac: 38, clv: 232 },
  { month: 'Apr', cac: 37, clv: 268 },
  { month: 'May', cac: 35, clv: 295 },
  { month: 'Jun', cac: 33, clv: 332 },
]

export const onTimeSeries: SeriesPoint[] = [
  { label: 'Jan', value: 89 },
  { label: 'Feb', value: 90.5 },
  { label: 'Mar', value: 91.2 },
  { label: 'Apr', value: 92.8 },
  { label: 'May', value: 93.6 },
  { label: 'Jun', value: 94.4 },
]

export const spoilageByFarmer: SpoilageRow[] = [
  { farmerId: 'f3', farmerName: 'Green Leaf Collective', spoilageRate: 0.061, unitsLost: 142 },
  { farmerId: 'f4', farmerName: 'Darko Organics', spoilageRate: 0.048, unitsLost: 88 },
  { farmerId: 'f1', farmerName: "Ama's Garden", spoilageRate: 0.031, unitsLost: 76 },
  { farmerId: 'f6', farmerName: 'Asante Riverside', spoilageRate: 0.027, unitsLost: 54 },
  { farmerId: 'f2', farmerName: 'Mensah Family Farm', spoilageRate: 0.014, unitsLost: 22 },
  { farmerId: 'f5', farmerName: 'Sunrise Fields', spoilageRate: 0.009, unitsLost: 12 },
]

export const revenueSeries: SeriesPoint[] = [
  { label: 'Jan', value: 58 }, { label: 'Feb', value: 64 }, { label: 'Mar', value: 71 },
  { label: 'Apr', value: 79 }, { label: 'May', value: 88 }, { label: 'Jun', value: 96 },
]

export const demandForecast: DemandForecastPoint[] = [
  { week: 'W1', actual: 420, forecast: 410, category: 'Vegetables' },
  { week: 'W2', actual: 465, forecast: 455, category: 'Vegetables' },
  { week: 'W3', actual: 510, forecast: 520, category: 'Vegetables' },
  { week: 'W4', actual: 540, forecast: 548, category: 'Vegetables' },
  { week: 'W5', actual: null, forecast: 605, category: 'Vegetables' },
  { week: 'W6', actual: null, forecast: 660, category: 'Vegetables' },
  { week: 'W7', actual: null, forecast: 690, category: 'Vegetables' },
]

// ---- Customer testimonials (storefront) ----
export interface Testimonial {
  id: string
  quote: string
  name: string
  location: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'The tomatoes actually taste like tomatoes again. Delivery hit my window exactly, and paying with MoMo took two taps.',
    name: 'Akosua Mensah',
    location: 'East Legon, Accra',
  },
  {
    id: 't2',
    quote:
      'As a restaurant owner, freshness is everything. Golden Acres gets produce to my kitchen the same morning it leaves the farm.',
    name: 'Chef Kwabena',
    location: 'Osu, Accra',
  },
  {
    id: 't3',
    quote:
      'I love knowing exactly which farmer grew my food. One bad batch was refunded before I even finished the chat. Trust earned.',
    name: 'Naa Adjeley',
    location: 'Spintex, Accra',
  },
]

// ---- Lookup + derivation helpers (keep components thin) ----
const farmerById = new Map(farmers.map((f) => [f.id, f]))

export function getFarmer(id: string): Farmer | undefined {
  return farmerById.get(id)
}

export function productFarmer(product: Product): Farmer {
  // Data is authored consistently; fall back to first farmer defensively.
  return farmerById.get(product.farmerId) ?? farmers[0]
}

// Estimated headline price for a product (variable-weight aware).
export function productEstimate(product: Product): number {
  return product.variableWeight
    ? product.estWeightKg * product.pricePerKg
    : product.priceMin
}

// Curated "today's harvest" — bestsellers + in-stock, stable order.
export const featuredProducts: Product[] = products
  .filter((p) => p.status !== 'delisted')
  .sort((a, b) => {
    const aBest = a.tags.includes('Bestseller') ? 1 : 0
    const bBest = b.tags.includes('Bestseller') ? 1 : 0
    return bBest - aBest
  })
  .slice(0, 8)

// ---- Customer assistance: seed tickets for the CS / Ops queue ----
export const supportTickets: SupportTicket[] = [
  {
    id: 'cs1',
    reference: 'CS-1042',
    customerName: 'Nana Adjei',
    customerPhone: '+233 24 555 0142',
    orderRef: 'GA-24817',
    category: 'delivery',
    subject: 'Driver missed my delivery window',
    status: 'open',
    priority: 'high',
    createdAt: inDays(0) + 'T09:12:00',
    updatedAt: inDays(0) + 'T09:12:00',
    messages: [
      {
        id: 'm1',
        author: 'customer',
        authorName: 'Nana Adjei',
        body: 'My slot was 14:00–17:00 but it is now past 17:30 and the order still shows out for delivery. Can you check with the driver?',
        sentAt: inDays(0) + 'T09:12:00',
      },
    ],
  },
  {
    id: 'cs2',
    reference: 'CS-1041',
    customerName: 'Akosua Mensah',
    customerEmail: 'akosua@example.com',
    orderRef: 'GA-24790',
    category: 'quality',
    subject: 'Two tomatoes were bruised',
    status: 'pending',
    priority: 'normal',
    createdAt: inDays(-1) + 'T16:40:00',
    updatedAt: inDays(0) + 'T08:05:00',
    messages: [
      {
        id: 'm1',
        author: 'customer',
        authorName: 'Akosua Mensah',
        body: 'A couple of the Roma tomatoes arrived bruised. Everything else was perfect.',
        sentAt: inDays(-1) + 'T16:40:00',
      },
      {
        id: 'm2',
        author: 'support',
        authorName: 'Efua A.',
        body: 'So sorry about that, Akosua. I have issued a partial refund for the affected items — it will reflect on your MoMo within 48 hours.',
        sentAt: inDays(0) + 'T08:05:00',
      },
    ],
  },
  {
    id: 'cs3',
    reference: 'CS-1038',
    customerName: 'Chef Kwabena',
    customerPhone: '+233 20 777 1188',
    category: 'payment',
    subject: 'Charged twice for one order',
    status: 'resolved',
    priority: 'high',
    createdAt: inDays(-3) + 'T11:20:00',
    updatedAt: inDays(-2) + 'T10:00:00',
    messages: [
      {
        id: 'm1',
        author: 'customer',
        authorName: 'Chef Kwabena',
        body: 'I got two MoMo debit prompts for the same basket this morning.',
        sentAt: inDays(-3) + 'T11:20:00',
      },
      {
        id: 'm2',
        author: 'support',
        authorName: 'Yaw B.',
        body: 'Confirmed the duplicate — the second charge was auto-reversed by the PSP. You should see it back now. Apologies for the scare!',
        sentAt: inDays(-2) + 'T10:00:00',
      },
    ],
  },
]
