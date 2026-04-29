import { useDispatch, useSelector } from 'react-redux'
import {
  closeLLMDialog,
  updateConceptViewTime,
  selectLLMDialog
} from '../state/keyConceptsSlice'
import { X, Lightbulb, Target } from 'lucide-react'

export default function LLMExplanationModal() {
  const dispatch = useDispatch()
  const { isOpen, loading, error, data, viewStartTime, pendingConceptViewId } =
    useSelector(selectLLMDialog)

  const handleClose = () => {
    if (pendingConceptViewId && viewStartTime) {
      const timeSpentSeconds = Math.round((Date.now() - viewStartTime) / 1000)
      dispatch(
        updateConceptViewTime({ id: pendingConceptViewId, timeSpentSeconds })
      )
    }
    dispatch(closeLLMDialog())
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      {/* Sheet / dialog box */}
      <div className="modal-box w-full max-w-2xl p-0 rounded-t-2xl sm:rounded-2xl max-h-[92dvh] sm:max-h-[80vh] flex flex-col">
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-base-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3.5 border-b border-base-200 flex-shrink-0">
          <div className="flex-1 pr-3 min-w-0">
            <h2 className="font-bold text-base leading-snug">
              {data?.concept || 'Concept Explanation'}
            </h2>
            {data && (
              <p className="text-xs text-base-content/50 mt-0.5 truncate">
                {data.topic} → {data.subtopic}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle flex-shrink-0 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
              <p className="mt-4 text-sm text-base-content/50">
                Generating explanation…
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="alert alert-error">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Content */}
          {data && !loading && (
            <div className="space-y-5">
              {/* Simple explanation */}
              <p className="text-sm leading-relaxed text-base-content">
                {data.simpleExplanation}
              </p>

              {/* Key Points */}
              {data.keyPoints?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2.5">
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {data.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <span className="text-success font-bold flex-shrink-0 mt-0.5">
                          •
                        </span>
                        <span className="text-base-content/85 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Memory Trick */}
              {data.memoryTricks && (
                <div className="rounded-xl bg-warning/10 border border-warning/20 p-4 flex gap-3">
                  <Lightbulb className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-warning mb-1">
                      Memory Trick
                    </p>
                    <p className="text-sm text-base-content/80 leading-relaxed">
                      {data.memoryTricks}
                    </p>
                  </div>
                </div>
              )}

              {/* Example */}
              {data.realWorldExample && (
                <div>
                  <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2.5">
                    Example
                  </h3>
                  <div className="bg-base-200 rounded-xl px-4 py-3">
                    <p className="text-sm text-base-content/85 leading-relaxed">
                      {data.realWorldExample}
                    </p>
                  </div>
                </div>
              )}

              {/* Exam Tip */}
              {data.examTip && (
                <div className="rounded-xl bg-error/10 border border-error/20 p-4 flex gap-3">
                  <Target className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-error mb-1">
                      Exam Tip
                    </p>
                    <p className="text-sm text-base-content/80 leading-relaxed">
                      {data.examTip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-5 py-4 border-t border-base-200 flex-shrink-0">
            <button onClick={handleClose} className="btn btn-primary w-full">
              Got it
            </button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </div>
  )
}
