import { useMemo, useCallback } from 'react'
import { AlertCircle, Sparkles, Trophy } from 'lucide-react'

// Shared accuracy bar row used in State B and C banners
function AccuracyRow({ name, accuracy }) {
  const barColor =
    accuracy >= 70 ? 'bg-success' : accuracy >= 40 ? 'bg-warning' : 'bg-error'
  const textColor =
    accuracy >= 70
      ? 'text-success'
      : accuracy >= 40
        ? 'text-warning'
        : 'text-error'

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-base-content/70 flex-1 truncate">
        {name}
      </span>
      <div className="w-16 h-1.5 rounded-full bg-base-200 overflow-hidden flex-shrink-0">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
      <span
        className={`text-xs font-bold tabular-nums w-8 text-right flex-shrink-0 ${textColor}`}
      >
        {accuracy}%
      </span>
    </div>
  )
}

export default function GuidanceBanner({
  topicProgress,
  highlightedTopicCode,
  organizedConcepts,
  conceptViewCounts
}) {
  const topicReviewedCount = useCallback(
    (topicCode) => {
      const topic = organizedConcepts.find((t) => t.code === topicCode)
      if (!topic) return 0
      return topic.subtopics
        .flatMap((st) => st.concepts.map((c) => c.name))
        .filter((name) => (conceptViewCounts[name] ?? 0) > 0).length
    },
    [organizedConcepts, conceptViewCounts]
  )

  const knownCodes = useMemo(
    () => new Set(organizedConcepts.map((t) => t.code)),
    [organizedConcepts]
  )

  const practiced = useMemo(
    () =>
      (topicProgress || [])
        .filter((t) => t.questions_attempted > 0 && knownCodes.has(t.topic))
        .sort((a, b) => a.accuracy - b.accuracy), // lowest accuracy first
    [topicProgress, knownCodes]
  )

  const totalKnownTopics = organizedConcepts.filter(
    (t) => t.subtopics.reduce((s, st) => s + st.concepts.length, 0) > 0
  ).length

  const allPracticed = practiced.length >= totalKnownTopics

  // ── State: navigated here from a session (topic already highlighted) ────────
  if (highlightedTopicCode) {
    const topic = (topicProgress || []).find(
      (t) => t.topic === highlightedTopicCode
    )
    const topicName = organizedConcepts.find(
      (t) => t.code === highlightedTopicCode
    )?.name
    const totalConcepts =
      organizedConcepts
        .find((t) => t.code === highlightedTopicCode)
        ?.subtopics.reduce((s, st) => s + st.concepts.length, 0) ?? 0
    const reviewed = topicReviewedCount(highlightedTopicCode)
    const lowReview = totalConcepts > 0 && reviewed / totalConcepts < 0.5

    return (
      <div className="mb-4 rounded-2xl bg-warning/10 border border-warning/30 px-4 py-3.5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-base-content">
            Focus on: {topicName ?? highlightedTopicCode}
          </p>
          <p className="text-xs text-base-content/55 mt-0.5">
            {topic
              ? lowReview
                ? `Your accuracy here is ${topic.accuracy}% and you've only reviewed ${reviewed}/${totalConcepts} concepts — read through them below before practicing again.`
                : `Your accuracy here is ${topic.accuracy}% — review the concepts below to strengthen this area before practicing again.`
              : 'Review the key concepts in this topic before your next practice session.'}
          </p>
        </div>
      </div>
    )
  }

  // ── State A: no practice yet ─────────────────────────────────────────────────
  if (practiced.length === 0) {
    return (
      <div className="mb-4 rounded-2xl bg-primary/8 border border-primary/20 px-4 py-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-base-content">
            Start here before you practice
          </p>
          <p className="text-xs text-base-content/55 mt-1 leading-relaxed">
            You haven&apos;t practiced any topics yet. Browse the concepts below
            to build familiarity — tap any concept to read the full explanation.
            Then head to Practice when you&apos;re ready.
          </p>
        </div>
      </div>
    )
  }

  // ── State B: all topics practiced ────────────────────────────────────────────
  if (allPracticed) {
    const weakest = practiced[0]
    const weakestName = organizedConcepts.find(
      (t) => t.code === weakest.topic
    )?.name

    return (
      <div className="mb-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm px-4 py-3.5">
        <div className="flex items-center gap-2 mb-2.5">
          <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm font-semibold text-base-content">
            Your weakest topics to review
          </p>
        </div>
        <div className="space-y-1.5">
          {practiced.slice(0, 4).map((t) => {
            const name =
              organizedConcepts.find((o) => o.code === t.topic)?.name ??
              t.topic_display
            return (
              <AccuracyRow key={t.topic} name={name} accuracy={t.accuracy} />
            )
          })}
        </div>
        <p className="text-xs text-base-content/45 mt-2.5">
          Start with{' '}
          <span className="font-semibold text-base-content/70">
            {weakestName}
          </span>{' '}
          — it&apos;s your lowest accuracy topic. Tap it below to expand.
        </p>
      </div>
    )
  }

  // ── State C: some topics practiced ───────────────────────────────────────────
  const unpracticedCount = totalKnownTopics - practiced.length
  const weakest = practiced[0]
  const weakestName = organizedConcepts.find(
    (t) => t.code === weakest.topic
  )?.name
  const weakestTotal =
    organizedConcepts
      .find((t) => t.code === weakest.topic)
      ?.subtopics.reduce((s, st) => s + st.concepts.length, 0) ?? 0
  const weakestReviewed = topicReviewedCount(weakest.topic)
  const weakestLowReview =
    weakestTotal > 0 && weakestReviewed / weakestTotal < 0.5

  return (
    <div className="mb-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
        <p className="text-sm font-semibold text-base-content">
          Topics to review
        </p>
      </div>
      <div className="space-y-1.5 mb-2.5">
        {practiced.slice(0, 3).map((t) => {
          const name =
            organizedConcepts.find((o) => o.code === t.topic)?.name ??
            t.topic_display
          return <AccuracyRow key={t.topic} name={name} accuracy={t.accuracy} />
        })}
      </div>
      <p className="text-xs text-base-content/50 leading-relaxed">
        Start with{' '}
        <span className="font-semibold text-base-content/70">
          {weakestName}
        </span>{' '}
        ({weakest.accuracy}% accuracy
        {weakestLowReview &&
          `, ${weakestReviewed}/${weakestTotal} concepts reviewed`}
        ).
        {weakestLowReview
          ? ' Read through the concepts first, then practice.'
          : ' Tap it below to expand and review.'}
        {unpracticedCount > 0 && (
          <>
            {' '}
            You also have{' '}
            <span className="font-semibold text-base-content/70">
              {unpracticedCount} topic{unpracticedCount > 1 ? 's' : ''}
            </span>{' '}
            you haven&apos;t practiced yet.
          </>
        )}
      </p>
    </div>
  )
}
