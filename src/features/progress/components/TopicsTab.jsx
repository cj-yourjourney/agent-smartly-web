import {
  BookOpen,
  CheckCircle,
  Target,
  AlertTriangle,
  Info
} from 'lucide-react'

export default function TopicsTab({
  topicProgress,
  subtopicProgress,
  weakAreas,
  selectedTopic,
  onTopicClick,
  summary
}) {
  const getMasteryColor = (level) => {
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

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-success'
    if (accuracy >= 75) return 'text-info'
    if (accuracy >= 60) return 'text-warning'
    return 'text-error'
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" /> Progress by Topic
            </h2>
            <span className="text-xs text-base-content/50">
              Click a topic to see subtopics
            </span>
          </div>
          {topicProgress.length === 0 ? (
            <div className="alert alert-info">
              <Info className="w-6 h-6" />
              <span>Start practicing to see your progress by topic!</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Questions</th>
                    <th>Correct</th>
                    <th>Accuracy</th>
                    <th>Mastery</th>
                  </tr>
                </thead>
                <tbody>
                  {topicProgress.map((topic) => (
                    <tr
                      key={topic.topic}
                      className="hover cursor-pointer"
                      onClick={() => onTopicClick(topic.topic)}
                    >
                      <td className="font-semibold">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {topic.topic_display}
                          {topic.questions_attempted < 25 &&
                            topic.questions_attempted > 0 && (
                              <span className="badge badge-xs badge-warning">
                                needs more
                              </span>
                            )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            topic.questions_attempted < 25
                              ? 'text-warning font-medium'
                              : ''
                          }
                        >
                          {topic.questions_attempted}
                          <span className="text-base-content/30 font-normal">
                            {' '}
                            / 25
                          </span>
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-success" />
                          {topic.questions_correct}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${getAccuracyColor(topic.accuracy)}`}
                          >
                            {topic.accuracy}%
                          </span>
                          <progress
                            className="progress progress-primary w-20"
                            value={topic.accuracy}
                            max="100"
                          />
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getMasteryColor(topic.mastery_level)}`}
                        >
                          {topic.mastery_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedTopic && subtopicProgress.length > 0 && (
        <div className="card bg-base-100 shadow-xl border-2 border-primary">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" /> Subtopic Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Subtopic</th>
                    <th>Questions</th>
                    <th>Accuracy</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subtopicProgress.map((sub, idx) => (
                    <tr key={idx} className="hover">
                      <td>{sub.subtopic_display}</td>
                      <td>{sub.questions_attempted}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${getAccuracyColor(sub.accuracy)}`}
                          >
                            {sub.accuracy}%
                          </span>
                          <progress
                            className="progress progress-primary w-16"
                            value={sub.accuracy}
                            max="100"
                          />
                        </div>
                      </td>
                      <td>
                        {sub.is_weak_area && (
                          <span className="badge badge-error badge-sm gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Needs Practice
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-error" /> Weak Areas{' '}
            {weakAreas.length > 0 && (
              <span className="badge badge-error badge-sm ml-1">
                {weakAreas.length}
              </span>
            )}
          </h2>
          {weakAreas.length === 0 ? (
            <div className="alert alert-success">
              <CheckCircle className="w-6 h-6" />
              <span>
                {summary.total_questions_attempted === 0
                  ? 'Answer at least 3 questions per subtopic to identify weak areas.'
                  : 'No weak areas identified yet — keep it up!'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weakAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-error/5 border border-error/20"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {area.subtopic_display}
                    </p>
                    <p className="text-xs text-base-content/50 mt-0.5">
                      {area.topic_display}
                    </p>
                    <p className="text-xs text-base-content/40 mt-0.5">
                      {area.questions_attempted} attempted ·{' '}
                      {area.questions_incorrect} wrong
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
