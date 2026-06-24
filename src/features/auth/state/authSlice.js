// features/auth/state/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG } from '../../../shared/api/config'

// ─── Token storage helpers ────────────────────────────────────────────────────

const getTokensFromStorage = () => {
  if (typeof window === 'undefined') return { access: null, refresh: null }
  return {
    access: localStorage.getItem('accessToken'),
    refresh: localStorage.getItem('refreshToken')
  }
}

const saveTokensToStorage = (access, refresh) => {
  if (typeof window === 'undefined') return
  if (access) localStorage.setItem('accessToken', access)
  if (refresh) localStorage.setItem('refreshToken', refresh)
}

const removeTokensFromStorage = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// ─── Token introspection helpers ─────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature.
 * Returns null if the token is missing or malformed.
 */
const decodeTokenPayload = (token) => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

/**
 * Returns true if the token is expired (or within `bufferMs` of expiring).
 * A null / malformed token is treated as expired.
 */
const isTokenExpired = (token, bufferMs = 10_000) => {
  const payload = decodeTokenPayload(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 - Date.now() < bufferMs
}

/**
 * Returns milliseconds until the token expires (0 if already expired).
 */
const msUntilExpiry = (token) => {
  const payload = decodeTokenPayload(token)
  if (!payload?.exp) return 0
  return Math.max(0, payload.exp * 1000 - Date.now())
}

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_OBTAIN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        }
      )
      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)
      saveTokensToStorage(data.access, data.refresh)
      return data
    } catch {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        }
      )
      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)
      // No tokens yet — user must verify email first
      return data
    } catch {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_EMAIL}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        }
      )
      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)
      saveTokensToStorage(data.access, data.refresh)
      return data
    } catch {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PASSWORD_RESET_REQUEST}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      )
      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)
      return data
    } catch {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async ({ token, password, password2 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PASSWORD_RESET_CONFIRM}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password, password2 })
        }
      )
      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)
      return data
    } catch {
      return rejectWithValue({
        detail: 'Network error. Please check your connection.'
      })
    }
  }
)

/**
 * Refresh the access token using the stored refresh token.
 *
 * With ROTATE_REFRESH_TOKENS=True on the backend, Django returns a brand-new
 * refresh token alongside the new access token. We persist both so the 30-day
 * window resets on every successful refresh (active users never get logged out).
 */
export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    const storedRefresh =
      getState().auth.refreshToken || getTokensFromStorage().refresh

    if (!storedRefresh) {
      return rejectWithValue({ detail: 'No refresh token available' })
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_REFRESH}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: storedRefresh })
        }
      )

      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)

      // data.refresh is the rotated refresh token (present when ROTATE_REFRESH_TOKENS=True).
      // Fall back to the token we sent in case the backend doesn't rotate.
      const newRefresh = data.refresh || storedRefresh
      saveTokensToStorage(data.access, newRefresh)

      return { access: data.access, refresh: newRefresh }
    } catch {
      return rejectWithValue({ detail: 'Failed to refresh token' })
    }
  }
)

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      let { accessToken } = getState().auth
      if (!accessToken) accessToken = getTokensFromStorage().access
      if (!accessToken)
        return rejectWithValue({ detail: 'No access token available' })

      // Proactively refresh if the access token is expired or nearly so
      if (isTokenExpired(accessToken)) {
        const result = await dispatch(refreshAccessToken()).unwrap()
        accessToken = result.access
      }

      const fetchWithToken = async (token) =>
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_AUTH}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

      let response = await fetchWithToken(accessToken)

      // If we still get 401, try one more refresh (handles race conditions)
      if (response.status === 401) {
        const result = await dispatch(refreshAccessToken()).unwrap()
        accessToken = result.access
        response = await fetchWithToken(accessToken)
      }

      const data = await response.json()
      if (!response.ok) return rejectWithValue(data)
      return data
    } catch (error) {
      return rejectWithValue({
        detail: error?.message || 'Failed to fetch user details'
      })
    }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  registerSuccess: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called once on app boot (AuthProvider mount).
     *
     * THE CORE FIX:
     * We no longer use the access token to decide if the user is authenticated.
     * The access token expires every hour — that's expected and fine.
     * Instead we check the REFRESH TOKEN (30-day lifetime).
     * If it's still valid, the user is authenticated; AuthProvider will
     * immediately fire refreshAccessToken() to get a fresh access token.
     */
    initializeAuth: (state) => {
      const { access, refresh } = getTokensFromStorage()

      state.accessToken = access
      state.refreshToken = refresh

      // Authenticated = has a non-expired refresh token.
      // Access token expiry is irrelevant here; it will be refreshed shortly.
      const refreshAlive = refresh && !isTokenExpired(refresh, 0)
      state.isAuthenticated = !!refreshAlive
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
      // ── Login ──────────────────────────────────────────────────────────────
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

      // ── Register ───────────────────────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.registerSuccess = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false // email not verified yet
        state.error = null
        state.registerSuccess = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.registerSuccess = false
      })

      // ── Email verification ─────────────────────────────────────────────────
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh
        state.user = action.payload.user ?? null
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          'Verification failed'
        state.isAuthenticated = false
      })

      // ── Password reset request ─────────────────────────────────────────────
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.error || action.payload?.detail || 'Request failed'
      })

      // ── Password reset confirm ─────────────────────────────────────────────
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.loading = false
        state.error =
          action.payload?.error || action.payload?.detail || 'Reset failed'
      })

      // ── Token refresh ──────────────────────────────────────────────────────
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.access
        // Persist the rotated refresh token (ROTATE_REFRESH_TOKENS=True)
        state.refreshToken = action.payload.refresh
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Refresh token is dead (expired / revoked) → full logout
        state.loading = false
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.user = null
        removeTokensFromStorage()
      })

      // ── Fetch user details ─────────────────────────────────────────────────
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
        // Only force logout on hard auth errors, not transient failures
        const msg = (action.payload?.detail || '').toLowerCase()
        if (msg.includes('token') || msg.includes('authentication')) {
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

// Selector: ms until access token expires (used by AuthProvider timer)
export const selectAccessTokenExpiry = (state) =>
  msUntilExpiry(state.auth.accessToken)
