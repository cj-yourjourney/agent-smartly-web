import { Flame, Calendar } from 'lucide-react'
import ExamReadinessCard from './ExamReadinessCard'

export default function OverviewTab({ summary, topicProgress, router }) {
  return (
    <div className="space-y-6">
      <ExamReadinessCard
        summary={summary}
        topicProgress={topicProgress}
        router={router}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-warning to-warning-focus text-warning-content shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm opacity-90">Current Streak</h2>
                <p className="text-4xl font-bold mt-2">
                  {summary.current_streak_days}
                </p>
                <p className="text-xs opacity-75">days</p>
              </div>
              <Flame className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-info to-info-focus text-info-content shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm opacity-90">Last 7 Days</h2>
                <p className="text-4xl font-bold mt-2">
                  {summary.questions_last_7_days}
                </p>
                <p className="text-xs opacity-75">questions</p>
              </div>
              <Calendar className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
