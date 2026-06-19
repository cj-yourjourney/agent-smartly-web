// features/progress/utils.js

/**
 * Topic-level guidance logic shared between the Progress page's guidance
 * card (TopicGuidanceCard) and Practice Mode's topic-selection screen
 * (TopicSelectionScreen), so both surfaces always agree on "what topic
 * should I focus on next."
 *
 * Mirrors the site's core loop: Review Key Concepts in a topic -> Practice
 * Questions in that same topic -> repeat for all 7 topics.
 */

export const TOPIC_QUESTION_TARGET = 25
export const TOPIC_ACCURACY_TARGET = 82

// Below this accuracy, more question volume alone won't fix the gap — the
// user likely needs to revisit the concepts, even if they've already
// attempted questions in this topic. Matches the "error" accuracy band
// already used elsewhere in the app (TopicsTab, TopicSelectionScreen).
export const TOPIC_REVIEW_THRESHOLD = 60

/**
 * Returns a structured recommendation describing the single highest-priority
 * topic action right now, plus enough data to render specific copy.
 *
 * Priority order:
 *   1. Among topics the user has already started but hasn't yet hit BOTH
 *      the accuracy target (82%) and the question-volume target (25) for,
 *      take the one with the lowest accuracy.
 *      - If that accuracy is below 60%, recommend REVIEW — drilling more
 *        questions without revisiting the concepts won't close that big a
 *        gap.
 *      - Otherwise recommend PRACTICE — they understand it reasonably,
 *        they just need more reps or more volume.
 *   2. If every started topic is fully on track, recommend REVIEW on the
 *      next topic the user hasn't touched yet.
 *   3. If all 7 topics are fully on track, a "stay fresh" message.
 *   4. If there's no topic data at all yet, a "start your first session"
 *      message.
 *
 * @param {Array} topicProgress - [{ topic, topic_display, accuracy, questions_attempted, mastery_level }]
 * @returns {{
 *   phase: 'start' | 'review' | 'practice' | 'complete',
 *   topicValue: string | null,
 *   topicLabel: string | null,
 *   headline: string,
 *   detail: string,
 *   accuracy: number | null,
 *   questionsAttempted: number | null
 * }}
 */
export function getTopicGuidance(topicProgress = []) {
  if (!topicProgress || topicProgress.length === 0) {
    return {
      phase: 'start',
      topicValue: null,
      topicLabel: null,
      headline: 'Start your first practice session',
      detail:
        "Review a topic's key concepts, then practice questions in that same topic.",
      accuracy: null,
      questionsAttempted: null
    }
  }

  const notStarted = topicProgress.filter((t) => t.questions_attempted === 0)
  const started = topicProgress.filter((t) => t.questions_attempted > 0)

  const needsWork = started
    .filter(
      (t) =>
        t.accuracy < TOPIC_ACCURACY_TARGET ||
        t.questions_attempted < TOPIC_QUESTION_TARGET
    )
    .sort((a, b) => a.accuracy - b.accuracy)

  if (needsWork.length > 0) {
    const topic = needsWork[0]
    return topic.accuracy < TOPIC_REVIEW_THRESHOLD
      ? buildReviewRecommendation(topic, { alreadyStarted: true })
      : buildPracticeRecommendation(topic)
  }

  if (notStarted.length > 0) {
    return buildReviewRecommendation(notStarted[0], { alreadyStarted: false })
  }

  return {
    phase: 'complete',
    topicValue: null,
    topicLabel: null,
    headline: 'All 7 topics on track',
    detail: 'Keep a light practice rotation going so your score stays fresh.',
    accuracy: null,
    questionsAttempted: null
  }
}

/**
 * Convenience helper for UI that only needs the topic code to highlight
 * (e.g. TopicSelectionScreen's "recommended" banner).
 */
export function getRecommendedTopicValue(topicProgress = []) {
  return getTopicGuidance(topicProgress).topicValue
}

function buildPracticeRecommendation(topic) {
  const accuracyGap = Math.max(0, TOPIC_ACCURACY_TARGET - topic.accuracy)
  const questionGap = Math.max(
    0,
    TOPIC_QUESTION_TARGET - topic.questions_attempted
  )
  const belowAccuracy = topic.accuracy < TOPIC_ACCURACY_TARGET
  const belowVolume = topic.questions_attempted < TOPIC_QUESTION_TARGET

  let detail
  if (belowAccuracy && belowVolume) {
    detail = `${topic.accuracy}% accuracy on ${topic.questions_attempted}/${TOPIC_QUESTION_TARGET} questions — keep practicing to close the gap.`
  } else if (belowAccuracy) {
    detail = `${topic.accuracy}% accuracy — ${accuracyGap.toFixed(1)}% short of your 82% target.`
  } else {
    detail = `${topic.accuracy}% accuracy — just ${questionGap} more question${questionGap === 1 ? '' : 's'} to fully clear this topic.`
  }

  return {
    phase: 'practice',
    topicValue: topic.topic,
    topicLabel: topic.topic_display,
    headline: `Focus on: ${topic.topic_display}`,
    detail,
    accuracy: topic.accuracy,
    questionsAttempted: topic.questions_attempted
  }
}

// Fewer than this many attempts means accuracy isn't meaningful yet —
// the user just hasn't done enough questions to get a fair read.
const MIN_ATTEMPTS_FOR_ACCURACY = 5

function buildReviewRecommendation(topic, { alreadyStarted } = {}) {
  const tooFewAttempts =
    alreadyStarted && topic.questions_attempted < MIN_ATTEMPTS_FOR_ACCURACY

  const detail = !alreadyStarted
    ? 'Not started yet — review the key concepts, then practice questions in this topic.'
    : tooFewAttempts
      ? `Only ${topic.questions_attempted} question${topic.questions_attempted === 1 ? '' : 's'} attempted — review the key concepts to build a strong foundation first.`
      : `${topic.accuracy}% accuracy is low — review the key concepts before practicing more questions.`

  return {
    phase: 'review',
    topicValue: topic.topic,
    topicLabel: topic.topic_display,
    headline: alreadyStarted
      ? `Review: ${topic.topic_display}`
      : `Start with: ${topic.topic_display}`,
    detail,
    accuracy: alreadyStarted && !tooFewAttempts ? topic.accuracy : null,
    questionsAttempted: alreadyStarted ? topic.questions_attempted : 0
  }
}
