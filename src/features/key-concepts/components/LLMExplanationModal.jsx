// features/key-concepts/components/LLMExplanationModal.jsx
import { useDispatch, useSelector } from 'react-redux'
import { closeLLMDialog, selectLLMDialog } from '../state/keyConceptsSlice'
import { Sparkles, BookOpen, Lightbulb, CheckCircle, X } from 'lucide-react'

export default function LLMExplanationModal() {
  const dispatch = useDispatch()
  const { isOpen, loading, error, data } = useSelector(selectLLMDialog)

  const handleClose = () => {
    dispatch(closeLLMDialog())
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-xl">AI Learning Assistant</h3>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">
              Generating explanation...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {data && !loading && (
          <div className="space-y-6">
            {/* Concept Info */}
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="text-sm text-base-content/70 mb-1">
                {data.topic}
              </div>
              <div className="text-sm text-base-content/70 mb-2">
                → {data.subtopic}
              </div>
              <div className="font-bold text-lg text-primary">
                {data.concept}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-secondary" />
                <h4 className="font-semibold text-lg">Explanation</h4>
              </div>
              <p className="text-base-content/90 leading-relaxed">
                {data.explanation}
              </p>
            </div>

            {/* Key Points */}
            {data.keyPoints && data.keyPoints.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-semibold text-lg">Key Points</h4>
                </div>
                <ul className="space-y-2">
                  {data.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-base-content/90"
                    >
                      <span className="text-success mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Memory Tricks */}
            {data.memoryTricks && data.memoryTricks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  <h4 className="font-semibold text-lg">Memory Tricks</h4>
                </div>
                <div className="space-y-3">
                  {data.memoryTricks.map((trick, index) => (
                    <div
                      key={index}
                      className="bg-warning/10 border-l-4 border-warning p-3 rounded"
                    >
                      <p className="text-base-content/90">{trick}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            {data.examples && data.examples.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-info" />
                  <h4 className="font-semibold text-lg">Examples</h4>
                </div>
                <div className="space-y-3">
                  {data.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-info/10 p-4 rounded-lg border border-info/20"
                    >
                      <p className="text-base-content/90">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-primary">
            Got it!
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  )
}
