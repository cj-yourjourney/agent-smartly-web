// features/home/components/how-it-works/StepReview.jsx
const TAGS = [
  '144 Key Concepts',
  '7 Topics Organized',
  'Memory Tricks',
  'AI Explain',
  'Review Tracking'
]

export default function StepReview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
      <div className="flex flex-col gap-4 lg:order-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shrink-0">
            1
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Review
          </span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl">
          Learn the Key Concepts in One Topic
        </h3>
        <p className="text-base-content/65 text-lg leading-relaxed">
          Start with the{' '}
          <span className="font-semibold text-base-content">
            144 essential key concepts
          </span>{' '}
          — the real terms, rules, and definitions the DRE actually tests.
          Nothing more. Study one subject at a time (e.g., Agency Laws) with
          definitions, memory tricks, and AI explanations built in.
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="badge badge-primary badge-outline badge-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="lg:order-2">
        <img
          src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/key-concept-05-04.png"
          alt="Key Concepts page — 144 concepts organized by topic"
          className="w-full h-auto block rounded-2xl border border-base-200"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
          loading="lazy"
        />
      </div>
    </div>
  )
}
