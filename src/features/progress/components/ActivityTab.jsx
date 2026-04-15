import {
  Clock,
  Info,
  BookOpen,
  Target,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react'

export default function ActivityTab({ recentActivity }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" /> Recent Activity (Last 7
          Days)
        </h2>
        {recentActivity.length === 0 ? (
          <div className="alert alert-info">
            <Info className="w-6 h-6" />
            <span>No recent activity in the last 7 days.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((attempt) => (
              <div
                key={attempt.id}
                className={`p-4 rounded-lg border-l-4 ${attempt.is_correct ? 'border-success bg-success/10' : 'border-error bg-error/10'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium line-clamp-2 mb-2">
                      {attempt.question_text}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="badge badge-sm gap-1">
                        <BookOpen className="w-3 h-3" />
                        {attempt.topic}
                      </span>
                      {attempt.subtopic && (
                        <span className="badge badge-sm badge-outline gap-1">
                          <Target className="w-3 h-3" />
                          {attempt.subtopic}
                        </span>
                      )}
                      {attempt.time_spent_seconds && (
                        <span className="badge badge-sm badge-ghost gap-1">
                          <Clock className="w-3 h-3" />
                          {attempt.time_spent_seconds}s
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {attempt.is_correct ? (
                      <div className="badge badge-success gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Correct
                      </div>
                    ) : (
                      <div className="badge badge-error gap-2">
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-base-content/50 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(attempt.attempted_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
