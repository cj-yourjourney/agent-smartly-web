import { useState, useCallback } from 'react'
import { authenticatedFetch, API_CONFIG } from '../../../shared/api/config' // adjust path to match your project
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
  AlertTriangle,
  BarChart2,
  Hash,
  ListChecks,
  Percent
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function AccuracyBar({ pct }) {
  const color = pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-error'
  return (
    <div className="w-full bg-base-300 rounded-full h-1.5 mt-1">
      <div
        className={`${color} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function StatusBadge({ session }) {
  if (session.status === 'in_progress')
    return (
      <span className="badge badge-warning badge-sm font-semibold">
        In Progress
      </span>
    )
  if (session.status === 'abandoned')
    return <span className="badge badge-ghost badge-sm">Abandoned</span>
  if (session.passed)
    return (
      <div className="badge badge-success gap-1 py-3 px-3 font-bold text-xs">
        <CheckCircle className="w-3.5 h-3.5" /> Passed
      </div>
    )
  return (
    <div className="badge badge-error gap-1 py-3 px-3 font-bold text-xs">
      <XCircle className="w-3.5 h-3.5" /> Failed
    </div>
  )
}

function AttemptRow({ attempt, index }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border-l-2 text-sm
        ${
          attempt.is_correct
            ? 'border-success bg-success/5'
            : 'border-error bg-error/5'
        }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Number */}
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-xs font-bold text-base-content/50 mt-0.5">
        {index + 1}
      </span>

      {/* Question */}
      <div className="flex-1 min-w-0">
        <p className="font-medium line-clamp-2 mb-1.5 leading-snug">
          {attempt.question_text}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
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

        {/* ── Answer display ── */}
        {attempt.is_correct ? (
          // Correct: just show the right answer text with a checkmark
          <div className="flex items-start gap-1.5 text-xs text-success font-medium">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{attempt.correct_answer_text || attempt.correct_answer}</span>
          </div>
        ) : (
          // Wrong: show their wrong answer text (red) then the correct answer text (green)
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
                  Correct answer:{' '}
                  {attempt.correct_answer_text || attempt.correct_answer}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result icon */}
      <div className="flex-shrink-0 mt-0.5">
        {attempt.is_correct ? (
          <CheckCircle className="w-5 h-5 text-success" />
        ) : (
          <XCircle className="w-5 h-5 text-error" />
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

  const borderColor =
    session.status === 'completed'
      ? session.passed
        ? 'border-success'
        : 'border-error'
      : 'border-warning'

  const bgColor =
    session.status === 'completed'
      ? session.passed
        ? 'bg-success/5'
        : 'bg-error/5'
      : 'bg-warning/5'

  const fetchDetail = useCallback(async () => {
    if (detail) return // already loaded
    setLoading(true)
    setFetchError(null)
    try {
      const endpoint = `${API_CONFIG.ENDPOINTS.SESSIONS}${session.id}/`
      const res = await authenticatedFetch(endpoint)
      if (!res.ok)
        throw new Error(`Failed to load session detail (${res.status})`)
      const data = await res.json()
      setDetail(data)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [session.id, detail])

  const handleToggle = () => {
    const nextExpanded = !expanded
    setExpanded(nextExpanded)
    if (nextExpanded && !detail && !loading) fetchDetail()
  }

  const attempts = detail?.attempts ?? []

  return (
    <div
      className={`rounded-xl border-l-4 ${borderColor} ${bgColor} transition-all duration-200`}
    >
      {/* ── Header row (always visible) ── */}
      <button
        onClick={handleToggle}
        className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Title + inline badges */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-base leading-tight">
                {session.session_type_display}
              </h3>
              {session.status === 'in_progress' && (
                <span className="badge badge-warning badge-sm font-semibold">
                  In Progress
                </span>
              )}
              {session.status === 'abandoned' && (
                <span className="badge badge-ghost badge-sm">Abandoned</span>
              )}
            </div>

            {session.topic_display && (
              <p className="text-sm text-base-content/70 flex items-center gap-1 mb-2">
                <Target className="w-3.5 h-3.5" />
                {session.topic_display}
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="badge badge-outline badge-sm gap-1">
                <Hash className="w-3 h-3" />
                {session.questions_attempted} /{' '}
                {session.total_questions_planned} questions
              </span>
              {session.duration_minutes > 0 && (
                <span className="badge badge-ghost badge-sm gap-1">
                  <Clock className="w-3 h-3" />
                  {session.duration_minutes} min
                </span>
              )}
              <span className="badge badge-ghost badge-sm gap-1">
                <BarChart2 className="w-3 h-3" />
                {session.accuracy}% accuracy
              </span>
            </div>

            {/* Accuracy bar */}
            {session.questions_attempted > 0 && (
              <div className="mt-2 max-w-xs">
                <AccuracyBar pct={session.accuracy} />
              </div>
            )}
          </div>

          {/* Right side: status badge + chevron */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {session.status === 'completed' && (
              <StatusBadge session={session} />
            )}
            <div className="text-base-content/40 mt-auto">
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-base-content/40 mt-2 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(session.started_at).toLocaleString()}
        </p>
      </button>

      {/* ── Expandable attempts section ── */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-base-content/10 pt-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-base-content/50 py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading questions…
            </div>
          )}

          {fetchError && (
            <div className="alert alert-error alert-sm py-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {fetchError}
            </div>
          )}

          {!loading && !fetchError && attempts.length === 0 && detail && (
            <p className="text-sm text-base-content/50 py-3 text-center">
              No question attempts recorded for this session.
            </p>
          )}

          {!loading && attempts.length > 0 && (
            <>
              {/* Per-topic breakdown (if multi-topic) */}
              {detail?.topic_breakdown?.length > 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {detail.topic_breakdown.map((tb) => (
                    <div
                      key={tb.topic}
                      className="badge badge-outline gap-1 py-3 px-3 text-xs"
                    >
                      <span className="font-semibold">{tb.topic_display}:</span>
                      {tb.questions_correct}/{tb.questions_attempted} correct
                    </div>
                  ))}
                </div>
              )}

              {/* Question list */}
              <div className="space-y-2">
                {attempts.map((attempt, i) => (
                  <AttemptRow key={attempt.id} attempt={attempt} index={i} />
                ))}
              </div>

              {/* Summary footer */}
              <div className="mt-3 pt-3 border-t border-base-content/10 flex gap-4 text-xs text-base-content/50">
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

// ── Stats Header ──────────────────────────────────────────────────────────────

function SessionsStatsHeader({ sessions }) {
  const totalSessions = sessions.length

  const totalQuestions = sessions.reduce(
    (sum, s) => sum + (s.questions_attempted || 0),
    0
  )

  // Avg accuracy across completed sessions that have at least 1 attempt
  const scoredSessions = sessions.filter(
    (s) => s.status === 'completed' && s.questions_attempted > 0
  )
  const avgAccuracy =
    scoredSessions.length > 0
      ? Math.round(
          scoredSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) /
            scoredSessions.length
        )
      : 0

  const stats = [
    {
      label: 'Total sessions',
      value: totalSessions,
      icon: <ClipboardList className="w-5 h-5 text-primary" />
    },
    {
      label: 'Questions practiced',
      value: totalQuestions,
      icon: <ListChecks className="w-5 h-5 text-secondary" />
    },
    {
      label: 'Avg accuracy',
      value: scoredSessions.length > 0 ? `${avgAccuracy}%` : '—',
      icon: <Percent className="w-5 h-5 text-accent" />,
      valueColor:
        avgAccuracy >= 70
          ? 'text-success'
          : avgAccuracy >= 40
            ? 'text-warning'
            : avgAccuracy > 0
              ? 'text-error'
              : ''
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-base-200 rounded-xl p-4 flex flex-col gap-1"
        >
          <div className="flex items-center gap-1.5 text-xs text-base-content/50 font-medium">
            {stat.icon}
            {stat.label}
          </div>
          <p
            className={`text-2xl font-bold leading-tight ${stat.valueColor || ''}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}

// ── Main Tab Component ────────────────────────────────────────────────────────

export default function SessionsActivityTab({ sessions }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-1 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" />
          Practice Sessions
        </h2>
        <p className="text-sm text-base-content/50 mb-4">
          Click any session to review every question you answered.
        </p>

        {/* ── Stats summary ── */}
        {sessions && sessions.length > 0 && (
          <SessionsStatsHeader sessions={sessions} />
        )}

        {!sessions || sessions.length === 0 ? (
          <div className="alert alert-info">
            <Info className="w-6 h-6" />
            <span>
              No practice sessions recorded yet. Start a session to see your
              results here!
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
