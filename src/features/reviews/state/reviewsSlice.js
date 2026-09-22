import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, API_CONFIG } from '../../../shared/api/config'

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.REVIEWS, {
        page,
        page_size: pageSize
      })
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load reviews')
    }
  }
)

export const fetchReviewSummary = createAsyncThunk(
  'reviews/fetchReviewSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.REVIEWS_SUMMARY)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load review summary')
    }
  }
)

const initialState = {
  results: [],
  count: 0,
  next: null,
  previous: null,
  page: 1,
  status: 'idle',
  error: null,
  summary: {
    averageRating: 0,
    count: 0,
    breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    status: 'idle'
  }
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.results = action.payload.results
        state.count = action.payload.count
        state.next = action.payload.next
        state.previous = action.payload.previous
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(fetchReviewSummary.pending, (state) => {
        state.summary.status = 'loading'
      })
      .addCase(fetchReviewSummary.fulfilled, (state, action) => {
        state.summary.status = 'succeeded'
        state.summary.averageRating = action.payload.average_rating
        state.summary.count = action.payload.count
        state.summary.breakdown = action.payload.breakdown
      })
      .addCase(fetchReviewSummary.rejected, (state) => {
        state.summary.status = 'failed'
      })
  }
})

export const { setPage } = reviewsSlice.actions
export default reviewsSlice.reducer
