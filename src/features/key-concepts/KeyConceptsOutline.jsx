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
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react'

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

  const handleToggleTopic = (code) => dispatch(toggleTopic(code))

  const handleAskLLM = (
    concept,
    subtopicName,
    topicName,
    topicCode,
    subtopicCode
  ) => {
    dispatch(
      askLLMAboutConcept({
        conceptName: concept.name,
        subtopicName,
        topicName,
        topicCode,
        subtopicCode,
        description: concept.description
      })
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl p-4">
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-base-200 py-6 sm:py-8">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
              <h1 className="text-2xl font-bold">Key Concepts</h1>
            </div>
            <p className="text-sm text-base-content/50">
              {concepts.length} essential concepts for the CA Real Estate
              Salesperson exam
            </p>
            <p className="text-xs text-base-content/40 mt-1">
              Tap any concept for an AI explanation
            </p>
          </div>

          {/* Topics list */}
          <div className="space-y-3">
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
                  className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
                >
                  {/* Topic header */}
                  <button
                    onClick={() => handleToggleTopic(topic.code)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-base-200/60 transition-colors text-left"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-base-content/40 flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                    <span className="font-semibold flex-1 text-sm sm:text-base">
                      {topic.name}
                    </span>
                    <span className="badge badge-ghost badge-sm flex-shrink-0">
                      {count}
                    </span>
                  </button>

                  {/* Subtopics & concepts */}
                  {isExpanded && (
                    <div className="border-t border-base-200">
                      {topic.subtopics.map((subtopic, idx) => (
                        <div
                          key={subtopic.code}
                          className={
                            idx !== topic.subtopics.length - 1
                              ? 'border-b border-base-200'
                              : ''
                          }
                        >
                          {/* Subtopic label */}
                          <div className="px-4 pt-3 pb-2">
                            <span className="text-xs font-semibold text-base-content/40 uppercase tracking-wide">
                              {subtopic.name}
                            </span>
                          </div>

                          {/* Concept rows — clearly tappable cards */}
                          <div className="px-3 pb-3 space-y-1.5">
                            {subtopic.concepts.map((concept) => (
                              <button
                                key={concept.id}
                                onClick={() =>
                                  handleAskLLM(
                                    concept,
                                    subtopic.name,
                                    topic.name,
                                    topic.code,
                                    subtopic.code
                                  )
                                }
                                disabled={llmDialog.loading}
                                className="w-full flex items-center justify-between gap-3 px-3.5 py-3 bg-base-200 hover:bg-base-300 active:scale-[0.98] rounded-lg transition-all text-left disabled:opacity-50"
                              >
                                <span className="text-sm font-medium text-base-content/80">
                                  {concept.name}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-base-content/30 flex-shrink-0" />
                              </button>
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
      </div>

      <LLMExplanationModal />
    </>
  )
}
