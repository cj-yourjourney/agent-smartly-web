import {
  Clock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Target
} from 'lucide-react'
import {
  SmartGuidanceCard,
  getRecommendedTopicValue
} from './SmartGuidanceCard'

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
      className="w-full p-5 sm:p-6 rounded-2xl active:scale-[0.99] transition-all group text-left touch-manipulation bg-base-100 hover:bg-base-200/50 border border-base-200"
      title="Start a full 75-question practice exam with 90-minute timer"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-[24px] font-bold text-base-content leading-[30px]">
              Full Practice Exam
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full border text-primary border-primary/40">
              Best for exam prep
            </span>
          </div>
          <p className="text-sm text-base-content/60 leading-snug mt-0.5">
            Half-scale DRE simulation · 75 questions in 90 mins
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-base-content/60 group-hover:translate-x-1 transition-all shrink-0" />
      </div>
      <div className="flex items-center gap-4 text-xs text-base-content/40">
        {['75 questions', '90 min timer', 'All 7 topics'].map((tag) => (
          <span key={tag} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-base-content/30" />
            {tag}
          </span>
        ))}
      </div>
    </button>
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
  return (
    <div
      className={`border rounded-xl transition-all ${
        isExpanded
          ? 'border-primary/50 bg-primary/5 shadow-sm'
          : isRecommended
            ? 'border-primary/40 bg-primary/[0.03]'
            : 'border-base-200 bg-base-100 hover:border-base-300'
      }`}
    >
      {/* overflow-hidden on the row prevents the toggle from ever being pushed off-screen */}
      <div className="flex items-stretch overflow-hidden">
        <button
          onClick={() => onTopicSelect(item.topic.value)}
          className="flex-1 min-w-0 text-left px-4 py-3 text-sm font-medium text-base-content hover:text-primary transition-colors min-h-[56px] flex items-center touch-manipulation"
          title={`Practice ${item.topic.label} (20 questions)`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* min-w-0 here is what allows truncation to actually work inside flex */}
          <div className="min-w-0 w-full">
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate block">{item.topic.label}</span>
              {/* Lowest-accuracy topic badge */}
              {isRecommended && (
                <span className="badge badge-primary badge-xs gap-1 shrink-0">
                  <Target className="w-2.5 h-2.5" />
                  Focus here
                </span>
              )}
            </div>

            {/* Topic-level accuracy + questions practiced — labeled so each number is clear */}
            {progress && progress.questions_attempted > 0 && (
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-baseline gap-1">
                  <span
                    className={`text-xs font-bold ${accuracyColor(progress.accuracy)}`}
                  >
                    {progress.accuracy}%
                  </span>
                  <span className="text-[10px] text-base-content/40 font-normal">
                    accuracy
                  </span>
                </span>
                <span className="w-px h-3 bg-base-300 shrink-0" />
                <span className="flex items-baseline gap-1">
                  <span className="text-xs font-semibold text-base-content/50">
                    {progress.questions_attempted}
                  </span>
                  <span className="text-[10px] text-base-content/40 font-normal">
                    practiced
                  </span>
                </span>
              </div>
            )}
          </div>
        </button>

        {item.subtopics.length > 0 && (
          <>
            <div className="w-px bg-base-200 my-2 shrink-0" />
            {/* shrink-0 ensures the toggle is never squeezed off screen on narrow viewports */}
            <button
              onClick={() => onToggle(item.topic.value)}
              className="shrink-0 px-3 text-base-content/40 hover:text-primary hover:bg-base-200/50 active:bg-base-200 transition-all flex flex-col items-center justify-center gap-0.5 touch-manipulation w-14 rounded-r-xl"
              title={
                isExpanded
                  ? 'Hide subtopics'
                  : `Show ${item.subtopics.length} subtopics`
              }
              aria-label="Toggle subtopics"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="text-xs font-bold leading-none">
                {item.subtopics.length}
              </span>
              <span className="text-[9px] leading-none text-base-content/30 font-normal">
                subtopics
              </span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </>
        )}
      </div>

      {isExpanded && item.subtopics.length > 0 && (
        <div className="border-t border-base-200/60">
          <div className="p-2 space-y-0.5">
            {item.subtopics.map((subtopic) => (
              <button
                key={subtopic.value}
                onClick={() =>
                  onSubtopicSelect(item.topic.value, subtopic.value)
                }
                className="w-full text-left py-3 px-4 text-sm text-base-content/70 hover:text-primary hover:bg-base-100 active:bg-base-200 rounded-lg transition-all flex items-center group touch-manipulation"
                title={`Practice ${subtopic.label} (20 questions)`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary mr-3 shrink-0 transition-colors" />
                {subtopic.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StudyByTopicPanel({
  topicStructure,
  progressMap,
  recommendedTopicValue,
  expandedTopic,
  onTopicSelect,
  onToggle,
  onSubtopicSelect
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl font-bold text-base-content leading-tight">
            Study by Topic / Subtopic
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
            20 questions · No time limit ·{' '}
            <span className="text-base-content/40 inline-flex items-center gap-0.5">
              <ChevronDown className="w-3 h-3" /> tap to drill into subtopics
            </span>
          </p>
        </div>
      </div>

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
  // Build a quick lookup: topic value -> progress entry
  const progressMap = {}
  topicProgress.forEach((p) => {
    progressMap[p.topic] = p
  })

  const recommendedTopicValue = getRecommendedTopicValue(topicProgress)

  return (
    <div className="min-h-screen bg-base-100">
      {/* Compact sticky header on mobile */}
      <div className="sticky top-0 z-10 bg-base-100/95 backdrop-blur-sm border-b border-base-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold text-base-content">
            Practice Mode
          </h1>
          <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">
            Choose how you want to practice
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 md:px-12 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Smart guidance: recommends the lowest-accuracy topic */}
          <SmartGuidanceCard
            topicProgress={topicProgress}
            onSelect={onTopicSelect}
          />

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:items-start">
            <FullPracticeExamCard onSelect={onPracticeQuizSelect} />
            <StudyByTopicPanel
              topicStructure={topicStructure}
              progressMap={progressMap}
              recommendedTopicValue={recommendedTopicValue}
              expandedTopic={expandedTopic}
              onTopicSelect={onTopicSelect}
              onToggle={onToggle}
              onSubtopicSelect={onSubtopicSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
