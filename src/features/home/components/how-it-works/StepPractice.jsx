// features/home/components/how-it-works/StepPractice.jsx
const TAGS = [
  'Study by Topic',
  '1,300+ Questions',
  'Instant Explanations',
  'Memory Tips',
  'Full Practice Exam'
]

export default function StepPractice() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
      <div className="lg:order-2 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shrink-0">
            2
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Practice
          </span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl">
          Drill Questions in That Same Topic
        </h3>
        <p className="text-base-content/65 text-lg leading-relaxed">
          Immediately test what you just learned with{' '}
          <span className="font-semibold text-base-content">
            1,300+ topic-filtered practice questions
          </span>
          . Every answer comes with a full explanation and memory tip — so you
          learn why, not just what. Aim for 70%+ before moving on.
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
      <div className="lg:order-1 grid grid-cols-2 gap-4">
        <img
          src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/practice-mode-05-04.png"
          alt="Practice mode — choose topic or full exam"
          className="w-full h-auto block rounded-2xl border border-base-200"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
          loading="lazy"
        />
        <img
          src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/question-05-04.png"
          alt="Practice question with instant explanation"
          className="w-full h-auto block rounded-2xl border border-base-200"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
          loading="lazy"
        />
      </div>
    </div>
  )
}
