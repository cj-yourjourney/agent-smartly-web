import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  recordQuestionAttempt
} from './state/practiceSlice'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Clock
} from 'lucide-react'

export default function PracticeMode() {
  const dispatch = useDispatch()
  const {
    topics,
    topicStructure,
    selectedTopic,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    answerResult,
    loading,
    startTime,
    isPracticeQuiz
  } = useSelector((state) => state.practice)

  const [expandedTopic, setExpandedTopic] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false)

  useEffect(() => {
    dispatch(fetchTopics())
    dispatch(fetchTopicStructure())
  }, [dispatch])

  useEffect(() => {
    if (selectedTopic && questions.length > 0) {
      dispatch(setStartTime())
    }
  }, [currentQuestionIndex, dispatch, selectedTopic, questions.length])

  // Timer for comprehensive practice
  useEffect(() => {
    if (isPracticeQuiz && selectedTopic && !sessionStartTime) {
      setSessionStartTime(Date.now())
      setShowTimeUpAlert(false)
    }

    if (isPracticeQuiz && sessionStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
        setElapsedTime(elapsed)

        // Show alert when time is up
        if (elapsed >= timeLimit && !showTimeUpAlert) {
          setShowTimeUpAlert(true)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isPracticeQuiz, sessionStartTime, selectedTopic, showTimeUpAlert])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate time remaining (90 minutes = 5400 seconds)
  const timeLimit = 90 * 60
  const timeRemaining = Math.max(0, timeLimit - elapsedTime)
  const isTimeUp = elapsedTime >= timeLimit
  const isTimeWarning = timeRemaining <= 10 * 60 && timeRemaining > 5 * 60
  const isTimeCritical = timeRemaining <= 5 * 60 && timeRemaining > 0

  // --- Handlers ---
  const handleTopicSelect = (topicValue) =>
    dispatch(fetchQuestionsByTopic(topicValue))

  const handleSubtopicSelect = (topicValue, subtopicValue) => {
    dispatch(
      fetchQuestionsBySubtopic({ topic: topicValue, subtopic: subtopicValue })
    )
  }

  const handlePracticeQuizSelect = () => {
    dispatch(fetchPracticeQuizQuestions())
    setElapsedTime(0)
    setSessionStartTime(null)
  }

  const toggleTopic = (topicValue) => {
    setExpandedTopic(expandedTopic === topicValue ? null : topicValue)
  }

  const handleAnswerSelect = (answer) => {
    if (!answerResult) dispatch(setSelectedAnswer(answer))
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return
    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    await dispatch(
      checkAnswer({ questionId: currentQuestion.id, answer: selectedAnswer })
    )
    dispatch(
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        timeSpent
      })
    )
  }

  const handleNextQuestion = () => dispatch(goToNextQuestion())
  const handlePreviousQuestion = () => dispatch(goToPreviousQuestion())

  const handleBackToTopics = () => {
    dispatch(resetToTopicSelection())
    setExpandedTopic(null)
    setElapsedTime(0)
    setSessionStartTime(null)
    setShowTimeUpAlert(false)
  }

  // --- Loading State ---
  if (loading && topics.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  // --- Topic Selection Screen ---
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-base-100 p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Practice Mode
            </h1>
            <p className="text-base-content/70">
              Choose your practice format: take a full practice exam or study
              specific topics.
            </p>
          </div>

          {/* Practice Exam Button */}
          <div className="mb-8">
            <button
              onClick={handlePracticeQuizSelect}
              className="w-full p-5 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-lg font-bold">Practice Exam</div>
                    <div className="text-sm opacity-90">
                      75 questions • 90 minutes • All topics
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="divider text-base-content/50">OR</div>

          {/* Topic Practice Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-base-content mb-1">
              Study by Topic
            </h2>
            <p className="text-sm text-base-content/60">
              20 questions per topic • No time limit
            </p>
          </div>

          <div className="space-y-2">
            {topicStructure.map((item) => (
              <div
                key={item.topic.value}
                className={`border rounded-lg transition-colors ${
                  expandedTopic === item.topic.value
                    ? 'border-primary/40 bg-base-200/50'
                    : 'border-base-300 bg-base-100'
                }`}
              >
                <div className="flex items-stretch">
                  <button
                    onClick={() => handleTopicSelect(item.topic.value)}
                    className="flex-1 text-left px-4 py-2.5 font-medium text-base-content hover:text-primary transition-colors"
                  >
                    {item.topic.label}
                  </button>

                  {item.subtopics.length > 0 && (
                    <>
                      <div className="w-px bg-base-300"></div>
                      <button
                        onClick={() => toggleTopic(item.topic.value)}
                        className="px-3 text-base-content/40 hover:text-primary transition-colors"
                        aria-label="Toggle subtopics"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedTopic === item.topic.value
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                      </button>
                    </>
                  )}
                </div>

                {expandedTopic === item.topic.value && (
                  <div className="border-t border-base-300 bg-base-200/30 p-1.5">
                    {item.subtopics.map((subtopic) => (
                      <button
                        key={subtopic.value}
                        onClick={() =>
                          handleSubtopicSelect(item.topic.value, subtopic.value)
                        }
                        className="w-full text-left py-2 px-3 text-sm text-base-content/70 hover:text-primary hover:bg-base-100 rounded transition-colors"
                      >
                        {subtopic.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // --- No Questions State ---
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-base-content/70 mb-3">
            No questions available for this section.
          </p>
          <button onClick={handleBackToTopics} className="btn btn-link">
            Back to Practice Mode
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentTopicLabel = isPracticeQuiz
    ? 'Practice Exam'
    : topics.find((t) => t.value === selectedTopic)?.label || selectedTopic

  // --- Quiz UI ---
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                isPracticeQuiz
                  ? 'text-secondary bg-secondary/10'
                  : 'text-primary bg-primary/10'
              }`}
            >
              {currentTopicLabel}
            </span>
            <span className="text-sm font-medium text-base-content/50">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isPracticeQuiz && (
              <div
                className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded ${
                  isTimeUp
                    ? 'text-error bg-error/10'
                    : isTimeCritical
                    ? 'text-error bg-error/10'
                    : isTimeWarning
                    ? 'text-warning bg-warning/10'
                    : 'text-base-content/70 bg-base-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isTimeUp ? 'Overtime' : formatTime(timeRemaining)}</span>
              </div>
            )}
            <button
              onClick={handleBackToTopics}
              className="text-xs text-base-content/50 hover:text-base-content transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Time up alert */}
        {isPracticeQuiz && showTimeUpAlert && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-bold">Time's Up!</h3>
              <div className="text-sm">
                In the real exam, time would be over. You can continue
                practicing, but this is now overtime.
              </div>
            </div>
          </div>
        )}

        {/* Time warning */}
        {isPracticeQuiz && isTimeWarning && !showTimeUpAlert && (
          <div
            className={`alert mb-4 ${
              isTimeCritical ? 'alert-error' : 'alert-warning'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-sm">
              {isTimeCritical
                ? 'Less than 5 minutes remaining!'
                : '10 minutes remaining'}
            </span>
          </div>
        )}

        {/* Question */}
        <h2 className="text-2xl font-semibold text-base-content mb-5 leading-tight">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-2 mb-5">
          {['a', 'b', 'c', 'd'].map((choice) => {
            const isSelected = selectedAnswer === choice
            const optionText = currentQuestion[`choice_${choice}`]

            return (
              <label
                key={choice}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-base-300 hover:border-primary/30 hover:bg-base-200/30'
                  }
                  ${
                    answerResult
                      ? 'cursor-default pointer-events-none opacity-60'
                      : ''
                  }
                `}
              >
                <input
                  type="radio"
                  name="answer"
                  className="radio radio-primary radio-sm mt-0.5 shrink-0"
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(choice)}
                  disabled={!!answerResult}
                />
                <span className="text-base leading-snug">{optionText}</span>
              </label>
            )
          })}
        </div>

        {/* Submit or Result */}
        {!answerResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="btn btn-primary w-full"
          >
            Submit Answer
          </button>
        ) : (
          <div>
            {/* Feedback */}
            <div
              className={`p-3 rounded-lg mb-3 border ${
                answerResult.is_correct
                  ? 'bg-success/10 border-success/30'
                  : 'bg-error/10 border-error/30'
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                {answerResult.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span
                    className={`font-semibold block mb-1 ${
                      answerResult.is_correct ? 'text-success' : 'text-error'
                    }`}
                  >
                    {answerResult.is_correct ? 'Correct!' : 'Incorrect'}
                  </span>
                  {!answerResult.is_correct && (
                    <p className="text-base text-base-content/80 mb-1.5">
                      Correct answer:{' '}
                      <span className="font-semibold">
                        {answerResult.correct_answer.toUpperCase()}
                      </span>
                    </p>
                  )}
                  <p className="text-base text-base-content/80 leading-snug">
                    {answerResult.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline flex-1 btn-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-primary flex-1 btn-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
