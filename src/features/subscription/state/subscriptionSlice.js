// src/features/subscription/state/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../../shared/api/config'
import { API_CONFIG } from '../../../shared/api/config'

/**
 * Fetch subscription + access status from /api/profiles/details/
 * Returns has_access, subscription, trial_questions_used, trial_questions_limit.
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
    trialQuestionsUsed: 0, // questions answered during free trial
    trialQuestionsLimit: 60, // free question cap (mirrors TRIAL_QUESTION_LIMIT)
    isLoading: false,
    isFetched: false, // true once we've completed at least one fetch
    error: null
  },
  reducers: {
    // Dispatch on logout to clear all subscription state
    resetSubscription: (state) => {
      state.hasAccess = null
      state.subscription = null
      state.trialQuestionsUsed = 0
      state.trialQuestionsLimit = 60
      state.isLoading = false
      state.isFetched = false
      state.error = null
    },
    // Optimistic update — called by AccountPage after a successful payment
    // so guarded pages unlock immediately without waiting for a re-fetch
    setSubscriptionData: (state, action) => {
      state.hasAccess = action.payload.has_access ?? state.hasAccess
      state.subscription = action.payload.subscription ?? state.subscription
      if (action.payload.trial_questions_used !== undefined) {
        state.trialQuestionsUsed = action.payload.trial_questions_used
      }
      if (action.payload.trial_questions_limit !== undefined) {
        state.trialQuestionsLimit = action.payload.trial_questions_limit
      }
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
        state.trialQuestionsUsed = action.payload.trial_questions_used ?? 0
        state.trialQuestionsLimit = action.payload.trial_questions_limit ?? 60
        state.isFetched = true
        state.error = null
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false
        // BUG FIX: Do NOT set hasAccess=false on a network/API error.
        // A failed fetch does not mean the user has no access — it means we
        // don't know yet. Keeping hasAccess=null lets SubscriptionGuard spin
        // instead of falsely showing the paywall to legitimate users.
        state.hasAccess = null
        state.isFetched = true
        state.error = action.payload
      })
  }
})

export const { resetSubscription, setSubscriptionData } =
  subscriptionSlice.actions
export default subscriptionSlice.reducer
