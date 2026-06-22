import ConceptRow from './ConceptRow'

export default function SubtopicSection({
  subtopic,
  isFirst,
  conceptViewCounts,
  onAskLLM,
  topicName,
  topicCode,
  isLLMLoading
}) {
  if (subtopic.concepts.length === 0) return null

  return (
    <div>
      <div
        className={`px-4 py-2 ${!isFirst ? 'border-t border-base-200' : ''}`}
      >
        <span className="text-[10px] font-bold text-base-content/35 uppercase tracking-widest">
          {subtopic.name}
        </span>
      </div>
      <div className="px-3 pb-3 space-y-1">
        {subtopic.concepts.map((concept) => (
          <ConceptRow
            key={concept.id}
            concept={concept}
            reviewCount={conceptViewCounts[concept.name] ?? 0}
            isDisabled={isLLMLoading}
            onAsk={() =>
              onAskLLM(
                concept,
                subtopic.name,
                topicName,
                topicCode,
                subtopic.code
              )
            }
          />
        ))}
      </div>
    </div>
  )
}
