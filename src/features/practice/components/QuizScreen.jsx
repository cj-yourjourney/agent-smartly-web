import {
  Clock,
  Info,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  BarChart2
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
  onExit
}) {
  return (
    <div className="flex justify-between items-center mb-5">
      <div className="flex items-center gap-2.5">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            isPracticeQuiz
              ? 'text-secondary bg-secondary/10'
              : 'text-primary bg-primary/10'
          }`}
        >
          {topicLabel}
        </span>
        <span className="text-sm font-medium text-base-content/50">
          {currentQuestionIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isPracticeQuiz && (
          <div
            className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded ${
              isTimeUp || isTimeCritical
                ? 'text-error bg-error/10'
                : isTimeWarning
                  ? 'text-warning bg-warning/10'
                  : 'text-base-content/70 bg-base-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {isTimeUp ? 'Overtime' : formatTimeClock(timeRemaining)}
            </span>
          </div>
        )}
        <button
          onClick={onExit}
          className="text-xs text-base-content/50 hover:text-base-content transition-colors"
        >
          Exit
        </button>
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
          <h3 className="font-bold">Time&apos;s Up!</h3>
          <div className="text-sm">
            In the real exam, time would be over. You can continue practicing,
            but this is now overtime.
          </div>
        </div>
      </div>
    )
  }

  if (isTimeWarning) {
    return (
      <div
        className={`alert mb-4 ${isTimeCritical ? 'alert-error' : 'alert-warning'}`}
      >
        <Info className="w-5 h-5" />
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
    <div className="space-y-2 mb-5">
      {['a', 'b', 'c', 'd'].map((choice) => {
        const isSelected = selectedAnswer === choice
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
              ${isAnswered ? 'cursor-default pointer-events-none opacity-60' : ''}
            `}
          >
            <input
              type="radio"
              name="answer"
              className="radio radio-primary radio-sm mt-0.5 shrink-0"
              checked={isSelected}
              onChange={() => onSelect(choice)}
              disabled={isAnswered}
            />
            <span className="text-base leading-snug">
              {question[`choice_${choice}`]}
            </span>
          </label>
        )
      })}
    </div>
  )
}

function AnswerFeedback({ answerResult }) {
  return (
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
        className="btn btn-outline flex-1 btn-sm"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>

      {isLastQuestion ? (
        <button
          onClick={onNext}
          className="btn btn-primary flex-1 btn-sm gap-1.5"
        >
          <BarChart2 className="w-4 h-4" />
          Finish Session
        </button>
      ) : (
        <button onClick={onNext} className="btn btn-primary flex-1 btn-sm">
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
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-2xl">
        <QuizHeader
          topicLabel={topicLabel}
          isPracticeQuiz={isPracticeQuiz}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          timeRemaining={timeRemaining}
          isTimeUp={isTimeUp}
          isTimeWarning={isTimeWarning}
          isTimeCritical={isTimeCritical}
          onExit={onExit}
        />

        <TimeAlerts
          isPracticeQuiz={isPracticeQuiz}
          showTimeUpAlert={showTimeUpAlert}
          isTimeWarning={isTimeWarning}
          isTimeCritical={isTimeCritical}
        />

        <h2 className="text-2xl font-semibold text-base-content mb-5 leading-tight">
          {currentQuestion.question_text}
        </h2>

        <AnswerOptions
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          isAnswered={!!answerResult}
          onSelect={onAnswerSelect}
        />

        {!answerResult ? (
          <button
            onClick={onSubmit}
            disabled={!selectedAnswer}
            className="btn btn-primary w-full"
          >
            Submit Answer
          </button>
        ) : (
          <div>
            <AnswerFeedback answerResult={answerResult} />
            <QuizNavigation
              currentQuestionIndex={currentQuestionIndex}
              isLastQuestion={isLastQuestion}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
        )}
      </div>
    </div>
  )
}
