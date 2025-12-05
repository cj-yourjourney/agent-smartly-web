// features/key-concepts/state/keyConceptsSlice.js
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

// Mock LLM responses for demonstration
const MOCK_LLM_RESPONSES = {
  default: {
    explanation:
      'This is a fundamental concept in California real estate law. It involves understanding the legal principles and practical applications that govern property rights and transactions.',
    memoryTricks: [
      'Think of the first letter of each key term to create a memorable acronym',
      "Connect this concept to a real-world example you've experienced",
      'Create a mental image or story that links the concept to something familiar'
    ],
    keyPoints: [
      'Understanding the legal definition and implications',
      'Recognizing how it applies in different scenarios',
      'Knowing the exceptions and special cases'
    ]
  }
}

// Async thunk for fetching key concepts
export const fetchKeyConcepts = createAsyncThunk(
  'keyConcepts/fetchKeyConcepts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/api/key-concepts/')
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch key concepts')
    }
  }
)

// Async thunk for asking LLM about a concept (mock for now)
export const askLLMAboutConcept = createAsyncThunk(
  'keyConcepts/askLLMAboutConcept',
  async ({ conceptName, subtopicName, topicName }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Replace with actual API call when endpoint is ready
      // const response = await api.post('/api/key-concepts/explain/', {
      //   concept: conceptName,
      //   subtopic: subtopicName,
      //   topic: topicName
      // })

      // Mock response
      const mockResponse = {
        concept: conceptName,
        subtopic: subtopicName,
        topic: topicName,
        explanation: `${conceptName} is a key concept within ${subtopicName}. ${MOCK_LLM_RESPONSES.default.explanation}`,
        memoryTricks: MOCK_LLM_RESPONSES.default.memoryTricks.map(
          (trick) => `For "${conceptName}": ${trick}`
        ),
        keyPoints: MOCK_LLM_RESPONSES.default.keyPoints,
        examples: [
          `A practical example of ${conceptName} would be in a typical residential transaction...`,
          `Another scenario where ${conceptName} applies is when dealing with commercial properties...`
        ]
      }

      return mockResponse
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get explanation')
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
    data: null
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
    openLLMDialog: (state) => {
      state.llmDialog.isOpen = true
    },
    closeLLMDialog: (state) => {
      state.llmDialog.isOpen = false
      state.llmDialog.data = null
      state.llmDialog.error = null
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
      .addCase(askLLMAboutConcept.pending, (state) => {
        state.llmDialog.loading = true
        state.llmDialog.error = null
      })
      .addCase(askLLMAboutConcept.fulfilled, (state, action) => {
        state.llmDialog.loading = false
        state.llmDialog.data = action.payload
        state.llmDialog.isOpen = true
      })
      .addCase(askLLMAboutConcept.rejected, (state, action) => {
        state.llmDialog.loading = false
        state.llmDialog.error = action.payload
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

// Selector to organize concepts by topic and subtopic
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

// Selector to check if topic is expanded
export const selectIsTopicExpanded = (topicCode) => (state) => {
  return state.keyConcepts.expandedTopics.includes(topicCode)
}

export const {
  toggleTopic,
  expandAllTopics,
  collapseAllTopics,
  openLLMDialog,
  closeLLMDialog,
  resetKeyConcepts
} = keyConceptsSlice.actions

export default keyConceptsSlice.reducer
