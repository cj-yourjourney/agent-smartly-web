import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTopics,
  fetchQuestionsByTopic,
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
  Info,
  BookOpen
} from 'lucide-react'

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

  const [topicStructure, setTopicStructure] = useState([])
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)

  useEffect(() => {
    dispatch(fetchTopics())
    fetchTopicStructure()
  }, [dispatch])

  useEffect(() => {
    if (selectedTopic && questions.length > 0) {
      dispatch(setStartTime())
    }
  }, [currentQuestionIndex, dispatch, selectedTopic, questions.length])

  const fetchTopicStructure = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/practice/topic-structure/'
      )
      const data = await response.json()
      setTopicStructure(data)
    } catch (error) {
      console.error('Error fetching topic structure:', error)
    }
  }

  const handleTopicSelect = (topicValue) => {
    setSelectedSubtopic(null)
    dispatch(fetchQuestionsByTopic(topicValue))
  }

  const handleSubtopicSelect = (topicValue, subtopicValue) => {
    setSelectedSubtopic(subtopicValue)
    // Fetch questions filtered by both topic and subtopic
    fetchQuestionsBySubtopic(topicValue, subtopicValue)
  }

  const fetchQuestionsBySubtopic = async (topic, subtopic) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/practice/questions/?topic=${topic}&subtopic=${subtopic}`
      )
      const data = await response.json()
      dispatch({
        type: 'practice/fetchQuestionsByTopic/fulfilled',
        payload: { questions: data, topic }
      })
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const toggleTopic = (topicValue) => {
    setExpandedTopic(expandedTopic === topicValue ? null : topicValue)
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

  const handleNextQuestion = () => {
    dispatch(goToNextQuestion())
  }

  const handlePreviousQuestion = () => {
    dispatch(goToPreviousQuestion())
  }

  const handleBackToTopics = () => {
    dispatch(resetToTopicSelection())
    setSelectedSubtopic(null)
    setExpandedTopic(null)
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
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="card-title text-3xl">
                  California Real Estate Practice Quiz
                </h1>
              </div>

              <div className="alert alert-info mb-6">
                <Info className="w-5 h-5" />
                <div className="text-sm">
                  <p className="font-semibold">How to practice:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>
                      Click on a <strong>topic</strong> to practice all
                      questions in that area
                    </li>
                    <li>
                      Click <strong>"View Subtopics"</strong> to drill down and
                      practice specific subtopics
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                {topicStructure.map((item) => (
                  <div
                    key={item.topic.value}
                    className="border-2 border-base-300 rounded-lg overflow-hidden hover:border-primary transition-colors"
                  >
                    <div className="flex items-stretch">
                      <button
                        onClick={() => handleTopicSelect(item.topic.value)}
                        className="flex-1 btn btn-ghost justify-start text-left h-auto py-5 px-6 rounded-none hover:bg-primary hover:text-primary-content group"
                      >
                        <BookOpen className="w-5 h-5 mr-3 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                        <span className="font-medium">{item.topic.label}</span>
                      </button>

                      {item.subtopics.length > 0 && (
                        <button
                          onClick={() => toggleTopic(item.topic.value)}
                          className="btn btn-ghost border-l-2 border-base-300 rounded-none px-6 hover:bg-base-200 flex items-center gap-2"
                        >
                          <span className="text-sm font-medium">
                            {expandedTopic === item.topic.value
                              ? 'Hide'
                              : 'View'}{' '}
                            Subtopics
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              expandedTopic === item.topic.value
                                ? 'rotate-90'
                                : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {expandedTopic === item.topic.value &&
                      item.subtopics.length > 0 && (
                        <div className="bg-base-200 border-t-2 border-base-300">
                          <div className="p-4">
                            <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-3 px-2">
                              Choose a Subtopic:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {item.subtopics.map((subtopic) => (
                                <button
                                  key={subtopic.value}
                                  onClick={() =>
                                    handleSubtopicSelect(
                                      item.topic.value,
                                      subtopic.value
                                    )
                                  }
                                  className="w-full text-left py-3 px-4 bg-base-100 hover:bg-primary hover:text-primary-content rounded-lg transition-all text-sm flex items-center gap-3 group border border-base-300 hover:border-primary"
                                >
                                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  <span>{subtopic.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No questions available
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="alert alert-info">
                <Info className="w-6 h-6" />
                <span>
                  No questions available yet for this{' '}
                  {selectedSubtopic ? 'subtopic' : 'topic'}.
                </span>
              </div>
              <button
                onClick={handleBackToTopics}
                className="btn btn-primary mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
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
              <h1 className="card-title text-2xl">Practice Quiz</h1>
              <button
                onClick={handleBackToTopics}
                className="btn btn-sm btn-outline"
              >
                <ArrowLeft className="w-4 h-4" />
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
              {['a', 'b', 'c', 'd'].map((choice) => (
                <div key={choice} className="form-control">
                  <label className="label cursor-pointer justify-start gap-4 p-4 border rounded-lg hover:bg-base-200 transition-colors">
                    <input
                      type="radio"
                      name="answer"
                      className="radio radio-primary"
                      value={choice}
                      checked={selectedAnswer === choice}
                      onChange={() => handleAnswerSelect(choice)}
                      disabled={answerResult !== null}
                    />
                    <span className="label-text text-base">
                      {choice.toUpperCase()}){' '}
                      {currentQuestion[`choice_${choice}`]}
                    </span>
                  </label>
                </div>
              ))}
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
                    <CheckCircle2 className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold">Correct!</h3>
                      <p className="text-sm">{answerResult.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-error">
                    <XCircle className="w-6 h-6" />
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
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
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
