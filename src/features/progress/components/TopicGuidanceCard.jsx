import { useDispatch } from 'react-redux'
import { Lightbulb, Zap, Target, ArrowRight, CheckCircle } from 'lucide-react'
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

  // Single action: Review routes to Key Concepts with the topic highlighted.
  // Practice always lands on the topic-selection screen — never auto-starts
  // a quiz. TopicSelectionScreen independently derives the same recommended
  // topic via getTopicGuidance, so it shows up pre-highlighted there with
  // no extra state to pass.
  const handleAction = () => {
    if (isReviewPhase) {
      dispatch(setHighlightedTopic(guidance.topicValue ?? null))
      router.push(ROUTES.LEARNING.KEY_CONCEPTS)
    } else {
      router.push(ROUTES.LEARNING.PRACTICE)
    }
  }

  const buttonLabel = isReviewPhase
    ? guidance.topicValue
      ? 'Review This Topic'
      : 'Review Key Concepts'
    : guidance.topicValue
      ? 'Practice This Topic'
      : 'Practice Questions'

  const ButtonIcon = isReviewPhase ? Zap : Target

  return (
    <div className="space-y-2.5">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
          {isComplete ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Lightbulb className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary mb-0.5">
            {guidance.headline}
          </p>
          <p className="text-xs text-base-content/60 leading-relaxed">
            {guidance.detail}
          </p>
        </div>
      </div>

      <button onClick={handleAction} className="btn btn-primary w-full gap-2">
        <ButtonIcon className="w-5 h-5" />
        {buttonLabel}
        <ArrowRight className="w-4 h-4 ml-auto" />
      </button>
    </div>
  )
}
