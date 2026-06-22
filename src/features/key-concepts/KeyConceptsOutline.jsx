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
import { fetchTopicProgress } from '../progress/state/progressSlice'
import LLMExplanationModal from './components/LLMExplanationModal'
import ConceptsPageHeader from './components/ConceptsPageHeader'
import GuidanceBanner from './components/GuidanceBanner'
import TopicCard from './components/TopicCard'

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
  const topicProgress = useSelector((s) => s.progress?.topicProgress ?? [])

  // Ref map: topic.code → DOM element, for scrolling to the highlighted topic
  const topicRefs = useRef({})
  // Guard: only clear the highlight when the component truly unmounts (user
  // navigates away), not during React's initial mount / StrictMode double-invoke.
  const isMountedRef = useRef(false)

  useEffect(() => {
    dispatch(fetchKeyConcepts())
    dispatch(fetchConceptViewCounts())
    // Fetch topic progress only if not already in store (e.g. user came here
    // directly without visiting the Progress page first)
    if (topicProgress.length === 0) {
      dispatch(fetchTopicProgress())
    }
    isMountedRef.current = true
    return () => {
      if (isMountedRef.current) {
        dispatch(setHighlightedTopic(null))
      }
    }
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll highlighted topic into view once concepts have loaded
  useEffect(() => {
    if (!highlightedTopicCode || loading) return
    const el = topicRefs.current[highlightedTopicCode]
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }, [highlightedTopicCode, loading])

  // Auto-highlight weakest topic when arriving organically (no session highlight)
  useEffect(() => {
    if (highlightedTopicCode || loading || topicProgress.length === 0) return
    const knownCodes = new Set(organizedConcepts.map((t) => t.code))
    const practiced = topicProgress
      .filter((t) => t.questions_attempted > 0 && knownCodes.has(t.topic))
      .sort((a, b) => a.accuracy - b.accuracy)
    if (practiced.length > 0) {
      dispatch(setHighlightedTopic(practiced[0].topic))
    }
  }, [
    loading,
    topicProgress,
    organizedConcepts,
    highlightedTopicCode,
    dispatch
  ])

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
        <ConceptsPageHeader
          concepts={concepts}
          conceptViewCounts={conceptViewCounts}
        />

        <div className="container mx-auto max-w-3xl px-4 pt-4 space-y-2">
          <GuidanceBanner
            topicProgress={topicProgress}
            highlightedTopicCode={highlightedTopicCode}
            organizedConcepts={organizedConcepts}
            conceptViewCounts={conceptViewCounts}
          />

          {organizedConcepts.map((topic, topicIdx) => {
            const tp = topicProgress.find((t) => t.topic === topic.code)
            return (
              <TopicCard
                key={topic.code}
                topic={topic}
                topicIdx={topicIdx}
                isExpanded={expandedTopics.includes(topic.code)}
                isHighlighted={highlightedTopicCode === topic.code}
                conceptViewCounts={conceptViewCounts}
                onToggle={handleToggleTopic}
                onAskLLM={handleAskLLM}
                isLLMLoading={llmDialog.loading}
                topicRef={(el) => {
                  topicRefs.current[topic.code] = el
                }}
                topicAccuracy={tp?.questions_attempted > 0 ? tp.accuracy : null}
              />
            )
          })}
        </div>
      </div>

      <LLMExplanationModal />
    </>
  )
}
