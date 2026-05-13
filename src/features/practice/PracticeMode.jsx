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
    sessionId
  } = useSelector((state) => state.practice)

  const [expandedTopic, setExpandedTopic] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false)
  const [answeredMap, setAnsweredMap] = useState({})
  const [showSessionComplete, setShowSessionComplete] = useState(false)

  // Use a ref for sessionStartTime so the interval callback always reads the
  // live value without being a useEffect dependency. This prevents the interval
  // from ever tearing down and restarting mid-session due to a state change,
  // which was the root cause of the timer reset around 30 minutes.
  const sessionStartTimeRef = useRef(null)
  // Ref guard so the time-up alert fires exactly once without being a dep.
  const timeUpFiredRef = useRef(false)
  // Holds the live interval ID so resetLocalState can clear it imperatively.
  const timerIntervalRef = useRef(null)

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

  // ── Session duration tracking (frontend-only, sent once on complete/abandon) ─
  // Max creditable seconds per session type — mirrors the server-side cap in
  // PracticeSession._MAX_DURATION_SECONDS so the two stay in sync.
  const SESSION_MAX_SECONDS = isPracticeQuiz ? 150 * 60 : 40 * 60

  // Returns elapsed seconds capped at the session type's maximum.
  // Called once when the user finishes or exits — no polling, no periodic saves.
  const getSessionDuration = useCallback(() => {
    if (!sessionStartTimeRef.current) return 0
    const elapsed = Math.floor(
      (Date.now() - sessionStartTimeRef.current) / 1000
    )
    return Math.min(elapsed, SESSION_MAX_SECONDS)
  }, [SESSION_MAX_SECONDS])

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    dispatch(fetchTopics())
    dispatch(fetchTopicStructure())
  }, [dispatch])

  useEffect(() => {
    if (selectedTopic && questions.length > 0) {
      dispatch(setStartTime())
    }
  }, [currentQuestionIndex, dispatch, selectedTopic, questions.length])

  // Start the session clock the moment questions load.
  // Written to a ref (not state) so it can never trigger a re-render or cause
  // the countdown interval to restart. The guard ensures it is set only once.
  useEffect(() => {
    if (questions.length > 0 && !sessionStartTimeRef.current) {
      sessionStartTimeRef.current = Date.now()
    }
  }, [questions.length])

  // Reset tracking when a new session begins.
  // Intentionally keyed on selectedTopic only — questions.length can change
  // mid-session (e.g. Redux state updates) and must not wipe answered answers.
  useEffect(() => {
    if (selectedTopic) {
      setAnsweredMap({})
      setShowSessionComplete(false)
    }
  }, [selectedTopic])

  // Countdown timer for practice exam (display only — does not affect tracking).
  // Deps are ONLY isPracticeQuiz and timeLimit — both effectively constant for
  // the lifetime of a session. sessionStartTimeRef and timeUpFiredRef are refs
  // so reading them inside the interval never stales and never triggers a
  // re-run. This means the interval is created ONCE and runs uninterrupted
  // from 90:00 → 00:00 with no resets.
  useEffect(() => {
    if (!isPracticeQuiz) return
    // Wait until questions have loaded and the ref is populated before starting.
    const bootstrap = setInterval(() => {
      if (sessionStartTimeRef.current) {
        clearInterval(bootstrap)
        timeUpFiredRef.current = false
        const interval = setInterval(() => {
          const elapsed = Math.floor(
            (Date.now() - sessionStartTimeRef.current) / 1000
          )
          setElapsedTime(elapsed)
          if (elapsed >= timeLimit && !timeUpFiredRef.current) {
            timeUpFiredRef.current = true
            setShowTimeUpAlert(true)
          }
        }, 1000)
        // Store cleanup on the ref so resetLocalState can also clear it
        timerIntervalRef.current = interval
      }
    }, 100)
    return () => {
      clearInterval(bootstrap)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [isPracticeQuiz, timeLimit])

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const resetLocalState = useCallback(() => {
    setExpandedTopic(null)
    setElapsedTime(0)
    setShowTimeUpAlert(false)
    setAnsweredMap({})
    setShowSessionComplete(false)
    // Clear refs — must happen after state resets so the bootstrap loop
    // in the countdown effect doesn't immediately re-arm on the next session.
    sessionStartTimeRef.current = null
    timeUpFiredRef.current = false
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
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
    // Reset ref and state so the new session gets a fresh clock.
    sessionStartTimeRef.current = null
    timeUpFiredRef.current = false
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
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

    dispatch(
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        timeSpent,
        sessionId: sessionId || undefined
      })
    )
  }

  const finishSession = useCallback(() => {
    if (sessionId) {
      dispatch(
        completeSession({ sessionId, durationSeconds: getSessionDuration() })
      )
    }
    setShowSessionComplete(true)
  }, [dispatch, sessionId, getSessionDuration])

  const handleNextQuestion = () => {
    if (isLastQuestion && answerResult) {
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
    if (sessionId) {
      dispatch(
        completeSession({ sessionId, durationSeconds: getSessionDuration() })
      )
    }
    dispatch(resetToTopicSelection())
    resetLocalState()
    router.push(`${ROUTES.LEARNING.PROGRESS}?tab=sessions`)
  }

  const handleBackToTopics = () => {
    if (sessionId) {
      dispatch(
        abandonSession({ sessionId, durationSeconds: getSessionDuration() })
      )
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
        topicLabel={resolveTopicLabel()}
        elapsedTime={elapsedTime}
        onPracticeAgain={handlePracticeAgain}
        onViewDetails={handleViewDetails}
      />
    )
  }

  if (!selectedTopic) {
    return (
      <TopicSelectionScreen
        topicStructure={topicStructure}
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
