import { useEffect, useRef } from 'react'
import {
  Clock,
  Info,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Eye
} from 'lucide-react'
import { formatTimeClock } from '../utils'

function QuizHeader({
  topicLabel,
  isPracticeQuiz,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  isTimeUp,
  isTimeWarning,
  isTimeCritical,
  isReviewing,
  onExit
}) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  return (
    <div className="sticky top-0 z-20 bg-base-100/95 backdrop-blur-sm border-b border-base-200">
      <div className="flex justify-between items-center px-4 pt-3 pb-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
              isPracticeQuiz
                ? 'text-secondary bg-secondary/10'
                : 'text-primary bg-primary/10'
            }`}
          >
            {isPracticeQuiz ? 'Exam' : 'Topic'}
          </span>
          {isReviewing && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-base-300 text-base-content/50 flex items-center gap-1 shrink-0">
              <Eye className="w-3 h-3" />
              Review
            </span>
          )}
          <span className="text-sm font-medium text-base-content/60 truncate hidden sm:block">
            {topicLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isPracticeQuiz && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                isTimeUp || isTimeCritical
                  ? 'text-error bg-error/10'
                  : isTimeWarning
                    ? 'text-warning bg-warning/10'
                    : 'text-base-content/60 bg-base-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimeUp ? 'OT' : formatTimeClock(timeRemaining)}</span>
            </div>
          )}

          <span className="text-xs font-bold text-base-content/50 tabular-nums">
            {currentQuestionIndex + 1}
            <span className="text-base-content/30">/{totalQuestions}</span>
          </span>

          <button
            onClick={onExit}
            className="text-xs text-base-content/40 hover:text-base-content transition-colors px-2 py-1 -mr-1 touch-manipulation"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-base-200 mx-4 mb-0 rounded-full overflow-hidden max-w-2xl mx-auto">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function TimeAlerts({
  isPracticeQuiz,
  showTimeUpAlert,
  isTimeWarning,
  isTimeCritical
}) {
  if (!isPracticeQuiz) return null

  if (showTimeUpAlert) {
    return (
      <div className="alert alert-error mb-4 py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-5 w-5"
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
          <h3 className="font-bold text-sm">Time&apos;s Up!</h3>
          <div className="text-xs opacity-90">
            Real exam would be over. Continue for practice.
          </div>
        </div>
      </div>
    )
  }

  if (isTimeWarning) {
    return (
      <div
        className={`alert mb-4 py-2.5 ${isTimeCritical ? 'alert-error' : 'alert-warning'}`}
      >
        <Info className="w-4 h-4 shrink-0" />
        <span className="text-sm">
          {isTimeCritical
            ? 'Less than 5 minutes remaining!'
            : '10 minutes remaining'}
        </span>
      </div>
    )
  }

  return null
}

function AnswerOptions({ question, selectedAnswer, isAnswered, onSelect }) {
  return (
    <div className="space-y-2.5 mb-4">
      {['a', 'b', 'c', 'd'].map((choice) => {
        const isSelected = selectedAnswer === choice
        return (
          <label
            key={choice}
            className={`
              flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.99]
              ${
                isSelected
                  ? 'border-primary bg-primary/8 shadow-sm'
                  : 'border-base-200 hover:border-primary/40 hover:bg-base-50 active:bg-base-200/50'
              }
              ${isAnswered ? 'cursor-default pointer-events-none' : ''}
            `}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Choice letter badge */}
            <span
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                isSelected
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content/50'
              } ${isAnswered ? 'opacity-60' : ''}`}
            >
              {choice.toUpperCase()}
            </span>
            <span
              className={`text-base leading-snug ${isAnswered ? 'opacity-60' : 'text-base-content'}`}
            >
              {question[`choice_${choice}`]}
            </span>
            <input
              type="radio"
              name="answer"
              className="sr-only"
              checked={isSelected}
              onChange={() => onSelect(choice)}
              disabled={isAnswered}
            />
          </label>
        )
      })}
    </div>
  )
}

function AnswerFeedback({ answerResult }) {
  return (
    <div
      className={`p-3.5 rounded-xl mb-3 border-2 ${
        answerResult.is_correct
          ? 'bg-success/8 border-success/30'
          : 'bg-error/8 border-error/30'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {answerResult.is_correct ? (
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <span
            className={`font-bold block mb-1 text-sm ${
              answerResult.is_correct ? 'text-success' : 'text-error'
            }`}
          >
            {answerResult.is_correct ? 'Correct!' : 'Incorrect'}
          </span>
          {!answerResult.is_correct && (
            <p className="text-sm text-base-content/80 mb-1.5">
              Correct answer:{' '}
              <span className="font-bold">
                {answerResult.correct_answer.toUpperCase()}
              </span>
            </p>
          )}
          <p className="text-sm text-base-content/70 leading-relaxed">
            {answerResult.explanation}
          </p>
        </div>
      </div>
    </div>
  )
}

function QuizNavigation({
  currentQuestionIndex,
  isLastQuestion,
  onPrevious,
  onNext
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="btn btn-outline btn-sm h-11 flex-none px-4 touch-manipulation disabled:opacity-30"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {isLastQuestion ? (
        <button
          onClick={onNext}
          className="btn btn-primary flex-1 h-11 gap-1.5 touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <BarChart2 className="w-4 h-4" />
          Finish Session
        </button>
      ) : (
        <button
          onClick={onNext}
          className="btn btn-primary flex-1 h-11 touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export function QuizScreen({
  topicLabel,
  isPracticeQuiz,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  answerResult,
  isReviewing,
  timeRemaining,
  isTimeUp,
  isTimeWarning,
  isTimeCritical,
  showTimeUpAlert,
  isLastQuestion,
  onAnswerSelect,
  onSubmit,
  onPrevious,
  onNext,
  onExit
}) {
  const scrollContainerRef = useRef(null)

  // After submitting, scroll to the bottom of the container so the feedback/explanation
  // is always fully visible above the sticky footer (pb-28 provides clearance).
  useEffect(() => {
    if (!answerResult || !scrollContainerRef.current) return
    const timer = setTimeout(() => {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }, 120)
    return () => clearTimeout(timer)
  }, [answerResult])

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Sticky header with progress bar */}
      <QuizHeader
        topicLabel={topicLabel}
        isPracticeQuiz={isPracticeQuiz}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
        isTimeUp={isTimeUp}
        isTimeWarning={isTimeWarning}
        isTimeCritical={isTimeCritical}
        isReviewing={isReviewing}
        onExit={onExit}
      />

      {/* Scrollable content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4 pt-5 pb-28">
          <TimeAlerts
            isPracticeQuiz={isPracticeQuiz}
            showTimeUpAlert={showTimeUpAlert}
            isTimeWarning={isTimeWarning}
            isTimeCritical={isTimeCritical}
          />

          <h2 className="text-lg sm:text-2xl font-semibold text-base-content mb-5 leading-snug">
            {currentQuestion.question_text}
          </h2>

          <AnswerOptions
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            isAnswered={!!answerResult}
            onSelect={onAnswerSelect}
          />

          {/* Feedback shown inline after answering */}
          {answerResult && <AnswerFeedback answerResult={answerResult} />}
        </div>
      </div>

      {/* Sticky action footer */}
      <div className="sticky bottom-0 z-20 bg-base-100/95 backdrop-blur-sm border-t border-base-200 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          {!answerResult ? (
            <button
              onClick={onSubmit}
              disabled={!selectedAnswer}
              className="btn btn-primary w-full h-12 text-base touch-manipulation disabled:opacity-40"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Submit Answer
            </button>
          ) : (
            <QuizNavigation
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          )}
        </div>
      </div>
    </div>
  )
}
