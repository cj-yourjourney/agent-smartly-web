// features/practice/PracticeMode.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTopics,
  fetchQuestionsByTopic,
  checkAnswer,
  setSelectedAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  resetToTopicSelection,
  setStartTime
} from './state/practiceSlice'

// Import the centralized recordQuestionAttempt action
import { recordQuestionAttempt } from '../progress/state/progressSlice'

export default function PracticeMode() {
  const dispatch = useDispatch()
  const {
    topics,
    selectedTopic,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    answerResult,
    loading,
    startTime
  } = useSelector((state) => state.practice)

  useEffect(() => {
    dispatch(fetchTopics())
  }, [dispatch])

  useEffect(() => {
    if (selectedTopic && questions.length > 0) {
      dispatch(setStartTime())
    }
  }, [currentQuestionIndex, dispatch, selectedTopic, questions.length])

  const handleTopicSelect = (topic) => {
    dispatch(fetchQuestionsByTopic(topic))
  }

  const handleAnswerSelect = (answer) => {
    dispatch(setSelectedAnswer(answer))
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer')
      return
    }

    const currentQuestion = questions[currentQuestionIndex]
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    // Check answer
    await dispatch(
      checkAnswer({ questionId: currentQuestion.id, answer: selectedAnswer })
    )

    // Record attempt
    dispatch(
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        timeSpent
      })
    )
  }

  const handleNextQuestion = () => {
    dispatch(goToNextQuestion())
  }

  const handlePreviousQuestion = () => {
    dispatch(goToPreviousQuestion())
  }

  const handleBackToTopics = () => {
    dispatch(resetToTopicSelection())
  }

  if (loading && topics.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // Topic selection screen
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl mb-6">
                California Real Estate Practice Quiz
              </h1>
              <p className="text-lg mb-6">
                Select a topic to start practicing:
              </p>

              <div className="grid grid-cols-1 gap-4">
                {topics.map((topic) => (
                  <button
                    key={topic.value}
                    onClick={() => handleTopicSelect(topic.value)}
                    className="btn btn-outline btn-lg justify-start text-left h-auto py-4"
                  >
                    <span className="text-base font-normal">{topic.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No questions available for selected topic
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
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
                <span>No questions available yet for this topic.</span>
              </div>
              <button
                onClick={handleBackToTopics}
                className="btn btn-primary mt-4"
              >
                Back to Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentTopicLabel =
    topics.find((t) => t.value === selectedTopic)?.label || selectedTopic

  // Quiz screen
  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <h1 className="card-title text-2xl">
                California Real Estate Practice Quiz
              </h1>
              <button
                onClick={handleBackToTopics}
                className="btn btn-sm btn-outline"
              >
                Change Topic
              </button>
            </div>

            <div className="badge badge-secondary mb-2">
              {currentTopicLabel}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="badge badge-primary badge-lg">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <progress
                className="progress progress-primary w-56"
                value={currentQuestionIndex + 1}
                max={questions.length}
              ></progress>
            </div>

            <h2 className="text-xl font-semibold mb-6">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-3 mb-6">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-base-200">
                  <input
                    type="radio"
                    name="answer"
                    className="radio radio-primary"
                    value="a"
                    checked={selectedAnswer === 'a'}
                    onChange={() => handleAnswerSelect('a')}
                    disabled={answerResult !== null}
                  />
                  <span className="label-text text-base">
                    A) {currentQuestion.choice_a}
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-base-200">
                  <input
                    type="radio"
                    name="answer"
                    className="radio radio-primary"
                    value="b"
                    checked={selectedAnswer === 'b'}
                    onChange={() => handleAnswerSelect('b')}
                    disabled={answerResult !== null}
                  />
                  <span className="label-text text-base">
                    B) {currentQuestion.choice_b}
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-base-200">
                  <input
                    type="radio"
                    name="answer"
                    className="radio radio-primary"
                    value="c"
                    checked={selectedAnswer === 'c'}
                    onChange={() => handleAnswerSelect('c')}
                    disabled={answerResult !== null}
                  />
                  <span className="label-text text-base">
                    C) {currentQuestion.choice_c}
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-base-200">
                  <input
                    type="radio"
                    name="answer"
                    className="radio radio-primary"
                    value="d"
                    checked={selectedAnswer === 'd'}
                    onChange={() => handleAnswerSelect('d')}
                    disabled={answerResult !== null}
                  />
                  <span className="label-text text-base">
                    D) {currentQuestion.choice_d}
                  </span>
                </label>
              </div>
            </div>

            {!answerResult && (
              <button
                className="btn btn-primary btn-block"
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </button>
            )}

            {answerResult && (
              <div className="space-y-4">
                {answerResult.is_correct ? (
                  <div className="alert alert-success">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-bold">Correct!</h3>
                      <p className="text-sm">{answerResult.explanation}</p>
                    </div>
                  </div>
                ) : (
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
                    <div>
                      <h3 className="font-bold">Incorrect</h3>
                      <p className="text-sm">
                        The correct answer is:{' '}
                        <span className="font-bold">
                          {answerResult.correct_answer.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm mt-2">{answerResult.explanation}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-between">
                  <button
                    className="btn btn-outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous Question
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next Question
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
