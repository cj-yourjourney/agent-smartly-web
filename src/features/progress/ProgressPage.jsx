// features/progress/ProgressPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  TrendingUp,
  Target,
  Flame,
  Calendar,
  CheckCircle,
  XCircle,
  Trophy,
  AlertTriangle,
  Clock,
  BookOpen,
  Award,
  Activity,
  Info
} from 'lucide-react'
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
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Your Progress</h1>
          </div>
          <p className="text-base-content/70 ml-13">
            Track your learning journey and identify areas for improvement
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <AlertTriangle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 bg-base-100 p-2">
          <button
            className={`tab gap-2 tab-lg px-6 ${
              activeTab === 'overview' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity className="w-4 h-4" />
            Overview
          </button>
          <button
            className={`tab gap-2 tab-lg px-6 ${
              activeTab === 'topics' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('topics')}
          >
            <BookOpen className="w-4 h-4" />
            Topics
          </button>
          <button
            className={`tab gap-2 tab-lg px-6 ${
              activeTab === 'weak-areas' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('weak-areas')}
          >
            <AlertTriangle className="w-4 h-4" />
            Weak Areas
          </button>
          <button
            className={`tab gap-2 tab-lg px-6 ${
              activeTab === 'activity' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('activity')}
          >
            <Clock className="w-4 h-4" />
            Recent Activity
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm opacity-90">Total Questions</h2>
                      <p className="text-4xl font-bold mt-2">
                        {summary.total_questions_attempted}
                      </p>
                    </div>
                    <Target className="w-12 h-12 opacity-50" />
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm opacity-90">Overall Accuracy</h2>
                      <p className="text-4xl font-bold mt-2">
                        {summary.overall_accuracy}%
                      </p>
                    </div>
                    <Award className="w-12 h-12 opacity-50" />
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-warning to-warning-focus text-warning-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm opacity-90">Current Streak</h2>
                      <p className="text-4xl font-bold mt-2">
                        {summary.current_streak_days}
                      </p>
                      <p className="text-xs opacity-75">days</p>
                    </div>
                    <Flame className="w-12 h-12 opacity-50" />
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-info to-info-focus text-info-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm opacity-90">Last 7 Days</h2>
                      <p className="text-4xl font-bold mt-2">
                        {summary.questions_last_7_days}
                      </p>
                      <p className="text-xs opacity-75">questions</p>
                    </div>
                    <Calendar className="w-12 h-12 opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Breakdown */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  Answer Breakdown
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-success/10 rounded-lg">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                    <div className="text-3xl font-bold text-success">
                      {summary.total_correct}
                    </div>
                    <div className="text-sm text-base-content/70">
                      Correct Answers
                    </div>
                  </div>
                  <div className="text-center p-6 bg-error/10 rounded-lg">
                    <XCircle className="w-12 h-12 text-error mx-auto mb-2" />
                    <div className="text-3xl font-bold text-error">
                      {summary.total_incorrect}
                    </div>
                    <div className="text-sm text-base-content/70">
                      Incorrect Answers
                    </div>
                  </div>
                  <div className="text-center p-6 bg-warning/10 rounded-lg">
                    <Flame className="w-12 h-12 text-warning mx-auto mb-2" />
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

            {/* Progress Bar */}
            {summary.total_questions_attempted > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">Overall Performance</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Accuracy Rate
                        </span>
                        <span
                          className={`text-sm font-bold ${getAccuracyColor(
                            summary.overall_accuracy
                          )}`}
                        >
                          {summary.overall_accuracy}%
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full h-4"
                        value={summary.overall_accuracy}
                        max="100"
                      ></progress>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Progress by Topic
                </h2>

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
                            onClick={() => handleTopicClick(topic.topic)}
                          >
                            <td className="font-semibold">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                {topic.topic_display}
                              </div>
                            </td>
                            <td>{topic.questions_attempted}</td>
                            <td>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-success" />
                                {topic.questions_correct}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold ${getAccuracyColor(
                                    topic.accuracy
                                  )}`}
                                >
                                  {topic.accuracy}%
                                </span>
                                <progress
                                  className="progress progress-primary w-20"
                                  value={topic.accuracy}
                                  max="100"
                                ></progress>
                              </div>
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
              <div className="card bg-base-100 shadow-xl border-2 border-primary">
                <div className="card-body">
                  <h2 className="card-title mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Subtopic Breakdown
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
                        {subtopicProgress.map((subtopic, index) => (
                          <tr key={index} className="hover">
                            <td>{subtopic.subtopic_display}</td>
                            <td>{subtopic.questions_attempted}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold ${getAccuracyColor(
                                    subtopic.accuracy
                                  )}`}
                                >
                                  {subtopic.accuracy}%
                                </span>
                                <progress
                                  className="progress progress-primary w-16"
                                  value={subtopic.accuracy}
                                  max="100"
                                ></progress>
                              </div>
                            </td>
                            <td>
                              {subtopic.is_weak_area && (
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
          </div>
        )}

        {/* Weak Areas Tab */}
        {activeTab === 'weak-areas' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-error" />
                Areas Needing Practice
              </h2>

              {weakAreas.length === 0 ? (
                <div className="alert alert-success">
                  <CheckCircle className="w-6 h-6" />
                  <span>Great job! No weak areas identified yet.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {weakAreas.map((area, index) => (
                    <div
                      key={index}
                      className="card bg-base-200 border-l-4 border-error"
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-error mt-1" />
                            <div>
                              <h3 className="font-bold text-lg">
                                {area.subtopic_display}
                              </h3>
                              <p className="text-sm text-base-content/70 flex items-center gap-1 mt-1">
                                <BookOpen className="w-4 h-4" />
                                {area.topic_display}
                              </p>
                            </div>
                          </div>
                          <span className="badge badge-error badge-lg gap-1">
                            <XCircle className="w-4 h-4" />
                            {area.accuracy}% accuracy
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm mt-3">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {area.questions_attempted} attempted
                          </span>
                          <span className="flex items-center gap-1 text-error">
                            <XCircle className="w-4 h-4" />
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
              <h2 className="card-title mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Recent Activity (Last 7 Days)
              </h2>

              {recentActivity.length === 0 ? (
                <div className="alert alert-info">
                  <Info className="w-6 h-6" />
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
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-2 mb-2">
                            {attempt.question_text}
                          </p>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="badge badge-sm gap-1">
                              <BookOpen className="w-3 h-3" />
                              {attempt.topic}
                            </span>
                            {attempt.subtopic && (
                              <span className="badge badge-sm badge-outline gap-1">
                                <Target className="w-3 h-3" />
                                {attempt.subtopic}
                              </span>
                            )}
                            {attempt.time_spent_seconds && (
                              <span className="badge badge-sm badge-ghost gap-1">
                                <Clock className="w-3 h-3" />
                                {attempt.time_spent_seconds}s
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {attempt.is_correct ? (
                            <div className="badge badge-success gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Correct
                            </div>
                          ) : (
                            <div className="badge badge-error gap-2">
                              <XCircle className="w-4 h-4" />
                              Incorrect
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-base-content/50 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
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
