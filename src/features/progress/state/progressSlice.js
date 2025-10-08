// features/progress/state/progressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG, api } from '../../../shared/api/config'

// Async thunks
export const fetchProgressSummary = createAsyncThunk(
  'progress/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.PROGRESS_SUMMARY)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchTopicProgress = createAsyncThunk(
  'progress/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.PROGRESS_TOPICS)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchSubtopicProgress = createAsyncThunk(
  'progress/fetchSubtopics',
  async (topic = null, { rejectWithValue }) => {
    try {
      const params = topic ? { topic } : {}
      const data = await api.get(
        API_CONFIG.ENDPOINTS.PROGRESS_SUBTOPICS,
        params
      )
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchWeakAreas = createAsyncThunk(
  'progress/fetchWeakAreas',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.WEAK_AREAS)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRecentActivity = createAsyncThunk(
  'progress/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.RECENT_ACTIVITY)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Centralized action for recording question attempts
 * Used by both practice and exam modules
 * @param {Object} payload - Question attempt data
 * @param {number} payload.questionId - The question ID
 * @param {string} payload.userAnswer - The user's answer
 * @param {number} payload.timeSpent - Time spent in seconds
 * @param {boolean} [payload.isCorrect] - Optional: Whether answer is correct (for exam mode)
 */
export const recordQuestionAttempt = createAsyncThunk(
  'progress/recordQuestionAttempt',
  async (
    { questionId, userAnswer, timeSpent, isCorrect },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        question_id: questionId,
        user_answer: userAnswer,
        time_spent_seconds: timeSpent
      }

      // Include isCorrect only if provided (for exam submissions)
      if (isCorrect !== undefined) {
        payload.is_correct = isCorrect
      }

      const data = await api.post(API_CONFIG.ENDPOINTS.ATTEMPTS, payload)
      return data
    } catch (error) {
      // Log error but don't break the user flow
      console.error('Failed to record question attempt:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Initial state
const initialState = {
  summary: {
    total_questions_attempted: 0,
    total_correct: 0,
    total_incorrect: 0,
    overall_accuracy: 0,
    questions_last_7_days: 0,
    current_streak_days: 0,
    longest_streak_days: 0,
    last_practice_date: null
  },
  topicProgress: [],
  subtopicProgress: [],
  weakAreas: [],
  recentActivity: [],
  loading: false,
  error: null,
  selectedTopic: null,
  recordingAttempt: false
}

// Slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setSelectedTopic: (state, action) => {
      state.selectedTopic = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch progress summary
      .addCase(fetchProgressSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProgressSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchProgressSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch topic progress
      .addCase(fetchTopicProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopicProgress.fulfilled, (state, action) => {
        state.loading = false
        state.topicProgress = action.payload
      })
      .addCase(fetchTopicProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch subtopic progress
      .addCase(fetchSubtopicProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubtopicProgress.fulfilled, (state, action) => {
        state.loading = false
        state.subtopicProgress = action.payload
      })
      .addCase(fetchSubtopicProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch weak areas
      .addCase(fetchWeakAreas.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeakAreas.fulfilled, (state, action) => {
        state.loading = false
        state.weakAreas = action.payload
      })
      .addCase(fetchWeakAreas.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch recent activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading = false
        state.recentActivity = action.payload
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Record question attempt
      .addCase(recordQuestionAttempt.pending, (state) => {
        state.recordingAttempt = true
      })
      .addCase(recordQuestionAttempt.fulfilled, (state) => {
        state.recordingAttempt = false
        // Optionally trigger a refresh of progress data here
      })
      .addCase(recordQuestionAttempt.rejected, (state, action) => {
        state.recordingAttempt = false
        // Silent failure - don't set error to avoid disrupting user flow
        console.error('Failed to record attempt:', action.payload)
      })
  }
})

export const { setSelectedTopic, clearError } = progressSlice.actions
export default progressSlice.reducer
