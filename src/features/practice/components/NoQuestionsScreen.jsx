export function NoQuestionsScreen({ onBack }) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-base-content/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-base-content/60 mb-5 text-sm">
          No questions available for this section.
        </p>
        <button
          onClick={onBack}
          className="btn btn-outline btn-sm h-11 px-6 touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          Back to Practice Mode
        </button>
      </div>
    </div>
  )
}
