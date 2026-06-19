import {
  BookOpen,
  CheckCircle,
  Target,
  AlertTriangle,
  Info
} from 'lucide-react'

const masteryColor = (level) => {
  switch (level) {
    case 'Mastered':
      return 'badge-success'
    case 'Proficient':
      return 'badge-info'
    case 'Developing':
      return 'badge-warning'
    case 'Needs Practice':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}

const accuracyColor = (acc) =>
  acc >= 90
    ? 'text-success'
    : acc >= 75
      ? 'text-info'
      : acc >= 60
        ? 'text-warning'
        : 'text-error'

export default function TopicsTab({
  topicProgress,
  subtopicProgress,
  weakAreas,
  selectedTopic,
  onTopicClick,
  summary
}) {
  return (
    <div className="space-y-4">
      {/* Topic list */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Progress by Topic
            </h2>
            <span className="text-xs text-base-content/40 hidden sm:block">
              Tap a topic to drill into subtopics
            </span>
          </div>

          {topicProgress.length === 0 ? (
            <div className="alert alert-info">
              <Info className="w-5 h-5" />
              <span>Start practicing to see your progress by topic.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {topicProgress.map((topic) => (
                <div key={topic.topic}>
                  {/* Topic row — card style, works on any screen width */}
                  <button
                    className="w-full text-left rounded-xl border border-base-200 bg-base-100 hover:bg-base-200 active:scale-[0.99] transition-all px-4 py-3"
                    onClick={() => onTopicClick(topic.topic)}
                  >
                    {/* Row 1: topic name + mastery badge */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm leading-snug">
                          {topic.topic_display}
                        </p>
                        {topic.questions_attempted > 0 &&
                          topic.questions_attempted < 25 && (
                            <span className="badge badge-xs badge-warning mt-1">
                              needs more
                            </span>
                          )}
                      </div>
                      <span
                        className={`badge badge-sm flex-shrink-0 ${masteryColor(topic.mastery_level)}`}
                      >
                        {topic.mastery_level}
                      </span>
                    </div>

                    {/* Row 2: questions + accuracy + progress bar */}
                    <div className="flex items-center gap-4 text-xs text-base-content/50">
                      <span>
                        <span
                          className={
                            topic.questions_attempted < 25
                              ? 'text-warning font-medium'
                              : 'text-base-content/70 font-medium'
                          }
                        >
                          {topic.questions_attempted}
                        </span>
                        <span className="text-base-content/30"> / 25 q</span>
                      </span>
                      <span
                        className={`font-semibold ${accuracyColor(topic.accuracy)}`}
                      >
                        {topic.accuracy}%
                      </span>
                      <progress
                        className="progress progress-primary flex-1 h-1.5"
                        value={topic.accuracy}
                        max="100"
                      />
                    </div>
                  </button>

                  {/* Inline subtopic expansion */}
                  {selectedTopic === topic.topic &&
                    subtopicProgress.length > 0 && (
                      <div className="bg-base-200 rounded-xl mx-1 mt-1 mb-2 p-3 space-y-2">
                        <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wide flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" /> Subtopics
                        </p>
                        {subtopicProgress.map((sub, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-base-content/70 flex-1 min-w-0">
                                {sub.subtopic_display}
                              </span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className={`text-xs font-semibold ${accuracyColor(sub.accuracy)}`}
                                >
                                  {sub.accuracy}%
                                </span>
                                <span className="text-xs text-base-content/40">
                                  {sub.questions_attempted}q
                                </span>
                                {sub.is_weak_area && (
                                  <span className="badge badge-error badge-xs">
                                    weak
                                  </span>
                                )}
                              </div>
                            </div>
                            <progress
                              className="progress progress-primary w-full h-1"
                              value={sub.accuracy}
                              max="100"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weak Areas */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-error" />
            Weak Areas
            {weakAreas.length > 0 && (
              <span className="badge badge-error badge-sm">
                {weakAreas.length}
              </span>
            )}
          </h2>

          {weakAreas.length === 0 ? (
            <div className="alert alert-success py-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">
                {summary.total_questions_attempted === 0
                  ? 'Answer at least 3 questions per subtopic to identify weak areas.'
                  : 'No weak areas — keep it up!'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {weakAreas.map((area, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-error/5 border border-error/20"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {area.subtopic_display}
                    </p>
                    <p className="text-xs text-base-content/40 mt-0.5">
                      {area.topic_display} · {area.questions_attempted}{' '}
                      attempted
                    </p>
                  </div>
                  <span className="badge badge-error badge-md ml-3 flex-shrink-0">
                    {area.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
