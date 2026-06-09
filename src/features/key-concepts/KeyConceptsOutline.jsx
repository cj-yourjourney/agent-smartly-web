import { useEffect, useRef, useMemo, useCallback } from 'react'
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
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  AlertCircle,
  Trophy
} from 'lucide-react'

// ── Guidance banner ────────────────────────────────────────────────────────────
// Derives a user-state-aware recommendation from topicProgress data.
// Three states: no practice, partial practice, all topics practiced.
function GuidanceBanner({
  topicProgress,
  highlightedTopicCode,
  organizedConcepts,
  conceptViewCounts
}) {
  // Helper: how many concepts in a topic have been reviewed at least once
  const topicReviewedCount = useCallback(
    (topicCode) => {
      const topic = organizedConcepts.find((t) => t.code === topicCode)
      if (!topic) return 0
      return topic.subtopics
        .flatMap((st) => st.concepts.map((c) => c.name))
        .filter((name) => (conceptViewCounts[name] ?? 0) > 0).length
    },
    [organizedConcepts, conceptViewCounts]
  )
  // Only show banner for topics that exist in Key Concepts (have a code match)
  const knownCodes = useMemo(
    () => new Set(organizedConcepts.map((t) => t.code)),
    [organizedConcepts]
  )

  const practiced = useMemo(
    () =>
      (topicProgress || [])
        .filter((t) => t.questions_attempted > 0 && knownCodes.has(t.topic))
        .sort((a, b) => a.accuracy - b.accuracy), // lowest accuracy first
    [topicProgress, knownCodes]
  )

  const totalKnownTopics = organizedConcepts.filter((t) => {
    const count = t.subtopics.reduce((s, st) => s + st.concepts.length, 0)
    return count > 0
  }).length

  const allPracticed = practiced.length >= totalKnownTopics

  // If navigated here from a session (highlight already set), the topic card
  // itself already draws attention — show a minimal contextual banner only.
  if (highlightedTopicCode) {
    const topic = (topicProgress || []).find(
      (t) => t.topic === highlightedTopicCode
    )
    const topicName = organizedConcepts.find(
      (t) => t.code === highlightedTopicCode
    )?.name
    const totalConcepts =
      organizedConcepts
        .find((t) => t.code === highlightedTopicCode)
        ?.subtopics.reduce((s, st) => s + st.concepts.length, 0) ?? 0
    const reviewed = topicReviewedCount(highlightedTopicCode)
    const lowReview = totalConcepts > 0 && reviewed / totalConcepts < 0.5
    return (
      <div className="mb-4 rounded-2xl bg-warning/10 border border-warning/30 px-4 py-3.5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-base-content">
            Focus on: {topicName ?? highlightedTopicCode}
          </p>
          <p className="text-xs text-base-content/55 mt-0.5">
            {topic
              ? lowReview
                ? `Your accuracy here is ${topic.accuracy}% and you've only reviewed ${reviewed}/${totalConcepts} concepts — read through them below before practicing again.`
                : `Your accuracy here is ${topic.accuracy}% — review the concepts below to strengthen this area before practicing again.`
              : 'Review the key concepts in this topic before your next practice session.'}
          </p>
        </div>
      </div>
    )
  }

  // ── State A: no practice at all ──────────────────────────────────────────
  if (practiced.length === 0) {
    return (
      <div className="mb-4 rounded-2xl bg-primary/8 border border-primary/20 px-4 py-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-base-content">
            Start here before you practice
          </p>
          <p className="text-xs text-base-content/55 mt-1 leading-relaxed">
            You haven&apos;t practiced any topics yet. Browse the concepts below
            to build familiarity — tap any concept to get an AI explanation.
            Then head to Practice when you&apos;re ready.
          </p>
        </div>
      </div>
    )
  }

  // ── State B: all topics practiced ───────────────────────────────────────
  if (allPracticed) {
    const weakest = practiced[0] // sorted lowest first
    const weakestName = organizedConcepts.find(
      (t) => t.code === weakest.topic
    )?.name
    return (
      <div className="mb-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm px-4 py-3.5">
        <div className="flex items-center gap-2 mb-2.5">
          <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm font-semibold text-base-content">
            Your weakest topics to review
          </p>
        </div>
        <div className="space-y-1.5">
          {practiced.slice(0, 4).map((t) => {
            const name =
              organizedConcepts.find((o) => o.code === t.topic)?.name ??
              t.topic_display
            const barColor =
              t.accuracy >= 70
                ? 'bg-success'
                : t.accuracy >= 40
                  ? 'bg-warning'
                  : 'bg-error'
            const textColor =
              t.accuracy >= 70
                ? 'text-success'
                : t.accuracy >= 40
                  ? 'text-warning'
                  : 'text-error'
            return (
              <div key={t.topic} className="flex items-center gap-2">
                <span className="text-xs text-base-content/70 flex-1 truncate">
                  {name}
                </span>
                <div className="w-16 h-1.5 rounded-full bg-base-200 overflow-hidden flex-shrink-0">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${t.accuracy}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-bold tabular-nums w-8 text-right flex-shrink-0 ${textColor}`}
                >
                  {t.accuracy}%
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-base-content/45 mt-2.5">
          Start with{' '}
          <span className="font-semibold text-base-content/70">
            {weakestName}
          </span>{' '}
          — it&apos;s your lowest accuracy topic. Tap it below to expand.
        </p>
      </div>
    )
  }

  // ── State C: some topics practiced ──────────────────────────────────────
  const unpracticedCount = totalKnownTopics - practiced.length
  const weakest = practiced[0]
  const weakestName = organizedConcepts.find(
    (t) => t.code === weakest.topic
  )?.name
  const weakestTotal =
    organizedConcepts
      .find((t) => t.code === weakest.topic)
      ?.subtopics.reduce((s, st) => s + st.concepts.length, 0) ?? 0
  const weakestReviewed = topicReviewedCount(weakest.topic)
  const weakestLowReview =
    weakestTotal > 0 && weakestReviewed / weakestTotal < 0.5
  return (
    <div className="mb-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
        <p className="text-sm font-semibold text-base-content">
          Topics to review
        </p>
      </div>
      <div className="space-y-1.5 mb-2.5">
        {practiced.slice(0, 3).map((t) => {
          const name =
            organizedConcepts.find((o) => o.code === t.topic)?.name ??
            t.topic_display
          const barColor =
            t.accuracy >= 70
              ? 'bg-success'
              : t.accuracy >= 40
                ? 'bg-warning'
                : 'bg-error'
          const textColor =
            t.accuracy >= 70
              ? 'text-success'
              : t.accuracy >= 40
                ? 'text-warning'
                : 'text-error'
          return (
            <div key={t.topic} className="flex items-center gap-2">
              <span className="text-xs text-base-content/70 flex-1 truncate">
                {name}
              </span>
              <div className="w-16 h-1.5 rounded-full bg-base-200 overflow-hidden flex-shrink-0">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
              <span
                className={`text-xs font-bold tabular-nums w-8 text-right flex-shrink-0 ${textColor}`}
              >
                {t.accuracy}%
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-base-content/50 leading-relaxed">
        Start with{' '}
        <span className="font-semibold text-base-content/70">
          {weakestName}
        </span>{' '}
        ({weakest.accuracy}% accuracy
        {weakestLowReview &&
          `, ${weakestReviewed}/${weakestTotal} concepts reviewed`}
        ).
        {weakestLowReview
          ? ' Read through the concepts first, then practice.'
          : ' Tap it below to expand and review.'}
        {unpracticedCount > 0 && (
          <>
            {' '}
            You also have{' '}
            <span className="font-semibold text-base-content/70">
              {unpracticedCount} topic{unpracticedCount > 1 ? 's' : ''}
            </span>{' '}
            you haven&apos;t practiced yet.
          </>
        )}
      </p>
    </div>
  )
}

import { fetchTopicProgress } from '../progress/state/progressSlice'

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
  // Progress data — already fetched by ProgressPage; zero extra API calls.
  // Falls back gracefully to [] if the user hasn't visited Progress yet.
  const topicProgress = useSelector((s) => s.progress?.topicProgress ?? [])

  // Ref map: topic.code → DOM element, for scrolling to the highlighted topic
  const topicRefs = useRef({})
  // Guard: only clear the highlight when the component truly unmounts (user
  // navigates away), not during React's initial mount/StrictMode double-invoke.
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
    // Clear the highlight only when the user leaves this page
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
      // Small delay so the expand animation doesn't fight the scroll
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }, [highlightedTopicCode, loading])

  // If user arrives organically (no session highlight set) and has practiced
  // at least one topic, auto-highlight their weakest topic so the card stands out.
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
        {/* Sticky page header */}
        <div className="sticky top-0 z-10 bg-base-200/90 backdrop-blur-sm border-b border-base-300 px-4 py-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h1 className="text-lg font-bold leading-tight">
                    Key Concepts
                  </h1>
                  <span className="text-xs font-semibold tabular-nums text-primary flex-shrink-0">
                    {
                      Object.values(conceptViewCounts).filter((v) => v > 0)
                        .length
                    }
                    <span className="text-base-content/40 font-normal">
                      {' '}
                      / {concepts.length} reviewed
                    </span>
                  </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-1 mt-1.5">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-500"
                    style={{
                      width:
                        concepts.length > 0
                          ? `${(Object.values(conceptViewCounts).filter((v) => v > 0).length / concepts.length) * 100}%`
                          : '0%'
                    }}
                  />
                </div>
                <p className="text-xs text-base-content/45 leading-none mt-1">
                  CA Real Estate Salesperson Exam · Tap any concept for AI
                  explanation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="container mx-auto max-w-3xl px-4 pt-4 space-y-2">
          <GuidanceBanner
            topicProgress={topicProgress}
            highlightedTopicCode={highlightedTopicCode}
            organizedConcepts={organizedConcepts}
            conceptViewCounts={conceptViewCounts}
          />
          {organizedConcepts.map((topic, topicIdx) => {
            const isExpanded = expandedTopics.includes(topic.code)
            const isHighlighted = highlightedTopicCode === topic.code
            const count = topic.subtopics.reduce(
              (sum, st) => sum + st.concepts.length,
              0
            )
            if (count === 0) return null
            const topicConceptNames = topic.subtopics.flatMap((st) =>
              st.concepts.map((c) => c.name)
            )
            const reviewedCount = topicConceptNames.filter(
              (name) => (conceptViewCounts[name] ?? 0) > 0
            ).length

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
                    {/* Per-topic reviewed count */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span
                        className={`text-xs font-medium tabular-nums ${isExpanded || isHighlighted ? 'text-primary' : 'text-base-content/40'}`}
                      >
                        <span
                          className={
                            reviewedCount === count ? 'text-success' : ''
                          }
                        >
                          {reviewedCount}
                        </span>
                        <span className="text-base-content/30">/{count}</span>
                      </span>
                      <div className="w-10 h-0.5 rounded-full bg-base-300 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${reviewedCount === count ? 'bg-success' : 'bg-primary/60'}`}
                          style={{
                            width:
                              count > 0
                                ? `${(reviewedCount / count) * 100}%`
                                : '0%'
                          }}
                        />
                      </div>
                    </div>
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
