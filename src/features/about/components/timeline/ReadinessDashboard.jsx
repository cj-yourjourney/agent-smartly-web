const TOPICS = [
  { topic: 'Property Ownership', pct: 91, color: 'bg-success' },
  { topic: 'Contracts', pct: 78, color: 'bg-warning' },
  { topic: 'Finance', pct: 84, color: 'bg-primary' },
  { topic: 'Agency', pct: 95, color: 'bg-success' }
]

export default function ReadinessDashboard() {
  return (
    <div className="px-5 sm:px-6 pb-6">
      <div className="rounded-2xl border border-primary/20 bg-base-100 overflow-hidden shadow-md">
        <div className="bg-base-200 px-4 py-2.5 flex items-center gap-2 border-b border-base-300">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-error/50" />
            <div className="w-3 h-3 rounded-full bg-warning/50" />
            <div className="w-3 h-3 rounded-full bg-success/50" />
          </div>
          <div className="flex-1 bg-base-300 rounded-md h-5 mx-4 flex items-center px-2">
            <span className="text-[10px] text-base-content/30 font-mono">
              agentsmartly.com/dashboard
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-0.5">
                Exam Readiness
              </p>
              <p className="text-3xl font-black text-primary">
                87
                <span className="text-lg font-bold text-base-content/30">
                  /100
                </span>
              </p>
            </div>
            <div
              className="radial-progress text-primary text-xs font-bold"
              style={{
                '--value': 87,
                '--size': '4rem',
                '--thickness': '4px'
              }}
              aria-label="87%"
            >
              87%
            </div>
          </div>
          <div className="space-y-2">
            {TOPICS.map((t) => (
              <div key={t.topic} className="flex items-center gap-3">
                <p className="text-xs text-base-content/55 w-32 shrink-0 truncate">
                  {t.topic}
                </p>
                <div className="flex-1 bg-base-300 rounded-full h-1.5">
                  <div
                    className={`${t.color} h-1.5 rounded-full`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-base-content/60 w-8 text-right">
                  {t.pct}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-base-content/30 text-center pt-1">
            ↑ What your dashboard looks like as you study
          </p>
        </div>
      </div>
    </div>
  )
}
