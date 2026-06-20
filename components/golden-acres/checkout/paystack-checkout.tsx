'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { startPaystackCheckout, type PlaceOrderInput } from '@/app/actions/orders'

/**
 * Paystack Checkout for MoMo + GHS card payments.
 * Opens the Paystack hosted payment page, then polls for verification.
 * On completion, calls onComplete with the order reference.
 */
export function PaystackCheckout({
  input,
  onComplete,
  onError,
}: {
  input: PlaceOrderInput
  onComplete: (reference: string) => void
  onError: (message: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [pollingRef, setPollingRef] = useState<string>('')
  const pollIntervalRef = useRef<NodeJS.Timeout>()

  /** Start the checkout flow: initialize Paystack, then redirect. */
  const handleInitialize = useCallback(async () => {
    setLoading(true)
    try {
      // Create the order on our backend and get Paystack init response
      const res = await startPaystackCheckout(input)

      if (!res.ok || !res.reference || !res.authorizationUrl) {
        onError(res.error ?? 'Could not start Paystack checkout.')
        setLoading(false)
        return
      }

      setPollingRef(res.reference)

      // Store the reference in session storage so we can poll after redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('paystack_reference', res.reference)
        // Redirect to Paystack's hosted payment page
        window.location.href = res.authorizationUrl
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment initialization failed.')
      setLoading(false)
    }
  }, [input, onError])

  /** Poll Paystack for payment confirmation (if we're back from redirect). */
  const startPolling = useCallback(async (ref: string) => {
    // Poll every 2 seconds for up to 2 minutes
    let attempts = 0
    const maxAttempts = 60

    const poll = async () => {
      attempts++
      const result = await verifyPaystackTransaction(ref)

      if (result.success && result.data) {
        const { status } = result.data

        if (status === 'success') {
          clearInterval(pollIntervalRef.current)
          onComplete(ref)
          return
        }

        if (status === 'failed' || status === 'abandoned') {
          clearInterval(pollIntervalRef.current)
          onError(`Payment ${status}. Please try again.`)
          return
        }

        // Still pending; keep polling
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollIntervalRef.current)
        onError('Payment confirmation timed out. Please check your account and contact support.')
      }
    }

    poll() // first check immediately
    pollIntervalRef.current = setInterval(poll, 2000)
  }, [onComplete, onError])

  // Check if we're returning from Paystack redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = sessionStorage.getItem('paystack_reference')
      if (ref) {
        sessionStorage.removeItem('paystack_reference')
        startPolling(ref)
      }
    }
  }, [startPolling])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {pollingRef ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Checking payment status with Paystack…
          </p>
          <p className="text-xs text-muted-foreground">
            Ref: {pollingRef}
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-700">
              You will be redirected to Paystack to complete the payment. Your order will be
              confirmed after you return.
            </p>
          </div>

          <button
            onClick={handleInitialize}
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Initializing…
              </span>
            ) : (
              'Continue to Paystack'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
