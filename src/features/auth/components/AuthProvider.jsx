// src/features/auth/components/AuthProvider.jsx
import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeAuth,
  fetchUserDetails,
  refreshAccessToken,
  logout,
  selectAccessTokenExpiry
} from '../state/authSlice'
import {
  fetchSubscriptionStatus,
  resetSubscription
} from '../../subscription/state/subscriptionSlice'

// How long before access-token expiry we proactively refresh (5 minutes)
const REFRESH_BUFFER_MS = 5 * 60 * 1000

export default function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, isInitialized, accessToken, refreshToken } =
    useSelector((state) => state.auth)
  const accessTokenExpiry = useSelector(selectAccessTokenExpiry)
  const { isFetched: subscriptionFetched } = useSelector(
    (state) => state.subscription
  )

  const refreshTimerRef = useRef(null)
  // Tracks whether the initial bootstrap (app mount) has completed.
  // Separate from the post-login bootstrap so both paths work independently.
  const bootstrapStarted = useRef(false)

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const handleRefreshFailure = useCallback(
    (context) => {
      console.error(
        `❌ AuthProvider [${context}]: token refresh failed, logging out`
      )
      dispatch(logout())
      dispatch(resetSubscription())
    },
    [dispatch]
  )

  // ── 1. Bootstrap: read tokens from localStorage ───────────────────────────
  useEffect(() => {
    bootstrapStarted.current = false
    dispatch(initializeAuth())
  }, [dispatch])

  // ── 2. App-mount bootstrap ────────────────────────────────────────────────
  //
  // Runs once after initializeAuth() sets isInitialized = true.
  // Handles returning users (refresh token valid, access token may be stale).
  //
  useEffect(() => {
    if (!isInitialized) return
    if (bootstrapStarted.current) return
    bootstrapStarted.current = true

    const bootstrap = async () => {
      if (!isAuthenticated) {
        // Not logged in — clear any stale subscription state and stop
        dispatch(resetSubscription())
        return
      }

      // Already authenticated on mount (returning user) — load their data
      const accessExpired = !accessToken || accessTokenExpiry < 10_000
      if (accessExpired) {
        try {
          await dispatch(refreshAccessToken()).unwrap()
        } catch {
          handleRefreshFailure('bootstrap')
          return
        }
      }

      try {
        await dispatch(fetchUserDetails()).unwrap()
      } catch {
        // fetchUserDetails handles auth errors internally
      }

      try {
        await dispatch(fetchSubscriptionStatus()).unwrap()
      } catch {
        // subscriptionSlice sets isFetched=true + hasAccess=false on error
      }
    }

    bootstrap()
  }, [isInitialized]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Post-login bootstrap ───────────────────────────────────────────────
  //
  // Handles the case where the user logs in during the session:
  // - App mounted with isAuthenticated=false (no tokens in localStorage)
  // - User submitted the login form → isAuthenticated flips to true
  // - The mount bootstrap (effect 2) already ran and saw isAuthenticated=false,
  //   so fetchUserDetails / fetchSubscriptionStatus were never called.
  // - This effect catches that transition and runs them now.
  //
  useEffect(() => {
    // Only act once the mount bootstrap is done (bootstrapStarted = true)
    // and only when authentication transitions to true with no subscription data yet.
    if (!isInitialized) return
    if (!bootstrapStarted.current) return // mount bootstrap hasn't run yet
    if (!isAuthenticated) return // not logged in (or just logged out)
    if (subscriptionFetched) return // already have subscription data

    const postLoginBootstrap = async () => {
      try {
        await dispatch(fetchUserDetails()).unwrap()
      } catch {
        // fetchUserDetails handles auth errors internally
      }

      try {
        await dispatch(fetchSubscriptionStatus()).unwrap()
      } catch {
        // subscriptionSlice sets isFetched=true + hasAccess=false on error
      }
    }

    postLoginBootstrap()
  }, [isAuthenticated, isInitialized]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 4. Schedule proactive access-token refresh ────────────────────────────
  useEffect(() => {
    clearRefreshTimer()

    if (!isAuthenticated || !accessToken || !refreshToken) return
    if (accessTokenExpiry === 0) return

    const delay = Math.max(0, accessTokenExpiry - REFRESH_BUFFER_MS)

    refreshTimerRef.current = setTimeout(async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap()
      } catch {
        handleRefreshFailure('auto-refresh timer')
      }
    }, delay)

    return clearRefreshTimer
  }, [
    isAuthenticated,
    accessToken,
    refreshToken,
    accessTokenExpiry,
    dispatch,
    clearRefreshTimer,
    handleRefreshFailure
  ])

  // ── 5. Refresh on tab focus ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return

    const handleVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return
      if (!accessToken) return

      if (accessTokenExpiry < REFRESH_BUFFER_MS) {
        try {
          await dispatch(refreshAccessToken()).unwrap()
        } catch {
          handleRefreshFailure('tab focus')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [
    isAuthenticated,
    accessToken,
    accessTokenExpiry,
    dispatch,
    handleRefreshFailure
  ])

  // ── Render ─────────────────────────────────────────────────────────────────
  // Block children until auth AND subscription are both resolved.
  // This prevents SubscriptionGuard from ever seeing isFetched=false.
  if (!isInitialized || (isAuthenticated && !subscriptionFetched)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return <>{children}</>
}
