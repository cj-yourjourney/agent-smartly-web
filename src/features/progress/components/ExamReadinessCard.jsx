import { Target, Award, BookOpen, Zap, Clock, ChevronRight } from 'lucide-react'
import ROUTES from '@/shared/constants/routes'

const QUESTION_TARGET = 300
const ACCURACY_TARGET = 82
const CONCEPT_TARGET = 134

export default function ExamReadinessCard({ summary, topicProgress, router }) {
  const score = summary.exam_readiness_score || 0
  const label = summary.exam_readiness_label || 'Not Started'
  const totalQ = summary.total_questions_attempted || 0
  const accuracy = summary.overall_accuracy || 0
  const conceptCoverage = summary.key_concept_coverage || 0
  const conceptsFullyReviewed = summary.concepts_fully_reviewed || 0
  const conceptsSkimmed = summary.concepts_skimmed || 0
  const daysInactive = summary.days_since_last_activity ?? null
  const freshnessPct = summary.score_freshness_pct ?? 100

  const topicsFullyCovered = topicProgress.filter(
    (t) => t.questions_attempted >= 25
  ).length
  const topicsStarted = topicProgress.filter(
    (t) => t.questions_attempted > 0 && t.questions_attempted < 25
  ).length
  const topicCoverageScore = topicProgress.reduce((acc, tp) => {
    const q = tp.questions_attempted
    if (q === 0) return acc
    if (q < 10) return acc + 0.25
    if (q < 25) return acc + 0.6
    return acc + 1.0
  }, 0)
  const topicCoveragePct = Math.min((topicCoverageScore / 7) * 100, 100)
  const volumePct = Math.min((totalQ / QUESTION_TARGET) * 100, 100)
  const accuracyPct = Math.min((accuracy / ACCURACY_TARGET) * 100, 100)

  const scoreColor =
    score === 0
      ? 'text-base-content/30'
      : score < 40
        ? 'text-error'
        : score < 55
          ? 'text-warning'
          : score < 70
            ? 'text-info'
            : score < 85
              ? 'text-primary'
              : 'text-success'

  const scoreBadge =
    score === 0
      ? 'badge-ghost'
      : score < 40
        ? 'badge-error'
        : score < 55
          ? 'badge-warning'
          : score < 70
            ? 'badge-info'
            : score < 85
              ? 'badge-primary'
              : 'badge-success'

  const pillars = [
    {
      icon: <Target className="w-4 h-4 text-primary" />,
      label: 'Questions',
      weight: '25%',
      value: `${totalQ} / ${QUESTION_TARGET}`,
      pct: volumePct,
      progressClass: volumePct >= 100 ? 'progress-success' : 'progress-primary',
      note:
        volumePct >= 100
          ? '✓ Target reached'
          : `${QUESTION_TARGET - totalQ} more to go`,
      done: volumePct >= 100
    },
    {
      icon: <Award className="w-4 h-4 text-secondary" />,
      label: 'Accuracy',
      weight: '45%',
      value: `${accuracy}% / ${ACCURACY_TARGET}%`,
      pct: accuracyPct,
      progressClass:
        accuracyPct >= 100 ? 'progress-success' : 'progress-warning',
      note:
        accuracyPct >= 100
          ? '✓ Target reached'
          : `Need ${Math.max(0, ACCURACY_TARGET - accuracy).toFixed(1)}% more`,
      done: accuracyPct >= 100
    },
    {
      icon: <BookOpen className="w-4 h-4 text-accent" />,
      label: 'Topics',
      weight: '15%',
      value: `${topicsFullyCovered}${topicsStarted > 0 ? ` + ${topicsStarted} partial` : ''} / 7`,
      pct: topicCoveragePct,
      progressClass:
        topicCoveragePct >= 100 ? 'progress-success' : 'progress-info',
      note:
        topicCoveragePct >= 100
          ? '✓ All topics covered'
          : `${7 - topicsFullyCovered} topics need 25+ questions`,
      done: topicCoveragePct >= 100
    },
    {
      icon: <Zap className="w-4 h-4 text-warning" />,
      label: 'Key Concepts',
      weight: '15%',
      value: `${conceptsFullyReviewed}${conceptsSkimmed > 0 ? ` + ${conceptsSkimmed} skimmed` : ''} / ${CONCEPT_TARGET}`,
      pct: conceptCoverage,
      progressClass:
        conceptCoverage >= 100 ? 'progress-success' : 'progress-warning',
      note:
        conceptCoverage >= 100
          ? '✓ All concepts reviewed'
          : `${CONCEPT_TARGET - conceptsFullyReviewed} remaining`,
      done: conceptCoverage >= 100
    }
  ]

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body gap-6">
        {/* Score row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/50 uppercase tracking-widest mb-1">
              Exam Readiness
            </p>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold tabular-nums ${scoreColor}`}>
                {score}
              </span>
              <span className="text-base-content/30 text-xl">/100</span>
              <span className={`badge ${scoreBadge} font-semibold`}>
                {label}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
            className="btn btn-primary btn-sm gap-1"
          >
            Practice <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Inactivity warning */}
        {daysInactive !== null && daysInactive > 7 && (
          <div
            className={`alert py-2 text-sm ${daysInactive > 30 ? 'alert-error' : 'alert-warning'}`}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>
              Score at <strong>{freshnessPct}%</strong> strength —{' '}
              {daysInactive} days without practice.
            </span>
          </div>
        )}

        {/* 4 Pillars */}
        <div>
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-3">
            The 4 pillars
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pillars.map((p) => (
              <div
                key={p.label}
                className="bg-base-200 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {p.icon}
                    <span className="text-sm font-semibold">{p.label}</span>
                  </div>
                  <span className="text-xs text-base-content/40 font-medium">
                    {p.weight}
                  </span>
                </div>
                <progress
                  className={`progress w-full h-1.5 ${p.progressClass}`}
                  value={p.pct}
                  max="100"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-base-content/60">{p.value}</span>
                  <span
                    className={
                      p.done
                        ? 'text-success font-medium'
                        : 'text-base-content/40'
                    }
                  >
                    {p.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
