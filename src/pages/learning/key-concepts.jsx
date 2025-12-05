// components/KeyConceptsOutline.jsx
import { useState, useEffect } from 'react'

const EXAM_TOPICS = [
  {
    code: 'property_ownership',
    name: 'Property Ownership and Land Use Controls',
    percentage: '15%'
  },
  {
    code: 'agency_laws',
    name: 'Laws of Agency and Fiduciary Duties',
    percentage: '17%'
  },
  {
    code: 'valuation',
    name: 'Property Valuation and Financial Analysis',
    percentage: '14%'
  },
  { code: 'financing', name: 'Financing', percentage: '9%' },
  { code: 'transfer', name: 'Transfer of Property', percentage: '8%' },
  {
    code: 'practice_disclosures',
    name: 'Practice of Real Estate and Disclosures',
    percentage: '25%'
  },
  { code: 'contracts', name: 'Contracts', percentage: '12%' }
]

export default function KeyConceptsOutline() {
  const [concepts, setConcepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedTopics, setExpandedTopics] = useState(new Set())

  useEffect(() => {
    fetch('http://localhost:8000/api/key-concepts/')
      .then((res) => res.json())
      .then((data) => setConcepts(data))
      .catch((err) => console.error('Error:', err))
      .finally(() => setLoading(false))
  }, [])

  const toggleTopic = (code) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  // Group concepts by topic and subtopic
  const organized = EXAM_TOPICS.map((topic) => {
    const topicConcepts = concepts.filter((c) => c.topic === topic.code)
    const subtopicMap = new Map()

    topicConcepts.forEach((concept) => {
      if (!subtopicMap.has(concept.subtopic)) {
        subtopicMap.set(concept.subtopic, [])
      }
      subtopicMap.get(concept.subtopic).push(concept)
    })

    return {
      ...topic,
      subtopics: Array.from(subtopicMap.entries()).map(([code, concepts]) => ({
        code,
        name: concepts[0].subtopic_display,
        concepts
      }))
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">CA Real Estate Study Guide</h1>
        <p className="text-sm text-base-content/70">
          Key concepts organized by exam outline
        </p>
      </div>

      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Total Concepts</div>
          <div className="stat-value text-primary">{concepts.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Topics Covered</div>
          <div className="stat-value">
            {organized.filter((t) => t.subtopics.length > 0).length}/7
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {organized.map((topic) => {
          const isExpanded = expandedTopics.has(topic.code)
          const count = topic.subtopics.reduce(
            (sum, st) => sum + st.concepts.length,
            0
          )

          return (
            <div
              key={topic.code}
              className="collapse collapse-arrow bg-base-200"
            >
              <input
                type="checkbox"
                checked={isExpanded}
                onChange={() => toggleTopic(topic.code)}
              />
              <div className="collapse-title">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{topic.name}</span>
                  <div className="flex gap-2">
                    <div className="badge badge-primary">
                      {topic.percentage}
                    </div>
                    <div className="badge badge-ghost">{count}</div>
                  </div>
                </div>
              </div>

              <div className="collapse-content">
                {count === 0 ? (
                  <div className="alert alert-warning">
                    <span>No concepts added yet</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topic.subtopics.map((subtopic) => (
                      <div key={subtopic.code} className="card bg-base-100">
                        <div className="card-body p-4">
                          <h3 className="font-medium text-sm mb-2">
                            {subtopic.name}
                            <span className="badge badge-sm ml-2">
                              {subtopic.concepts.length}
                            </span>
                          </h3>
                          <ul className="space-y-1">
                            {subtopic.concepts.map((concept) => (
                              <li
                                key={concept.id}
                                className="flex items-baseline gap-2 text-sm"
                              >
                                <span>•</span>
                                <span className="flex-1">
                                  {concept.name}
                                  {concept.page_number && (
                                    <span className="text-xs text-base-content/60 ml-2">
                                      {concept.page_number}
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
