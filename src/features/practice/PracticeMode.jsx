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
  ChevronDown
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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // --- Topic Selection Screen ---
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-white text-slate-800 p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Practice Quiz
            </h1>
            <p className="text-slate-600 text-sm">
              Select a <span className="font-semibold">topic</span> to practice
              all questions, or expand to choose a specific{' '}
              <span className="font-semibold">subtopic</span>.
            </p>
          </div>

          <div className="space-y-3">
            {topicStructure.map((item) => (
              <div
                key={item.topic.value}
                className={`
                  border rounded-lg bg-white transition-all
                  ${
                    expandedTopic === item.topic.value
                      ? 'border-indigo-300'
                      : 'border-slate-200'
                  }
                `}
              >
                <div className="flex items-stretch">
                  <button
                    onClick={() => handleTopicSelect(item.topic.value)}
                    className="flex-1 text-left px-4 py-3 font-medium text-slate-700 hover:text-indigo-700 hover:bg-slate-50 rounded-l-lg transition-colors"
                  >
                    {item.topic.label}
                  </button>

                  {item.subtopics.length > 0 && (
                    <>
                      <div className="w-[1px] bg-slate-200"></div>
                      <button
                        onClick={() => toggleTopic(item.topic.value)}
                        className="px-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-r-lg transition-colors"
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
                  <div className="border-t border-slate-200 bg-slate-50 p-2">
                    {item.subtopics.map((subtopic) => (
                      <button
                        key={subtopic.value}
                        onClick={() =>
                          handleSubtopicSelect(item.topic.value, subtopic.value)
                        }
                        className="w-full text-left py-2 px-4 text-sm text-slate-600 hover:text-indigo-700 hover:bg-white rounded transition-all"
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-600 mb-4">
          No questions available for this section.
        </p>
        <button
          onClick={handleBackToTopics}
          className="text-indigo-600 hover:underline font-medium"
        >
          Back to Topics
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentTopicLabel =
    topics.find((t) => t.value === selectedTopic)?.label || selectedTopic

  // --- Quiz UI ---
  return (
    <div className="min-h-screen bg-white text-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {currentTopicLabel}
            </span>
            <span className="text-xs text-slate-400">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <button
            onClick={handleBackToTopics}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Change Topic
          </button>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {['a', 'b', 'c', 'd'].map((choice) => {
            const isSelected = selectedAnswer === choice
            const optionText = currentQuestion[`choice_${choice}`]

            return (
              <div
                key={choice}
                onClick={() => handleAnswerSelect(choice)}
                className={`
                  flex items-center p-3 rounded-lg border cursor-pointer transition-all
                  ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300'
                  }
                  ${answerResult ? 'cursor-default opacity-70' : ''}
                `}
              >
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                  ${isSelected ? 'border-indigo-600' : 'border-slate-300'}
                `}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  )}
                </div>
                <span className="text-sm text-slate-700">{optionText}</span>
              </div>
            )
          })}
        </div>

        {/* Submit or Result */}
        {!answerResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className={`
              w-full py-3 rounded-lg font-semibold text-white transition-all
              ${
                selectedAnswer
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }
            `}
          >
            Submit
          </button>
        ) : (
          <div>
            <div
              className={`p-4 rounded-lg mb-4 ${
                answerResult.is_correct
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {answerResult.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={`font-semibold text-sm ${
                    answerResult.is_correct ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {answerResult.is_correct ? 'Correct!' : 'Incorrect'}
                </span>
              </div>

              {!answerResult.is_correct && (
                <p className="text-sm text-red-700 mb-2">
                  Correct: {answerResult.correct_answer.toUpperCase()}
                </p>
              )}

              <p className="text-sm text-slate-700">
                {answerResult.explanation}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100">
        <div
          className="h-full bg-indigo-600 transition-all"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
