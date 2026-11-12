// features/home/components/StatsBar.jsx
const STATS = [
  { value: '144', label: 'Essential Key Concepts' },
  { value: '7', label: 'Exam Topics — Review & Practice Each' },
  { value: '1,300+', label: 'Practice Questions' },
  { value: '500+', label: 'Exams Passed' }
]

export default function StatsBar() {
  return (
    <div className="bg-base-200 py-12 border-y border-base-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 py-6 px-4
                  ${i % 2 === 0 ? 'border-r border-base-300' : ''}
                  ${i < 2 ? 'border-b border-base-300 md:border-b-0' : ''}
                  ${i === 1 ? 'md:border-r md:border-base-300' : ''}
                  ${i === 2 ? 'md:border-r md:border-base-300' : ''}
                `}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {s.value}
              </div>
              <div className="text-base-content/50 text-xs text-center mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
