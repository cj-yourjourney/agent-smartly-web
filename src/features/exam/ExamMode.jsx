// features/exam/ExamMode.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchExamQuestions,
  fetchExamStats,
  startExam,
  setSelectedAnswer,
  saveAnswer,
  goToQuestion,
  nextQuestion,
  previousQuestion,
  submitExam,
  toggleReviewMode,
  resetExam
} from './state/examSlice'
// Import the centralized recordQuestionAttempt action
import { recordQuestionAttempt } from '../progress/state/progressSlice'

export default function ExamMode() {
  const dispatch = useDispatch()
  const {
    questions,
    currentQuestionIndex,
    answers,
    selectedAnswer,
    examStartTime,
    questionStartTime,
    examStats,
    examResults,
    isExamStarted,
    isExamSubmitted,
    loading,
    error,
    showReviewMode
  } = useSelector((state) => state.exam)

  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Fetch exam stats on component mount
  useEffect(() => {
    dispatch(fetchExamStats())
  }, [dispatch])

  // Timer effect
  useEffect(() => {
    if (isExamStarted && !isExamSubmitted) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - examStartTime) / 1000))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isExamStarted, isExamSubmitted, examStartTime])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  const handleStartExam = async () => {
    await dispatch(fetchExamQuestions())
    dispatch(startExam())
  }

  const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer))
  }

  const handleSaveAndNext = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer before proceeding')
      return
    }

    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    // Save answer in state
    dispatch(saveAnswer())

    // Record attempt to backend
    dispatch(
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        timeSpent
      })
    )

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(nextQuestion())
    }
  }

  const handlePrevious = () => {
    dispatch(previousQuestion())
  }

  const handleGoToQuestion = (index) => {
    if (selectedAnswer !== null) {
      dispatch(saveAnswer())
    }
    dispatch(goToQuestion(index))
  }

  const handleSubmitExam = async () => {
    // Save current answer if any
    if (selectedAnswer !== null) {
      dispatch(saveAnswer())
    }

    const totalTime = Math.floor((Date.now() - examStartTime) / 1000)

    await dispatch(
      submitExam({
        answers: answers,
        totalTime
      })
    )

    setShowSubmitModal(false)
  }

  const handleReviewToggle = () => {
    dispatch(toggleReviewMode())
  }

  const handleRestartExam = () => {
    if (
      confirm('Are you sure you want to restart? All progress will be lost.')
    ) {
      dispatch(resetExam())
    }
  }

  // Loading screen
  if (loading && questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // Error screen
  if (error && !isExamStarted) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="alert alert-error">
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={() => dispatch(resetExam())}
                className="btn btn-primary mt-4"
              >
                Back to Exam Start
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  if (isExamSubmitted && examResults) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl mb-6">Exam Results</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Score</div>
                  <div
                    className={`stat-value ${
                      examResults.passed ? 'text-success' : 'text-error'
                    }`}
                  >
                    {examResults.score_percentage}%
                  </div>
                  <div className="stat-desc">
                    {examResults.passed ? 'Passed!' : 'Did not pass'}
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Correct Answers</div>
                  <div className="stat-value text-primary">
                    {examResults.correct_answers}/{examResults.total_questions}
                  </div>
                  <div className="stat-desc">
                    {examResults.incorrect_answers} incorrect
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Time Taken</div>
                  <div className="stat-value text-sm">
                    {formatTime(examResults.total_time)}
                  </div>
                  <div className="stat-desc">Total exam time</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Passing Score</div>
                  <div className="stat-value text-sm">
                    {examResults.passing_score}%
                  </div>
                  <div className="stat-desc">Required to pass</div>
                </div>
              </div>

              <div
                className={`alert ${
                  examResults.passed ? 'alert-success' : 'alert-warning'
                } mb-4`}
              >
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
                    d={
                      examResults.passed
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                    }
                  />
                </svg>
                <span>
                  {examResults.passed
                    ? 'Congratulations! You passed the exam.'
                    : 'Keep practicing! You can retake the exam anytime.'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReviewToggle}
                  className="btn btn-primary flex-1"
                >
                  {showReviewMode ? 'Hide Review' : 'Review Answers'}
                </button>
                <button
                  onClick={handleRestartExam}
                  className="btn btn-outline flex-1"
                >
                  Take Another Exam
                </button>
              </div>

              {showReviewMode && (
                <div className="mt-6 space-y-4">
                  <h2 className="text-2xl font-semibold">Answer Review</h2>
                  {examResults.results.map((result, index) => {
                    const question = questions.find(
                      (q) => q.id === result.question_id
                    )
                    if (!question) return null

                    return (
                      <div
                        key={result.question_id}
                        className={`card ${
                          result.is_correct ? 'bg-success/10' : 'bg-error/10'
                        }`}
                      >
                        <div className="card-body">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">
                              Question {index + 1}
                            </h3>
                            <div
                              className={`badge ${
                                result.is_correct
                                  ? 'badge-success'
                                  : 'badge-error'
                              }`}
                            >
                              {result.is_correct ? 'Correct' : 'Incorrect'}
                            </div>
                          </div>
                          <p className="text-base mt-2">
                            {question.question_text}
                          </p>
                          <div className="mt-4 space-y-2">
                            <p>
                              <strong>Your answer:</strong>{' '}
                              {result.user_answer.toUpperCase()}){' '}
                              {question[`choice_${result.user_answer}`]}
                            </p>
                            {!result.is_correct && (
                              <p className="text-success">
                                <strong>Correct answer:</strong>{' '}
                                {result.correct_answer.toUpperCase()}){' '}
                                {question[`choice_${result.correct_answer}`]}
                              </p>
                            )}
                            <div className="alert alert-info">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="stroke-current shrink-0 w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              <span>{result.explanation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exam start screen
  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl mb-4">
                California Real Estate Agent Exam
              </h1>

              <div className="alert alert-info mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h3 className="font-bold">Exam Instructions</h3>
                  <p className="text-sm">
                    This is a timed exam simulating the actual California Real
                    Estate Agent exam. Read each question carefully and select
                    your answer.
                  </p>
                </div>
              </div>

              {examStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Total Questions</div>
                    <div className="stat-value text-primary">
                      {examStats.exam_length}
                    </div>
                    <div className="stat-desc">Available in this exam</div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Time Limit</div>
                    <div className="stat-value text-primary">
                      {examStats.time_limit} min
                    </div>
                    <div className="stat-desc">3 hours total</div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Passing Score</div>
                    <div className="stat-value text-primary">
                      {examStats.passing_score}%
                    </div>
                    <div className="stat-desc">Minimum required</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Exam Rules:</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must answer all questions to submit the exam</li>
                  <li>
                    You can navigate between questions and change your answers
                  </li>
                  <li>Your progress is automatically saved</li>
                  <li>
                    Once submitted, you cannot change your answers but can
                    review them
                  </li>
                  <li>A passing score is {examStats?.passing_score || 70}%</li>
                </ul>
              </div>

              <button
                onClick={handleStartExam}
                className="btn btn-primary btn-lg mt-6 btn-block"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exam in progress
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = answers.length
  const unansweredCount = questions.length - answeredCount

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold">CA Real Estate Exam</h1>
                  <div className="badge badge-lg badge-primary">
                    {formatTime(timeElapsed)}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={progress}
                    max="100"
                  ></progress>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentQuestion.question_text}
                  </h2>

                  <div className="space-y-3">
                    {['a', 'b', 'c', 'd'].map((choice) => (
                      <div key={choice} className="form-control">
                        <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-base-200">
                          <input
                            type="radio"
                            name="answer"
                            className="radio radio-primary"
                            value={choice}
                            checked={selectedAnswer === choice}
                            onChange={() => handleAnswerSelect(choice)}
                          />
                          <span className="label-text text-base">
                            {choice.toUpperCase()}){' '}
                            {currentQuestion[`choice_${choice}`]}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2 justify-between">
                  <button
                    onClick={handlePrevious}
                    className="btn btn-outline"
                    disabled={currentQuestionIndex === 0}
                  >
                    ← Previous
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={handleSaveAndNext}
                      className="btn btn-primary"
                    >
                      Save & Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="btn btn-success"
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-4">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Question Navigator</h3>

                <div className="stats stats-vertical shadow mb-4">
                  <div className="stat">
                    <div className="stat-title">Answered</div>
                    <div className="stat-value text-success text-2xl">
                      {answeredCount}
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Unanswered</div>
                    <div className="stat-value text-warning text-2xl">
                      {unansweredCount}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                  {questions.map((_, index) => {
                    const isAnswered = answers.some(
                      (a) => a.questionId === questions[index].id
                    )
                    const isCurrent = index === currentQuestionIndex

                    return (
                      <button
                        key={index}
                        onClick={() => handleGoToQuestion(index)}
                        className={`btn btn-sm ${
                          isCurrent
                            ? 'btn-primary'
                            : isAnswered
                            ? 'btn-success'
                            : 'btn-outline'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="btn btn-success btn-block mt-4"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Submit Exam?</h3>
            <p className="py-4">
              You have answered {answeredCount} out of {questions.length}{' '}
              questions.
            </p>
            {unansweredCount > 0 && (
              <div className="alert alert-warning">
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
                <span>
                  Warning: You have {unansweredCount} unanswered questions!
                </span>
              </div>
            )}
            <p className="py-4">
              Are you sure you want to submit? You cannot change your answers
              after submission.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={handleSubmitExam} className="btn btn-success">
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
