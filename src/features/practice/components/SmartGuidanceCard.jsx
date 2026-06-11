import { ChevronRight, Sparkles } from 'lucide-react'

const accuracyColor = (acc) =>
  acc >= 90
    ? 'text-success'
    : acc >= 75
      ? 'text-info'
      : acc >= 60
        ? 'text-warning'
        : 'text-error'

/**
 * Smart guidance card for Practice Mode.
 * Recommends the user's lowest-accuracy topic (among topics they've
 * actually attempted) and lets them jump straight into practicing it.
 *
 * Renders nothing if there's no topic data yet (e.g. brand new user).
 */
export function SmartGuidanceCard({ topicProgress = [], onSelect }) {
  const attemptedTopics = topicProgress.filter((p) => p.questions_attempted > 0)

  if (attemptedTopics.length === 0) return null

  const recommendedTopic = [...attemptedTopics].sort(
    (a, b) => a.accuracy - b.accuracy
  )[0]

  return (
    <button
      onClick={() => onSelect(recommendedTopic.topic)}
      className="w-full px-4 py-3.5 sm:px-5 border border-primary/25 rounded-2xl hover:border-primary/50 hover:shadow-sm active:scale-[0.99] transition-all group text-left bg-primary/5 touch-manipulation"
      title={`Practice ${recommendedTopic.topic_display} (20 questions)`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5">
            Focus area
          </p>
          <div className="flex items-baseline gap-2 min-w-0">
            <p className="text-sm font-semibold text-base-content leading-tight truncate">
              {recommendedTopic.topic_display}
            </p>
            <span
              className={`text-xs font-bold shrink-0 ${accuracyColor(recommendedTopic.accuracy)}`}
            >
              {recommendedTopic.accuracy}%
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-base-content/25 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </button>
  )
}

/**
 * Returns the topic value of the recommended (lowest-accuracy attempted)
 * topic, or null if no topics have been attempted yet.
 * Exported so other components (e.g. TopicRow) can highlight the same topic.
 */
export function getRecommendedTopicValue(topicProgress = []) {
  const attemptedTopics = topicProgress.filter((p) => p.questions_attempted > 0)
  if (attemptedTopics.length === 0) return null
  return [...attemptedTopics].sort((a, b) => a.accuracy - b.accuracy)[0].topic
}
