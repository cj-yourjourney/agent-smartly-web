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
      // Returns the created record including its id, which is stored in state
      // so the modal can PATCH it with the real time on close.
      const response = await api.post(API_CONFIG.ENDPOINTS.KEY_CONCEPT_VIEW, {
        concept_name: conceptName,
        topic,
        subtopic,
        time_spent_seconds: Math.min(timeSpentSeconds, MAX_TIME_SECONDS)
      })
      return response // { id, concept_name, topic, subtopic, time_spent_seconds, viewed_at }
    } catch (error) {
      console.warn('Failed to record concept view:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchConceptViewCounts = createAsyncThunk(
  'keyConcepts/fetchConceptViewCounts',
  async (_, { rejectWithValue }) => {
    try {
      // Returns { "Riparian Rights": 3, "Adverse Possession": 1, ... }
      return await api.get(API_CONFIG.ENDPOINTS.KEY_CONCEPT_VIEW_COUNTS)
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to fetch concept view counts'
      )
    }
  }
)

export const updateConceptViewTime = createAsyncThunk(
  'keyConcepts/updateConceptViewTime',
  async ({ id, timeSpentSeconds }, { rejectWithValue }) => {
    const MAX_TIME_SECONDS = 500
    try {
      await api.patch(`${API_CONFIG.ENDPOINTS.KEY_CONCEPT_VIEW}${id}/`, {
        time_spent_seconds: Math.min(timeSpentSeconds, MAX_TIME_SECONDS)
      })
    } catch (error) {
      // Silent failure — credit was already given on open, time is best-effort
      console.warn('Failed to update concept view time:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  concepts: [],
  examTopics: EXAM_TOPICS,
  expandedTopics: [],
  conceptViewCounts: {}, // { conceptName: reviewCount }
  loading: false,
  error: null,
  llmDialog: {
    isOpen: false,
    loading: false,
    error: null,
    data: null,
    viewStartTime: null,
    pendingConcept: null,
    pendingConceptViewId: null
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
      state.llmDialog.pendingConceptViewId = null
    },
    resetKeyConcepts: (state) => {
      state.concepts = []
      state.expandedTopics = []
      state.loading = false
      state.error = null
      state.llmDialog = {
        isOpen: false,
        loading: false,
        error: null,
        data: null,
        viewStartTime: null,
        pendingConcept: null,
        pendingConceptViewId: null
      }
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

      // Record concept view — store the returned id for the later PATCH,
      // and optimistically increment the local count so the badge updates
      // immediately without waiting for a refetch.
      .addCase(recordConceptView.fulfilled, (state, action) => {
        if (action.payload?.id) {
          state.llmDialog.pendingConceptViewId = action.payload.id
        }
        const name = action.meta.arg?.conceptName
        if (name) {
          state.conceptViewCounts[name] =
            (state.conceptViewCounts[name] ?? 0) + 1
        }
      })
      .addCase(recordConceptView.rejected, (state, action) => {
        console.warn('recordConceptView failed silently:', action.payload)
      })

      // Update concept view time — fire-and-forget on modal close
      .addCase(updateConceptViewTime.rejected, (state, action) => {
        console.warn('updateConceptViewTime failed silently:', action.payload)
      })

      // Fetch per-concept review counts from server
      .addCase(fetchConceptViewCounts.fulfilled, (state, action) => {
        state.conceptViewCounts = action.payload
      })
      .addCase(fetchConceptViewCounts.rejected, (state, action) => {
        // Silent failure — UI degrades gracefully (all badges show 0)
        console.warn('fetchConceptViewCounts failed silently:', action.payload)
      })
  }
})

// Selectors
export const selectKeyConcepts = (state) => state.keyConcepts.concepts
export const selectExamTopics = (state) => state.keyConcepts.examTopics
export const selectExpandedTopics = (state) => state.keyConcepts.expandedTopics
export const selectConceptViewCounts = (state) =>
  state.keyConcepts.conceptViewCounts
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
