// src/features/auth/components/SubscriptionGuard.jsx
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

/**
 * SubscriptionGuard
 *
 * Wraps any page that requires authentication and/or an active subscription.
 *
 * Props:
 *   children           — page content to render when access is granted
 *   requireSubscription (default: true)
 *                      — when false, only authentication is checked (e.g. Progress page)
 *                      — when true, user must also have an active trial or paid subscription
 *
 * Redirect behaviour:
 *   • Not authenticated  →  /auth/login?next=<current path>
 *   • No subscription    →  /profile?upgrade=true
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

  // True once we have a definitive answer on subscription status
  const subscriptionResolved = isFetched && !isLoading

  useEffect(() => {
    if (!isInitialized) return

    // Not logged in → send to login, preserve intended destination
    if (!isAuthenticated) {
      router.replace(`/auth/login?next=${encodeURIComponent(router.pathname)}`)
      return
    }

    // Subscription check (only for guarded pages)
    if (requireSubscription && subscriptionResolved && !hasAccess) {
      router.replace('/profile?upgrade=true')
    }
  }, [
    isInitialized,
    isAuthenticated,
    hasAccess,
    subscriptionResolved,
    requireSubscription,
    router
  ])

  // ── Loading states ────────────────────────────────────────────────────────────

  // Auth not yet bootstrapped
  if (!isInitialized) {
    return <PageSpinner />
  }

  // Not authenticated — returning null prevents flash while redirect fires
  if (!isAuthenticated) {
    return null
  }

  // Still waiting for subscription status (only relevant when requireSubscription=true)
  if (requireSubscription && !subscriptionResolved) {
    return <PageSpinner />
  }

  // Access denied — null prevents flash while redirect fires
  if (requireSubscription && !hasAccess) {
    return null
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
