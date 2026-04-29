import { useState } from 'react'
import {
  Target,
  Award,
  BookOpen,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  Lightbulb
} from 'lucide-react'
import ROUTES from '@/shared/constants/routes'

const QUESTION_TARGET = 300
const ACCURACY_TARGET = 82
const CONCEPT_TARGET = 134

// ── Score band helpers ────────────────────────────────────────────────────────

function getScoreBand(score) {
  if (score === 0)
    return {
      label: 'Not Started',
      badge: 'badge-ghost',
      text: 'text-base-content/30',
      bar: ''
    }
  if (score < 40)
    return {
      label: 'Early Stage',
      badge: 'badge-error',
      text: 'text-error',
      bar: 'progress-error'
    }
  if (score < 55)
    return {
      label: 'Building Up',
      badge: 'badge-warning',
      text: 'text-warning',
      bar: 'progress-warning'
    }
  if (score < 70)
    return {
      label: 'Developing',
      badge: 'badge-info',
      text: 'text-info',
      bar: 'progress-info'
    }
  if (score < 85)
    return {
      label: 'On Track',
      badge: 'badge-primary',
      text: 'text-primary',
      bar: 'progress-primary'
    }
  return {
    label: 'Exam Ready',
    badge: 'badge-success',
    text: 'text-success',
    bar: 'progress-success'
  }
}

// ── Smart next-step recommendation ───────────────────────────────────────────

function getNextStep({
  score,
  volumePct,
  accuracyPct,
  topicCoveragePct,
  conceptCoverage
}) {
  if (score === 0) {
    return {
      headline: 'Start your first practice session',
      detail:
        'Answer a few questions to get your baseline score and see where you stand.'
    }
  }

  const candidates = [
    {
      key: 'accuracy',
      pct: accuracyPct,
      headline: 'Focus on accuracy',
      detail:
        'Accuracy has the biggest impact (45%). Review your weak subtopics and make sure you understand the "why" behind each answer.'
    },
    {
      key: 'volume',
      pct: volumePct,
      headline: 'Practice more questions',
      detail: `You've answered ${Math.round(volumePct * 3)} of 300 target questions. Consistent daily practice builds pattern recognition fast.`
    },
    {
      key: 'topics',
      pct: topicCoveragePct,
      headline: 'Cover more topics',
      detail:
        'Some topics still need 25+ questions to earn full credit. Spread your practice across all 7 exam topics.'
    },
    {
      key: 'concepts',
      pct: conceptCoverage,
      headline: 'Review key concepts',
      detail: `Read through the 134 key concepts — a quick win with ${CONCEPT_TARGET - Math.round((conceptCoverage * CONCEPT_TARGET) / 100)} still remaining.`
    }
  ]

  const top = candidates
    .filter((c) => c.pct < 100)
    .sort((a, b) => a.pct - b.pct)[0]

  if (!top) {
    return {
      headline: 'Keep your score fresh',
      detail:
        "All pillars complete! Practice regularly so your score doesn't decay from inactivity."
    }
  }

  return top
}

// ── Pillar card ───────────────────────────────────────────────────────────────

function PillarCard({
  icon,
  label,
  weight,
  value,
  pct,
  progressClass,
  note,
  done
}) {
  return (
    <div className="bg-base-200 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon}
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="text-xs text-base-content/40 font-medium flex-shrink-0">
          {weight}
        </span>
      </div>
      <progress
        className={`progress w-full h-1.5 ${progressClass}`}
        value={pct}
        max="100"
      />
      {/* Each line gets its own row — no truncation */}
      <div className="text-xs space-y-0.5">
        <p className="text-base-content/60">{value}</p>
        <p
          className={done ? 'text-success font-medium' : 'text-base-content/40'}
        >
          {note}
        </p>
      </div>
    </div>
  )
}

// ── Scoring explainer (collapsible) ──────────────────────────────────────────

function ScoringExplainer() {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-base-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-base-content/50 hover:bg-base-200 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          How is this score calculated?
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3">
          <p className="text-xs text-base-content/60 leading-relaxed">
            Your Exam Readiness score (0–100) is a composite of four pillars
            that mirror what actually predicts CA Real Estate Exam success. It
            decays slightly when you stop practicing, nudging you to stay
            consistent.
          </p>
          <div className="space-y-2">
            {[
              {
                label: 'Accuracy',
                weight: '45%',
                desc: 'Weighted accuracy across all topics vs. an 82% target. The biggest lever — quality over quantity.'
              },
              {
                label: 'Question Volume',
                weight: '25%',
                desc: '300 questions is the target. Repetition deepens pattern recognition.'
              },
              {
                label: 'Topic Coverage',
                weight: '15%',
                desc: '25+ questions per topic earns full credit; fewer gives partial credit.'
              },
              {
                label: 'Key Concepts',
                weight: '15%',
                desc: 'Reading all 134 key concepts. Fast and high-impact.'
              }
            ].map((row) => (
              <div key={row.label} className="flex gap-2 items-start">
                <span className="badge badge-ghost badge-sm flex-shrink-0 mt-0.5">
                  {row.weight}
                </span>
                <div>
                  <span className="font-semibold text-xs">{row.label} — </span>
                  <span className="text-xs text-base-content/50">
                    {row.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-base-content/40 border-t border-base-200 pt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            Freshness: score drops to 85% after 7 days, 70% after 30, and 55%
            after 60 days without practice.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExamReadinessCard({ summary, topicProgress, router }) {
  const score = summary.exam_readiness_score || 0
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

  const band = getScoreBand(score)
  const nextStep = getNextStep({
    score,
    volumePct,
    accuracyPct,
    topicCoveragePct,
    conceptCoverage
  })

  const pillars = [
    {
      icon: <Target className="w-4 h-4 text-primary" />,
      label: 'Questions',
      weight: '25%',
      value: `${totalQ} / ${QUESTION_TARGET}`,
      pct: volumePct,
      progressClass: volumePct >= 100 ? 'progress-success' : 'progress-primary',
      note: volumePct >= 100 ? '✓ Done' : `${QUESTION_TARGET - totalQ} to go`,
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
          ? '✓ Done'
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
          ? '✓ Done'
          : `${7 - topicsFullyCovered} topics left`,
      done: topicCoveragePct >= 100
    },
    {
      icon: <Zap className="w-4 h-4 text-warning" />,
      label: 'Concepts',
      weight: '15%',
      value: `${conceptsFullyReviewed}${conceptsSkimmed > 0 ? ` + ${conceptsSkimmed} skimmed` : ''} / ${CONCEPT_TARGET}`,
      pct: conceptCoverage,
      progressClass:
        conceptCoverage >= 100 ? 'progress-success' : 'progress-warning',
      note:
        conceptCoverage >= 100
          ? '✓ Done'
          : `${CONCEPT_TARGET - conceptsFullyReviewed} remaining`,
      done: conceptCoverage >= 100
    }
  ]

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body gap-5 p-4 sm:p-6">
        {/* Score */}
        <div>
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-1.5">
            Exam Readiness Score
          </p>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className={`text-5xl font-bold tabular-nums ${band.text}`}>
              {score}
            </span>
            <span className="text-base-content/30 text-xl">/100</span>
            <span className={`badge ${band.badge} font-semibold`}>
              {band.label}
            </span>
          </div>
          <div className="mt-3 w-48 max-w-full">
            <progress
              className={`progress w-full h-2 ${band.bar}`}
              value={score}
              max="100"
            />
          </div>
        </div>

        {/* Inactivity warning */}
        {daysInactive !== null && daysInactive > 7 && (
          <div
            className={`alert py-2 text-sm ${daysInactive > 30 ? 'alert-error' : 'alert-warning'}`}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>
              Score at <strong>{freshnessPct}%</strong> strength —{' '}
              {daysInactive} days without practice. Practice today to stop the
              decay.
            </span>
          </div>
        )}

        {/* Next step recommendation */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary mb-0.5">
              {nextStep.headline}
            </p>
            <p className="text-xs text-base-content/60 leading-relaxed">
              {nextStep.detail}
            </p>
          </div>
        </div>

        {/* CTA buttons — full-width stacked, default (md) size */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
            className="btn btn-primary w-full gap-2"
          >
            <Target className="w-5 h-5" />
            Practice Questions
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
          <button
            onClick={() => router.push(ROUTES.LEARNING.KEY_CONCEPTS)}
            className="btn btn-outline w-full gap-2"
          >
            <Zap className="w-5 h-5" />
            Review Key Concepts
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
        </div>

        {/* 4 Pillars */}
        <div>
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-3">
            The 4 Pillars
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {pillars.map((p) => (
              <PillarCard key={p.label} {...p} />
            ))}
          </div>
        </div>

        {/* Scoring explainer */}
        <ScoringExplainer />
      </div>
    </div>
  )
}
