import {
  Trophy,
  XCircle,
  Clock,
  ClipboardList,
  RotateCcw,
  BookOpen
} from 'lucide-react'
import { formatTimePretty } from '../utils'

export function SessionCompleteScreen({
  results,
  completedSession,
  topicLabel,
  elapsedTime,
  onPracticeAgain,
  onViewDetails,
  onReviewKeyConcepts
}) {
  const total = completedSession?.questions_attempted ?? results.total
  const correct = completedSession?.questions_correct ?? results.correct
  const accuracy = completedSession
    ? Math.round(completedSession.accuracy)
    : total > 0
      ? Math.round((correct / total) * 100)
      : 0

  const displayElapsed = completedSession
    ? (completedSession.duration_seconds ??
      Math.round((completedSession.duration_minutes ?? 0) * 60))
    : elapsedTime

  const passed = accuracy >= 70
  const isFullExam = total === 75

  const scoreColor = passed
    ? 'text-success'
    : accuracy >= 40
      ? 'text-warning'
      : 'text-error'

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          {passed ? (
            <>
              <div
                className={`flex items-center gap-2 text-4xl font-bold ${scoreColor}`}
              >
                <Trophy className="w-8 h-8" />
                {accuracy}%
              </div>
              <p className={`text-lg font-bold ${scoreColor}`}>Passed!</p>
            </>
          ) : (
            <>
              <div
                className={`flex items-center gap-2 text-4xl font-bold ${scoreColor}`}
              >
                <XCircle className="w-8 h-8" />
                {accuracy}% accuracy
              </div>
              <p className={`text-lg font-bold ${scoreColor}`}>Not quite yet</p>
            </>
          )}

          <p className="text-sm text-base-content/50 text-center mt-1">
            {correct}/{total} correct · {topicLabel}
          </p>

          {!passed && (
            <p className="text-sm text-base-content/50 text-center">
              Review the key concepts before trying again.
            </p>
          )}

          {/* Time — only for full 75-question exam */}
          {isFullExam && displayElapsed > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-base-content/40 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Time: {formatTimePretty(displayElapsed)}</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          {passed ? (
            <>
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
              <button
                onClick={onReviewKeyConcepts}
                className="btn btn-outline w-full h-12 gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <BookOpen className="w-4 h-4" />
                Review Key Concepts
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onReviewKeyConcepts}
                className="btn btn-primary w-full h-12 gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <BookOpen className="w-4 h-4" />
                Review Key Concepts
              </button>
              <button
                onClick={onPracticeAgain}
                className="btn btn-outline w-full h-12 gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
              <button
                onClick={onViewDetails}
                className="btn btn-outline w-full h-12 gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ClipboardList className="w-4 h-4" />
                View Session Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
