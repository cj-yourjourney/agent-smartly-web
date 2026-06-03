import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchKeyConcepts,
  fetchConceptViewCounts,
  toggleTopic,
  askLLMAboutConcept,
  selectOrganizedConcepts,
  selectExpandedTopics,
  selectHighlightedTopicCode,
  selectLoading,
  selectError,
  selectKeyConcepts,
  selectLLMDialog,
  selectConceptViewCounts,
  setHighlightedTopic
} from './state/keyConceptsSlice'
import LLMExplanationModal from './components/LLMExplanationModal'
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react'

export default function KeyConceptsOutline() {
  const dispatch = useDispatch()
  const organizedConcepts = useSelector(selectOrganizedConcepts)
  const expandedTopics = useSelector(selectExpandedTopics)
  const highlightedTopicCode = useSelector(selectHighlightedTopicCode)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const concepts = useSelector(selectKeyConcepts)
  const llmDialog = useSelector(selectLLMDialog)
  const conceptViewCounts = useSelector(selectConceptViewCounts)

  // Ref map: topic.code → DOM element, for scrolling to the highlighted topic
  const topicRefs = useRef({})

  useEffect(() => {
    dispatch(fetchKeyConcepts())
    dispatch(fetchConceptViewCounts())
    // Clear the highlight when user leaves the page
    return () => {
      dispatch(setHighlightedTopic(null))
    }
  }, [dispatch])

  // Scroll highlighted topic into view once concepts have loaded
  useEffect(() => {
    if (!highlightedTopicCode || loading) return
    const el = topicRefs.current[highlightedTopicCode]
    if (el) {
      // Small delay so the expand animation doesn't fight the scroll
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }, [highlightedTopicCode, loading])

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
      <div className="min-h-screen bg-base-200 pb-10">
        {/* Sticky page header */}
        <div className="sticky top-0 z-10 bg-base-200/90 backdrop-blur-sm border-b border-base-300 px-4 py-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Key Concepts
                </h1>
                <p className="text-xs text-base-content/45 leading-none mt-0.5">
                  {concepts.length} essential concepts · CA Real Estate
                  Salesperson Exam · Tap to get AI explanation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="container mx-auto max-w-3xl px-4 pt-4 space-y-2">
          {organizedConcepts.map((topic, topicIdx) => {
            const isExpanded = expandedTopics.includes(topic.code)
            const isHighlighted = highlightedTopicCode === topic.code
            const count = topic.subtopics.reduce(
              (sum, st) => sum + st.concepts.length,
              0
            )
            if (count === 0) return null

            return (
              <div
                key={topic.code}
                ref={(el) => {
                  topicRefs.current[topic.code] = el
                }}
                className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-base-100 border-warning/60 shadow-lg ring-2 ring-warning/30'
                    : isExpanded
                      ? 'bg-base-100 border-primary/20 shadow-md'
                      : 'bg-base-100 border-base-200 shadow-sm'
                }`}
              >
                {/* Topic toggle */}
                <button
                  onClick={() => handleToggleTopic(topic.code)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-base-200/60 transition-colors"
                >
                  {/* Number badge */}
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isHighlighted
                        ? 'bg-warning text-warning-content'
                        : isExpanded
                          ? 'bg-primary text-primary-content'
                          : 'bg-base-200 text-base-content/50'
                    }`}
                  >
                    {topicIdx + 1}
                  </span>

                  <span className="font-semibold flex-1 text-sm leading-snug">
                    {topic.name}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* "Review this" badge shown only on the highlighted topic */}
                    {isHighlighted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/15 text-warning text-[10px] font-bold uppercase tracking-wide">
                        ★ Review this
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium tabular-nums ${isExpanded || isHighlighted ? 'text-primary' : 'text-base-content/40'}`}
                    >
                      {count}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-base-content/40 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-base-200">
                    {topic.subtopics.map((subtopic, stIdx) => {
                      if (subtopic.concepts.length === 0) return null
                      return (
                        <div key={subtopic.code}>
                          {/* Subtopic divider label */}
                          <div
                            className={`px-4 py-2 ${stIdx > 0 ? 'border-t border-base-200' : ''}`}
                          >
                            <span className="text-[10px] font-bold text-base-content/35 uppercase tracking-widest">
                              {subtopic.name}
                            </span>
                          </div>

                          {/* Concept rows */}
                          <div className="px-3 pb-3 space-y-1">
                            {subtopic.concepts.map((concept) => {
                              const reviewCount =
                                conceptViewCounts[concept.name] ?? 0
                              return (
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
                                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-base-200/70 hover:bg-base-200 active:bg-base-300 active:scale-[0.985] rounded-xl transition-all text-left disabled:opacity-40"
                                >
                                  <span className="text-sm text-base-content leading-snug flex-1">
                                    {concept.name}
                                  </span>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {reviewCount > 0 ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-base-300/60 text-base-content/45 text-[10px] font-medium leading-none">
                                        Reviewed {reviewCount} times
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-base-200 text-base-content/25 text-[11px] font-medium leading-none">
                                        New
                                      </span>
                                    )}
                                    <ChevronRight className="w-3.5 h-3.5 text-base-content/25" />
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
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
