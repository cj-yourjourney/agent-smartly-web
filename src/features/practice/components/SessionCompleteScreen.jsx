import {
  Trophy,
  XCircle,
  Clock,
  Info,
  ClipboardList,
  RotateCcw
} from 'lucide-react'
import { formatTimePretty } from '../utils'

export function SessionCompleteScreen({
  results,
  topicLabel,
  elapsedTime,
  onPracticeAgain,
  onViewDetails
}) {
  const accuracy =
    results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0
  const passed = accuracy >= 70
  const incorrect = results.total - results.correct

  const ringColor =
    accuracy >= 70
      ? 'text-success'
      : accuracy >= 40
        ? 'text-warning'
        : 'text-error'

  const ringBg =
    accuracy >= 70
      ? 'bg-success/10 border-success/30'
      : accuracy >= 40
        ? 'bg-warning/10 border-warning/30'
        : 'bg-error/10 border-error/30'

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 flex items-start sm:items-center justify-center p-4 py-6 sm:py-8">
        <div className="w-full max-w-md">
          {/* Score circle */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center mb-3 sm:mb-4 ${ringBg}`}
            >
              <span className={`text-4xl font-bold tabular-nums ${ringColor}`}>
                {accuracy}%
              </span>
              <span className="text-xs text-base-content/50 mt-0.5">
                accuracy
              </span>
            </div>

            {passed ? (
              <div className="flex items-center gap-1.5 text-success font-bold text-lg">
                <Trophy className="w-5 h-5" />
                Passed!
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-error font-bold text-base">
                <XCircle className="w-5 h-5" />
                Keep going — you&apos;ve got this!
              </div>
            )}

            <p className="text-sm text-base-content/40 mt-1 text-center truncate max-w-xs">
              {topicLabel}
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8">
            <div className="bg-base-200 rounded-xl p-3 text-center">
              <p className="text-2xl sm:text-2xl font-bold tabular-nums">
                {results.total}
              </p>
              <p className="text-xs text-base-content/50 mt-0.5">Questions</p>
            </div>
            <div className="bg-success/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold tabular-nums text-success">
                {results.correct}
              </p>
              <p className="text-xs text-base-content/50 mt-0.5">Correct</p>
            </div>
            <div className="bg-error/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold tabular-nums text-error">
                {incorrect}
              </p>
              <p className="text-xs text-base-content/50 mt-0.5">Incorrect</p>
            </div>
          </div>

          {/* Time */}
          {elapsedTime > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-base-content/40 mb-5 sm:mb-8">
              <Clock className="w-3.5 h-3.5" />
              <span>Time: {formatTimePretty(elapsedTime)}</span>
            </div>
          )}

          {/* Pass threshold hint */}
          {!passed && (
            <div className="alert alert-info py-2.5 mb-5 text-sm">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                CA exam requires 70% to pass. You scored {accuracy}% — review
                weak areas and try again.
              </span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onViewDetails}
              className="btn btn-primary w-full h-12 gap-2 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ClipboardList className="w-4 h-4" />
              View Session Details
            </button>
            <button
              onClick={onPracticeAgain}
              className="btn btn-outline w-full h-12 gap-2 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
          </div>

          <p className="text-center text-xs text-base-content/40 mt-4">
            Detailed breakdown on the{' '}
            <button
              onClick={onViewDetails}
              className="underline hover:text-base-content transition-colors touch-manipulation"
            >
              Progress → Sessions
            </button>{' '}
            page.
          </p>
        </div>
      </div>
    </div>
  )
}
