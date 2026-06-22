import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { fetchQuestionsByTopic } from '../../practice/state/practiceSlice'
import SubtopicSection from './SubtopicSection'

export default function TopicCard({
  topic,
  topicIdx,
  isExpanded,
  isHighlighted,
  conceptViewCounts,
  onToggle,
  onAskLLM,
  isLLMLoading,
  topicRef,
  topicAccuracy // null = never practiced, number = last accuracy (0–100)
}) {
  const totalCount = topic.subtopics.reduce(
    (sum, st) => sum + st.concepts.length,
    0
  )
  if (totalCount === 0) return null

  const router = useRouter()
  const dispatch = useDispatch()

  const topicConceptNames = topic.subtopics.flatMap((st) =>
    st.concepts.map((c) => c.name)
  )
  const reviewedCount = topicConceptNames.filter(
    (name) => (conceptViewCounts[name] ?? 0) > 0
  ).length

  const hasPracticed = topicAccuracy !== null
  const practiceLabel = hasPracticed ? 'Practice again' : 'Practice this topic'
  const accuracyHint =
    hasPracticed && typeof topicAccuracy === 'number'
      ? `${Math.round(topicAccuracy)}% last time`
      : null

  const handlePractice = () => {
    dispatch(fetchQuestionsByTopic(topic.code))
    router.push('/learning/practice')
  }

  return (
    <div
      ref={topicRef}
      className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
        isHighlighted
          ? 'bg-base-100 border-warning/60 shadow-lg ring-2 ring-warning/30'
          : isExpanded
            ? 'bg-base-100 border-primary/20 shadow-md'
            : 'bg-base-100 border-base-200 shadow-sm'
      }`}
    >
      {/* Topic toggle button */}
      <button
        onClick={() => onToggle(topic.code)}
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
          {isHighlighted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/15 text-warning text-[10px] font-bold uppercase tracking-wide">
              ★ Review this
            </span>
          )}

          {/* Per-topic reviewed count + mini progress bar */}
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`text-xs font-medium tabular-nums ${
                isExpanded || isHighlighted
                  ? 'text-primary'
                  : 'text-base-content/40'
              }`}
            >
              <span
                className={reviewedCount === totalCount ? 'text-success' : ''}
              >
                {reviewedCount}
              </span>
              <span className="text-base-content/30">/{totalCount}</span>
            </span>
            <div className="w-10 h-0.5 rounded-full bg-base-300 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  reviewedCount === totalCount ? 'bg-success' : 'bg-primary/60'
                }`}
                style={{
                  width:
                    totalCount > 0
                      ? `${(reviewedCount / totalCount) * 100}%`
                      : '0%'
                }}
              />
            </div>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-base-content/40 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded subtopics */}
      {isExpanded && (
        <div className="border-t border-base-200">
          {/* Practice CTA — visible immediately on expand */}
          <div className="px-4 py-3 border-b border-base-200">
            <button
              onClick={handlePractice}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                hasPracticed
                  ? 'bg-base-200 hover:bg-base-300 text-base-content'
                  : 'bg-primary text-primary-content hover:opacity-90'
              }`}
            >
              <span>{practiceLabel}</span>
              {accuracyHint && (
                <span className="text-xs font-normal opacity-60">
                  · {accuracyHint}
                </span>
              )}
            </button>
          </div>

          {topic.subtopics.map((subtopic, stIdx) => (
            <SubtopicSection
              key={subtopic.code}
              subtopic={subtopic}
              isFirst={stIdx === 0}
              conceptViewCounts={conceptViewCounts}
              onAskLLM={onAskLLM}
              topicName={topic.name}
              topicCode={topic.code}
              isLLMLoading={isLLMLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}
