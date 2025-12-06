// features/auth/state/authSlice.js - Enhanced with auto-refresh and token monitoring
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG } from '../../../shared/api/config'

// Helper functions for token management
const getTokensFromStorage = () => {
  if (typeof window !== 'undefined') {
    const access = localStorage.getItem('accessToken')
    const refresh = localStorage.getItem('refreshToken')
    return { access, refresh }
  }
  return { access: null, refresh: null }
}

const saveTokensToStorage = (access, refresh) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access)
    if (refresh) localStorage.setItem('refreshToken', refresh)
  }
}

const removeTokensFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

// Check if token is expired or about to expire (with buffer)
const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    const now = Date.now()

    // Token expired if it expires in less than 10 seconds
    return exp - now < 10000
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

// Get time until token expires
const getTokenExpiryTime = (token) => {
  if (!token) return 0

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    const now = Date.now()
    return Math.max(0, exp - now)
  } catch (error) {
    return 0
  }
}

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_OBTAIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data)
      }

      saveTokensToStorage(data.access, data.refresh)
      return data
    } catch (error) {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data)
      }

      saveTokensToStorage(data.access, data.refresh)
      return data
    } catch (error) {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

// Async thunk for token refresh
export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().auth
      const refreshToken = state.refreshToken || getTokensFromStorage().refresh

      if (!refreshToken) {
        return rejectWithValue({ detail: 'No refresh token available' })
      }

      console.log('🔄 Refreshing access token...')

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_REFRESH}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh: refreshToken })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Token refresh failed:', data)
        return rejectWithValue(data)
      }

      // Save new access token
      saveTokensToStorage(data.access, refreshToken)
      console.log('✅ Token refreshed successfully')

      return { access: data.access, refresh: refreshToken }
    } catch (error) {
      console.error('❌ Token refresh error:', error)
      return rejectWithValue({
        detail: 'Failed to refresh token'
      })
    }
  }
)

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      let { accessToken } = getState().auth

      if (!accessToken) {
        accessToken = getTokensFromStorage().access
      }

      if (!accessToken) {
        return rejectWithValue({ detail: 'No access token available' })
      }

      // Check if token needs refresh
      if (isTokenExpired(accessToken)) {
        console.log('🔄 Token expired, refreshing before fetching user...')
        const refreshResult = await dispatch(refreshAccessToken()).unwrap()
        accessToken = refreshResult.access
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_AUTH}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        // If 401, try refresh once more
        if (response.status === 401) {
          console.log('🔄 Got 401, attempting token refresh...')
          const refreshResult = await dispatch(refreshAccessToken()).unwrap()

          // Retry with new token
          const retryResponse = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_AUTH}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshResult.access}`
              }
            }
          )

          const retryData = await retryResponse.json()

          if (!retryResponse.ok) {
            return rejectWithValue(retryData)
          }

          return retryData
        }

        return rejectWithValue(data)
      }

      return data
    } catch (error) {
      console.error('❌ Fetch user details error:', error)
      return rejectWithValue({
        detail: 'Failed to fetch user details'
      })
    }
  }
)

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registerSuccess: false,
  isInitialized: false,
  refreshTimer: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const tokens = getTokensFromStorage()
      state.accessToken = tokens.access
      state.refreshToken = tokens.refresh
      state.isAuthenticated = !!tokens.access && !isTokenExpired(tokens.access)
      state.isInitialized = true

      console.log('🔐 Auth initialized:', {
        hasAccessToken: !!tokens.access,
        hasRefreshToken: !!tokens.refresh,
        isAuthenticated: state.isAuthenticated
      })
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      state.registerSuccess = false
      removeTokensFromStorage()
      console.log('👋 User logged out')
    },
    clearError: (state) => {
      state.error = null
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.detail || 'Login failed'
        state.isAuthenticated = false
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.registerSuccess = false
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.registerSuccess = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.registerSuccess = false
      })
      // Refresh token cases
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.access
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loading = false
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.user = null
        removeTokensFromStorage()
        console.log('❌ Token refresh failed, logging out')
      })
      // Fetch user details cases
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.detail || 'Failed to fetch user details'

        // If it's an auth error, logout
        if (
          action.payload?.detail?.includes('token') ||
          action.payload?.detail?.includes('authentication')
        ) {
          state.accessToken = null
          state.refreshToken = null
          state.isAuthenticated = false
          state.user = null
          removeTokensFromStorage()
        }
      })
  }
})

export const {
  initializeAuth,
  logout,
  clearError,
  clearRegisterSuccess,
  setUser
} = authSlice.actions

export default authSlice.reducer

// Selector to get token expiry time
export const selectTokenExpiryTime = (state) => {
  return getTokenExpiryTime(state.auth.accessToken)
}
