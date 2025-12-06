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

export default function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, isInitialized, accessToken, refreshToken } =
    useSelector((state) => state.auth)
  const tokenExpiryTime = useSelector(selectTokenExpiryTime)
  const refreshTimerRef = useRef(null)

  // First useEffect: Initialize auth from localStorage
  useEffect(() => {
    console.log('🚀 AuthProvider - Initializing auth...')
    dispatch(initializeAuth())
  }, [dispatch])

  // Second useEffect: Fetch user details after initialization if authenticated
  useEffect(() => {
    console.log('🔍 AuthProvider - Auth state:', {
      isInitialized,
      isAuthenticated,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    })

    if (isInitialized && isAuthenticated && accessToken) {
      console.log('✅ AuthProvider - Fetching user details...')
      dispatch(fetchUserDetails())
    } else {
      console.log('⏭️ AuthProvider - Skipping fetch user details')
    }
  }, [dispatch, isInitialized, isAuthenticated, accessToken])

  // Third useEffect: Set up automatic token refresh
  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    // Only set up refresh if authenticated and have tokens
    if (!isAuthenticated || !accessToken || !refreshToken) {
      console.log(
        '⏭️ AuthProvider - No auto-refresh needed (not authenticated)'
      )
      return
    }

    // Calculate when to refresh (refresh 10 seconds before expiry)
    const timeUntilRefresh = Math.max(0, tokenExpiryTime - 10000)

    console.log(
      `⏰ AuthProvider - Setting up auto-refresh in ${Math.round(
        timeUntilRefresh / 1000
      )}s`
    )

    // Set up the refresh timer
    refreshTimerRef.current = setTimeout(async () => {
      console.log('🔄 AuthProvider - Auto-refreshing token...')
      try {
        await dispatch(refreshAccessToken()).unwrap()
        console.log('✅ AuthProvider - Auto-refresh successful')
      } catch (error) {
        console.error('❌ AuthProvider - Auto-refresh failed:', error)
        // Token refresh failed, logout user
        dispatch(logout())
      }
    }, timeUntilRefresh)

    // Cleanup function
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }
  }, [dispatch, isAuthenticated, accessToken, refreshToken, tokenExpiryTime])

  // Fourth useEffect: Handle visibility change to refresh on tab focus
  useEffect(() => {
    if (!isAuthenticated) return

    const handleVisibilityChange = async () => {
      // When tab becomes visible, check if token needs refresh
      if (document.visibilityState === 'visible' && accessToken) {
        const now = Date.now()
        const expiresIn = tokenExpiryTime

        // If token expires in less than 30 seconds or already expired, refresh
        if (expiresIn < 30000) {
          console.log('🔄 AuthProvider - Tab focused, refreshing token...')
          try {
            await dispatch(refreshAccessToken()).unwrap()
            console.log('✅ AuthProvider - Focus refresh successful')
          } catch (error) {
            console.error('❌ AuthProvider - Focus refresh failed:', error)
            dispatch(logout())
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dispatch, isAuthenticated, accessToken, tokenExpiryTime])

  // Show loading spinner while initializing
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
