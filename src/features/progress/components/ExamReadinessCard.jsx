import {
  Trophy,
  Clock,
  Target,
  BookOpen,
  AlertTriangle,
  Zap,
  CheckCircle,
  ChevronRight,
  Award,
  BarChart2
} from 'lucide-react'
import ROUTES from '@/shared/constants/routes'

export default function ExamReadinessCard({ summary, topicProgress, router }) {
  const score = summary.exam_readiness_score || 0
  const label = summary.exam_readiness_label || 'Not Started'
  const coverage = summary.exam_coverage || 0
  const totalQ = summary.total_questions_attempted || 0
  const accuracy = summary.overall_accuracy || 0
  const conceptCoverage = summary.key_concept_coverage || 0
  const conceptsFullyReviewed = summary.concepts_fully_reviewed || 0
  const conceptsSkimmed = summary.concepts_skimmed || 0
  const daysInactive = summary.days_since_last_activity ?? null
  const freshnessPct = summary.score_freshness_pct ?? 100

  const QUESTION_TARGET = 300
  const ACCURACY_TARGET = 82
  const KEY_CONCEPT_TARGET = 134

  const volumePct = Math.min((totalQ / QUESTION_TARGET) * 100, 100)
  const accuracyPct = Math.min((accuracy / ACCURACY_TARGET) * 100, 100)

  const topicCoverageScore = topicProgress.reduce((acc, tp) => {
    const q = tp.questions_attempted
    if (q === 0) return acc
    if (q < 10) return acc + 0.25
    if (q < 25) return acc + 0.6
    return acc + 1.0
  }, 0)
  const topicCoveragePct = Math.min((topicCoverageScore / 7) * 100, 100)
  const topicsFullyCovered = topicProgress.filter(
    (t) => t.questions_attempted >= 25
  ).length
  const topicsStarted = topicProgress.filter(
    (t) => t.questions_attempted > 0 && t.questions_attempted < 25
  ).length

  const getScoreStyle = () => {
    if (score === 0)
      return { fill: 'text-base-content/20', badge: 'badge-ghost' }
    if (score < 40) return { fill: 'text-error', badge: 'badge-error' }
    if (score < 55) return { fill: 'text-warning', badge: 'badge-warning' }
    if (score < 70) return { fill: 'text-info', badge: 'badge-info' }
    if (score < 85) return { fill: 'text-primary', badge: 'badge-primary' }
    return { fill: 'text-success', badge: 'badge-success' }
  }
  const style = getScoreStyle()

  const getGuidanceItems = () => {
    const items = []
    if (daysInactive !== null && daysInactive > 7) {
      const decayMsg =
        daysInactive <= 30
          ? `Your score is currently at ${freshnessPct}% strength. Practice today to bring it back to full.`
          : daysInactive <= 60
            ? `Your score has dropped to ${freshnessPct}%. Memory fades — get back on track today!`
            : `Your score is at ${freshnessPct}% — significant time has passed. A strong study session will help fast.`
      items.push({
        type: daysInactive <= 30 ? 'warning' : 'error',
        icon: <Clock className="w-4 h-4" />,
        title: `Score at ${freshnessPct}% — ${daysInactive} days without practice`,
        description: decayMsg,
        action: 'Practice Now',
        onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
      })
    }
    if (totalQ === 0) {
      return [
        {
          type: 'error',
          icon: <Target className="w-4 h-4" />,
          title: 'Start with practice questions',
          description:
            'You need 300+ questions to build a reliable readiness score. Start now!',
          action: 'Go to Practice',
          onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
        },
        {
          type: 'info',
          icon: <BookOpen className="w-4 h-4" />,
          title: 'Review key concepts first',
          description:
            'Build a foundation by reviewing key concepts before jumping into questions.',
          action: 'View Key Concepts',
          onClick: () => router.push(ROUTES.LEARNING.KEY_CONCEPTS)
        }
      ]
    }
    if (totalQ < 300) {
      const remaining = 300 - totalQ
      items.push({
        type: totalQ < 100 ? 'error' : 'warning',
        icon: <Target className="w-4 h-4" />,
        title: `${remaining} more questions to reach the target`,
        description: `Students who pass typically answer 300+ questions. You've done ${totalQ} so far.`,
        action: 'Keep Practicing',
        onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
      })
    }
    const missedTopics =
      topicProgress.length > 0
        ? 7 - topicProgress.filter((t) => t.questions_attempted > 0).length
        : 7
    const undertreatedTopics = topicProgress.filter(
      (t) => t.questions_attempted > 0 && t.questions_attempted < 25
    ).length
    if (missedTopics > 0) {
      items.push({
        type: 'warning',
        icon: <BarChart2 className="w-4 h-4" />,
        title: `${missedTopics} topic${missedTopics > 1 ? 's' : ''} not yet started`,
        description:
          'The CA exam tests all 7 topic areas — missing any of them will hurt your score.',
        action: 'Practice All Topics',
        onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
      })
    } else if (undertreatedTopics > 0) {
      items.push({
        type: 'info',
        icon: <BarChart2 className="w-4 h-4" />,
        title: `${undertreatedTopics} topic${undertreatedTopics > 1 ? 's' : ''} need 25+ questions for full credit`,
        description:
          'Topics with fewer than 25 questions only get partial coverage credit. Keep going!',
        action: 'Practice Those Topics',
        onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
      })
    }
    if (totalQ >= 20 && accuracy < 82) {
      items.push({
        type: accuracy < 65 ? 'error' : 'warning',
        icon: <AlertTriangle className="w-4 h-4" />,
        title: `Accuracy is ${accuracy}% — aim for 82%+ to max this pillar`,
        description:
          'Review key concepts for your weakest topics. Understanding the material is what pushes accuracy past 82%.',
        action: 'Review Key Concepts',
        onClick: () => router.push(ROUTES.LEARNING.KEY_CONCEPTS)
      })
    }
    if (conceptCoverage < 100) {
      const skimMsg =
        conceptsSkimmed > 0
          ? ` You've also skimmed ${conceptsSkimmed} — spend 60+ seconds on each to get full credit.`
          : ''
      items.push({
        type: conceptsFullyReviewed < 30 ? 'warning' : 'info',
        icon: <BookOpen className="w-4 h-4" />,
        title: `${conceptsFullyReviewed} of ${KEY_CONCEPT_TARGET} concepts fully reviewed`,
        description: `Students who understand the key concepts find exam questions much easier.${skimMsg}`,
        action: 'Review Key Concepts',
        onClick: () => router.push(ROUTES.LEARNING.KEY_CONCEPTS)
      })
    }
    if (accuracy >= 75 && totalQ < 300 && missedTopics === 0) {
      items.push({
        type: 'info',
        icon: <Zap className="w-4 h-4" />,
        title: 'Great accuracy — now build volume',
        description: `You're hitting ${accuracy}% accuracy across all topics. Keep answering to solidify your score.`,
        action: 'Keep Practicing',
        onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
      })
    }
    if (score >= 85) {
      items.push({
        type: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        title: "You're exam ready!",
        description:
          '300+ questions, 75%+ accuracy, all topics covered, and key concepts reviewed. Do a final weak-area review.',
        action: 'Final Review',
        onClick: () => router.push(ROUTES.LEARNING.PRACTICE)
      })
    }
    return items
  }

  const guidance = getGuidanceItems()
  const alertClass = {
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
    success: 'alert-success'
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" /> Exam Readiness
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  strokeWidth="10"
                  className="stroke-base-200"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className={style.fill}
                  stroke="currentColor"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${style.fill}`}>
                  {score > 0 ? `${score}%` : '—'}
                </span>
                <span className="text-xs text-base-content/50 mt-1">
                  readiness
                </span>
              </div>
            </div>
            <span className={`badge badge-lg font-semibold ${style.badge}`}>
              {label}
            </span>
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-base-content/60 mb-4">
              {totalQ === 0
                ? 'Your score tracks 4 things: accuracy, questions answered, topics covered, and key concepts read. Practice daily — the score reflects how ready you are right now.'
                : freshnessPct < 100
                  ? `Score reduced to ${freshnessPct}% of full value — ${daysInactive} days since last practice. Study today to restore it.`
                  : 'Score tracks accuracy (45%), questions (25%), topic coverage (15%), and key concepts (15%). Keep practicing daily to keep it fresh.'}
            </p>
            {guidance.map((item, i) => (
              <div key={i} className={`alert ${alertClass[item.type]} py-3`}>
                <div className="flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs opacity-80 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <button
                  onClick={item.onClick}
                  className="btn btn-xs btn-ghost gap-1 flex-shrink-0 whitespace-nowrap"
                >
                  {item.action} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-base-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
              The 4 pillars of exam readiness
            </p>
            {freshnessPct < 100 && (
              <span
                className={`badge badge-sm gap-1 ${freshnessPct <= 70 ? 'badge-error' : 'badge-warning'}`}
              >
                <Clock className="w-3 h-3" /> Score at {freshnessPct}% —
                inactive {daysInactive}d
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Questions Pillar */}
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Questions</span>
                <span className="ml-auto text-xs font-bold text-base-content/50">
                  25%
                </span>
              </div>
              <p className="text-xs text-base-content/40 mb-2">
                Target: 300 answered
              </p>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>{totalQ}</span>
                <span className="text-base-content/40">/ 300</span>
              </div>
              <progress
                className={`progress w-full h-2 ${volumePct >= 100 ? 'progress-success' : 'progress-primary'}`}
                value={volumePct}
                max="100"
              />
              <p
                className={`text-xs mt-1.5 font-medium ${volumePct >= 100 ? 'text-success' : 'text-base-content/40'}`}
              >
                {volumePct >= 100
                  ? '✓ Target reached'
                  : `${300 - totalQ} more to go`}
              </p>
            </div>
            {/* Accuracy Pillar */}
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-secondary" />
                <span className="text-sm font-semibold">Accuracy</span>
                <span className="ml-auto text-xs font-bold text-base-content/50">
                  45%
                </span>
              </div>
              <p className="text-xs text-base-content/40 mb-2">
                Target: 82% correct
              </p>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>{accuracy}%</span>
                <span className="text-base-content/40">/ 82%</span>
              </div>
              <progress
                className={`progress w-full h-2 ${accuracyPct >= 100 ? 'progress-success' : 'progress-warning'}`}
                value={accuracyPct}
                max="100"
              />
              <p
                className={`text-xs mt-1.5 font-medium ${accuracyPct >= 100 ? 'text-success' : 'text-base-content/40'}`}
              >
                {accuracyPct >= 100
                  ? '✓ Target reached'
                  : `Need ${Math.max(0, 82 - accuracy).toFixed(1)}% more`}
              </p>
            </div>
            {/* Topics Pillar */}
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold">Topics</span>
                <span className="ml-auto text-xs font-bold text-base-content/50">
                  15%
                </span>
              </div>
              <p className="text-xs text-base-content/40 mb-2">
                Target: 25+ questions per topic
              </p>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>
                  {topicsFullyCovered} done{' '}
                  {topicsStarted > 0 && (
                    <span className="text-base-content/40">
                      · {topicsStarted} in progress
                    </span>
                  )}
                </span>
                <span className="text-base-content/40">/ 7</span>
              </div>
              <progress
                className={`progress w-full h-2 ${topicCoveragePct >= 100 ? 'progress-success' : 'progress-info'}`}
                value={topicCoveragePct}
                max="100"
              />
              <p
                className={`text-xs mt-1.5 font-medium ${topicCoveragePct >= 100 ? 'text-success' : 'text-base-content/40'}`}
              >
                {topicCoveragePct >= 100
                  ? '✓ All topics covered'
                  : `${7 - topicsFullyCovered} topics need 25+ questions`}
              </p>
            </div>
            {/* Concepts Pillar */}
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold">Key Concepts</span>
                <span className="ml-auto text-xs font-bold text-base-content/50">
                  15%
                </span>
              </div>
              <p className="text-xs text-base-content/40 mb-2">
                Target: read 134 for 60s+ each
              </p>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>
                  {conceptsFullyReviewed} fully read{' '}
                  {conceptsSkimmed > 0 && (
                    <span className="text-base-content/40">
                      · {conceptsSkimmed} skimmed
                    </span>
                  )}
                </span>
                <span className="text-base-content/40">
                  / {KEY_CONCEPT_TARGET}
                </span>
              </div>
              <progress
                className={`progress w-full h-2 ${conceptCoverage >= 100 ? 'progress-success' : 'progress-warning'}`}
                value={conceptCoverage}
                max="100"
              />
              <p
                className={`text-xs mt-1.5 font-medium ${conceptCoverage >= 100 ? 'text-success' : 'text-base-content/40'}`}
              >
                {conceptCoverage >= 100
                  ? '✓ All concepts reviewed'
                  : conceptsSkimmed > 0
                    ? `${conceptsSkimmed} skimmed — re-read for 60s+ to count`
                    : `${KEY_CONCEPT_TARGET - conceptsFullyReviewed} concepts remaining`}
              </p>
            </div>
          </div>
          {freshnessPct < 100 && (
            <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-2 text-xs">
              <Clock className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-warning">
                  Why is my score reduced?
                </span>
                <span className="text-base-content/60 ml-1">
                  Readiness fades without practice. Your score is multiplied by{' '}
                  {freshnessPct}% because you haven't studied in {daysInactive}{' '}
                  days.{' '}
                  {daysInactive <= 30
                    ? ' Practice today to restore it to full strength.'
                    : ' Get back on track to restore your score.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
