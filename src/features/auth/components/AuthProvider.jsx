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

  const refreshTimerRef = useRef(null)
  // Tracks whether we've completed the post-init bootstrap (refresh + user fetch)
  const bootstrapDoneRef = useRef(false)

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
    dispatch(initializeAuth())
  }, [dispatch])

  // ── 2. Post-init bootstrap ────────────────────────────────────────────────
  //
  // Runs once after initializeAuth() sets isInitialized = true.
  //
  // Scenario A — returning user (most common case for the "logged out daily" bug):
  //   - isAuthenticated = true  (refresh token is valid)
  //   - accessToken may be expired (that's fine, it only lasts 1 hour)
  //   → silently refresh the access token first, then fetch user data
  //
  // Scenario B — fresh login / just verified email:
  //   - isAuthenticated = true, accessToken is fresh
  //   → skip the refresh, go straight to fetching user data
  //
  // Scenario C — not logged in:
  //   - isAuthenticated = false
  //   → clear subscription state, done
  //
  useEffect(() => {
    if (!isInitialized || bootstrapDoneRef.current) return
    bootstrapDoneRef.current = true

    const bootstrap = async () => {
      if (!isAuthenticated) {
        dispatch(resetSubscription())
        return
      }

      // Check if access token is missing or expired
      const accessExpired = !accessToken || accessTokenExpiry < 10_000

      if (accessExpired) {
        // Refresh token is valid (initializeAuth confirmed this) but
        // access token is stale — get a fresh one before doing anything else.
        try {
          await dispatch(refreshAccessToken()).unwrap()
        } catch {
          handleRefreshFailure('bootstrap')
          return
        }
      }

      // Now we have a valid access token — load user data
      try {
        await dispatch(fetchUserDetails()).unwrap()
        dispatch(fetchSubscriptionStatus())
      } catch {
        // fetchUserDetails already handles auth errors internally
        // (it calls refreshAccessToken again if needed); nothing to do here
      }
    }

    bootstrap()
  }, [isInitialized]) // eslint-disable-line react-hooks/exhaustive-deps
  // Intentionally only on isInitialized — we want this to run exactly once

  // ── 3. Schedule proactive access-token refresh ────────────────────────────
  //
  // Fires REFRESH_BUFFER_MS before the access token expires so API calls
  // are never blocked by an expired token during normal usage.
  //
  useEffect(() => {
    clearRefreshTimer()

    if (!isAuthenticated || !accessToken || !refreshToken) return

    // If token is already expired (or expiry unknown), refresh immediately.
    // This path is hit when the rotated refresh token comes back but
    // accessTokenExpiry hasn't updated in Redux yet.
    if (accessTokenExpiry === 0) return // bootstrap effect handles this

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

  // ── 4. Refresh on tab focus ───────────────────────────────────────────────
  //
  // When the user switches back to the tab after a long time away,
  // refresh if the access token has less than 5 minutes left.
  //
  useEffect(() => {
    if (!isAuthenticated) return

    const handleVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return
      if (!accessToken) return

      // Only refresh if the token is about to expire (< 5 min) or already has
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
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return <>{children}</>
}
