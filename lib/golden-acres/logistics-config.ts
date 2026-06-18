// Shared config for the simulated 3PL carrier integration. The webhook secret
// authenticates inbound carrier callbacks; a dev fallback keeps local/demo runs
// working when THREE_PL_WEBHOOK_SECRET isn't set.
export const THREE_PL_WEBHOOK_SECRET =
  process.env.THREE_PL_WEBHOOK_SECRET ?? "ga-3pl-dev-secret"

export const THREE_PL_CARRIER = "SwiftChain GH"

// Rider pool the carrier assigns from on dispatch.
export const THREE_PL_DRIVERS = [
  { id: "d1", name: "Kwame Osei", phone: "+233 24 118 2200", vehicle: "Cold-chain van · GR 2841-23" },
  { id: "d2", name: "Abena Owusu", phone: "+233 20 552 7781", vehicle: "Insulated bike · M 559-21" },
  { id: "d3", name: "Yaw Darko", phone: "+233 27 904 6610", vehicle: "Cold-chain van · GT 1190-22" },
  { id: "d4", name: "Esi Mensa", phone: "+233 55 330 4498", vehicle: "Insulated bike · M 712-24" },
] as const

// Each map tick advances the driver this fraction of the route, so a full run
// takes ~10 polls (≈ 30s at a 3s poll) — long enough to watch, short enough for demos.
export const ROUTE_STEP = 0.1

// Webhook event payloads the carrier device posts to /api/3pl/webhook.
export type ThreePLWebhookEvent =
  | {
      type: "position"
      reference: string
      lat: number
      lng: number
      progress: number
      etaMinutes: number
    }
  | {
      type: "delivered"
      reference: string
      lat: number
      lng: number
      signature: string
      photo?: string
    }
