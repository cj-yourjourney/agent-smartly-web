import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_CONFIG, api } from '../../../shared/api/config'

const EXAM_TOPICS = [
  {
    code: 'property_ownership',
    name: 'Property Ownership and Land Use Controls',
    percentage: '15%'
  },
  {
    code: 'agency_laws',
    name: 'Laws of Agency and Fiduciary Duties',
    percentage: '17%'
  },
  {
    code: 'valuation',
    name: 'Property Valuation and Financial Analysis',
    percentage: '14%'
  },
  { code: 'financing', name: 'Financing', percentage: '9%' },
  { code: 'transfer', name: 'Transfer of Property', percentage: '8%' },
  {
    code: 'practice_disclosures',
    name: 'Practice of Real Estate and Disclosures',
    percentage: '25%'
  },
  { code: 'contracts', name: 'Contracts', percentage: '12%' }
]

export const fetchKeyConcepts = createAsyncThunk(
  'keyConcepts/fetchKeyConcepts',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.KEY_CONCEPTS)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch key concepts')
    }
  }
)

export const askLLMAboutConcept = createAsyncThunk(
  'keyConcepts/askLLMAboutConcept',
  async (
    {
      conceptName,
      subtopicName,
      topicName,
      topicCode,
      subtopicCode,
      description
    },
    { rejectWithValue, dispatch }
  ) => {
    // Record the view immediately on open — credit is given for any interaction,
    // regardless of how long the modal stays open or whether it is closed.
    dispatch(
      recordConceptView({
        conceptName,
        topic: topicCode,
        subtopic: subtopicCode,
        timeSpentSeconds: 0
      })
    )

    try {
      const requestBody = {
        main_topic: topicName,
        subtopic: subtopicName,
        key_concept: conceptName
      }

      if (description) {
        requestBody.description = description
      }

      const response = await api.post(
        API_CONFIG.ENDPOINTS.EXPLAIN_CONCEPT,
        requestBody
      )

      if (!response.success) {
        throw new Error(response.error || 'Failed to get explanation')
      }

      return {
        concept: response.concept,
        subtopic: response.subtopic,
        topic: response.main_topic,
        simpleExplanation: response.explanation.simple_explanation,
        keyPoints: response.explanation.key_points,
        memoryTricks: response.explanation.memory_tricks,
        realWorldExample: response.explanation.real_world_example,
        examTip: response.explanation.exam_tip
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get explanation')
    }
  }
)

export const recordConceptView = createAsyncThunk(
  'keyConcepts/recordConceptView',
  async (
    { conceptName, topic, subtopic, timeSpentSeconds },
    { rejectWithValue }
  ) => {
    const MAX_TIME_SECONDS = 500
    try {
      await api.post(API_CONFIG.ENDPOINTS.KEY_CONCEPT_VIEW, {
        concept_name: conceptName,
        topic,
        subtopic,
        time_spent_seconds: Math.min(timeSpentSeconds, MAX_TIME_SECONDS)
      })
    } catch (error) {
      console.warn('Failed to record concept view:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  concepts: [],
  examTopics: EXAM_TOPICS,
  expandedTopics: [],
  loading: false,
  error: null,
  llmDialog: {
    isOpen: false,
    loading: false,
    error: null,
    data: null,
    viewStartTime: null,
    pendingConcept: null
  }
}

const keyConceptsSlice = createSlice({
  name: 'keyConcepts',
  initialState,
  reducers: {
    toggleTopic: (state, action) => {
      const topicCode = action.payload
      const index = state.expandedTopics.indexOf(topicCode)
      if (index > -1) {
        state.expandedTopics.splice(index, 1)
      } else {
        state.expandedTopics.push(topicCode)
      }
    },
    expandAllTopics: (state) => {
      state.expandedTopics = state.examTopics.map((t) => t.code)
    },
    collapseAllTopics: (state) => {
      state.expandedTopics = []
    },
    closeLLMDialog: (state) => {
      state.llmDialog.isOpen = false
      state.llmDialog.data = null
      state.llmDialog.error = null
      state.llmDialog.viewStartTime = null
      state.llmDialog.pendingConcept = null
    },
    resetKeyConcepts: (state) => {
      state.concepts = []
      state.expandedTopics = []
      state.loading = false
      state.error = null
      state.llmDialog = initialState.llmDialog
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch concepts
      .addCase(fetchKeyConcepts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchKeyConcepts.fulfilled, (state, action) => {
        state.loading = false
        state.concepts = action.payload
        state.error = null
      })
      .addCase(fetchKeyConcepts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Ask LLM
      .addCase(askLLMAboutConcept.pending, (state, action) => {
        state.llmDialog.loading = true
        state.llmDialog.error = null
        state.llmDialog.isOpen = true
        state.llmDialog.viewStartTime = Date.now()
        const { conceptName, topicCode, subtopicCode } = action.meta.arg
        state.llmDialog.pendingConcept = {
          conceptName,
          topic: topicCode,
          subtopic: subtopicCode
        }
      })
      .addCase(askLLMAboutConcept.fulfilled, (state, action) => {
        state.llmDialog.loading = false
        state.llmDialog.data = action.payload
      })
      .addCase(askLLMAboutConcept.rejected, (state, action) => {
        state.llmDialog.loading = false
        state.llmDialog.error = action.payload
      })

      // Record concept view (fire-and-forget, no state changes needed)
      .addCase(recordConceptView.rejected, (state, action) => {
        console.warn('recordConceptView failed silently:', action.payload)
      })
  }
})

// Selectors
export const selectKeyConcepts = (state) => state.keyConcepts.concepts
export const selectExamTopics = (state) => state.keyConcepts.examTopics
export const selectExpandedTopics = (state) => state.keyConcepts.expandedTopics
export const selectLoading = (state) => state.keyConcepts.loading
export const selectError = (state) => state.keyConcepts.error
export const selectLLMDialog = (state) => state.keyConcepts.llmDialog

export const selectOrganizedConcepts = (state) => {
  const { concepts, examTopics } = state.keyConcepts

  return examTopics.map((topic) => {
    const topicConcepts = concepts.filter((c) => c.topic === topic.code)
    const subtopicMap = new Map()

    topicConcepts.forEach((concept) => {
      if (!subtopicMap.has(concept.subtopic)) {
        subtopicMap.set(concept.subtopic, [])
      }
      subtopicMap.get(concept.subtopic).push(concept)
    })

    return {
      ...topic,
      subtopics: Array.from(subtopicMap.entries()).map(([code, concepts]) => ({
        code,
        name: concepts[0].subtopic_display,
        concepts
      }))
    }
  })
}

export const selectIsTopicExpanded = (topicCode) => (state) => {
  return state.keyConcepts.expandedTopics.includes(topicCode)
}

export const {
  toggleTopic,
  expandAllTopics,
  collapseAllTopics,
  closeLLMDialog,
  resetKeyConcepts
} = keyConceptsSlice.actions

export default keyConceptsSlice.reducer
