import { useDispatch } from 'react-redux'
import { Zap, Target, ArrowRight, CheckCircle } from 'lucide-react'
import ROUTES from '@/shared/constants/routes'
import { setHighlightedTopic } from '@/features/key-concepts/state/keyConceptsSlice'
import { getTopicGuidance } from '../utils'

/**
 * Topic-level "what should I do next" guidance for the Progress page.
 * Always shows exactly one recommendation and one action — Review for an
 * untouched topic, Practice for a started-but-not-yet-cleared topic —
 * picked from the highest-priority topic (see ../utils.js).
 */
export default function TopicGuidanceCard({ topicProgress, router }) {
  const dispatch = useDispatch()
  const guidance = getTopicGuidance(topicProgress)

  const isReviewPhase =
    guidance.phase === 'review' || guidance.phase === 'start'
  const isComplete = guidance.phase === 'complete'

  const handleAction = () => {
    if (isReviewPhase) {
      dispatch(setHighlightedTopic(guidance.topicValue ?? null))
      router.push(ROUTES.LEARNING.KEY_CONCEPTS)
    } else {
      router.push(ROUTES.LEARNING.PRACTICE)
    }
  }

  const ctaLabel = isReviewPhase ? 'Review Key Concepts' : 'Practice Questions'
  const topicName = guidance.topicLabel ?? guidance.topicValue
  const ButtonIcon = isReviewPhase ? Zap : Target

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
        {isComplete ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <ButtonIcon className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {/* Action button */}
        <div className="mb-2.5">
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-content text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            <ButtonIcon className="w-3.5 h-3.5" />
            {ctaLabel}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {/* Topic name — larger, clearly legible */}
        {topicName && (
          <p className="text-sm font-semibold text-primary mb-1">{topicName}</p>
        )}
        {/* Detail */}
        <p className="text-xs text-base-content/50 leading-relaxed">
          {guidance.detail}
        </p>
      </div>
    </div>
  )
}
