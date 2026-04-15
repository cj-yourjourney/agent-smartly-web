export function NoQuestionsScreen({ onBack }) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <p className="text-base-content/70 mb-3">
          No questions available for this section.
        </p>
        <button onClick={onBack} className="btn btn-link">
          Back to Practice Mode
        </button>
      </div>
    </div>
  )
}
