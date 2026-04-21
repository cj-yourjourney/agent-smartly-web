// src/features/account/AccountPage.jsx
import { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { fetchUserDetails } from '../auth/state/authSlice'
import {
  fetchSubscriptionStatus,
  setSubscriptionData
} from '../subscription/state/subscriptionSlice'
import {
  User,
  Mail,
  Calendar,
  Clock,
  Zap,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react'
import { API_CONFIG, authenticatedFetch } from '../../shared/api/config'
import ROUTES from '../../shared/constants/routes'

const TRIAL_DAYS = 3
const ACCESS_PRICE = '$9.99'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getTrialInfo(dateJoinedStr) {
  if (!dateJoinedStr) return null
  const joined = new Date(dateJoinedStr)
  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const daysUsed = Math.floor((now - joined) / msPerDay)
  const daysLeft = Math.max(TRIAL_DAYS - daysUsed, 0)
  const trialEndDate = new Date(joined.getTime() + TRIAL_DAYS * msPerDay)
  return { daysUsed, daysLeft, isActive: daysLeft > 0, trialEndDate }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Dynamically load Stripe.js once
let stripePromise = null
function getStripe(publicKey) {
  if (!stripePromise && publicKey) {
    stripePromise = new Promise((resolve) => {
      if (window.Stripe) {
        resolve(window.Stripe(publicKey))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => resolve(window.Stripe(publicKey))
      document.head.appendChild(script)
    })
  }
  return stripePromise
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function AvatarCircle({ username }) {
  const initial = username ? username.charAt(0).toUpperCase() : 'U'
  return (
    <div className="avatar placeholder">
      <div className="bg-primary text-primary-content rounded-full w-20">
        <span className="text-3xl font-semibold">{initial}</span>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-base-200 last:border-0">
      <div className="text-base-content/40 shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm text-base-content/50 w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-base-content">
        {value || '—'}
      </span>
    </div>
  )
}

// ─── One-Time Charge Notice ────────────────────────────────────────────────────
// Shown wherever a payment form is displayed

function OneTimeChargeNotice() {
  return (
    <div className="flex items-start gap-2 bg-info/10 border border-info/30 rounded-lg px-3 py-2.5">
      <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
      <div className="text-xs text-base-content/70 leading-relaxed">
        <span className="font-semibold text-base-content">
          One-time charge — not a subscription.
        </span>{' '}
        Your card is charged once for {ACCESS_PRICE}. There are{' '}
        <span className="font-semibold">no recurring charges</span> and nothing
        auto-renews. You can renew manually anytime before your access expires.
      </div>
    </div>
  )
}

// ─── Upgrade Banner ────────────────────────────────────────────────────────────
// Shown when the user was redirected here because their trial/access expired

function UpgradeBanner() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-warning/10 border border-warning/40 rounded-xl px-4 py-3 mb-6"
    >
      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-warning">
          Your access has expired
        </p>
        <p className="text-xs text-base-content/60 mt-0.5">
          Purchase access below to continue using practice questions and key
          concepts. It's a one-time charge — no auto-renewals.
        </p>
      </div>
    </div>
  )
}

// ─── Stripe Payment Form ───────────────────────────────────────────────────────

function PaymentForm({ onSuccess, isRenewal = false }) {
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
                fontSize: '15px',
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
      } catch (err) {
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
        { method: 'POST', body: JSON.stringify({}) }
      )
      const intentData = await intentRes.json()

      if (!intentRes.ok) {
        throw new Error(intentData.error || 'Could not initiate payment')
      }

      const { client_secret } = intentData

      // Step 2: Confirm the card payment with Stripe.js
      const { error: stripeError, paymentIntent } =
        await stripeRef.current.confirmCardPayment(client_secret, {
          payment_method: { card: cardRef.current }
        })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      // Step 3: Tell our backend to activate access
      const confirmRes = await authenticatedFetch(
        API_CONFIG.ENDPOINTS.SUBSCRIBE_CONFIRM,
        {
          method: 'POST',
          body: JSON.stringify({ payment_intent_id: paymentIntent.id })
        }
      )
      const confirmData = await confirmRes.json()

      if (!confirmRes.ok) {
        throw new Error(confirmData.error || 'Could not activate access')
      }

      onSuccess(confirmData)
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* One-time charge notice */}
      <OneTimeChargeNotice />

      {/* Card input */}
      <div>
        <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wide block mb-2">
          Card Details
        </label>
        <div
          ref={cardElementRef}
          className={`
            border rounded-lg px-4 py-3 bg-base-100 transition-all
            ${!stripeReady ? 'opacity-40' : 'opacity-100'}
            ${error ? 'border-error' : 'border-base-300 focus-within:border-primary'}
          `}
          style={{ minHeight: '44px' }}
        />
        {!stripeReady && (
          <p className="text-xs text-base-content/40 mt-1 flex items-center gap-1">
            <span className="loading loading-spinner loading-xs" />
            Loading secure payment form…
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-error text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-1.5 text-xs text-base-content/40">
        <Lock className="h-3 w-3" />
        <span>Encrypted & secured by Stripe. We never store your card.</span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!stripeReady || !cardComplete || paying}
        className="btn btn-primary w-full gap-2"
      >
        {paying ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Processing…
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            {isRenewal
              ? `Extend access — ${ACCESS_PRICE}`
              : `Get access — ${ACCESS_PRICE}`}
          </>
        )}
      </button>
    </div>
  )
}

// ─── Subscription Section ──────────────────────────────────────────────────────

function AccessSection({ user, profileData, onSubscriptionActivated }) {
  const [showForm, setShowForm] = useState(false)
  const [successData, setSuccessData] = useState(null)

  const trial = getTrialInfo(user?.date_joined)
  const subscription = profileData?.subscription
  const hasAccess = profileData?.has_access

  const handleSuccess = useCallback(
    (data) => {
      setSuccessData(data)
      setShowForm(false)
      onSubscriptionActivated(data)
    },
    [onSubscriptionActivated]
  )

  // ── Active access ──────────────────────────────────────────────
  if (subscription?.is_active) {
    const expiresOn = formatDate(subscription.expires_at)
    return (
      <div className="card bg-base-100 border border-success/30 rounded-xl overflow-hidden">
        <div className="bg-success/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-sm font-semibold text-success">
              Full Access Active
            </span>
          </div>
          <span className="badge badge-success badge-sm badge-outline">
            One-time purchase
          </span>
        </div>

        <div className="card-body p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-base-content/50">Amount paid</span>
            <span className="font-medium">{ACCESS_PRICE}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-base-content/50">Access expires</span>
            <span className="font-medium">{expiresOn}</span>
          </div>

          {/* No auto-renewal notice */}
          <div className="flex items-center gap-1.5 text-xs text-base-content/50 bg-base-200 rounded-lg px-3 py-2">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>
              This is <span className="font-semibold">not</span> a recurring
              subscription — nothing will auto-renew.
            </span>
          </div>

          {/* Renew early option */}
          <div className="divider my-0" />
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-sm btn-outline w-full gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Extend access by another month
            </button>
          ) : (
            <div>
              <p className="text-xs text-base-content/50 mb-3">
                This is a one-time charge. Paying now extends your access by one
                month — nothing auto-renews.
              </p>
              <PaymentForm onSuccess={handleSuccess} isRenewal />
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-ghost btn-sm w-full mt-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Just activated (success state) ────────────────────────────
  if (successData) {
    return (
      <div className="card bg-success/10 border border-success/30 rounded-xl">
        <div className="card-body p-4 flex flex-row items-start gap-3">
          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-success text-sm">
              Access activated!
            </p>
            <p className="text-xs text-base-content/60 mt-0.5">
              You now have full access until{' '}
              {formatDate(successData.expires_at)}.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Trial active — show progress + soft upsell ─────────────────
  if (trial?.isActive) {
    const pct = Math.round(((TRIAL_DAYS - trial.daysLeft) / TRIAL_DAYS) * 100)

    return (
      <div className="space-y-3">
        {/* Trial progress card */}
        <div className="card bg-base-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
              Free Trial
            </span>
            <div className="badge badge-success badge-outline gap-1 text-xs">
              <ShieldCheck className="h-3 w-3" />
              {trial.daysLeft} day{trial.daysLeft !== 1 ? 's' : ''} left
            </div>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={pct}
            max="100"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-base-content/40">
              Started {formatDate(user?.date_joined)}
            </span>
            <span className="text-xs text-base-content/40">
              Ends {formatDate(trial.trialEndDate)}
            </span>
          </div>
        </div>

        {/* Soft purchase CTA */}
        {!showForm ? (
          <div className="card bg-base-100 border border-base-200 rounded-xl">
            <div className="card-body p-4">
              <p className="text-sm font-medium text-base-content">
                Get full access after your trial
              </p>
              <p className="text-xs text-base-content/50 mt-0.5 mb-1">
                {ACCESS_PRICE} one-time · no recurring charges · renew anytime
              </p>
              <p className="text-xs text-info font-medium mb-3">
                Not a subscription — you will never be auto-charged.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-sm w-full gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Get full access
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 border border-primary/20 rounded-xl">
            <div className="card-body p-4 space-y-1">
              <p className="text-sm font-semibold text-base-content">
                Get full access · {ACCESS_PRICE} one-time
              </p>
              <p className="text-xs text-base-content/50 mb-3">
                Your card is charged once today. Renew manually anytime — no
                auto-renewals, ever.
              </p>
              <PaymentForm onSuccess={handleSuccess} />
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-ghost btn-sm w-full mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Trial ended, no access ───────────────────────────────────────
  return (
    <div className="card bg-base-100 border border-warning/30 rounded-xl overflow-hidden">
      <div className="bg-warning/10 px-4 py-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-warning" />
        <span className="text-sm font-semibold text-warning">
          Trial Ended — Get Full Access
        </span>
      </div>
      <div className="card-body p-4 space-y-3">
        <ul className="space-y-1.5">
          {[
            'Unlimited practice questions',
            'Full topic coverage',
            'Progress tracking & analytics'
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
              <span className="text-base-content/70">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="divider my-0" />

        <PaymentForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

const AccountPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  // Show upgrade banner when user was redirected here due to expired access
  const showUpgradeBanner = router.query.upgrade === 'true'

  // Account data (subscription, has_access, etc.) fetched separately
  const [accountData, setAccountData] = useState(null)
  const [accountLoading, setAccountLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN)
      return
    }
    if (!user) {
      dispatch(fetchUserDetails())
    }
  }, [isAuthenticated, user, dispatch, router])

  // Fetch account details (subscription, credits, etc.)
  useEffect(() => {
    if (!isAuthenticated) return

    setAccountLoading(true)
    authenticatedFetch(API_CONFIG.ENDPOINTS.PROFILE_DETAILS)
      .then((res) => res.json())
      .then((data) => setAccountData(data))
      .catch(() => setAccountData(null))
      .finally(() => setAccountLoading(false))
  }, [isAuthenticated])

  // Called after a successful one-time payment:
  // 1. Re-fetches account data for local UI
  // 2. Re-fetches subscription in Redux so SubscriptionGuard unlocks immediately
  const handleAccessActivated = useCallback(
    (paymentData) => {
      // Optimistically update Redux so guards unlock right away
      if (paymentData?.expires_at) {
        dispatch(
          setSubscriptionData({
            has_access: true,
            subscription: {
              status: 'active',
              is_active: true,
              started_at: new Date().toISOString(),
              expires_at: paymentData.expires_at
            }
          })
        )
      }

      // Then do a full re-fetch to get the authoritative server state
      authenticatedFetch(API_CONFIG.ENDPOINTS.PROFILE_DETAILS)
        .then((res) => res.json())
        .then((data) => {
          setAccountData(data)
          // Keep Redux in sync with fresh server data
          dispatch(fetchSubscriptionStatus())
        })
        .catch(() => {})
    },
    [dispatch]
  )

  if (!isAuthenticated) return null

  if (loading || !user || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    )
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')
  const credits = accountData?.credits ?? user.credits

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Upgrade banner — only shown when redirected from a guarded page */}
        {showUpgradeBanner && !accountData?.has_access && <UpgradeBanner />}

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <AvatarCircle username={user.username} />
          <div className="text-center">
            <h1 className="text-xl font-bold text-base-content">
              {fullName || user.username}
            </h1>
            {fullName && (
              <p className="text-sm text-base-content/50">@{user.username}</p>
            )}
          </div>
        </div>

        {/* Access / Trial Section */}
        <div className="mb-4">
          <AccessSection
            user={user}
            profileData={accountData}
            onSubscriptionActivated={handleAccessActivated}
          />
        </div>

        {/* Account Info Card */}
        <div className="card bg-base-100 border border-base-200 rounded-xl">
          <div className="card-body p-4">
            <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
              Account
            </h2>

            <InfoRow icon={User} label="Username" value={user.username} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow
              icon={Calendar}
              label="Member since"
              value={formatDate(user.date_joined)}
            />
            <InfoRow
              icon={Clock}
              label="Last login"
              value={user.last_login ? formatDate(user.last_login) : 'Just now'}
            />
            <InfoRow
              icon={Zap}
              label="Credits"
              value={credits !== undefined ? `${credits}` : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
