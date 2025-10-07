import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG } from '../../../shared/api/config'

const API_URL = `${API_CONFIG.BASE_URL}/api/users`

// ---- Safe localStorage helper ----
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    }
    return null
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value)
      } catch {
        // silently fail (e.g., in private mode)
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch {
        // ignore errors
      }
    }
  }
}

// ---- Async Thunks ----
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.detail || 'Invalid credentials')
      }

      const data = await response.json()
      safeLocalStorage.setItem('access_token', data.access)
      safeLocalStorage.setItem('refresh_token', data.refresh)

      return data
    } catch (error) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = safeLocalStorage.getItem('access_token')
      if (!token) return rejectWithValue('No access token found')

      const response = await fetch(`${API_URL}/auth/`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch user details')

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = safeLocalStorage.getItem('refresh_token')
      if (!refreshToken) return rejectWithValue('No refresh token found')

      const response = await fetch(`${API_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      })

      if (!response.ok) throw new Error('Failed to refresh token')

      const data = await response.json()
      safeLocalStorage.setItem('access_token', data.access)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password, password2 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, password2 })
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// ---- Helpers ----
const checkExistingAuth = () => {
  const accessToken = safeLocalStorage.getItem('access_token')
  const refreshToken = safeLocalStorage.getItem('refresh_token')

  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken,
      isAuthenticated: true
    }
  }

  return {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
  }
}

// ---- Initial State ----
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  ...checkExistingAuth()
}

// ---- Slice ----
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null

      safeLocalStorage.removeItem('access_token')
      safeLocalStorage.removeItem('refresh_token')
    },
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      state.accessToken = action.payload.access
      state.refreshToken = action.payload.refresh
      state.isAuthenticated = true
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
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
        state.error = action.payload
        state.isAuthenticated = false
      })

      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Refresh token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        safeLocalStorage.removeItem('access_token')
        safeLocalStorage.removeItem('refresh_token')
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer
