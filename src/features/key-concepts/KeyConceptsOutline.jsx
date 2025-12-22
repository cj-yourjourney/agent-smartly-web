// features/key-concepts/KeyConceptsOutline.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchKeyConcepts,
  toggleTopic,
  askLLMAboutConcept,
  selectOrganizedConcepts,
  selectExpandedTopics,
  selectLoading,
  selectError,
  selectKeyConcepts,
  selectLLMDialog
} from './state/keyConceptsSlice'
import LLMExplanationModal from './components/LLMExplanationModal'
import { Brain, ChevronRight, Info } from 'lucide-react'

export default function KeyConceptsOutline() {
  const dispatch = useDispatch()
  const organizedConcepts = useSelector(selectOrganizedConcepts)
  const expandedTopics = useSelector(selectExpandedTopics)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const concepts = useSelector(selectKeyConcepts)
  const llmDialog = useSelector(selectLLMDialog)

  useEffect(() => {
    dispatch(fetchKeyConcepts())
  }, [dispatch])

  const handleToggleTopic = (code) => {
    dispatch(toggleTopic(code))
  }

  const handleAskLLM = (concept, subtopicName, topicName) => {
    dispatch(
      askLLMAboutConcept({
        conceptName: concept.name,
        subtopicName,
        topicName,
        description: concept.description
      })
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Key Concepts</h1>
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <span>{concepts.length} concepts</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Hover and click
              <kbd className="kbd kbd-xs">
                <Brain className="w-3 h-3" />
              </kbd>
              Explain for AI help
            </span>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {organizedConcepts.map((topic) => {
            const isExpanded = expandedTopics.includes(topic.code)
            const count = topic.subtopics.reduce(
              (sum, st) => sum + st.concepts.length,
              0
            )

            if (count === 0) return null

            return (
              <div
                key={topic.code}
                className="card bg-base-100 border border-base-300 shadow-sm"
              >
                {/* Topic Header */}
                <button
                  onClick={() => handleToggleTopic(topic.code)}
                  className="card-body p-5 flex-row items-center gap-3 hover:bg-base-200/50 transition-colors"
                >
                  <ChevronRight
                    className={`w-5 h-5 transition-transform flex-shrink-0 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="font-semibold flex-1 text-left">
                    {topic.name}
                  </span>
                  <div className="badge badge-ghost">{count}</div>
                </button>

                {/* Subtopics & Concepts */}
                {isExpanded && (
                  <div className="border-t border-base-300">
                    {topic.subtopics.map((subtopic, idx) => (
                      <div
                        key={subtopic.code}
                        className={`px-5 py-4 ${
                          idx !== topic.subtopics.length - 1
                            ? 'border-b border-base-200'
                            : ''
                        }`}
                      >
                        <div className="text-xs font-semibold text-base-content/60 tracking-wide mb-3">
                          {subtopic.name}
                        </div>
                        <div className="space-y-3">
                          {subtopic.concepts.map((concept) => (
                            <div
                              key={concept.id}
                              className="flex items-start gap-3 py-1 group"
                            >
                              <button
                                onClick={() =>
                                  handleAskLLM(
                                    concept,
                                    subtopic.name,
                                    topic.name
                                  )
                                }
                                disabled={llmDialog.loading}
                                className="btn btn-primary btn-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                              >
                                <Brain className="w-3 h-3" />
                                Explain
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {concept.name}
                                  </span>

                                  {/* Custom readable tooltip with Tailwind */}
                                  {concept.description && (
                                    <div className="relative group/tooltip inline-block">
                                      <Info className="w-3.5 h-3.5 text-info cursor-help" />

                                      {/* Tooltip content */}
                                      <div className="absolute left-0 top-6 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 z-50 pointer-events-none">
                                        <div className="bg-white text-gray-800 text-sm rounded-lg shadow-2xl border-2 border-gray-200 p-4 w-96 max-w-[calc(100vw-2rem)]">
                                          {/* Arrow pointing up */}
                                          <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l-2 border-t-2 border-gray-200 transform rotate-45"></div>

                                          {/* Content */}
                                          <p className="text-gray-700 leading-relaxed relative z-10">
                                            {concept.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {concept.page_number && (
                                    <span className="text-xs text-base-content/50">
                                      {/* {concept.page_number} */}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <LLMExplanationModal />
    </>
  )
}
