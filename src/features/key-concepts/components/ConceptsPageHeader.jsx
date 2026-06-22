import { BookOpen } from 'lucide-react'

export default function ConceptsPageHeader({ concepts, conceptViewCounts }) {
  const reviewedCount = Object.values(conceptViewCounts).filter(
    (v) => v > 0
  ).length
  const totalCount = concepts.length

  return (
    <div className="sticky top-0 z-10 bg-base-200/90 backdrop-blur-sm border-b border-base-300 px-4 py-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <h1 className="text-lg font-bold leading-tight">Key Concepts</h1>
              <span className="text-xs font-semibold tabular-nums text-primary flex-shrink-0">
                {reviewedCount}
                <span className="text-base-content/40 font-normal">
                  {' '}
                  / {totalCount} reviewed
                </span>
              </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-1 mt-1.5">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-500"
                style={{
                  width:
                    totalCount > 0
                      ? `${(reviewedCount / totalCount) * 100}%`
                      : '0%'
                }}
              />
            </div>
            <p className="text-xs text-base-content/45 leading-none mt-1">
              CA Real Estate Salesperson Exam · Tap any concept to read more
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
