import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_CONFIG } from '@/shared/api/config'

// Fetch progress attempts
export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.access // from your authSlice

      if (!token) {
        return rejectWithValue({ detail: 'Not authenticated' })
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/api/progress/attempts/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: 'Failed to fetch progress' }
      )
    }
  }
)

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    attempts: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.attempts = action.payload
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.detail || 'Unable to load progress.'
      })
  }
})

export default progressSlice.reducer
