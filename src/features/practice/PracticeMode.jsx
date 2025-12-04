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
  ArrowLeft,
  ChevronDown,
  PlayCircle,
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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // --- Topic Selection Screen (Improved Guidance) ---
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-white text-slate-800 p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with Minimal Guide */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Practice Quiz
            </h1>
            <div className="flex items-start gap-3 text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <Info className="w-5 h-5 flex-shrink-0 text-indigo-500 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <p>
                  <span className="font-semibold text-slate-700">
                    Quick Start:
                  </span>{' '}
                  Click the topic name to practice all questions.
                </p>
                <p>
                  <span className="font-semibold text-slate-700">
                    Deep Dive:
                  </span>{' '}
                  Use the arrow on the right to drill down into specific
                  subtopics.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {topicStructure.map((item) => (
              <div
                key={item.topic.value}
                className={`
                  border rounded-xl bg-white transition-all duration-200
                  ${
                    expandedTopic === item.topic.value
                      ? 'border-indigo-200 shadow-md'
                      : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                  }
                `}
              >
                {/* Split Button Container */}
                <div className="flex items-stretch min-h-[64px]">
                  {/* Left Side: Start Main Topic */}
                  <button
                    onClick={() => handleTopicSelect(item.topic.value)}
                    className="flex-1 text-left px-6 py-4 flex items-center justify-between group rounded-l-xl hover:bg-slate-50 transition-colors relative overflow-hidden"
                  >
                    <span className="font-medium text-lg text-slate-700 group-hover:text-indigo-700 transition-colors z-10">
                      {item.topic.label}
                    </span>

                    {/* Hover Hint Pill */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Practice</span>
                    </div>
                  </button>

                  {/* Vertical Divider */}
                  {item.subtopics.length > 0 && (
                    <div className="w-[1px] bg-slate-100 my-3"></div>
                  )}

                  {/* Right Side: Expand/Collapse */}
                  {item.subtopics.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTopic(item.topic.value)
                      }}
                      className="px-5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-r-xl transition-colors flex items-center justify-center"
                      title="View Subtopics"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          expandedTopic === item.topic.value
                            ? 'rotate-180 text-indigo-600'
                            : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Expanded Subtopics Area */}
                <div
                  className={`
                  overflow-hidden transition-[max-height] duration-300 ease-in-out
                  ${
                    expandedTopic === item.topic.value
                      ? 'max-h-[500px] border-t border-slate-100'
                      : 'max-h-0'
                  }
                `}
                >
                  <div className="bg-slate-50/50 p-2 space-y-1">
                    {item.subtopics.map((subtopic) => (
                      <button
                        key={subtopic.value}
                        onClick={() =>
                          handleSubtopicSelect(item.topic.value, subtopic.value)
                        }
                        className="w-full text-left py-3 px-6 text-sm text-slate-600 hover:text-indigo-700 hover:bg-white hover:shadow-sm rounded-lg transition-all flex items-center gap-3 group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors" />
                        {subtopic.label}
                      </button>
                    ))}
                  </div>
                </div>
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
          className="flex items-center gap-2 text-indigo-600 hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentTopicLabel =
    topics.find((t) => t.value === selectedTopic)?.label || selectedTopic

  // --- Quiz UI (Minimal) ---
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center py-8 px-4 md:px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Practice Quiz</h1>
          <button
            onClick={handleBackToTopics}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 px-3 py-1.5 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" /> Change Topic
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {currentTopicLabel}
          </span>
          <span className="bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug mb-8">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {['a', 'b', 'c', 'd'].map((choice) => {
            const isSelected = selectedAnswer === choice
            const optionText = currentQuestion[`choice_${choice}`]

            return (
              <div
                key={choice}
                onClick={() => handleAnswerSelect(choice)}
                className={`
                  group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30'
                      : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }
                  ${answerResult ? 'cursor-default opacity-80' : ''}
                `}
              >
                <div
                  className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors
                  ${
                    isSelected
                      ? 'border-indigo-600'
                      : 'border-slate-300 group-hover:border-indigo-400'
                  }
                `}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  )}
                </div>

                <span className="text-base text-slate-700 font-medium">
                  {optionText}
                </span>
              </div>
            )
          })}
        </div>

        {/* Action Button / Result */}
        {!answerResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className={`
              w-full py-3.5 rounded-lg font-bold text-white transition-all
              ${
                selectedAnswer
                  ? 'bg-indigo-700 hover:bg-indigo-800 shadow-md hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            Submit Answer
          </button>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div
              className={`p-5 rounded-lg border mb-6 ${
                answerResult.is_correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {answerResult.is_correct ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h3
                  className={`font-bold ${
                    answerResult.is_correct ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {answerResult.is_correct ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>

              {!answerResult.is_correct && (
                <p className="text-red-700 mb-2">
                  Correct answer:{' '}
                  <span className="font-semibold">
                    {answerResult.correct_answer.toUpperCase()}
                  </span>
                </p>
              )}

              <p className="text-slate-700 text-sm leading-relaxed border-t border-black/5 pt-2 mt-2">
                {answerResult.explanation}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 py-3 px-4 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex-1 py-3 px-4 rounded-lg bg-indigo-700 text-white font-medium hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-50">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
