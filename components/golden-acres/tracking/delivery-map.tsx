'use client'

// Live delivery map.
// -----------------------------------------------------------------------------
// A self-contained SVG of the Greater Accra delivery zone (no map library / API
// key). It plots the Tema hub, the customer's drop, the road-like route between
// them, and an animated driver marker driven by the order's persisted
// `routeProgress`. While the order is out for delivery it polls `tickDelivery`
// (our simulated carrier device → real /api/3pl/webhook), and merges the
// authoritative server order back into the store so every surface stays in sync.

import { useEffect, useRef, useState } from 'react'
import { Navigation, MapPin, Warehouse, Snowflake } from 'lucide-react'
import { tickDelivery } from '@/app/actions/logistics'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { HUB } from '@/lib/golden-acres/data'
import {
  projectToUnit,
  routePolyline,
  pointAlongRoute,
} from '@/lib/golden-acres/geo'
import type { Order, GeoPoint } from '@/lib/golden-acres/types'

const POLL_MS = 3000
const VIEW = 1000 // SVG viewBox is 0..1000 in both axes (unit space * 1000)

export function DeliveryMap({ order }: { order: Order }) {
  const { applyServerOrder } = useDataStore()
  const [polling, setPolling] = useState(false)
  const inFlight = useRef(false)

  const t = order.threePL
  const origin: GeoPoint = t.originHub ?? HUB.location
  const dest: GeoPoint = { lat: order.address.lat, lng: order.address.lng }
  const delivered = order.status === 'delivered'
  // The carrier is "live" from the moment it has the order (tracking assigned)
  // until delivery — the first poll flips the persisted status to out-for-delivery.
  const live =
    !delivered &&
    order.status !== 'cancelled' &&
    !!t.trackingNumber
  const progress = t.routeProgress ?? 0

  // Poll the carrier device while the order is en route.
  useEffect(() => {
    if (!live) return
    let active = true
    const id = setInterval(async () => {
      if (inFlight.current) return
      inFlight.current = true
      setPolling(true)
      try {
        const res = await tickDelivery(order.reference)
        if (active && res.ok && res.order) applyServerOrder(res.order)
      } catch (e) {
        console.log('[v0] tickDelivery failed:', e)
      } finally {
        inFlight.current = false
        if (active) setPolling(false)
      }
    }, POLL_MS)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [live, order.reference, applyServerOrder])

  // Geometry in 0..1000 space.
  const o = scale(projectToUnit(origin))
  const d = scale(projectToUnit(dest))
  const driverUnit = pointAlongRoute(origin, dest, delivered ? 1 : progress)
  const driver = scale(driverUnit)
  const routePts = routePolyline(origin, dest)
  // Build the "travelled" portion of the route as a separate, denser polyline.
  const travelledPts = travelledPolyline(origin, dest, delivered ? 1 : progress)

  return (
    <div className="ga-rise overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-field" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Live delivery map
          </h2>
        </div>
        {live && (
          <span className="flex items-center gap-2 text-xs font-bold text-field">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-field/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-field" />
            </span>
            {polling ? 'Updating…' : 'Tracking'}
          </span>
        )}
        {delivered && (
          <span className="text-xs font-bold text-leaf">Arrived</span>
        )}
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="h-72 w-full sm:h-80"
          role="img"
          aria-label={`Delivery map showing the rider ${Math.round(
            (delivered ? 1 : progress) * 100,
          )}% of the way from the Tema hub to ${order.address.area}`}
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Land backdrop */}
          <rect x="0" y="0" width={VIEW} height={VIEW} fill="var(--color-secondary)" />
          {/* Gulf of Guinea band along the south edge for orientation */}
          <rect x="0" y={VIEW - 120} width={VIEW} height="120" fill="var(--color-field)" opacity="0.12" />
          <text x="24" y={VIEW - 44} fontSize="26" fontWeight="700" fill="var(--color-muted-foreground)" opacity="0.7">
            Gulf of Guinea
          </text>

          {/* Decorative road grid for map texture */}
          <g stroke="var(--color-border)" strokeWidth="2" opacity="0.5">
            {[200, 400, 600, 800].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2={VIEW} />
            ))}
            {[200, 400, 600, 800].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2={VIEW} y2={y} />
            ))}
          </g>

          {/* Planned route */}
          <polyline
            points={routePts}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="2 18"
            opacity="0.9"
          />
          {/* Travelled route */}
          <polyline
            points={travelledPts}
            fill="none"
            stroke="var(--color-leaf)"
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-all duration-700"
          />

          {/* Hub marker */}
          <g transform={`translate(${o.x} ${o.y})`}>
            <circle r="26" fill="var(--color-clay)" opacity="0.18" />
            <circle r="14" fill="var(--color-clay)" />
            <Marker label="Tema hub" />
          </g>

          {/* Destination marker */}
          <g transform={`translate(${d.x} ${d.y})`}>
            <circle r="26" fill="var(--color-field)" opacity="0.18" />
            <circle r="14" fill="var(--color-field)" />
          </g>

          {/* Driver marker */}
          <g transform={`translate(${driver.x} ${driver.y})`} className="transition-all duration-700">
            {live && (
              <circle r="34" fill="var(--color-field)" opacity="0.16">
                <animate attributeName="r" values="22;40;22" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.28;0;0.28" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r="18" fill="var(--color-field-deep)" stroke="var(--color-cream)" strokeWidth="4" />
            <g transform="translate(-9 -9) scale(0.75)">
              <path
                d="M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 6h11l3 5h4v5"
                fill="none"
                stroke="var(--color-cream)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>

        {/* Overlay labels */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm">
            <Warehouse className="h-3.5 w-3.5 text-clay" /> {HUB.name}
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-field" /> {order.address.area}
          </span>
        </div>
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
        <Stat
          label="ETA"
          value={
            delivered
              ? 'Arrived'
              : live && t.etaMinutes != null
                ? `~${t.etaMinutes} min`
                : '—'
          }
        />
        <Stat
          label="Progress"
          value={`${Math.round((delivered ? 1 : progress) * 100)}%`}
        />
        <Stat
          label="Cold chain"
          value={t.refrigeration ? 'Active' : 'N/A'}
          icon={t.refrigeration}
        />
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: boolean
}) {
  return (
    <div className="px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold text-foreground">
        {icon && <Snowflake className="h-3.5 w-3.5 text-field" />}
        {value}
      </p>
    </div>
  )
}

// Small SVG text helper rendered under a marker group.
function Marker({ label }: { label: string }) {
  return (
    <text
      x="0"
      y="34"
      textAnchor="middle"
      fontSize="22"
      fontWeight="700"
      fill="var(--color-foreground)"
    >
      {label}
    </text>
  )
}

const scale = (p: { x: number; y: number }) => ({ x: p.x * VIEW, y: p.y * VIEW })

// A denser sampling of the route from start up to `progress`, for the green
// "travelled" overlay. Reuses the same Bézier as routePolyline via pointAlongRoute.
function travelledPolyline(origin: GeoPoint, dest: GeoPoint, progress: number): string {
  const steps = Math.max(2, Math.round(progress * 40))
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const tt = (i / steps) * progress
    const p = pointAlongRoute(origin, dest, tt)
    pts.push(`${(p.x * VIEW).toFixed(1)},${(p.y * VIEW).toFixed(1)}`)
  }
  return pts.join(' ')
}
