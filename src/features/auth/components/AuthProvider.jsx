// src/features/auth/components/AuthProvider.jsx
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeAuth,
  fetchUserDetails,
  refreshAccessToken,
  logout,
  selectTokenExpiryTime
} from '../state/authSlice'
import {
  fetchSubscriptionStatus,
  resetSubscription
} from '../../subscription/state/subscriptionSlice'

export default function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, isInitialized, accessToken, refreshToken } =
    useSelector((state) => state.auth)
  const tokenExpiryTime = useSelector(selectTokenExpiryTime)
  const refreshTimerRef = useRef(null)

  // ── 1. Bootstrap auth from localStorage ──────────────────────────────────────
  useEffect(() => {
    console.log('🚀 AuthProvider - Initializing auth...')
    dispatch(initializeAuth())
  }, [dispatch])

  // ── 2. Fetch user details + subscription status after auth is resolved ────────
  useEffect(() => {
    console.log('🔍 AuthProvider - Auth state:', {
      isInitialized,
      isAuthenticated,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    })

    if (isInitialized && isAuthenticated && accessToken) {
      console.log('✅ AuthProvider - Fetching user details and subscription...')
      dispatch(fetchUserDetails())
      dispatch(fetchSubscriptionStatus())
    } else if (isInitialized && !isAuthenticated) {
      // Clear subscription state whenever auth is resolved as logged-out
      dispatch(resetSubscription())
      console.log('⏭️ AuthProvider - Not authenticated, subscription reset')
    }
  }, [dispatch, isInitialized, isAuthenticated, accessToken])

  // ── 3. Automatic token refresh timer ─────────────────────────────────────────
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    if (!isAuthenticated || !accessToken || !refreshToken) {
      console.log(
        '⏭️ AuthProvider - No auto-refresh needed (not authenticated)'
      )
      return
    }

    const timeUntilRefresh = Math.max(0, tokenExpiryTime - 10000)

    console.log(
      `⏰ AuthProvider - Setting up auto-refresh in ${Math.round(timeUntilRefresh / 1000)}s`
    )

    refreshTimerRef.current = setTimeout(async () => {
      console.log('🔄 AuthProvider - Auto-refreshing token...')
      try {
        await dispatch(refreshAccessToken()).unwrap()
        console.log('✅ AuthProvider - Auto-refresh successful')
      } catch (error) {
        console.error('❌ AuthProvider - Auto-refresh failed:', error)
        dispatch(logout())
        dispatch(resetSubscription())
      }
    }, timeUntilRefresh)

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }
  }, [dispatch, isAuthenticated, accessToken, refreshToken, tokenExpiryTime])

  // ── 4. Refresh token on tab focus if close to expiry ─────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && accessToken) {
        if (tokenExpiryTime < 30000) {
          console.log('🔄 AuthProvider - Tab focused, refreshing token...')
          try {
            await dispatch(refreshAccessToken()).unwrap()
            console.log('✅ AuthProvider - Focus refresh successful')
          } catch (error) {
            console.error('❌ AuthProvider - Focus refresh failed:', error)
            dispatch(logout())
            dispatch(resetSubscription())
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dispatch, isAuthenticated, accessToken, tokenExpiryTime])

  // ── Render ────────────────────────────────────────────────────────────────────
  if (!isInitialized) {
    console.log('⏳ AuthProvider - Still initializing...')
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  console.log('✅ AuthProvider - Initialized, rendering children')
  return <>{children}</>
}
