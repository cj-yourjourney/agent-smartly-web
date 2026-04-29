import { Flame, Calendar, TrendingUp } from 'lucide-react'
import ExamReadinessCard from './ExamReadinessCard'

export default function OverviewTab({ summary, topicProgress, router }) {
  const streakDays = summary.current_streak_days || 0
  const last7Days = summary.questions_last_7_days || 0
  const totalQ = summary.total_questions_attempted || 0
  const accuracy = summary.overall_accuracy || 0

  const stats = [
    {
      label: 'Current Streak',
      value: streakDays,
      unit: streakDays === 1 ? 'day' : 'days',
      icon: <Flame className="w-4 h-4 text-warning" />,
      accent:
        streakDays >= 7 ? 'border-warning/30 bg-warning/5' : 'border-base-200'
    },
    {
      label: 'Last 7 Days',
      value: last7Days,
      unit: 'questions',
      icon: <Calendar className="w-4 h-4 text-info" />,
      accent: 'border-base-200'
    }
  ]

  return (
    <div className="space-y-4">
      <ExamReadinessCard
        summary={summary}
        topicProgress={topicProgress}
        router={router}
      />

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`card bg-base-100 shadow-sm border ${s.accent}`}
          >
            <div className="card-body py-4 px-4">
              <div className="flex items-center gap-1.5 text-xs text-base-content/50 mb-2">
                {s.icon}
                {s.label}
              </div>
              <p className="text-3xl font-bold tabular-nums leading-none">
                {s.value}
              </p>
              <p className="text-xs text-base-content/40 mt-1">{s.unit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* All-time summary */}
      {totalQ > 0 && (
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body py-3 px-4">
            <p className="text-xs text-base-content/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              All Time
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold tabular-nums">{totalQ}</p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  Questions answered
                </p>
              </div>
              <div className="border-l border-base-200 pl-6">
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    accuracy >= 70
                      ? 'text-success'
                      : accuracy >= 50
                        ? 'text-warning'
                        : 'text-error'
                  }`}
                >
                  {accuracy}%
                </p>
                <p className="text-xs text-base-content/40 mt-0.5">
                  Overall accuracy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
