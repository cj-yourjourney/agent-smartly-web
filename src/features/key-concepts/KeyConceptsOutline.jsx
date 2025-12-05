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
import { Sparkles } from 'lucide-react'

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
        topicName
      })
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="alert alert-error">
          <span>Error loading concepts: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            CA Real Estate Study Guide
          </h1>
          <p className="text-sm text-base-content/70">
            Key concepts organized by exam outline. Click the{' '}
            <Sparkles className="w-4 h-4 inline text-primary" /> icon to get AI
            explanations and memory tricks!
          </p>
        </div>

        <div className="stats shadow mb-6 w-full">
          <div className="stat">
            <div className="stat-title">Total Concepts</div>
            <div className="stat-value text-primary">{concepts.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Topics Covered</div>
            <div className="stat-value">
              {organizedConcepts.filter((t) => t.subtopics.length > 0).length}/7
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {organizedConcepts.map((topic) => {
            const isExpanded = expandedTopics.includes(topic.code)
            const count = topic.subtopics.reduce(
              (sum, st) => sum + st.concepts.length,
              0
            )

            return (
              <div key={topic.code} className="collapse bg-base-200">
                <input
                  type="checkbox"
                  checked={isExpanded}
                  onChange={() => handleToggleTopic(topic.code)}
                />
                <div className="collapse-title flex items-center gap-4 cursor-pointer">
                  <span className="font-semibold flex-1">{topic.name}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="badge badge-primary whitespace-nowrap">
                      {topic.percentage}
                    </div>
                    <div className="badge badge-ghost whitespace-nowrap">
                      {count}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                <div className="collapse-content">
                  {count === 0 ? (
                    <div className="alert alert-warning">
                      <span>No concepts added yet</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topic.subtopics.map((subtopic) => (
                        <div key={subtopic.code} className="card bg-base-100">
                          <div className="card-body p-4">
                            <h3 className="font-medium text-sm mb-2">
                              {subtopic.name}
                              <span className="badge badge-sm ml-2">
                                {subtopic.concepts.length}
                              </span>
                            </h3>
                            <ul className="space-y-1">
                              {subtopic.concepts.map((concept) => (
                                <li
                                  key={concept.id}
                                  className="flex items-center gap-2 text-sm group hover:bg-base-200 p-2 rounded transition-colors"
                                >
                                  <button
                                    onClick={() =>
                                      handleAskLLM(
                                        concept,
                                        subtopic.name,
                                        topic.name
                                      )
                                    }
                                    className="btn btn-xs btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={llmDialog.loading}
                                    title="Ask AI about this concept"
                                  >
                                    <Sparkles className="w-3 h-3 text-primary" />
                                  </button>
                                  <span>•</span>
                                  <span className="flex-1">
                                    {concept.name}
                                    {concept.page_number && (
                                      <span className="text-xs text-base-content/60 ml-2">
                                        {concept.page_number}
                                      </span>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* LLM Explanation Modal */}
      <LLMExplanationModal />
    </>
  )
}
