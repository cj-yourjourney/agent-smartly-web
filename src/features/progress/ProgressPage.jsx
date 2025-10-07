// features/progress/ProgressPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  fetchProgressSummary,
  fetchTopicProgress,
  fetchSubtopicProgress,
  fetchWeakAreas,
  fetchRecentActivity,
  setSelectedTopic
} from './state/progressSlice'

export default function ProgressPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const { isAuthenticated } = useSelector((state) => state.auth)
  const {
    summary,
    topicProgress,
    subtopicProgress,
    weakAreas,
    recentActivity,
    loading,
    error,
    selectedTopic
  } = useSelector((state) => state.progress)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProgressSummary())
      dispatch(fetchTopicProgress())
      dispatch(fetchWeakAreas())
      dispatch(fetchRecentActivity())
    }
  }, [dispatch, isAuthenticated])

  // Fetch subtopics when topic is selected
  useEffect(() => {
    if (selectedTopic) {
      dispatch(fetchSubtopicProgress(selectedTopic))
    }
  }, [dispatch, selectedTopic])

  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      dispatch(setSelectedTopic(null))
      dispatch(fetchSubtopicProgress())
    } else {
      dispatch(setSelectedTopic(topic))
    }
  }

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

  if (loading && !summary.total_questions_attempted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
          <p className="text-base-content/70">
            Track your learning journey and identify areas for improvement
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 bg-base-100">
          <button
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'topics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </button>
          <button
            className={`tab ${activeTab === 'weak-areas' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('weak-areas')}
          >
            Weak Areas
          </button>
          <button
            className={`tab ${activeTab === 'activity' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm">Total Questions</h2>
                  <p className="text-4xl font-bold">
                    {summary.total_questions_attempted}
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm">Overall Accuracy</h2>
                  <p
                    className={`text-4xl font-bold ${getAccuracyColor(
                      summary.overall_accuracy
                    )}`}
                  >
                    {summary.overall_accuracy}%
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm">Current Streak</h2>
                  <p className="text-4xl font-bold text-warning">
                    {summary.current_streak_days}
                  </p>
                  <p className="text-sm text-base-content/70">days</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm">Last 7 Days</h2>
                  <p className="text-4xl font-bold text-info">
                    {summary.questions_last_7_days}
                  </p>
                  <p className="text-sm text-base-content/70">questions</p>
                </div>
              </div>
            </div>

            {/* Progress Breakdown */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Answer Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">
                      {summary.total_correct}
                    </div>
                    <div className="text-sm text-base-content/70">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-error">
                      {summary.total_incorrect}
                    </div>
                    <div className="text-sm text-base-content/70">
                      Incorrect
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">
                      {summary.longest_streak_days}
                    </div>
                    <div className="text-sm text-base-content/70">
                      Longest Streak
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Progress by Topic</h2>

                {topicProgress.length === 0 ? (
                  <div className="alert alert-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Start practicing to see your progress by topic!</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
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
                            onClick={() => handleTopicClick(topic.topic)}
                          >
                            <td className="font-semibold">
                              {topic.topic_display}
                            </td>
                            <td>{topic.questions_attempted}</td>
                            <td>{topic.questions_correct}</td>
                            <td className={getAccuracyColor(topic.accuracy)}>
                              {topic.accuracy}%
                            </td>
                            <td>
                              <span
                                className={`badge ${getMasteryColor(
                                  topic.mastery_level
                                )}`}
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

            {/* Subtopics (when topic selected) */}
            {selectedTopic && subtopicProgress.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Subtopic Breakdown</h2>
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
                        {subtopicProgress.map((subtopic, index) => (
                          <tr key={index}>
                            <td>{subtopic.subtopic_display}</td>
                            <td>{subtopic.questions_attempted}</td>
                            <td className={getAccuracyColor(subtopic.accuracy)}>
                              {subtopic.accuracy}%
                            </td>
                            <td>
                              {subtopic.is_weak_area && (
                                <span className="badge badge-error badge-sm">
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
          </div>
        )}

        {/* Weak Areas Tab */}
        {activeTab === 'weak-areas' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Areas Needing Practice</h2>

              {weakAreas.length === 0 ? (
                <div className="alert alert-success">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Great job! No weak areas identified yet.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {weakAreas.map((area, index) => (
                    <div key={index} className="card bg-base-200">
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">
                              {area.subtopic_display}
                            </h3>
                            <p className="text-sm text-base-content/70">
                              {area.topic_display}
                            </p>
                          </div>
                          <span className="badge badge-error">
                            {area.accuracy}% accuracy
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm mt-2">
                          <span>
                            {area.questions_attempted} questions attempted
                          </span>
                          <span className="text-error">
                            {area.questions_incorrect} incorrect
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity Tab */}
        {activeTab === 'activity' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Recent Activity (Last 7 Days)</h2>

              {recentActivity.length === 0 ? (
                <div className="alert alert-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>No recent activity in the last 7 days.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((attempt) => (
                    <div
                      key={attempt.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        attempt.is_correct
                          ? 'border-success bg-success/10'
                          : 'border-error bg-error/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-2">
                            {attempt.question_text}
                          </p>
                          <div className="flex gap-3 mt-2 text-sm text-base-content/70">
                            <span className="badge badge-sm">
                              {attempt.topic}
                            </span>
                            {attempt.subtopic && (
                              <span className="badge badge-sm badge-outline">
                                {attempt.subtopic}
                              </span>
                            )}
                            {attempt.time_spent_seconds && (
                              <span>{attempt.time_spent_seconds}s</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {attempt.is_correct ? (
                            <div className="badge badge-success gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Correct
                            </div>
                          ) : (
                            <div className="badge badge-error gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Incorrect
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-base-content/50 mt-2">
                        {new Date(attempt.attempted_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
