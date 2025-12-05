import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTopics,
  fetchTopicStructure,
  fetchQuestionsByTopic,
  fetchQuestionsBySubtopic,
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
  Info
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
    startTime
  } = useSelector((state) => state.practice)

  const [expandedTopic, setExpandedTopic] = useState(null)

  useEffect(() => {
    dispatch(fetchTopics())
    dispatch(fetchTopicStructure())
  }, [dispatch])

  useEffect(() => {
    if (selectedTopic && questions.length > 0) {
      dispatch(setStartTime())
    }
  }, [currentQuestionIndex, dispatch, selectedTopic, questions.length])

  // --- Handlers ---
  const handleTopicSelect = (topicValue) =>
    dispatch(fetchQuestionsByTopic(topicValue))

  const handleSubtopicSelect = (topicValue, subtopicValue) => {
    dispatch(
      fetchQuestionsBySubtopic({ topic: topicValue, subtopic: subtopicValue })
    )
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
              Practice Quiz
            </h1>
            <p className="text-base-content/70">
              Select a <span className="font-semibold">topic</span> to practice
              all questions, or expand to choose a specific{' '}
              <span className="font-semibold">subtopic</span>.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-info/10 border border-info/20 rounded-lg mb-6">
            <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <span className="text-sm text-base-content/80">
              Each quiz contains 20 questions to help you practice effectively.
            </span>
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
            Back to Topics
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentTopicLabel =
    topics.find((t) => t.value === selectedTopic)?.label || selectedTopic

  // --- Quiz UI ---
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-2xl">
        {/* Minimal Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded">
              {currentTopicLabel}
            </span>
            <span className="text-sm font-medium text-base-content/50">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <button
            onClick={handleBackToTopics}
            className="text-xs text-base-content/50 hover:text-base-content transition-colors"
          >
            Change Topic
          </button>
        </div>

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
