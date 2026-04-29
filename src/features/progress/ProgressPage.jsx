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
import SessionsActivityTab from './components/SessionsActivityTab'

import {
  fetchProgressSummary,
  fetchTopicProgress,
  fetchSubtopicProgress,
  fetchWeakAreas,
  fetchRecentActivity,
  fetchSessions,
  setSelectedTopic
} from './state/progressSlice'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'topics', label: 'Topics', icon: BookOpen },
  { id: 'sessions', label: 'Sessions', icon: ClipboardList }
]

const VALID_TABS = TABS.map((t) => t.id)

export default function ProgressPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('overview')

  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth)
  const {
    summary,
    topicProgress,
    subtopicProgress,
    weakAreas,
    sessions,
    loading,
    error,
    selectedTopic
  } = useSelector((s) => s.progress)

  useEffect(() => {
    if (!router.isReady) return
    const tabParam = router.query.tab
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [router.isReady, router.query.tab])

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (router.query.tab) {
      router.replace({ pathname: router.pathname }, undefined, {
        shallow: true
      })
    }
  }

  if (!isInitialized || (loading && !summary?.total_questions_attempted)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-md" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Page header */}
        <div className="mb-5 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              Your Progress
            </h1>
            <p className="text-xs text-base-content/50">
              Track your learning and identify areas for improvement
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4 py-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-100 p-1 mb-5 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`tab gap-1.5 px-4 sm:px-5 text-sm ${activeTab === id ? 'tab-active' : ''}`}
              onClick={() => handleTabChange(id)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
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
