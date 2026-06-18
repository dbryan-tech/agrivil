"use client"

import { useCallback, useRef, useState } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Loader2 } from "lucide-react"
import {
  startCardCheckout,
  type PlaceOrderInput,
} from "@/app/actions/orders"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
)

/**
 * Embedded Stripe Checkout for the card payment path. On mount it creates a
 * server-priced checkout session and an awaiting-payment order. When Stripe
 * reports the payment complete, it calls onComplete with the order reference so
 * the parent can finalize (confirm) and advance to the confirmation step.
 */
export function CardCheckout({
  input,
  onComplete,
  onError,
}: {
  input: PlaceOrderInput
  onComplete: (reference: string) => void
  onError: (message: string) => void
}) {
  const [ready, setReady] = useState(false)
  const referenceRef = useRef<string>("")

  const fetchClientSecret = useCallback(async () => {
    const res = await startCardCheckout(input)
    if (!res.ok || !res.clientSecret || !res.reference) {
      onError(res.error ?? "Could not start card checkout.")
      throw new Error(res.error ?? "Could not start card checkout.")
    }
    referenceRef.current = res.reference
    setReady(true)
    return res.clientSecret
  }, [input, onError])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {!ready && (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading secure card form…
        </div>
      )}
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: () => {
            if (referenceRef.current) onComplete(referenceRef.current)
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
