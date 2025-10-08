// features/exam/state/examSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api, API_CONFIG } from '../../../shared/api/config'
// Import the centralized recordQuestionAttempt action
import { recordQuestionAttempt } from '../../progress/state/progressSlice'


// Export the shared action for use in exam components
export { recordQuestionAttempt }



// Async thunks
export const fetchExamQuestions = createAsyncThunk(
  'exam/fetchExamQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.EXAM_QUESTIONS)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch exam questions')
    }
  }
)

export const fetchExamStats = createAsyncThunk(
  'exam/fetchExamStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.EXAM_STATS)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch exam stats')
    }
  }
)

export const submitExam = createAsyncThunk(
  'exam/submitExam',
  async ({ answers, totalTime }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.EXAM_SUBMIT, {
        answers,
        total_time: totalTime
      })
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit exam')
    }
  }
)



const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [], // { question_id, user_answer, time_spent }
  selectedAnswer: null,
  examStartTime: null,
  questionStartTime: null,
  examStats: null,
  examResults: null,
  isExamStarted: false,
  isExamSubmitted: false,
  loading: false,
  error: null,
  showReviewMode: false
}

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    startExam: (state) => {
      state.isExamStarted = true
      state.examStartTime = Date.now()
      state.questionStartTime = Date.now()
      state.currentQuestionIndex = 0
      state.answers = []
      state.selectedAnswer = null
      state.examResults = null
      state.isExamSubmitted = false
      state.showReviewMode = false
    },
    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload
    },
    saveAnswer: (state) => {
      if (state.selectedAnswer === null) return

      const currentQuestion = state.questions[state.currentQuestionIndex]
      const timeSpent = Math.floor(
        (Date.now() - state.questionStartTime) / 1000
      )

      // Check if answer already exists for this question
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.question_id === currentQuestion.id
      )

      const answerData = {
        question_id: currentQuestion.id,
        user_answer: state.selectedAnswer,
        time_spent: timeSpent
      }

      if (existingAnswerIndex !== -1) {
        // Update existing answer
        state.answers[existingAnswerIndex] = answerData
      } else {
        // Add new answer
        state.answers.push(answerData)
      }
    },
    goToQuestion: (state, action) => {
      const targetIndex = action.payload
      if (targetIndex >= 0 && targetIndex < state.questions.length) {
        state.currentQuestionIndex = targetIndex
        state.questionStartTime = Date.now()

        // Load existing answer if available
        const currentQuestion = state.questions[targetIndex]
        const existingAnswer = state.answers.find(
          (a) => a.question_id === currentQuestion.id
        )
        state.selectedAnswer = existingAnswer
          ? existingAnswer.user_answer
          : null
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1
        state.questionStartTime = Date.now()

        // Load existing answer if available
        const currentQuestion = state.questions[state.currentQuestionIndex]
        const existingAnswer = state.answers.find(
          (a) => a.question_id === currentQuestion.id
        )
        state.selectedAnswer = existingAnswer
          ? existingAnswer.user_answer
          : null
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
        state.questionStartTime = Date.now()

        // Load existing answer if available
        const currentQuestion = state.questions[state.currentQuestionIndex]
        const existingAnswer = state.answers.find(
          (a) => a.question_id === currentQuestion.id
        )
        state.selectedAnswer = existingAnswer
          ? existingAnswer.user_answer
          : null
      }
    },
    toggleReviewMode: (state) => {
      state.showReviewMode = !state.showReviewMode
    },
    resetExam: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch exam questions
      .addCase(fetchExamQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExamQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.error = null
      })
      .addCase(fetchExamQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch exam stats
      .addCase(fetchExamStats.fulfilled, (state, action) => {
        state.examStats = action.payload
      })
      // Submit exam
      .addCase(submitExam.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.loading = false
        state.examResults = action.payload
        state.isExamSubmitted = true
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const {
  startExam,
  setSelectedAnswer,
  saveAnswer,
  goToQuestion,
  nextQuestion,
  previousQuestion,
  toggleReviewMode,
  resetExam
} = examSlice.actions

export default examSlice.reducer
