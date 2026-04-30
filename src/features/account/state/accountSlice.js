// src/features/account/state/accountSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_CONFIG, authenticatedFetch } from '../../../shared/api/config'

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const fetchAccountData = createAsyncThunk(
  'account/fetchAccountData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authenticatedFetch(API_CONFIG.ENDPOINTS.PROFILE_DETAILS)
      if (!res.ok) throw new Error('Failed to fetch account data')
      return await res.json()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ─── Slice ─────────────────────────────────────────────────────────────────────

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    data: null, // profile + subscription details from the server
    loading: false,
    error: null
  },
  reducers: {
    // Optimistically update after a successful payment without a second network call
    applyAccessActivated(state, action) {
      if (!state.data) return
      const { expires_at } = action.payload
      state.data = {
        ...state.data,
        has_access: true,
        subscription: {
          ...state.data.subscription,
          status: 'active',
          is_active: true,
          started_at: new Date().toISOString(),
          expires_at
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAccountData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchAccountData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { applyAccessActivated } = accountSlice.actions

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectAccountData = (state) => state.account.data
export const selectAccountLoading = (state) => state.account.loading

export default accountSlice.reducer
