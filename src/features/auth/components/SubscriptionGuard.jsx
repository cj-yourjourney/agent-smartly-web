// src/features/auth/components/SubscriptionGuard.jsx
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import AccessExpiredModal from './AccessExpiredModal'
import ROUTES from '../../../shared/constants/routes'

/**
 * SubscriptionGuard
 *
 * Wraps any page that requires authentication and/or an active access period.
 *
 * Props:
 *   children           — page content to render when access is granted
 *   requireSubscription (default: true)
 *                      — when false, only authentication is checked (e.g. Progress page)
 *                      — when true, user must also have an active trial or paid access
 *
 * Behaviour:
 *   • Not authenticated       →  redirect to ROUTES.AUTH.LOGIN?next=<current path>
 *   • Access required
 *     but access has expired  →  render children blurred + <AccessExpiredModal> overlay
 *                                (no redirect — user can see what they're missing)
 */
export default function SubscriptionGuard({
  children,
  requireSubscription = true
}) {
  const router = useRouter()

  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth)
  const { hasAccess, isLoading, isFetched } = useSelector(
    (state) => state.subscription
  )

  // True once we have a definitive answer on access status
  const subscriptionResolved = isFetched && !isLoading

  // Only redirect for authentication failures — not for expired access
  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      router.replace(
        `${ROUTES.AUTH.LOGIN}?next=${encodeURIComponent(router.pathname)}`
      )
    }
  }, [isInitialized, isAuthenticated, router])

  // ── Loading states ────────────────────────────────────────────────────────────

  // Auth not yet bootstrapped
  if (!isInitialized) {
    return <PageSpinner />
  }

  // Not authenticated — returning null prevents flash while redirect fires
  if (!isAuthenticated) {
    return null
  }

  // Still waiting for access status (only relevant when requireSubscription=true)
  if (requireSubscription && !subscriptionResolved) {
    return <PageSpinner />
  }

  // ── Access expired — show the page blurred with a modal on top ────────────────
  if (requireSubscription && !hasAccess) {
    return (
      <div className="relative">
        {/* Page content — rendered but visually locked */}
        <div
          className="pointer-events-none select-none"
          aria-hidden="true"
          style={{ opacity: 0.9 }}
        >
          {children}
        </div>

        {/* Paywall modal floats over the blurred content */}
        <AccessExpiredModal />
      </div>
    )
  }

  // ── All checks passed ─────────────────────────────────────────────────────────
  return <>{children}</>
}

function PageSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  )
}
