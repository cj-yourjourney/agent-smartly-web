import {
  ClipboardList,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Target
} from 'lucide-react'

export default function SessionsTab({ sessions }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" /> Practice Sessions
        </h2>

        {!sessions || sessions.length === 0 ? (
          <div className="alert alert-info">
            <Info className="w-6 h-6" />
            <span>
              No practice sessions recorded yet. Start a session to see your
              results here!
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border-l-4 ${
                  session.status === 'completed'
                    ? session.passed
                      ? 'border-success bg-success/10'
                      : 'border-error bg-error/10'
                    : 'border-warning bg-warning/10'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-1">
                      {session.session_type_display}
                      {session.status === 'in_progress' && (
                        <span className="badge badge-warning badge-sm">
                          In Progress
                        </span>
                      )}
                      {session.status === 'abandoned' && (
                        <span className="badge badge-ghost badge-sm">
                          Abandoned
                        </span>
                      )}
                    </h3>

                    {session.topic_display && (
                      <p className="text-sm font-medium flex items-center gap-1 mb-2">
                        <Target className="w-4 h-4 text-base-content/70" />
                        {session.topic_display}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-sm mt-3">
                      <span className="badge badge-outline gap-1">
                        Completed: {session.questions_attempted} /{' '}
                        {session.total_questions_planned}
                      </span>
                      {session.duration_minutes > 0 && (
                        <span className="badge badge-ghost gap-1">
                          <Clock className="w-3 h-3" />
                          {session.duration_minutes} min
                        </span>
                      )}
                      <span className="badge badge-ghost gap-1">
                        Accuracy: {session.accuracy}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {session.status === 'completed' &&
                      (session.passed ? (
                        <div className="badge badge-success gap-2 py-3 px-3 font-bold">
                          <CheckCircle className="w-4 h-4" />
                          Passed
                        </div>
                      ) : (
                        <div className="badge badge-error gap-2 py-3 px-3 font-bold">
                          <XCircle className="w-4 h-4" />
                          Failed
                        </div>
                      ))}
                  </div>
                </div>
                <p className="text-xs text-base-content/50 mt-3 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(session.started_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
