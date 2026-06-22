import { ChevronRight } from 'lucide-react'

export default function ConceptRow({
  concept,
  reviewCount,
  onAsk,
  isDisabled
}) {
  return (
    <button
      onClick={onAsk}
      disabled={isDisabled}
      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-base-200/70 hover:bg-base-200 active:bg-base-300 active:scale-[0.985] rounded-xl transition-all text-left disabled:opacity-40"
    >
      <span className="text-sm text-base-content leading-snug flex-1">
        {concept.name}
      </span>
      <div className="flex items-center gap-2 flex-shrink-0">
        {reviewCount > 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-base-300/60 text-base-content/45 text-[10px] font-medium leading-none">
            Reviewed {reviewCount} times
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-lg bg-base-200 text-base-content/25 text-[11px] font-medium leading-none">
            New
          </span>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-base-content/25" />
      </div>
    </button>
  )
}
