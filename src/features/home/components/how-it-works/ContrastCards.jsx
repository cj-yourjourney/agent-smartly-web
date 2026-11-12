// features/home/components/how-it-works/ContrastCards.jsx
const OTHERS = [
  'Hundreds of random questions',
  'Prep books with everything in them',
  'No clear starting point',
  'You guess what matters',
  'Overwhelming, not guiding'
]

const OURS = [
  '144 concepts — only what the DRE tests',
  'Organized by the 7 exact exam topics',
  'Three steps, always know what to do next',
  'Review → Practice → Check Progress',
  'Direct, focused, nothing extra'
]

export default function ContrastCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20 max-w-3xl mx-auto">
      <div className="rounded-2xl border border-base-300 bg-base-200 px-6 py-5 flex flex-col gap-3">
        <p className="text-xs font-bold tracking-widest uppercase text-base-content/40">
          Other prep sites
        </p>
        <ul className="flex flex-col gap-2">
          {OTHERS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-base-content/50"
            >
              <span className="text-error mt-0.5 shrink-0">✕</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-5 flex flex-col gap-3">
        <p className="text-xs font-bold tracking-widest uppercase text-primary">
          AgentSmartly
        </p>
        <ul className="flex flex-col gap-2">
          {OURS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-base-content/70"
            >
              <span className="text-success mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
