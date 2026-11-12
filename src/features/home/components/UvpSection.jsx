// features/home/components/UvpSection.jsx
export default function UvpSection() {
  return (
    <div className="py-20 px-4 bg-base-100 border-t border-base-200">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 px-8 sm:px-14 py-12 sm:py-14 text-center flex flex-col items-center gap-6">
          <p className="text-primary font-bold tracking-widest text-xs uppercase">
            Why AgentSmartly Exists
          </p>
          <p className="font-display text-xl sm:text-2xl leading-snug text-base-content">
            Most prep sites overwhelm you. We found exactly{' '}
            <span className="text-primary">144 key concepts</span> across 7
            topics — not 500, not 300.
          </p>
          <div className="h-px w-10 bg-primary/25" />
          <p className="text-base-content/60 text-base leading-relaxed max-w-md">
            Review. Practice. Check. Repeat. No textbooks, no fluff —{' '}
            <span className="font-semibold text-base-content">
              500+ students
            </span>{' '}
            have already used it to get licensed.
          </p>
        </div>
      </div>
    </div>
  )
}
