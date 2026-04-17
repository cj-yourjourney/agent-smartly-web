// src/features/subscription/state/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../../shared/api/config'
import { API_CONFIG } from '../../../shared/api/config'

/**
 * Fetch subscription + access status from /api/profiles/details/
 * The endpoint already returns has_access (trial OR active sub) and subscription object.
 */
export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.PROFILE_DETAILS)
      return data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    hasAccess: null, // null = not yet fetched; true/false = known
    subscription: null, // raw subscription object from backend
    isLoading: false,
    isFetched: false, // true once we've completed at least one fetch
    error: null
  },
  reducers: {
    // Dispatch on logout to clear all subscription state
    resetSubscription: (state) => {
      state.hasAccess = null
      state.subscription = null
      state.isLoading = false
      state.isFetched = false
      state.error = null
    },
    // Optimistic update — called by ProfilePage after a successful payment
    // so guarded pages unlock immediately without waiting for a re-fetch
    setSubscriptionData: (state, action) => {
      state.hasAccess = action.payload.has_access ?? state.hasAccess
      state.subscription = action.payload.subscription ?? state.subscription
      state.isFetched = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.hasAccess = action.payload.has_access
        state.subscription = action.payload.subscription
        state.isFetched = true
        state.error = null
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false
        // On error, deny access conservatively
        state.hasAccess = false
        state.isFetched = true
        state.error = action.payload
      })
  }
})

export const { resetSubscription, setSubscriptionData } =
  subscriptionSlice.actions
export default subscriptionSlice.reducer
