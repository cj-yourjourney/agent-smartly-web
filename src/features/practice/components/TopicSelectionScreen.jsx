import {
  Clock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Target,
  AlertCircle
} from 'lucide-react'

const accuracyColor = (acc) =>
  acc >= 90
    ? 'text-success'
    : acc >= 75
      ? 'text-info'
      : acc >= 60
        ? 'text-warning'
        : 'text-error'

const accuracyBg = (acc) =>
  acc >= 90
    ? 'bg-success/10'
    : acc >= 75
      ? 'bg-info/10'
      : acc >= 60
        ? 'bg-warning/10'
        : 'bg-error/10'

const getRecommendedTopicValue = (topicProgress = []) => {
  const attempted = topicProgress.filter((p) => p.questions_attempted > 0)
  if (attempted.length === 0) return null
  return [...attempted].sort((a, b) => a.accuracy - b.accuracy)[0].topic
}

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
            <h2 className="text-xl font-bold text-base-content leading-tight">
              Full Practice Exam
            </h2>
            <ChevronRight className="w-5 h-5 text-base-content/30 shrink-0" />
          </div>
          <p className="text-sm text-base-content/50 mt-0.5 leading-snug">
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
    <div className="w-full h-1 bg-base-200 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all ${
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
  isExpanded,
  onTopicSelect,
  onToggle,
  onSubtopicSelect
}) {
  const hasProgress = progress && progress.questions_attempted > 0

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all ${
        isRecommended
          ? 'border border-warning/40 bg-base-100'
          : 'border border-base-200 bg-base-100'
      }`}
    >
      {/* Recommended banner */}
      {isRecommended && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-warning/10 border-b border-warning/20">
          <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
          <span className="text-xs font-semibold text-warning">
            Focus here — lowest accuracy
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
          <span className="text-[15px] font-semibold text-base-content leading-snug block">
            {item.topic.label}
          </span>

          {hasProgress ? (
            <>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className={`text-sm font-bold ${accuracyColor(progress.accuracy)}`}
                >
                  {progress.accuracy}%
                </span>
                <span className="text-xs text-base-content/40">accuracy</span>
                <span className="w-px h-3 bg-base-300" />
                <span className="text-xs text-base-content/40">
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

  const recommendedTopicValue = getRecommendedTopicValue(topicProgress)

  return (
    <div className="min-h-screen bg-base-200/40">
      {/* Sticky header — matches Key Concepts style */}
      <div className="sticky top-0 z-10 bg-base-100/95 backdrop-blur-sm border-b border-base-200 px-4 py-4">
        <h1 className="text-2xl font-bold text-base-content">Practice Mode</h1>
        <p className="text-xs text-base-content/50 mt-0.5">
          Choose how you want to practice
        </p>
      </div>

      <div className="px-4 py-5 space-y-6 max-w-2xl mx-auto">
        {/* Full Practice Exam */}
        <FullPracticeExamCard onSelect={onPracticeQuizSelect} />

        {/* Study by Topic */}
        <div>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content leading-tight">
                Study by Topic
              </h2>
              <p className="text-xs text-base-content/50">
                20 questions · No time limit · tap a topic to expand subtopics
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
  )
}
