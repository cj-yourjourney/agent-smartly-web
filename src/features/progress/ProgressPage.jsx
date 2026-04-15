import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  TrendingUp,
  Activity,
  BookOpen,
  ClipboardList,
  AlertTriangle
} from 'lucide-react'

import OverviewTab from './components/OverviewTab'
import TopicsTab from './components/TopicsTab'
import SessionsActivityTab from './components/SessionsActivityTab' // ← new combined tab

import {
  fetchProgressSummary,
  fetchTopicProgress,
  fetchSubtopicProgress,
  fetchWeakAreas,
  fetchRecentActivity,
  fetchSessions,
  setSelectedTopic
} from './state/progressSlice'

export default function ProgressPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth)
  const {
    summary,
    topicProgress,
    subtopicProgress,
    weakAreas,
    sessions,
    loading,
    error,
    selectedTopic
  } = useSelector((state) => state.progress)

  useEffect(() => {
    if (isInitialized && !isAuthenticated) router.push('/login')
  }, [isAuthenticated, isInitialized, router])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProgressSummary())
      dispatch(fetchTopicProgress())
      dispatch(fetchWeakAreas())
      dispatch(fetchRecentActivity())
      dispatch(fetchSessions())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (selectedTopic) dispatch(fetchSubtopicProgress(selectedTopic))
  }, [dispatch, selectedTopic])

  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      dispatch(setSelectedTopic(null))
      dispatch(fetchSubtopicProgress())
    } else {
      dispatch(setSelectedTopic(topic))
    }
  }

  if (!isInitialized || (loading && !summary?.total_questions_attempted)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
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

        {/* Tab Controls */}
        <div className="tabs tabs-boxed mb-6 bg-base-100 p-2 overflow-x-auto flex-nowrap">
          <button
            className={`tab gap-2 tab-lg px-6 whitespace-nowrap ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity className="w-4 h-4" />
            Overview
          </button>
          <button
            className={`tab gap-2 tab-lg px-6 whitespace-nowrap ${activeTab === 'topics' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            <BookOpen className="w-4 h-4" />
            Topics & Weak Areas
          </button>
          <button
            className={`tab gap-2 tab-lg px-6 whitespace-nowrap ${activeTab === 'sessions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <ClipboardList className="w-4 h-4" />
            Practice Sessions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            summary={summary}
            topicProgress={topicProgress}
            router={router}
          />
        )}
        {activeTab === 'topics' && (
          <TopicsTab
            summary={summary}
            topicProgress={topicProgress}
            subtopicProgress={subtopicProgress}
            weakAreas={weakAreas}
            selectedTopic={selectedTopic}
            onTopicClick={handleTopicClick}
          />
        )}
        {activeTab === 'sessions' && (
          <SessionsActivityTab sessions={sessions || []} />
        )}
      </div>
    </div>
  )
}
