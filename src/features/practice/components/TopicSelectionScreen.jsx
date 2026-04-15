import { Clock, ChevronRight, ChevronDown } from 'lucide-react'

function FullPracticeExamCard({ onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full p-6 border-2 border-base-300 rounded-xl hover:border-primary hover:shadow-md transition-all group text-left bg-base-100"
      title="Start a full 75-question practice exam with 90-minute timer"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Clock className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-base-content mb-1 group-hover:text-primary transition-colors">
            Full Practice Exam
          </h2>
          <p className="text-base-content/60">
            Complete exam simulation with timer
          </p>
        </div>
        <ChevronRight className="w-6 h-6 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
      <div className="flex items-center gap-4 text-sm text-base-content/70">
        {['75 questions', '90 minutes', 'All topics'].map((tag) => (
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
      className={`border rounded-lg transition-all ${
        isExpanded
          ? 'border-primary/50 bg-primary/5 shadow-sm'
          : 'border-base-300 bg-base-100 hover:border-base-400'
      }`}
    >
      <div className="flex items-center">
        <button
          onClick={() => onTopicSelect(item.topic.value)}
          className="flex-1 text-left px-3.5 py-3 text-sm font-medium text-base-content hover:text-primary transition-colors"
          title={`Practice ${item.topic.label} (20 questions)`}
        >
          {item.topic.label}
        </button>

        {item.subtopics.length > 0 && (
          <>
            <div className="w-px h-6 bg-base-300" />
            <button
              onClick={() => onToggle(item.topic.value)}
              className="px-3.5 py-3 text-base-content/50 hover:text-primary hover:bg-base-200/50 transition-all flex items-center gap-1.5"
              title={
                isExpanded
                  ? 'Hide subtopics'
                  : `Show ${item.subtopics.length} subtopics`
              }
              aria-label="Toggle subtopics"
            >
              <span className="text-xs font-semibold min-w-[1rem] text-center">
                {item.subtopics.length}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </>
        )}
      </div>

      {isExpanded && item.subtopics.length > 0 && (
        <div className="border-t border-base-300/60">
          <div className="p-2 space-y-0.5">
            {item.subtopics.map((subtopic) => (
              <button
                key={subtopic.value}
                onClick={() =>
                  onSubtopicSelect(item.topic.value, subtopic.value)
                }
                className="w-full text-left py-2 px-3 text-xs text-base-content/70 hover:text-primary hover:bg-base-100 rounded-md transition-all flex items-center group"
                title={`Practice ${subtopic.label} (20 questions)`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary mr-2.5 shrink-0" />
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
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-base-content mb-1">
            Study by Topic
          </h2>
          <p className="text-base-content/60 text-sm">
            Click topic or use{' '}
            <ChevronDown className="w-3.5 h-3.5 inline mx-0.5 -mt-0.5" /> for
            subtopics • 20 questions • No time limit
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
    <div className="min-h-screen bg-base-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Practice Mode
          </h1>
          <p className="text-base-content/60">
            Choose how you want to practice
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
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
  )
}
