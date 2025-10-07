// features/auth/state/authSlice.js
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
    localStorage.setItem('refreshToken', refresh)
  }
}

const removeTokensFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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

      // Save tokens to localStorage
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

      // Save tokens to localStorage
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
      const { refreshToken } = getState().auth

      if (!refreshToken) {
        return rejectWithValue({ detail: 'No refresh token available' })
      }

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
        return rejectWithValue(data)
      }

      // Update access token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.access)
      }

      return data
    } catch (error) {
      return rejectWithValue({
        detail: 'Failed to refresh token'
      })
    }
  }
)

// Async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth

      if (!accessToken) {
        return rejectWithValue({ detail: 'No access token available' })
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
        return rejectWithValue(data)
      }

      return data
    } catch (error) {
      return rejectWithValue({
        detail: 'Failed to fetch user details'
      })
    }
  }
)

// Initial state - don't access localStorage during SSR
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registerSuccess: false,
  isInitialized: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const tokens = getTokensFromStorage()
      state.accessToken = tokens.access
      state.refreshToken = tokens.refresh
      state.isAuthenticated = !!tokens.access
      state.isInitialized = true
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      state.registerSuccess = false
      removeTokensFromStorage()
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
        removeTokensFromStorage()
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
