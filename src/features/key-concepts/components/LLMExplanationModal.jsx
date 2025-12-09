// features/key-concepts/components/LLMExplanationModal.jsx
import { useDispatch, useSelector } from 'react-redux'
import { closeLLMDialog, selectLLMDialog } from '../state/keyConceptsSlice'
import { X, Lightbulb, Target } from 'lucide-react'

export default function LLMExplanationModal() {
  const dispatch = useDispatch()
  const { isOpen, loading, error, data } = useSelector(selectLLMDialog)

  const handleClose = () => {
    dispatch(closeLLMDialog())
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <div className="flex-1 pr-4">
            <h2 className="font-bold text-lg">
              {data?.concept || 'Concept Explanation'}
            </h2>
            {data && (
              <div className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                <span>{data.topic}</span>
                <span>→</span>
                <span>{data.subtopic}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-sm text-base-content/60">
                Generating explanation...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-error shadow-lg">
              <span>{error}</span>
            </div>
          )}

          {/* Success State */}
          {data && !loading && (
            <div className="space-y-5">
              {/* Simple Explanation */}
              <div>
                <p className="text-base leading-relaxed text-base-content">
                  {data.simpleExplanation}
                </p>
              </div>

              <div className="divider my-4"></div>

              {/* Key Points */}
              {data.keyPoints && data.keyPoints.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-base-content/80">
                    Key Points
                  </h3>
                  <ul className="space-y-2 pl-1">
                    {data.keyPoints.map((point, index) => (
                      <li key={index} className="flex gap-3 text-sm">
                        <span className="text-success font-bold flex-shrink-0">
                          •
                        </span>
                        <span className="text-base-content/90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Memory Tricks */}
              {data.memoryTricks && (
                <div className="alert alert-warning shadow-sm">
                  <Lightbulb className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Memory Trick</h3>
                    <p className="text-sm opacity-90">{data.memoryTricks}</p>
                  </div>
                </div>
              )}

              {/* Real World Example */}
              {data.realWorldExample && (
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-base-content/80">
                    Example
                  </h3>
                  <div className="bg-base-200 px-4 py-3 rounded-lg">
                    <p className="text-sm text-base-content/90 leading-relaxed">
                      {data.realWorldExample}
                    </p>
                  </div>
                </div>
              )}

              {/* Exam Tip */}
              {data.examTip && (
                <div className="alert alert-error shadow-sm">
                  <Target className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Exam Tip</h3>
                    <p className="text-sm opacity-90">{data.examTip}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-4 border-t border-base-300">
            <button onClick={handleClose} className="btn btn-primary w-full">
              Got it
            </button>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </div>
  )
}
