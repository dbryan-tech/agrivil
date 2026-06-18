import "server-only"

import Stripe from "stripe"

/**
 * Lazily-instantiated Stripe client.
 *
 * Creating `new Stripe(...)` at module load throws when STRIPE_SECRET_KEY is
 * missing. Because this module is imported (transitively) by the storefront's
 * server actions / catalog hydration, that crash took down pages that have
 * nothing to do with payments. We defer instantiation until the client is
 * actually used (i.e. at checkout), so the rest of the app works without a key.
 */
let _stripe: Stripe | null = null

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment variables to enable checkout.",
    )
  }
  if (!_stripe) {
    _stripe = new Stripe(key)
  }
  return _stripe
}

/** True when Stripe is configured — use to gate payment UI/flows. */
export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY)

/**
 * Proxy that forwards property access to a real Stripe instance, created on
 * first use. Call sites can keep using `stripe.checkout.sessions.create(...)`.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})
