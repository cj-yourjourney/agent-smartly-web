// features/home/components/how-it-works/StepProgress.jsx
const TAGS = [
  'Readiness Score',
  'Per-Topic Accuracy',
  'DRE-Weighted',
  'On Track Indicator'
]

export default function StepProgress() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
      <div className="flex flex-col gap-4 lg:order-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shrink-0">
            3
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Check Progress
          </span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl">
          Know Exactly Where You Stand
        </h3>
        <p className="text-base-content/65 text-lg leading-relaxed">
          Your{' '}
          <span className="font-semibold text-base-content">
            Exam Readiness Score
          </span>{' '}
          tracks accuracy, question volume, topic coverage, and key concepts
          reviewed — all weighted to match the real DRE exam. See which topic
          to focus on next and know when you're actually ready to sit the exam.
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
          src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/exam-readiness-score-05-04.png"
          alt="Exam Readiness Score dashboard"
          className="w-full h-auto block rounded-2xl border border-base-200"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
          loading="lazy"
        />
      </div>
    </div>
  )
}
