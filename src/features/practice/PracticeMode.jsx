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

  // ── Session ID tracking ────────────────────────────────────────────────────
  // sessionIdRef always mirrors Redux sessionId so closures never see stale null.
  const sessionIdRef = useRef(sessionId)
  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  // sessionReadyPromiseRef holds the Promise returned by dispatching createSession.
  // handleSubmitAnswer awaits it before firing recordQuestionAttempt, so even
  // if Q1 is answered the instant the quiz screen appears (before createSession
  // resolves), the attempt still carries the correct session_id.
  const sessionReadyPromiseRef = useRef(null)

  // ── Other refs ─────────────────────────────────────────────────────────────
  const pendingAttemptRef = useRef(null)
  const timeUpFiredRef = useRef(false)
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
  const SESSION_MAX_SECONDS = isPracticeQuiz ? 150 * 60 : 40 * 60

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

  useEffect(() => {
    if (selectedTopic) {
      setAnsweredMap({})
      setShowSessionComplete(false)
    }
  }, [selectedTopic])

  // ── Countdown timer ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isPracticeQuiz || !quizStartTimestamp || showSessionComplete) return

    timeUpFiredRef.current = false

    const tick = () => {
      const elapsed = Math.floor((Date.now() - quizStartTimestamp) / 1000)
      setElapsedTime(elapsed)
      if (elapsed >= timeLimit && !timeUpFiredRef.current) {
        timeUpFiredRef.current = true
        setShowTimeUpAlert(true)
      }
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isPracticeQuiz, quizStartTimestamp, timeLimit, showSessionComplete])

  // ── Helpers ───────────────────────────────────────────────────────────────

  const resetLocalState = useCallback(() => {
    setExpandedTopic(null)
    setElapsedTime(0)
    setShowTimeUpAlert(false)
    setAnsweredMap({})
    setShowSessionComplete(false)
    timeUpFiredRef.current = false
    nonQuizStartTimeRef.current = null
    pendingAttemptRef.current = null
    sessionReadyPromiseRef.current = null
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

  // ── Snapshot duration helper ──────────────────────────────────────────────

  const snapshotDuration = useCallback(() => {
    const now = Date.now()
    if (isPracticeQuiz && quizStartTimestamp) {
      return Math.min(
        Math.floor((now - quizStartTimestamp) / 1000),
        SESSION_MAX_SECONDS
      )
    }
    if (nonQuizStartTimeRef.current) {
      return Math.min(
        Math.floor((now - nonQuizStartTimeRef.current) / 1000),
        SESSION_MAX_SECONDS
      )
    }
    return 0
  }, [isPracticeQuiz, quizStartTimestamp, SESSION_MAX_SECONDS])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleTopicSelect = async (topicValue) => {
    nonQuizStartTimeRef.current = Date.now()

    // Step 1: fetch questions
    const fetchResult = await dispatch(fetchQuestionsByTopic(topicValue))
    if (!fetchQuestionsByTopic.fulfilled.match(fetchResult)) return

    // Step 2: create the session and AWAIT it fully before the QuizScreen
    // can receive any user input. This guarantees sessionId is in Redux by
    // the time handleSubmitAnswer fires for Q1.
    const count = fetchResult.payload.questions?.length || 20
    const sessionPromise = dispatch(
      createSession({
        sessionType: 'topic',
        topic: topicValue,
        totalQuestions: count
      })
    )
    // Store the promise so handleSubmitAnswer can await it as a fallback
    // safety net (e.g. if the user somehow submits before this line resolves).
    sessionReadyPromiseRef.current = sessionPromise
    await sessionPromise
  }

  const handleSubtopicSelect = async (topicValue, subtopicValue) => {
    nonQuizStartTimeRef.current = Date.now()

    const fetchResult = await dispatch(
      fetchQuestionsBySubtopic({ topic: topicValue, subtopic: subtopicValue })
    )
    if (!fetchQuestionsBySubtopic.fulfilled.match(fetchResult)) return

    const count = fetchResult.payload.questions?.length || 20
    const sessionPromise = dispatch(
      createSession({
        sessionType: 'subtopic',
        topic: topicValue,
        subtopic: subtopicValue,
        totalQuestions: count
      })
    )
    sessionReadyPromiseRef.current = sessionPromise
    await sessionPromise
  }

  const handlePracticeQuizSelect = async () => {
    setElapsedTime(0)
    setShowTimeUpAlert(false)

    const fetchResult = await dispatch(fetchPracticeQuizQuestions())
    if (!fetchPracticeQuizQuestions.fulfilled.match(fetchResult)) return

    const count = fetchResult.payload.questions?.length || 75
    const sessionPromise = dispatch(
      createSession({ sessionType: 'practice_exam', totalQuestions: count })
    )
    sessionReadyPromiseRef.current = sessionPromise
    await sessionPromise
  }

  const handleAnswerSelect = (answer) => {
    if (!answerResult) dispatch(setSelectedAnswer(answer))
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return
    if (answeredMap[currentQuestionIndex]) return

    // Safety net: if createSession is still in-flight (e.g. very fast user or
    // slow network), wait for it to resolve before recording the attempt.
    // This guarantees session_id is never undefined on any attempt.
    if (sessionReadyPromiseRef.current) {
      await sessionReadyPromiseRef.current
      sessionReadyPromiseRef.current = null
    }

    const currentQuestion = questions[currentQuestionIndex]

    const MAX_TIME_PER_QUESTION = 120
    const rawTimeSpent = Math.floor((Date.now() - startTime) / 1000)
    const timeSpent = Math.min(rawTimeSpent, MAX_TIME_PER_QUESTION)

    const result = await dispatch(
      checkAnswer({ questionId: currentQuestion.id, answer: selectedAnswer })
    )

    const payload = result?.payload ?? {}
    const isCorrect = payload.is_correct ?? false

    setAnsweredMap((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        isCorrect,
        userAnswer: selectedAnswer,
        result: payload
      }
    }))

    // sessionIdRef.current is guaranteed non-null here because we awaited
    // sessionReadyPromiseRef above, which resolves only after createSession
    // has written the id into Redux (and thus into sessionIdRef via the effect).
    const attemptPromise = dispatch(
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        timeSpent,
        sessionId: sessionIdRef.current || undefined
      })
    )
    pendingAttemptRef.current = attemptPromise

    dispatch(fetchSubscriptionStatus())
  }

  const finishSession = useCallback(async () => {
    const durationSeconds = snapshotDuration()

    const currentSessionId = sessionIdRef.current
    if (currentSessionId) {
      await dispatch(
        completeSession({ sessionId: currentSessionId, durationSeconds })
      )
      dispatch(fetchSessions())
    }

    dispatch(fetchTopicProgress())
    setShowSessionComplete(true)
  }, [dispatch, snapshotDuration])

  const handleNextQuestion = async () => {
    if (isLastQuestion && answerResult) {
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
    const currentSessionId = sessionIdRef.current
    if (currentSessionId) {
      const durationSeconds = snapshotDuration()
      dispatch(
        abandonSession({ sessionId: currentSessionId, durationSeconds })
      ).then(() => dispatch(fetchSessions()))
    }
    dispatch(resetToTopicSelection())
    resetLocalState()
  }

  // ── Render ────────────────────────────────────────────────────────────────

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
      selectedAnswer={
        answeredMap[currentQuestionIndex]?.userAnswer ?? selectedAnswer
      }
      answerResult={answeredMap[currentQuestionIndex]?.result ?? answerResult}
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
