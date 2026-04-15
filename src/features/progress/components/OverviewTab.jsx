import { Flame, Calendar } from 'lucide-react'
import ExamReadinessCard from './ExamReadinessCard'

export default function OverviewTab({ summary, topicProgress, router }) {
  const stats = [
    {
      label: 'Current Streak',
      value: summary.current_streak_days,
      unit: 'days',
      icon: <Flame className="w-5 h-5 text-warning" />
    },
    {
      label: 'Last 7 Days',
      value: summary.questions_last_7_days,
      unit: 'questions',
      icon: <Calendar className="w-5 h-5 text-info" />
    }
  ]

  return (
    <div className="space-y-4">
      <ExamReadinessCard
        summary={summary}
        topicProgress={topicProgress}
        router={router}
      />

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card bg-base-100 shadow-sm border border-base-200"
          >
            <div className="card-body py-4 px-5">
              <div className="flex items-center gap-2 text-sm text-base-content/50 mb-1">
                {s.icon}
                {s.label}
              </div>
              <p className="text-3xl font-bold tabular-nums">{s.value}</p>
              <p className="text-xs text-base-content/40">{s.unit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
