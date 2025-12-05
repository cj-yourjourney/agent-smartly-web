// features/practice/state/practiceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG, api } from '../../../shared/api/config'
import { recordQuestionAttempt } from '../../progress/state/progressSlice'

export { recordQuestionAttempt }

// Async thunks
export const fetchTopics = createAsyncThunk(
  'practice/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.TOPICS)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchTopicStructure = createAsyncThunk(
  'practice/fetchTopicStructure',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.TOPIC_STRUCTURE)
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
      const data = await api.get(API_CONFIG.ENDPOINTS.QUESTIONS, { topic })
      return { questions: data, topic }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchQuestionsBySubtopic = createAsyncThunk(
  'practice/fetchQuestionsBySubtopic',
  async ({ topic, subtopic }, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.QUESTIONS, {
        topic,
        subtopic
      })
      return { questions: data, topic, subtopic }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPracticeQuizQuestions = createAsyncThunk(
  'practice/fetchPracticeQuizQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get(API_CONFIG.ENDPOINTS.PRACTICE_EXAM)
      return { questions: data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const checkAnswer = createAsyncThunk(
  'practice/checkAnswer',
  async ({ questionId, answer }, { rejectWithValue }) => {
    try {
      const data = await api.post(
        `${API_CONFIG.ENDPOINTS.QUESTIONS}${questionId}/check/`,
        { answer }
      )
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial state
const initialState = {
  topics: [],
  topicStructure: [],
  selectedTopic: null,
  selectedSubtopic: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: '',
  answerResult: null,
  loading: false,
  error: null,
  startTime: null,
  isPracticeQuiz: false
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
      state.selectedSubtopic = null
      state.questions = []
      state.currentQuestionIndex = 0
      state.selectedAnswer = ''
      state.answerResult = null
      state.startTime = null
      state.isPracticeQuiz = false
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
      // Fetch topic structure
      .addCase(fetchTopicStructure.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopicStructure.fulfilled, (state, action) => {
        state.loading = false
        state.topicStructure = action.payload
      })
      .addCase(fetchTopicStructure.rejected, (state, action) => {
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
        state.selectedSubtopic = null
        state.currentQuestionIndex = 0
        state.selectedAnswer = ''
        state.answerResult = null
        state.startTime = Date.now()
        state.isPracticeQuiz = false
      })
      .addCase(fetchQuestionsByTopic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch questions by subtopic
      .addCase(fetchQuestionsBySubtopic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestionsBySubtopic.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.selectedTopic = action.payload.topic
        state.selectedSubtopic = action.payload.subtopic
        state.currentQuestionIndex = 0
        state.selectedAnswer = ''
        state.answerResult = null
        state.startTime = Date.now()
        state.isPracticeQuiz = false
      })
      .addCase(fetchQuestionsBySubtopic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch practice quiz questions
      .addCase(fetchPracticeQuizQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPracticeQuizQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.selectedTopic = 'practice_quiz'
        state.selectedSubtopic = null
        state.currentQuestionIndex = 0
        state.selectedAnswer = ''
        state.answerResult = null
        state.startTime = Date.now()
        state.isPracticeQuiz = true
      })
      .addCase(fetchPracticeQuizQuestions.rejected, (state, action) => {
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
