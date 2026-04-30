// src/features/account/components/PaymentForm.jsx
import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CreditCard, Lock } from 'lucide-react'
import { API_CONFIG, authenticatedFetch } from '../../../shared/api/config'
import { ACCESS_PRICE, getStripe } from '../utils'
import OneTimeChargeNotice from './OneTimeChargeNotice'

export default function PaymentForm({ onSuccess, isRenewal = false }) {
  const cardElementRef = useRef(null)
  const cardMountedRef = useRef(false)
  const stripeRef = useRef(null)
  const cardRef = useRef(null)

  const [stripeReady, setStripeReady] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState(null)

  // Load Stripe public key then mount the Card element
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STRIPE_CONFIG}`
        )
        const { public_key } = await res.json()
        if (!public_key) throw new Error('Stripe public key not available')

        const stripe = await getStripe(public_key)
        if (cancelled || !stripe) return

        stripeRef.current = stripe

        if (!cardMountedRef.current && cardElementRef.current) {
          const elements = stripe.elements()
          const card = elements.create('card', {
            style: {
              base: {
                fontSize: '16px',
                fontFamily: '"Inter", system-ui, sans-serif',
                color: '#1f2937',
                '::placeholder': { color: '#9ca3af' },
                iconColor: '#6b7280'
              },
              invalid: { color: '#ef4444', iconColor: '#ef4444' }
            },
            hidePostalCode: false
          })
          card.mount(cardElementRef.current)
          card.on('change', (e) => {
            setCardComplete(e.complete)
            setError(e.error ? e.error.message : null)
          })
          cardRef.current = card
          cardMountedRef.current = true
        }

        setStripeReady(true)
      } catch {
        setError('Failed to load payment system. Please refresh.')
      }
    }

    init()

    return () => {
      cancelled = true
      if (cardRef.current) {
        cardRef.current.unmount()
        cardMountedRef.current = false
      }
    }
  }, [])

  const handleSubmit = async () => {
    if (!stripeRef.current || !cardRef.current || !cardComplete) return
    setError(null)
    setPaying(true)

    try {
      // Step 1: Create the PaymentIntent on our backend
      const intentRes = await authenticatedFetch(
        API_CONFIG.ENDPOINTS.SUBSCRIBE,
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      )
      const intentData = await intentRes.json()
      if (!intentRes.ok)
        throw new Error(intentData.error || 'Could not initiate payment')

      // Step 2: Confirm the card payment with Stripe.js
      const { error: stripeError, paymentIntent } =
        await stripeRef.current.confirmCardPayment(intentData.client_secret, {
          payment_method: { card: cardRef.current }
        })
      if (stripeError) throw new Error(stripeError.message)

      // Step 3: Tell our backend to activate access
      const confirmRes = await authenticatedFetch(
        API_CONFIG.ENDPOINTS.SUBSCRIBE_CONFIRM,
        {
          method: 'POST',
          body: JSON.stringify({ payment_intent_id: paymentIntent.id })
        }
      )
      const confirmData = await confirmRes.json()
      if (!confirmRes.ok)
        throw new Error(confirmData.error || 'Could not activate access')

      onSuccess(confirmData)
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="space-y-4">
      <OneTimeChargeNotice />

      {/* Card input */}
      <div>
        <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wide block mb-2">
          Card Details
        </label>
        <div
          ref={cardElementRef}
          className={`
            border rounded-xl px-4 py-4 bg-base-100 transition-all
            ${!stripeReady ? 'opacity-40' : 'opacity-100'}
            ${error ? 'border-error' : 'border-base-300 focus-within:border-primary'}
          `}
          style={{ minHeight: '52px' }}
        />
        {!stripeReady && (
          <p className="text-xs text-base-content/40 mt-1.5 flex items-center gap-1.5">
            <span className="loading loading-spinner loading-xs" />
            Loading secure payment form…
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-error text-sm bg-error/5 border border-error/20 rounded-xl px-3 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-base-content/40">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span>Encrypted & secured by Stripe. We never store your card.</span>
      </div>

      {/* Large tap target for mobile */}
      <button
        onClick={handleSubmit}
        disabled={!stripeReady || !cardComplete || paying}
        className="btn btn-primary w-full gap-2 h-14 text-base"
      >
        {paying ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Processing…
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            {isRenewal
              ? `Extend access — ${ACCESS_PRICE}`
              : `Get access — ${ACCESS_PRICE}`}
          </>
        )}
      </button>
    </div>
  )
}
