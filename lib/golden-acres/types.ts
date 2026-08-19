// Golden Acres — domain types
// Single source of truth for the four surfaces. Designed so the mock
// data layer can later be swapped for live 3PL / MoMo / Maps integrations
// without changing component contracts.

export type GhanaRegion =
  | 'Greater Accra'
  | 'Eastern'
  | 'Ashanti'
  | 'Volta'
  | 'Central'
  | 'Bono'
  | 'Northern'
  | 'Upper East'
  | 'Upper West'

// GhanaPostGPS digital address, e.g. "GA-183-4250"
export type GhanaPostGPS = string

export interface GeoPoint {
  lat: number
  lng: number
}

export interface Location extends GeoPoint {
  ghanaPostGPS: GhanaPostGPS
  area: string // neighbourhood / town anchor, e.g. "East Legon"
  region: GhanaRegion
}

export type ProduceCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Roots & Tubers'
  | 'Grains & Legumes'
  | 'Herbs & Spices'
  | 'Leafy Greens'

export type ProductUnit = 'kg' | 'bunch' | 'each' | 'crate' | 'basket'

export type StockStatus = 'in-stock' | 'low' | 'delisted' | 'out-of-stock'

export interface Farmer {
  id: string
  slug: string
  name: string
  farmName: string
  photo: string
  cover?: string
  bio: string
  story: string
  methods: string[] // growing methods
  certifications: string[] // e.g. "Certified Organic"
  region: GhanaRegion
  town: string // secondary nearest-town anchor
  pickupGPS: GhanaPostGPS // primary pickup tag
  location: GeoPoint
  farmToHubRadiusKm: number
  rating: number
  reviewCount: number
  joinedYear: number
  onTimeRate: number // 0..1 SLA reliability
  // Mobile Money payout destination (settlement target for the ledger)
  momoProvider?: MomoProvider
  momoNumber?: string // full number; masked before display
}

export interface Product {
  id: string
  slug: string
  name: string
  category: ProduceCategory
  farmerId: string
  farmerName?: string
  image: string
  unit: ProductUnit
  // Variable-weight pricing: an estimate + price range reconciled post-pick.
  variableWeight: boolean
  estWeightKg: number
  pricePerKg: number // GH₵
  priceMin: number // GH₵ range low (variable weight)
  priceMax: number // GH₵ range high
  refrigerationRequired: boolean
  shelfLifeDays: number
  expiryDate: string // ISO — drives FEFO fulfilment
  stockKg: number
  lowStockThreshold: number
  status: StockStatus
  organic: boolean
  season: string
  tags: string[]
  description: string
  // Moderation: farmer-submitted listings start 'pending' and only appear in
  // the storefront once a staff member approves them. Seed catalog = 'live'.
  reviewStatus?: ProductReviewStatus
  rating?: number
  reviewCount?: number
}

export type ProductReviewStatus = 'live' | 'pending' | 'rejected'

export type BundleFrequency = 'one-time' | 'weekly' | 'biweekly' | 'monthly'
export type BundleType = 'staples' | 'recipe-kit' | 'seasonal' | 'organic'

export interface BundleItem {
  productId: string
  qty: number
}

export interface Bundle {
  id: string
  slug: string
  name: string
  description: string
  image: string
  type: BundleType
  items: BundleItem[]
  price: number // GH₵ per delivery
  frequency: BundleFrequency
  serves: string // e.g. "Feeds 3–4"
  popular?: boolean
}

export type RecipeCategory =
  | 'Rice & grains'
  | 'Stews & soups'
  | 'Street food'
  | 'Sides & snacks'

export interface RecipeIngredient {
  productId: string
  qty: number // how many of the product unit this recipe needs
  note?: string // e.g. "ripe", "finely diced"
}

export interface Recipe {
  id: string
  name: string
  image: string
  time: string
  productIds: string[] // legacy flat list (kept for back-compat + quick lookups)
  // ---- Enriched, optional fields (additive; older rows still valid) ----
  description?: string
  category?: RecipeCategory
  serves?: string // e.g. "Serves 4"
  difficulty?: 'Easy' | 'Medium' | 'Advanced'
  ingredients?: RecipeIngredient[] // produce ingredients w/ quantities + notes
  steps?: string[] // numbered cooking method
  tip?: string // optional chef's tip
}

// ---- Orders / fulfilment ----

export type OrderStatus =
  | 'placed'
  | 'picking'
  | 'packed'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'momo-mtn' | 'momo-vodafone' | 'card'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partial-refund'

export type FaultParty = 'Farmer' | '3PL' | 'Hub' | 'None'

export interface TrackingEvent {
  ts: string // ISO
  status: OrderStatus | 'tracking-assigned'
  note: string
  location?: string
}

export interface ProofOfDelivery {
  photo: string
  signature: string
  geo: GeoPoint
  capturedAt: string
}

export interface ThreePL {
  trackingNumber: string | null
  driverId: string | null
  driverName: string | null
  driverPhone?: string | null
  vehicle: string | null
  refrigeration: boolean
  status: OrderStatus
  events: TrackingEvent[]
  pod?: ProofOfDelivery
  // ---- live delivery telemetry (populated by the 3PL webhook) ----
  carrier?: string | null
  dispatchedAt?: string | null // ISO, when handed to the 3PL
  etaMinutes?: number | null // minutes remaining, last reported by driver device
  originHub?: GeoPoint | null // fulfilment hub the run departs from
  driverLocation?: GeoPoint | null // last reported driver coordinate
  routeProgress?: number // 0..1 along hub → customer route
}

export interface OrderItem {
  productId: string
  name: string
  image?: string
  farmerId: string
  qty: number
  unit: ProductUnit
  estWeightKg: number
  finalWeightKg?: number // reconciled post-pick
  priceEstimate: number
  priceFinal?: number
  refrigerationRequired: boolean
}

export interface Refund {
  id: string
  amount: number
  reason: string
  fault: FaultParty
  type: 'full' | 'partial'
  issuedAt: string
}

export interface DeliverySlot {
  id: string
  date: string // ISO date
  window: string // e.g. "08:00 – 11:00"
  capacityRemaining: number
}

export interface Order {
  id: string
  reference: string // e.g. "GA-24817"
  customerName: string
  customerPhone: string
  items: OrderItem[]
  status: OrderStatus
  placedAt: string
  payment: { method: PaymentMethod; status: PaymentStatus }
  address: Location
  slot: { date: string; window: string }
  subtotalEstimate: number
  subtotalFinal?: number
  deliveryFee: number
  total: number
  threePL: ThreePL
  fault: FaultParty
  refunds: Refund[]
  // ---- post-delivery feedback (Step 2) ----
  orderRating?: number | null // 1..5 stars for the overall order experience
  riderRating?: number | null // 1..5 stars for the delivery rider
  tip?: number // GH₵ tip for the rider (0 when none)
  feedbackComment?: string | null
  feedbackAt?: string | null // ISO timestamp the feedback was submitted
}

// ---- Reviews & post-delivery feedback ----

// A review row. A product review has productId set; a farmer review has
// farmerId set with productId null. orderRef ties it to the delivery that
// unlocked the review (verified purchase).
export interface Review {
  id: string
  userId: string
  authorName: string
  productId?: string | null
  farmerId?: string | null
  orderRef?: string | null
  rating: number // 1..5
  title?: string | null
  body: string
  verifiedPurchase: boolean
  status: 'live' | 'pending' | 'hidden'
  /** Public reply from the farmer/seller, if any. */
  farmerReply?: string | null
  farmerReplyAt?: string | null
  createdAt: string
}

// Payload submitted from the post-delivery feedback flow.
export interface DeliveryFeedbackInput {
  reference: string
  orderRating: number // 1..5
  riderRating?: number // 1..5
  tip?: number // GH₵
  comment?: string
  // Optional per-product reviews keyed by productId.
  productReviews?: { productId: string; rating: number; body?: string }[]
  // Optional per-farmer reviews keyed by farmerId.
  farmerReviews?: { farmerId: string; rating: number; body?: string }[]
}

// ---- MarketPlace Match (proximity) ----

export interface ProximityMatch {
  farmer: Farmer
  distanceKm: number
  availabilityScore: number // 0..1 — how much of the requested basket they stock
  proximityScore: number // 0..1 — combined distance + availability
  inStockCount: number
}

export interface DeliveryQuote {
  servesArea: boolean // inside pilot geo-fence?
  distanceFromHubKm: number
  fee: number // GH₵
  etaWindow: string
  hubName: string
}

// ---- Farmer ledger ----

export type PayoutStatus = 'scheduled' | 'processing' | 'paid' | 'failed'

export type MomoProvider = 'MTN' | 'Vodafone' | 'AirtelTigo'

export interface LedgerEntry {
  id: string
  farmerId: string
  date: string
  orderRef: string
  grossSales: number
  commission: number // platform commission (deducted)
  sopPenalty: number // SOP-violation penalty (deducted)
  netPayout: number // guaranteed net
  payoutStatus: PayoutStatus
  payoutTimestamp: string // 48-hr guarantee timestamp
  // MoMo settlement metadata (populated once a payout run settles the entry)
  payoutProvider?: MomoProvider | null
  payoutNumber?: string | null // masked, e.g. "024•••1234"
  payoutRef?: string | null // simulated provider transaction id
  batchId?: string | null
  paidAt?: string | null
  failureReason?: string | null
}

// A simulated MoMo settlement run that paid a set of ledger entries.
export interface PayoutBatch {
  id: string
  runBy?: string | null
  status: 'completed' | 'partial'
  entryCount: number
  paidCount: number
  failedCount: number
  totalPaid: number
  createdAt: string
}

// ---- BI / KPI ----

export interface SeriesPoint {
  label: string
  value: number
}

export interface CacClvPoint {
  month: string
  cac: number
  clv: number
}

export interface SpoilageRow {
  farmerId: string
  farmerName: string
  spoilageRate: number // 0..1
  unitsLost: number
}

export interface DemandForecastPoint {
  week: string
  actual: number | null
  forecast: number
  category: ProduceCategory
}

export interface KpiSummary {
  gmv: number
  gmvDeltaPct: number
  activeCustomers: number
  customersDeltaPct: number
  onTimeRate: number
  onTimeDeltaPct: number
  avgSpoilageRate: number
  spoilageDeltaPct: number
}

// ---- Auth / accounts ----
// Designed so the mock auth seam (lib/golden-acres/auth.ts) can be swapped
// for Better Auth + Neon later without changing component contracts.

export type UserRole = 'customer' | 'farmer' | 'staff'

export type AuthMethod =
  | 'password' // email + password (customer + farmer + staff)
  | 'phone-pin' // phone number + 4-digit PIN (farmer, MoMo-style)
  | 'phone-otp' // phone number + one-time SMS code (farmer)
  | 'google' // OAuth (mocked in front-end phase)
  | 'apple' // OAuth (mocked in front-end phase)

export type StaffRole = 'support' | 'ops' | 'analyst' | 'admin'

export interface SavedAddress {
  id: string
  label: string // e.g. "Home", "Office"
  recipient: string
  phone: string
  ghanaPostGPS: GhanaPostGPS
  area: string
  region: GhanaRegion
  isDefault: boolean
  notes?: string
}

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export interface SubscriptionBox {
  id: string
  bundleId: string
  bundleName: string
  frequency: BundleFrequency
  price: number
  nextDelivery: string // ISO
  status: SubscriptionStatus
}

export interface BaseAccount {
  id: string
  role: UserRole
  name: string
  email?: string
  phone?: string
  avatarColor: string // deterministic token for monogram chip
  avatarImage?: string // uploaded profile photo (data URL in mock phase)
  createdVia: AuthMethod
  joinedAt: string
}

export interface CustomerAccount extends BaseAccount {
  role: 'customer'
  addresses: SavedAddress[]
  subscriptions: SubscriptionBox[]
  orderRefs: string[] // references into the orders dataset
  loyaltyPoints: number
  wishlist?: string[] // saved product IDs (favorites)
}

// ---- Loyalty ----
export type LoyaltyTier = 'sprout' | 'harvest' | 'golden'

export interface FarmerAccount extends BaseAccount {
  role: 'farmer'
  farmerId: string // links to Farmer in the catalog
  farmName: string
  pin?: string // 4-digit, mock only
}

export interface StaffAccount extends BaseAccount {
  role: 'staff'
  staffRole: StaffRole
}

export type Account = CustomerAccount | FarmerAccount | StaffAccount

export interface Session {
  account: Account
  method: AuthMethod
  issuedAt: string
}

export interface AuthResult {
  ok: boolean
  session?: Session
  error?: string
  // For phone-otp: the mock "sent" code surfaced to the demo UI.
  devOtp?: string
  // For OAuth (real flow): provider name for OAuth redirect
  oauth?: 'google' | 'apple'
}

// ---- Customer assistance / support tickets ----
// Customer-raised issues that surface in the CS / Ops portal queue.

export type TicketCategory =
  | 'order'
  | 'delivery'
  | 'payment'
  | 'quality'
  | 'account'
  | 'other'

export type TicketStatus = 'open' | 'pending' | 'resolved'
export type TicketPriority = 'low' | 'normal' | 'high'

export interface TicketAttachment {
  url: string
  name: string
  contentType: string
  size: number
}

export interface TicketMessage {
  id: string
  author: 'customer' | 'support'
  authorName: string
  body: string
  sentAt: string // ISO
  attachments?: TicketAttachment[]
}

export interface SupportTicket {
  id: string
  reference: string // e.g. "CS-1042"
  userId?: string | null
  customerName: string
  customerPhone?: string
  customerEmail?: string
  orderRef?: string // optional link to an order
  category: TicketCategory
  subject: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string | null
  createdAt: string
  updatedAt: string
  lastMessageAt?: string | null
  messages: TicketMessage[]
}

// ---- Notifications ----
// In-app notification feed, scoped to a customer by phone number.

export type NotificationKind =
  | 'order' // status changes along the fulfilment timeline
  | 'support' // a CS agent replied to a ticket
  | 'reward' // loyalty points / tier changes
  | 'promo' // marketing / restock nudges
  | 'payout' // farmer settlement / MoMo payout sent

export type NotificationChannel = 'in-app' | 'sms'

export interface Notification {
  id: string
  forPhone: string // recipient customer phone (canonical E.164)
  kind: NotificationKind
  title: string
  body: string
  href?: string // deep link (e.g. /orders/GA-24817)
  read: boolean
  createdAt: string
  // Idempotency + SMS dispatch metadata (Step 1 notifications backbone).
  dedupeKey?: string
  channel?: NotificationChannel
  smsStatus?: string
  smsTo?: string
}
