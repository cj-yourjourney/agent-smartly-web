import { useDispatch, useSelector } from 'react-redux'
import {
  closeLLMDialog,
  updateConceptViewTime,
  selectLLMDialog
} from '../state/keyConceptsSlice'
import {
  X,
  Lightbulb,
  Target,
  BookOpen,
  GitCompare,
  MapPin,
  AlertTriangle
} from 'lucide-react'

// ─── Section wrapper ────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  label,
  iconClass,
  borderClass,
  bgClass,
  children
}) {
  return (
    <div className={`rounded-2xl border ${borderClass} ${bgClass} p-4`}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${iconClass}`} />
        <span
          className={`text-[11px] font-bold uppercase tracking-widest ${iconClass}`}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

// ─── Loading skeleton ────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-base-300 rounded-full w-3/4" />
      <div className="h-4 bg-base-300 rounded-full w-full" />
      <div className="h-4 bg-base-300 rounded-full w-5/6" />
      <div className="h-20 bg-base-300 rounded-2xl w-full mt-2" />
      <div className="h-16 bg-base-300 rounded-2xl w-full" />
      <div className="h-16 bg-base-300 rounded-2xl w-full" />
      <p className="text-center text-xs text-base-content/40 pt-2">
        Generating your explanation…
      </p>
    </div>
  )
}

// ─── Main modal ──────────────────────────────────────────────────────────────
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
      {/* Dialog box */}
      <div className="modal-box w-full max-w-2xl p-0 rounded-t-2xl sm:rounded-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col">
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-base-300" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-base-200 flex-shrink-0">
          <div className="flex-1 pr-3 min-w-0">
            {data && (
              <p className="text-[11px] font-semibold text-primary/70 uppercase tracking-widest mb-0.5">
                {data.topic} › {data.subtopic}
              </p>
            )}
            <h2 className="font-bold text-lg leading-tight text-base-content">
              {data?.concept || 'Concept Explanation'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle flex-shrink-0 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* Loading */}
          {loading && <LoadingSkeleton />}

          {/* Error */}
          {error && !loading && (
            <div className="alert alert-error rounded-xl">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* ── Content ── */}
          {data && !loading && (
            <div className="space-y-4">
              {/* Simple explanation */}
              <p className="text-sm leading-relaxed text-base-content">
                {data.simpleExplanation}
              </p>

              {/* Key Points */}
              {data.keyPoints?.length > 0 && (
                <Section
                  icon={BookOpen}
                  label="Key Points"
                  iconClass="text-primary"
                  borderClass="border-primary/15"
                  bgClass="bg-primary/5"
                >
                  <ul className="space-y-2.5">
                    {data.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary font-bold text-[11px] flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-base-content/85 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Memory Trick — fix 1: no italic, no wrapping quotes, cleaner pill style */}
              {data.memoryTrick && (
                <Section
                  icon={Lightbulb}
                  label="Memory Trick"
                  iconClass="text-warning"
                  borderClass="border-warning/20"
                  bgClass="bg-warning/8"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-warning/60 text-lg leading-none flex-shrink-0 mt-[-2px]">
                      ›
                    </span>
                    <p className="text-sm text-base-content/85 leading-relaxed">
                      {data.memoryTrick}
                    </p>
                  </div>
                </Section>
              )}

              {/* Real World Example */}
              {data.realWorldExample && (
                <Section
                  icon={MapPin}
                  label="Real-World Example"
                  iconClass="text-success"
                  borderClass="border-success/20"
                  bgClass="bg-success/5"
                >
                  <p className="text-sm text-base-content/85 leading-relaxed">
                    {data.realWorldExample}
                  </p>
                </Section>
              )}

              {/* Common Confusions — fix 2: GitCompare icon, softer neutral tone */}
              {data.commonConfusions && (
                <Section
                  icon={GitCompare}
                  label="Don't Confuse With"
                  iconClass="text-base-content/50"
                  borderClass="border-base-content/10"
                  bgClass="bg-base-200/60"
                >
                  <p className="text-sm text-base-content/75 leading-relaxed">
                    {data.commonConfusions}
                  </p>
                </Section>
              )}

              {/* Exam Tip */}
              {data.examTip && (
                <Section
                  icon={Target}
                  label="Exam Tip"
                  iconClass="text-error"
                  borderClass="border-error/20"
                  bgClass="bg-error/8"
                >
                  <p className="text-sm text-base-content/85 leading-relaxed">
                    {data.examTip}
                  </p>
                </Section>
              )}
            </div>
          )}
        </div>

        {/* ── Footer — fix 3: checkmark icon on Got it button ── */}
        {!loading && (
          <div className="px-5 py-4 border-t border-base-200 flex-shrink-0">
            <button
              onClick={handleClose}
              className="btn btn-primary w-full rounded-xl gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
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
