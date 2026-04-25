import { useState, useCallback } from 'react'
import { authenticatedFetch, API_CONFIG } from '../../../shared/api/config'
import {
  ClipboardList,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Target,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Loader2,
  AlertTriangle
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function AccuracyBar({ pct }) {
  const color = pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-error'
  return (
    <div className="w-full bg-base-300 rounded-full h-1 mt-1">
      <div
        className={`${color} h-1 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function AttemptRow({ attempt, index }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg text-sm border-l-2
        ${attempt.is_correct ? 'border-success bg-success/5' : 'border-error bg-error/5'}`}
    >
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center text-xs text-base-content/40 font-bold mt-0.5">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-medium line-clamp-2 mb-1.5 leading-snug text-sm">
          {attempt.question_text}
        </p>

        <div className="flex flex-wrap gap-1 mb-2">
          <span className="badge badge-xs badge-ghost gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            {attempt.topic_display || attempt.topic}
          </span>
          {attempt.subtopic && (
            <span className="badge badge-xs badge-outline gap-1">
              <Target className="w-2.5 h-2.5" />
              {attempt.subtopic}
            </span>
          )}
          {attempt.time_spent_seconds != null && (
            <span className="badge badge-xs badge-ghost gap-1">
              <Clock className="w-2.5 h-2.5" />
              {attempt.time_spent_seconds}s
            </span>
          )}
        </div>

        {attempt.is_correct ? (
          <div className="flex items-start gap-1.5 text-xs text-success font-medium">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{attempt.correct_answer_text || attempt.correct_answer}</span>
          </div>
        ) : (
          <div className="space-y-1">
            {attempt.user_answer && (
              <div className="flex items-start gap-1.5 text-xs text-error font-medium">
                <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Your answer: {attempt.user_answer_text || attempt.user_answer}
                </span>
              </div>
            )}
            {attempt.correct_answer && (
              <div className="flex items-start gap-1.5 text-xs text-success font-medium">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Correct:{' '}
                  {attempt.correct_answer_text || attempt.correct_answer}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 mt-0.5">
        {attempt.is_correct ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <XCircle className="w-4 h-4 text-error" />
        )}
      </div>
    </div>
  )
}

// ── Session Card ──────────────────────────────────────────────────────────────

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const statusBadge = () => {
    if (session.status === 'in_progress')
      return <span className="badge badge-warning badge-sm">In Progress</span>
    if (session.status === 'abandoned')
      return <span className="badge badge-ghost badge-sm">Abandoned</span>
    if (session.passed)
      return (
        <span className="badge badge-success badge-sm gap-1">
          <CheckCircle className="w-3 h-3" />
          Passed
        </span>
      )
    return (
      <span className="badge badge-error badge-sm gap-1">
        <XCircle className="w-3 h-3" />
        Failed
      </span>
    )
  }

  const borderColor =
    session.status !== 'completed'
      ? 'border-l-warning'
      : session.passed
        ? 'border-l-success'
        : 'border-l-error'

  const fetchDetail = useCallback(async () => {
    if (detail) return
    setLoading(true)
    setFetchError(null)
    try {
      const res = await authenticatedFetch(
        `${API_CONFIG.ENDPOINTS.SESSIONS}${session.id}/`
      )
      if (!res.ok) throw new Error(`Failed to load (${res.status})`)
      setDetail(await res.json())
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [session.id, detail])

  const handleToggle = () => {
    const next = !expanded
    setExpanded(next)
    if (next && !detail && !loading) fetchDetail()
  }

  const attempts = detail?.attempts ?? []

  return (
    <div
      className={`rounded-lg border border-base-200 border-l-4 ${borderColor} bg-base-100`}
    >
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full text-left px-4 py-3 focus:outline-none"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-sm">
                {session.session_type_display}
              </span>
              {statusBadge()}
            </div>
            {session.topic_display && (
              <p className="text-xs text-base-content/50 flex items-center gap-1 mb-1.5">
                <Target className="w-3 h-3" />
                {session.topic_display}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-base-content/50">
              <span>
                {session.questions_attempted}/{session.total_questions_planned}{' '}
                questions
              </span>
              {session.duration_minutes > 0 && (
                <span>{session.duration_minutes} min</span>
              )}
              <span
                className={
                  session.accuracy >= 70
                    ? 'text-success font-medium'
                    : session.accuracy >= 40
                      ? 'text-warning font-medium'
                      : 'text-error font-medium'
                }
              >
                {session.accuracy}%
              </span>
            </div>
            {session.questions_attempted > 0 && (
              <div className="mt-1.5 max-w-xs">
                <AccuracyBar pct={session.accuracy} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="text-xs text-base-content/40 flex items-center gap-1 hidden sm:flex">
              <Calendar className="w-3 h-3" />
              {new Date(session.started_at).toLocaleDateString()}
            </p>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-base-content/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-base-content/40" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded attempts */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-base-200 pt-3 space-y-2">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-base-content/40 py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          )}
          {fetchError && (
            <div className="alert alert-error py-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {fetchError}
            </div>
          )}
          {!loading && !fetchError && detail && attempts.length === 0 && (
            <p className="text-sm text-base-content/40 py-3 text-center">
              No attempts recorded.
            </p>
          )}
          {!loading && attempts.length > 0 && (
            <>
              {detail?.topic_breakdown?.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {detail.topic_breakdown.map((tb) => (
                    <div
                      key={tb.topic}
                      className="badge badge-outline gap-1 py-2 px-2 text-xs"
                    >
                      <span className="font-semibold">{tb.topic_display}:</span>
                      {tb.questions_correct}/{tb.questions_attempted}
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {attempts.map((attempt, i) => (
                  <AttemptRow key={attempt.id} attempt={attempt} index={i} />
                ))}
              </div>
              <div className="pt-2 border-t border-base-content/10 flex gap-4 text-xs text-base-content/40">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                  {session.questions_correct} correct
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-error" />
                  {session.questions_incorrect} incorrect
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SessionsActivityTab({ sessions }) {
  // Safety-net: never show sessions where the user never answered a question.
  // The backend already excludes these, but guard here too in case of stale
  // Redux state or a direct prop passed from elsewhere.
  const visibleSessions = (sessions || []).filter(
    (s) => s.questions_attempted > 0
  )

  const scoredSessions = visibleSessions.filter(
    (s) => s.status === 'completed' && s.questions_attempted > 0
  )
  const avgAccuracy =
    scoredSessions.length > 0
      ? Math.round(
          scoredSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) /
            scoredSessions.length
        )
      : 0
  const totalQuestions = visibleSessions.reduce(
    (sum, s) => sum + (s.questions_attempted || 0),
    0
  )

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body gap-5">
        <h2 className="font-semibold text-base flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Practice Sessions
        </h2>

        {/* Summary strip */}
        {visibleSessions.length > 0 && (
          <div className="flex gap-6 text-sm border-b border-base-200 pb-4">
            <div>
              <p className="text-xs text-base-content/40 mb-0.5">Sessions</p>
              <p className="font-bold tabular-nums">{visibleSessions.length}</p>
            </div>
            <div>
              <p className="text-xs text-base-content/40 mb-0.5">Questions</p>
              <p className="font-bold tabular-nums">{totalQuestions}</p>
            </div>
            <div>
              <p className="text-xs text-base-content/40 mb-0.5">
                Avg Accuracy
              </p>
              <p
                className={`font-bold tabular-nums ${avgAccuracy >= 70 ? 'text-success' : avgAccuracy >= 40 ? 'text-warning' : avgAccuracy > 0 ? 'text-error' : ''}`}
              >
                {scoredSessions.length > 0 ? `${avgAccuracy}%` : '—'}
              </p>
            </div>
          </div>
        )}

        {visibleSessions.length === 0 ? (
          <div className="alert alert-info">
            <Info className="w-5 h-5" />
            <span className="text-sm">
              No sessions yet. Start a practice session to see results here.
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
