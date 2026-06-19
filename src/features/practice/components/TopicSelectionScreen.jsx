import {
  Clock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Target,
  AlertCircle
} from 'lucide-react'
import { getTopicGuidance } from '../../progress/utils'

const accuracyColor = (acc) =>
  acc >= 90
    ? 'text-success'
    : acc >= 75
      ? 'text-info'
      : acc >= 60
        ? 'text-warning'
        : 'text-error'

function FullPracticeExamCard({ onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="
        w-full text-left
        bg-base-100
        border border-base-300
        rounded-2xl
        p-5
        active:scale-[0.99]
        transition-all
        touch-manipulation
        shadow-sm
        active:shadow-none
      "
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-base-content leading-tight">
              Full Practice Exam
            </h2>
            <ChevronRight className="w-5 h-5 text-base-content/30 shrink-0" />
          </div>
          <p className="text-xs text-base-content/45 mt-0.5 leading-snug">
            Half-scale DRE simulation
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-base-200 mt-4 mb-3" />

      {/* Stats row */}
      <div className="flex items-center gap-0">
        {[
          { label: '75 questions', icon: null },
          { label: '90 min timer', icon: null },
          { label: 'All 7 topics', icon: null }
        ].map((tag, i) => (
          <span
            key={tag.label}
            className="flex items-center text-xs text-base-content/50"
          >
            {i > 0 && <span className="mx-2 text-base-content/20">·</span>}
            {tag.label}
          </span>
        ))}
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border text-primary border-primary/40 font-medium">
          Best for exam prep
        </span>
      </div>
    </button>
  )
}

function AccuracyBar({ accuracy }) {
  return (
    <div className="w-full h-1 bg-base-300 rounded-full overflow-hidden mt-1.5">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          accuracy >= 90
            ? 'bg-success'
            : accuracy >= 75
              ? 'bg-info'
              : accuracy >= 60
                ? 'bg-warning'
                : 'bg-error'
        }`}
        style={{ width: `${accuracy}%` }}
      />
    </div>
  )
}

function TopicRow({
  item,
  progress,
  isRecommended,
  recommendedReason,
  isExpanded,
  onTopicSelect,
  onToggle,
  onSubtopicSelect
}) {
  const hasProgress = progress && progress.questions_attempted > 0

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-200 ${
        isRecommended
          ? 'bg-base-100 border border-warning/60 shadow-sm'
          : 'bg-base-100 border border-base-200 shadow-sm'
      }`}
    >
      {/* Recommended banner */}
      {isRecommended && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-warning/10 border-b border-warning/20">
          <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
          <span className="text-xs font-semibold text-warning">
            {recommendedReason}
          </span>
        </div>
      )}

      {/* Main row */}
      <div className="flex items-stretch">
        {/* Topic button — takes most of the row */}
        <button
          onClick={() => onTopicSelect(item.topic.value)}
          className="flex-1 min-w-0 text-left px-4 py-4 touch-manipulation active:bg-base-200/50 transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="text-sm font-semibold text-base-content leading-snug block">
            {item.topic.label}
          </span>

          {hasProgress ? (
            <>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className={`text-xs font-bold tabular-nums ${accuracyColor(progress.accuracy)}`}
                >
                  {progress.accuracy}%
                </span>
                <span className="text-xs text-base-content/45">accuracy</span>
                <span className="w-px h-3 bg-base-300" />
                <span className="text-xs text-base-content/45">
                  <span className="font-semibold text-base-content/60">
                    {progress.questions_attempted}
                  </span>{' '}
                  practiced
                </span>
              </div>
              <AccuracyBar accuracy={progress.accuracy} />
            </>
          ) : (
            <span className="text-xs text-base-content/30 mt-1 block">
              Not started
            </span>
          )}
        </button>

        {/* Subtopics toggle */}
        {item.subtopics.length > 0 && (
          <button
            onClick={() => onToggle(item.topic.value)}
            className="shrink-0 w-16 flex flex-col items-center justify-center gap-0.5 border-l border-base-200 text-base-content/40 hover:text-primary hover:bg-base-200/40 active:bg-base-200 transition-all touch-manipulation"
            aria-label="Toggle subtopics"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="text-sm font-bold leading-none text-base-content/60">
              {item.subtopics.length}
            </span>
            <span className="text-[9px] leading-none text-base-content/30 font-medium">
              subtopics
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 mt-0.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Expanded subtopics */}
      {isExpanded && item.subtopics.length > 0 && (
        <div className="border-t border-base-200">
          {item.subtopics.map((subtopic, idx) => (
            <button
              key={subtopic.value}
              onClick={() => onSubtopicSelect(item.topic.value, subtopic.value)}
              className={`w-full text-left px-5 py-3.5 flex items-center gap-3 text-sm text-base-content/70 hover:text-primary hover:bg-base-200/40 active:bg-base-200 transition-colors touch-manipulation ${
                idx < item.subtopics.length - 1
                  ? 'border-b border-base-200/60'
                  : ''
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30 shrink-0" />
              <span className="flex-1">{subtopic.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-base-content/20 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TopicSelectionScreen({
  topicStructure,
  topicProgress = [],
  expandedTopic,
  onPracticeQuizSelect,
  onTopicSelect,
  onToggle,
  onSubtopicSelect
}) {
  const progressMap = {}
  topicProgress.forEach((p) => {
    progressMap[p.topic] = p
  })

  // Same recommendation engine as the Progress page's guidance card —
  // whatever it suggests there is highlighted here, automatically in sync.
  const guidance = getTopicGuidance(topicProgress)
  const recommendedTopicValue = guidance.topicValue
  const recommendedReason =
    guidance.phase === 'review'
      ? 'Focus here — review key concepts first'
      : 'Focus here — lowest accuracy'

  return (
    <div className="min-h-screen bg-base-200 pb-10">
      {/* Sticky header — mirrors Key Concepts exactly */}
      <div className="sticky top-0 z-10 bg-base-200/90 backdrop-blur-sm border-b border-base-300 px-4 py-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-lg font-bold leading-tight text-base-content">
            Practice Mode
          </h1>
          <p className="text-xs text-base-content/45 leading-none mt-1">
            Choose how you want to practice
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-10 py-5 sm:py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-8 lg:items-start">
          {/* Left col — Full Practice Exam (sticky on desktop so it stays visible while scrolling topics) */}
          <div className="lg:sticky lg:top-24">
            <FullPracticeExamCard onSelect={onPracticeQuizSelect} />
          </div>

          {/* Right col — Study by Topic */}
          <div>
            {/* Section header — mirrors Key Concepts header style */}
            <div className="flex items-center gap-2.5 mb-3 px-1">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-tight text-base-content">
                  Study by Topic
                </h2>
                <p className="text-xs text-base-content/45 leading-none mt-0.5">
                  20 questions · No time limit · tap to expand subtopics
                </p>
              </div>
            </div>

            {/* Topic list */}
            <div className="space-y-2">
              {topicStructure.map((item) => (
                <TopicRow
                  key={item.topic.value}
                  item={item}
                  progress={progressMap[item.topic.value]}
                  isRecommended={item.topic.value === recommendedTopicValue}
                  recommendedReason={recommendedReason}
                  isExpanded={expandedTopic === item.topic.value}
                  onTopicSelect={onTopicSelect}
                  onToggle={onToggle}
                  onSubtopicSelect={onSubtopicSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
