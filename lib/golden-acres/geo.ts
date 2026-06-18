// Pure geo helpers for the delivery-tracking layer. No deps, no API keys — the
// map renders these coordinates onto a hand-tuned SVG of Greater Accra.
import type { GeoPoint } from './types'

// Bounding box used to project lat/lng into the 0..1 space the SVG map draws
// in. Sized to comfortably contain the Tema hub and the pilot delivery areas.
export const ACCRA_BOUNDS = {
  minLat: 5.52,
  maxLat: 5.78,
  minLng: -0.32,
  maxLng: 0.06,
}

/** Project a geo point into normalized [0..1] x/y for the SVG viewport. */
export function projectToUnit(p: GeoPoint): { x: number; y: number } {
  const x = (p.lng - ACCRA_BOUNDS.minLng) / (ACCRA_BOUNDS.maxLng - ACCRA_BOUNDS.minLng)
  // Latitude grows north, but SVG y grows downward, so invert.
  const y = 1 - (p.lat - ACCRA_BOUNDS.minLat) / (ACCRA_BOUNDS.maxLat - ACCRA_BOUNDS.minLat)
  return { x: clamp01(x), y: clamp01(y) }
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** Linear interpolation between two geo points (t in 0..1). */
export function lerpPoint(a: GeoPoint, b: GeoPoint, t: number): GeoPoint {
  const k = clamp01(t)
  return { lat: a.lat + (b.lat - a.lat) * k, lng: a.lng + (b.lng - a.lng) * k }
}

/** Haversine distance in kilometres. */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

const toRad = (d: number) => (d * Math.PI) / 180

/**
 * Build a lightly curved poly-line (as normalized SVG points) between hub and
 * destination so the rendered route reads like a road rather than a ruler line.
 */
export function routePolyline(
  origin: GeoPoint,
  destination: GeoPoint,
  segments = 24,
): string {
  const o = projectToUnit(origin)
  const d = projectToUnit(destination)
  // Perpendicular offset for a gentle arc; deterministic from endpoints.
  const mx = (o.x + d.x) / 2
  const my = (o.y + d.y) / 2
  const dx = d.x - o.x
  const dy = d.y - o.y
  const bend = 0.12
  const cx = mx - dy * bend
  const cy = my + dx * bend
  const pts: string[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    // Quadratic Bézier through the control point.
    const x = (1 - t) ** 2 * o.x + 2 * (1 - t) * t * cx + t * t * d.x
    const y = (1 - t) ** 2 * o.y + 2 * (1 - t) * t * cy + t * t * d.y
    pts.push(`${(x * 1000).toFixed(1)},${(y * 1000).toFixed(1)}`)
  }
  return pts.join(' ')
}

/** Point along the same Bézier route at progress t (0..1), in unit space. */
export function pointAlongRoute(
  origin: GeoPoint,
  destination: GeoPoint,
  t: number,
): { x: number; y: number } {
  const o = projectToUnit(origin)
  const d = projectToUnit(destination)
  const mx = (o.x + d.x) / 2
  const my = (o.y + d.y) / 2
  const dx = d.x - o.x
  const dy = d.y - o.y
  const bend = 0.12
  const cx = mx - dy * bend
  const cy = my + dx * bend
  const k = clamp01(t)
  const x = (1 - k) ** 2 * o.x + 2 * (1 - k) * k * cx + k * k * d.x
  const y = (1 - k) ** 2 * o.y + 2 * (1 - k) * k * cy + k * k * d.y
  return { x, y }
}
