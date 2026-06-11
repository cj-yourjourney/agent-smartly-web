import { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  fetchTopics,
  fetchTopicStructure,
  fetchQuestionsByTopic,
  fetchQuestionsBySubtopic,
  fetchPracticeQuizQuestions,
  checkAnswer,
  setSelectedAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  resetToTopicSelection,
  setStartTime,
  recordQuestionAttempt,
  createSession,
  completeSession,
  abandonSession
} from './state/practiceSlice'
import { ROUTES } from '../../shared/constants/routes'
import { fetchSubscriptionStatus } from '../subscription/state/subscriptionSlice'
import {
  fetchSessions,
  fetchTopicProgress
} from '../progress/state/progressSlice'
import { setHighlightedTopic } from '../key-concepts/state/keyConceptsSlice'

import { LoadingScreen } from './components/LoadingScreen'
import { NoQuestionsScreen } from './components/NoQuestionsScreen'
import { SessionCompleteScreen } from './components/SessionCompleteScreen'
import { TopicSelectionScreen } from './components/TopicSelectionScreen'
import { QuizScreen } from './components/QuizScreen'

export default function PracticeMode() {
  const dispatch = useDispatch()
  const router = useRouter()

  const {
    topics,
    topicStructure,
    selectedTopic,
    selectedSubtopic,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    answerResult,
    loading,
    startTime,
    isPracticeQuiz,
    sessionId,
    quizStartTimestamp,
    completedSession
  } = useSelector((state) => state.practice)

  const { topicProgress } = useSelector((state) => state.progress)

  const [expandedTopic, setExpandedTopic] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false)
  const [answeredMap, setAnsweredMap] = useState({})
  const [showSessionComplete, setShowSessionComplete] = useState(false)

  // Ref to track the in-flight recordQuestionAttempt promise for the last
  // question. finishSession must wait for it before calling completeSession,
  // otherwise the backend rejects the attempt with "session already completed".
  const pendingAttemptRef = useRef(null)
  // interval fires multiple times at the boundary second.
  const timeUpFiredRef = useRef(false)
  // Wall-clock start time for topic/subtopic sessions.  Practice quiz uses
  // quizStartTimestamp from Redux instead (set when questions arrive), but
  // topic sessions have no Redux equivalent, so we capture Date.now() here
  // the moment the user picks a topic/subtopic.
  const nonQuizStartTimeRef = useRef(null)

  const sessionResults = {
    total: Object.keys(answeredMap).length,
    correct: Object.values(answeredMap).filter((v) => v.isCorrect).length
  }

  const timeLimit = 90 * 60
  const timeRemaining = Math.max(0, timeLimit - elapsedTime)
  const isTimeUp = elapsedTime >= timeLimit
  const isTimeWarning = timeRemaining <= 10 * 60 && timeRemaining > 5 * 60
  const isTimeCritical = timeRemaining <= 5 * 60 && timeRemaining > 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // ── Session duration tracking ─────────────────────────────────────────────
  // Max creditable seconds per session type — mirrors the server-side cap.
  const SESSION_MAX_SECONDS = isPracticeQuiz ? 150 * 60 : 40 * 60

  // Returns elapsed seconds capped at the session maximum.
  // Uses quizStartTimestamp from Redux so it's always accurate regardless of
  // component remounts. Falls back to elapsedTime for non-quiz sessions.
  const getSessionDuration = useCallback(() => {
    const anchor =
      quizStartTimestamp ?? (questions.length > 0 ? Date.now() : null)
    if (!anchor) return 0
    const elapsed = isPracticeQuiz
      ? Math.floor((Date.now() - quizStartTimestamp) / 1000)
      : elapsedTime
    return Math.min(elapsed, SESSION_MAX_SECONDS)
  }, [
    quizStartTimestamp,
    isPracticeQuiz,
    elapsedTime,
    questions.length,
    SESSION_MAX_SECONDS
  ])

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    dispatch(fetchTopics())
    dispatch(fetchTopicStructure())
    dispatch(fetchTopicProgress())
  }, [dispatch])

  useEffect(() => {
    if (selectedTopic && questions.length > 0) {
      dispatch(setStartTime())
    }
  }, [currentQuestionIndex, dispatch, selectedTopic, questions.length])

  // Reset local tracking when a new session begins.
  useEffect(() => {
    if (selectedTopic) {
      setAnsweredMap({})
      setShowSessionComplete(false)
    }
  }, [selectedTopic])

  // ── Countdown timer ──────────────────────────────────────────────────────────
  // Anchored to quizStartTimestamp in Redux — a value that is:
  //   • Set exactly once when fetchPracticeQuizQuestions.fulfilled fires
  //   • Cleared only when the session ends (resetToTopicSelection)
  //   • Immune to component remounts because it lives in the Redux store
  //
  // The effect re-runs only when quizStartTimestamp changes (i.e. a new exam
  // starts), so the interval is created once and runs straight to 00:00 with
  // zero resets. No bootstrap loop, no secondary ref, no race conditions.
  useEffect(() => {
    // Stop ticking as soon as the complete screen is shown — elapsedTime
    // freezes and SessionCompleteScreen will switch to the API value once
    // completeSession resolves.
    if (!isPracticeQuiz || !quizStartTimestamp || showSessionComplete) return

    // Reset the one-shot guard whenever a fresh exam begins.
    timeUpFiredRef.current = false

    const tick = () => {
      const elapsed = Math.floor((Date.now() - quizStartTimestamp) / 1000)
      setElapsedTime(elapsed)
      if (elapsed >= timeLimit && !timeUpFiredRef.current) {
        timeUpFiredRef.current = true
        setShowTimeUpAlert(true)
      }
    }

    tick() // paint the correct time immediately, before the first 1 s delay
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isPracticeQuiz, quizStartTimestamp, timeLimit, showSessionComplete])

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const resetLocalState = useCallback(() => {
    setExpandedTopic(null)
    setElapsedTime(0)
    setShowTimeUpAlert(false)
    setAnsweredMap({})
    setShowSessionComplete(false)
    // Reset the time-up guard so a new exam can show the alert again.
    timeUpFiredRef.current = false
    // Clear the topic-session clock so a future session starts fresh.
    nonQuizStartTimeRef.current = null
    // Clear any in-flight attempt promise so it doesn't leak into a new session.
    pendingAttemptRef.current = null
  }, [])

  const resolveTopicLabel = useCallback(() => {
    if (isPracticeQuiz) return 'Full Practice Exam'
    if (selectedSubtopic) {
      const topicItem = topicStructure.find(
        (i) => i.topic.value === selectedTopic
      )
      return (
        topicItem?.subtopics.find((s) => s.value === selectedSubtopic)?.label ??
        selectedSubtopic
      )
    }
    return topics.find((t) => t.value === selectedTopic)?.label ?? selectedTopic
  }, [isPracticeQuiz, selectedSubtopic, selectedTopic, topicStructure, topics])

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleTopicSelect = (topicValue) => {
    nonQuizStartTimeRef.current = Date.now()
    dispatch(fetchQuestionsByTopic(topicValue))
    dispatch(
      createSession({
        sessionType: 'topic',
        topic: topicValue,
        totalQuestions: 20
      })
    )
  }

  const handleSubtopicSelect = (topicValue, subtopicValue) => {
    nonQuizStartTimeRef.current = Date.now()
    dispatch(
      fetchQuestionsBySubtopic({ topic: topicValue, subtopic: subtopicValue })
    )
    dispatch(
      createSession({
        sessionType: 'subtopic',
        topic: topicValue,
        subtopic: subtopicValue,
        totalQuestions: 20
      })
    )
  }

  const handlePracticeQuizSelect = () => {
    // Reset local display state; quizStartTimestamp is set in Redux when
    // fetchPracticeQuizQuestions.fulfilled fires, so no manual clock management needed.
    setElapsedTime(0)
    setShowTimeUpAlert(false)
    dispatch(fetchPracticeQuizQuestions())
    dispatch(
      createSession({ sessionType: 'practice_exam', totalQuestions: 75 })
    )
  }

  const handleAnswerSelect = (answer) => {
    if (!answerResult) dispatch(setSelectedAnswer(answer))
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return
    // Prevent re-submitting an already-answered question
    if (answeredMap[currentQuestionIndex]) return

    const currentQuestion = questions[currentQuestionIndex]

    // Cap per-question time at 120 s (admin tracking only, not a user timer).
    const MAX_TIME_PER_QUESTION = 120
    const rawTimeSpent = Math.floor((Date.now() - startTime) / 1000)
    const timeSpent = Math.min(rawTimeSpent, MAX_TIME_PER_QUESTION)

    const result = await dispatch(
      checkAnswer({ questionId: currentQuestion.id, answer: selectedAnswer })
    )

    const payload = result?.payload ?? {}
    const isCorrect = payload.is_correct ?? false

    // Store full answer data so navigating back shows a read-only review state
    setAnsweredMap((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        isCorrect,
        userAnswer: selectedAnswer,
        result: payload
      }
    }))

    const attemptPromise = dispatch(
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        timeSpent,
        sessionId: sessionId || undefined
      })
    )
    // Store the promise so handleNextQuestion can await it on the last question
    // before calling finishSession — preventing the race where completeSession
    // marks the session 'completed' before this attempt POST lands.
    pendingAttemptRef.current = attemptPromise

    // Re-fetch subscription status after every answer.
    // trialQuestionsUsed in Redux reflects the count at login and is never
    // incremented locally, so a threshold check would never fire mid-session.
    // A lightweight GET after each answer guarantees the paywall modal appears
    // immediately after question #60 without requiring a page reload.
    dispatch(fetchSubscriptionStatus())
  }

  const finishSession = useCallback(async () => {
    // Snapshot duration at the exact moment the user finishes — before any
    // async work that could alter state.
    // • Practice quiz  → quizStartTimestamp from Redux (set when questions arrive)
    // • Topic/subtopic → nonQuizStartTimeRef captured when the user picked a topic
    const snapshotNow = Date.now()
    const durationSeconds =
      isPracticeQuiz && quizStartTimestamp
        ? Math.min(
            Math.floor((snapshotNow - quizStartTimestamp) / 1000),
            SESSION_MAX_SECONDS
          )
        : nonQuizStartTimeRef.current
          ? Math.min(
              Math.floor((snapshotNow - nonQuizStartTimeRef.current) / 1000),
              SESSION_MAX_SECONDS
            )
          : 0

    if (sessionId) {
      await dispatch(completeSession({ sessionId, durationSeconds }))
      // Refresh the sessions list in Redux so the Progress page shows the
      // just-completed session with its correct duration immediately.
      dispatch(fetchSessions())
    }

    // Refresh topic-level progress so Practice Mode's smart guidance reflects
    // the just-completed session immediately if the user returns to topic selection.
    dispatch(fetchTopicProgress())

    setShowSessionComplete(true)
  }, [
    dispatch,
    sessionId,
    isPracticeQuiz,
    quizStartTimestamp,
    SESSION_MAX_SECONDS
  ])

  const handleNextQuestion = async () => {
    if (isLastQuestion && answerResult) {
      // Wait for the last question's attempt to be recorded before completing
      // the session. Without this, completeSession can resolve first and the
      // backend rejects the attempt: "Cannot add attempts to a completed session".
      if (pendingAttemptRef.current) {
        await pendingAttemptRef.current
        pendingAttemptRef.current = null
      }
      finishSession()
      return
    }
    dispatch(goToNextQuestion())
  }

  const handlePracticeAgain = () => {
    resetLocalState()
    dispatch(resetToTopicSelection())
  }

  const handleViewDetails = () => {
    dispatch(resetToTopicSelection())
    resetLocalState()
    router.push(`${ROUTES.LEARNING.PROGRESS}?tab=sessions`)
  }

  const handleReviewKeyConcepts = () => {
    let topicCodeToHighlight = null

    if (isPracticeQuiz) {
      // completedSession.topic_breakdown: [{ topic: 'financing', accuracy: 20, questions_attempted: 5 }, ...]
      const breakdown = completedSession?.topic_breakdown
      if (Array.isArray(breakdown) && breakdown.length > 0) {
        const weakest = breakdown
          .filter((t) => t.questions_attempted > 0)
          .sort((a, b) => a.accuracy - b.accuracy)[0]
        topicCodeToHighlight = weakest?.topic ?? null
      }
    } else {
      topicCodeToHighlight =
        selectedTopic !== 'practice_quiz' ? selectedTopic : null
    }

    dispatch(setHighlightedTopic(topicCodeToHighlight))
    dispatch(resetToTopicSelection())
    resetLocalState()
    router.push(ROUTES.LEARNING.KEY_CONCEPTS)
  }

  const handleBackToTopics = () => {
    if (sessionId) {
      const snapshotNow = Date.now()
      const durationSeconds =
        isPracticeQuiz && quizStartTimestamp
          ? Math.min(
              Math.floor((snapshotNow - quizStartTimestamp) / 1000),
              SESSION_MAX_SECONDS
            )
          : nonQuizStartTimeRef.current
            ? Math.min(
                Math.floor((snapshotNow - nonQuizStartTimeRef.current) / 1000),
                SESSION_MAX_SECONDS
              )
            : 0
      dispatch(abandonSession({ sessionId, durationSeconds }))
    }
    dispatch(resetToTopicSelection())
    resetLocalState()
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading && topics.length === 0) {
    return <LoadingScreen />
  }

  if (showSessionComplete) {
    return (
      <SessionCompleteScreen
        results={sessionResults}
        completedSession={completedSession}
        topicLabel={resolveTopicLabel()}
        elapsedTime={elapsedTime}
        onPracticeAgain={handlePracticeAgain}
        onViewDetails={handleViewDetails}
        onReviewKeyConcepts={handleReviewKeyConcepts}
      />
    )
  }

  if (!selectedTopic) {
    return (
      <TopicSelectionScreen
        topicStructure={topicStructure}
        topicProgress={topicProgress}
        expandedTopic={expandedTopic}
        onPracticeQuizSelect={handlePracticeQuizSelect}
        onTopicSelect={handleTopicSelect}
        onToggle={(v) => setExpandedTopic(expandedTopic === v ? null : v)}
        onSubtopicSelect={handleSubtopicSelect}
      />
    )
  }

  if (questions.length === 0) {
    return <NoQuestionsScreen onBack={handleBackToTopics} />
  }

  return (
    <QuizScreen
      topicLabel={resolveTopicLabel()}
      isPracticeQuiz={isPracticeQuiz}
      currentQuestion={questions[currentQuestionIndex]}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      // If this question was already answered, derive display state from the map
      // so the user sees read-only review state instead of a blank submit form.
      selectedAnswer={
        answeredMap[currentQuestionIndex]?.userAnswer ?? selectedAnswer
      }
      answerResult={answeredMap[currentQuestionIndex]?.result ?? answerResult}
      // isReviewing = navigated back to a question that was already answered
      isReviewing={!!answeredMap[currentQuestionIndex] && !answerResult}
      timeRemaining={timeRemaining}
      isTimeUp={isTimeUp}
      isTimeWarning={isTimeWarning}
      isTimeCritical={isTimeCritical}
      showTimeUpAlert={showTimeUpAlert}
      isLastQuestion={isLastQuestion}
      onAnswerSelect={handleAnswerSelect}
      onSubmit={handleSubmitAnswer}
      onPrevious={() => dispatch(goToPreviousQuestion())}
      onNext={handleNextQuestion}
      onExit={handleBackToTopics}
    />
  )
}
