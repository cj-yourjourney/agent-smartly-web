import { Clock, ChevronRight, ChevronDown, BookOpen } from 'lucide-react'

function FullPracticeExamCard({ onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full p-4 sm:p-6 border-2 border-base-300 rounded-2xl hover:border-primary hover:shadow-md active:scale-[0.99] transition-all group text-left bg-base-100 touch-manipulation"
      title="Start a full 75-question practice exam with 90-minute timer"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-3">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-base-content mb-0.5 group-hover:text-primary transition-colors leading-tight">
            Full Practice Exam
          </h2>
          <p className="text-sm text-base-content/60 leading-snug">
            Complete simulation with timer
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
      <div className="flex items-center gap-3 sm:gap-4 text-xs text-base-content/60">
        {['75 questions', '90 min', 'All topics'].map((tag) => (
          <span key={tag} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-base-content/40" />
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}

function TopicRow({
  item,
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
          : 'border-base-200 bg-base-100 hover:border-base-300'
      }`}
    >
      <div className="flex items-stretch">
        <button
          onClick={() => onTopicSelect(item.topic.value)}
          className="flex-1 text-left px-4 py-3.5 text-sm font-medium text-base-content hover:text-primary transition-colors min-h-[48px] flex items-center touch-manipulation"
          title={`Practice ${item.topic.label} (20 questions)`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {item.topic.label}
        </button>

        {item.subtopics.length > 0 && (
          <>
            <div className="w-px bg-base-200 my-2" />
            <button
              onClick={() => onToggle(item.topic.value)}
              className="px-4 text-base-content/40 hover:text-primary hover:bg-base-200/50 active:bg-base-200 transition-all flex items-center gap-1 touch-manipulation min-w-[60px] justify-center rounded-r-xl"
              title={
                isExpanded
                  ? 'Hide subtopics'
                  : `Show ${item.subtopics.length} subtopics`
              }
              aria-label="Toggle subtopics"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="text-xs font-bold">{item.subtopics.length}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
            Study by Topic
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
            20 questions · No time limit
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {topicStructure.map((item) => (
          <TopicRow
            key={item.topic.value}
            item={item}
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
  expandedTopic,
  onPracticeQuizSelect,
  onTopicSelect,
  onToggle,
  onSubtopicSelect
}) {
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
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 lg:items-start">
            <FullPracticeExamCard onSelect={onPracticeQuizSelect} />
            <StudyByTopicPanel
              topicStructure={topicStructure}
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
