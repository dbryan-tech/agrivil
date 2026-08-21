// Golden Acres — typed API boundary.
//
// Every function here is the seam where a real integration will plug in later:
//   - getDeliveryQuote / validateGhanaPostGPS  -> Maps API
//   - chargeMoMo / chargeCard                  -> Mobile Money + card PSP
//   - pushToThreePL / getTracking              -> 3PL OMS + webhooks
// For now they resolve against the mock dataset with simulated latency so the
// UI is built against the exact shapes the live services will return.

import {
  products,
  farmers,
  bundles,
  recipes,
  orders,
  deliverySlots,
  HUB,
  PILOT_AREAS,
  OUT_OF_ZONE_AREAS,
} from './data'
import type {
  Product,
  Farmer,
  Bundle,
  Order,
  DeliverySlot,
  GeoPoint,
  GhanaPostGPS,
  DeliveryQuote,
  ProximityMatch,
  PaymentMethod,
  FaultParty,
} from './types'

function delay<T>(value: T, ms = 0): Promise<T> {
  if (ms <= 0) return Promise.resolve(value)
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Haversine distance in km
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

// ---- Catalog ----
export async function getProducts(): Promise<Product[]> {
  return delay(products)
}
export async function getProduct(slug: string): Promise<Product | undefined> {
  return delay(products.find((p) => p.slug === slug))
}
export async function getFarmers(): Promise<Farmer[]> {
  return delay(farmers)
}
export async function getFarmer(slug: string): Promise<Farmer | undefined> {
  return delay(farmers.find((f) => f.slug === slug))
}
export async function getBundles(): Promise<Bundle[]> {
  return delay(bundles)
}
export async function getDeliverySlots(): Promise<DeliverySlot[]> {
  return delay(deliverySlots)
}

// Synchronous lookups for components that already hold ids.
export function farmerById(id: string): Farmer | undefined {
  return farmers.find((f) => f.id === id)
}
export function productById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
export function productsByFarmer(farmerId: string): Product[] {
  return products.filter((p) => p.farmerId === farmerId)
}
export { recipes, farmers, products, bundles, orders }

// ---- Maps API seam ----

// GhanaPostGPS format: 2 letters, dash, 3 digits, dash, 4 digits (e.g. GA-183-4250)
const GPS_RE = /^[A-Z]{2}-\d{3}-\d{4}$/

export function isValidGhanaPostGPS(code: string): boolean {
  return GPS_RE.test(code.trim().toUpperCase())
}

export interface GpsValidation {
  valid: boolean
  area?: string
  servesArea: boolean
  point?: GeoPoint
}

// Validates format + resolves to an area, then checks the pilot geo-fence.
export async function validateGhanaPostGPS(
  code: string,
): Promise<GpsValidation> {
  const clean = code.trim().toUpperCase()
  if (!isValidGhanaPostGPS(clean)) {
    return delay({ valid: false, servesArea: false }, 300)
  }
  // GhanaPostGPS region letter: "G" = Greater Accra (our pilot zone).
  // Any other region prefix resolves outside the geo-fence (waitlist path).
  const inPilotRegion = clean.startsWith('G')
  const seed = clean
    .replace(/[^0-9]/g, '')
    .split('')
    .reduce((s, d) => s + Number(d), 0)

  if (!inPilotRegion) {
    // Resolve to a far point well beyond the 45km pilot radius.
    const point: GeoPoint = {
      lat: 6.7 + (seed % 11) * 0.05, // Kumasi-ish and beyond
      lng: -1.6 + (seed % 9) * 0.05,
    }
    return delay(
      { valid: true, area: OUT_OF_ZONE_AREAS[seed % OUT_OF_ZONE_AREAS.length], servesArea: false, point },
      380,
    )
  }

  const area = PILOT_AREAS[seed % PILOT_AREAS.length]
  const point: GeoPoint = {
    lat: 5.6 + ((seed % 13) - 6) * 0.012,
    lng: -0.18 + ((seed % 17) - 8) * 0.012,
  }
  return delay({ valid: true, area, servesArea: true, point }, 380)
}

// Dynamic delivery fee = base + distance from hub (Maps API in production).
export async function getDeliveryQuote(point: GeoPoint): Promise<DeliveryQuote> {
  const d = distanceKm(HUB.location, point)
  const servesArea = d <= 45 // pilot radius
  const fee = servesArea ? Math.round((10 + d * 0.55) * 10) / 10 : 0
  const etaWindow = d < 15 ? 'Same day' : d < 30 ? 'Next morning' : 'Next day'
  return delay({
    servesArea,
    distanceFromHubKm: Math.round(d * 10) / 10,
    fee,
    etaWindow,
    hubName: HUB.name,
  })
}

// ---- MarketPlace Match: proximity scoring ----
// proximityScore = weighted blend of nearness + how much of the basket a
// farmer can actually supply.
export async function getProximityMatches(
  point: GeoPoint,
  basketProductIds: string[] = [],
): Promise<ProximityMatch[]> {
  const maxDist = 360
  const matches: ProximityMatch[] = farmers.map((farmer) => {
    const d = distanceKm(point, farmer.location)
    const inStock = productsByFarmer(farmer.id).filter(
      (p) => p.status !== 'delisted',
    )
    const availabilityScore = basketProductIds.length
      ? inStock.filter((p) => basketProductIds.includes(p.id)).length /
        basketProductIds.length
      : Math.min(1, inStock.length / 4)
    const nearness = Math.max(0, 1 - d / maxDist)
    const proximityScore = nearness * 0.6 + availabilityScore * 0.4
    return {
      farmer,
      distanceKm: Math.round(d),
      availabilityScore,
      proximityScore,
      inStockCount: inStock.length,
    }
  })
  return delay(matches.sort((a, b) => b.proximityScore - a.proximityScore))
}

// ---- Payments seam (MoMo / card) ----
export interface ChargeResult {
  ok: boolean
  reference: string
  method: PaymentMethod
  message: string
}

export async function charge(
  method: PaymentMethod,
  _amount: number,
  _phoneOrCard: string,
): Promise<ChargeResult> {
  const reference = 'GA-' + Math.floor(20000 + Math.random() * 9999)
  const message =
    method === 'card'
      ? 'Card charged successfully.'
      : 'Approve the prompt on your phone to confirm payment.'
  return delay({ ok: true, reference, method, message }, 900)
}

// ---- 3PL seam ----
export async function getOrders(): Promise<Order[]> {
  return delay(orders)
}
export async function getOrder(ref: string): Promise<Order | undefined> {
  return delay(orders.find((o) => o.reference === ref))
}

// ---- Refund seam (PSP reversal + ledger fault attribution) ----
export interface RefundRequest {
  reference: string
  amount: number
  reason: string
  fault: FaultParty
  type: 'full' | 'partial'
}
export interface RefundResult {
  ok: boolean
  refundId: string
  reversedTo: string // payment rail the money returns to
  message: string
}
export async function issueRefund(req: RefundRequest): Promise<RefundResult> {
  const order = orders.find((o) => o.reference === req.reference)
  const rail =
    order?.payment.method === 'card'
      ? 'original card'
      : order?.payment.method === 'momo-vodafone'
        ? 'Telecel Cash wallet'
        : 'MTN MoMo wallet'
  return delay(
    {
      ok: true,
      refundId: `RF-${Math.floor(100000 + Math.random() * 899999)}`,
      reversedTo: rail,
      message: `${req.type === 'full' ? 'Full' : 'Partial'} refund reversed to customer ${rail}. Fault attributed to ${req.fault}.`,
    },
    850,
  )
}

// ---- Pilot-zone waitlist seam ----
// Captures demand outside the current geo-fence so expansion can be prioritised.
export interface WaitlistRequest {
  name: string
  contact: string // phone or email
  ghanaPostGPS?: string
  area?: string
}
export interface WaitlistResult {
  ok: boolean
  position: number // queue position in the requested area
  areaInterest: number // total people waiting in that area
  message: string
}
export async function joinWaitlist(req: WaitlistRequest): Promise<WaitlistResult> {
  // Deterministic-ish demo numbers seeded from the contact string.
  const seed = req.contact.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const areaInterest = 40 + (seed % 180)
  const position = 1 + (seed % 24)
  return delay(
    {
      ok: true,
      position,
      areaInterest,
      message: `You're #${position} on the list for ${req.area ?? 'your area'}. We'll text ${req.contact} the moment we deliver there.`,
    },
    700,
  )
}
