export default function Pagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPrev,
  onNext
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-12">
      <div className="join shadow-sm rounded-full overflow-hidden">
        <button
          className="join-item btn btn-sm rounded-none"
          onClick={onPrev}
          disabled={!hasPrevious}
        >
          ← Prev
        </button>
        <button className="join-item btn btn-sm btn-disabled bg-base-100 text-base-content/70 rounded-none">
          Page {page} of {totalPages}
        </button>
        <button
          className="join-item btn btn-sm rounded-none"
          onClick={onNext}
          disabled={!hasNext}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
