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
      className="w-full p-4 sm:p-5 border-2 border-primary/30 rounded-2xl hover:border-primary hover:shadow-md active:scale-[0.99] transition-all group text-left bg-primary/5 touch-manipulation"
      title={`Practice ${recommendedTopic.topic_display} (20 questions)`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
            Recommended for you
          </p>
          <p className="text-sm sm:text-base font-bold text-base-content leading-tight truncate">
            {recommendedTopic.topic_display}
          </p>
          <p className="text-xs text-base-content/50 mt-0.5">
            Your accuracy here is{' '}
            <span
              className={`font-semibold ${accuracyColor(recommendedTopic.accuracy)}`}
            >
              {recommendedTopic.accuracy}%
            </span>{' '}
            — practicing this will boost your overall score the most.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
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
