// features/practice/state/practiceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG } from '../../../shared/api/config'

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRACTICE}`
const PROGRESS_URL = `${API_CONFIG.BASE_URL}/api/progress`

// Async thunks
export const fetchTopics = createAsyncThunk(
  'practice/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/topics/`)
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchQuestionsByTopic = createAsyncThunk(
  'practice/fetchQuestionsByTopic',
  async (topic, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/questions/?topic=${topic}`)
      const data = await response.json()
      return { questions: data, topic }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const checkAnswer = createAsyncThunk(
  'practice/checkAnswer',
  async ({ questionId, answer }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/questions/${questionId}/check/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answer })
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const recordQuestionAttempt = createAsyncThunk(
  'practice/recordAttempt',
  async ({ questionId, userAnswer, timeSpent }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${PROGRESS_URL}/attempts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question_id: questionId,
          user_answer: userAnswer,
          time_spent_seconds: timeSpent
        })
      })

      if (!response.ok) {
        throw new Error('Failed to record attempt')
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial state
const initialState = {
  topics: [],
  selectedTopic: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: '',
  answerResult: null,
  loading: false,
  error: null,
  startTime: null
}

// Slice
const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload
      state.selectedAnswer = ''
      state.answerResult = null
      state.startTime = Date.now()
    },
    resetAnswerState: (state) => {
      state.selectedAnswer = ''
      state.answerResult = null
    },
    goToNextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
        state.selectedAnswer = ''
        state.answerResult = null
        state.startTime = Date.now()
      }
    },
    goToPreviousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
        state.selectedAnswer = ''
        state.answerResult = null
        state.startTime = Date.now()
      }
    },
    resetToTopicSelection: (state) => {
      state.selectedTopic = null
      state.questions = []
      state.currentQuestionIndex = 0
      state.selectedAnswer = ''
      state.answerResult = null
      state.startTime = null
    },
    setStartTime: (state) => {
      state.startTime = Date.now()
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false
        state.topics = action.payload
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch questions by topic
      .addCase(fetchQuestionsByTopic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestionsByTopic.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.selectedTopic = action.payload.topic
        state.currentQuestionIndex = 0
        state.selectedAnswer = ''
        state.answerResult = null
        state.startTime = Date.now()
      })
      .addCase(fetchQuestionsByTopic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Check answer
      .addCase(checkAnswer.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAnswer.fulfilled, (state, action) => {
        state.loading = false
        state.answerResult = action.payload
      })
      .addCase(checkAnswer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Record attempt (silent, doesn't affect UI)
      .addCase(recordQuestionAttempt.rejected, (state, action) => {
        console.error('Failed to record attempt:', action.payload)
      })
  }
})

export const {
  setSelectedAnswer,
  setCurrentQuestionIndex,
  resetAnswerState,
  goToNextQuestion,
  goToPreviousQuestion,
  resetToTopicSelection,
  setStartTime
} = practiceSlice.actions

export default practiceSlice.reducer
