// features/home/components/DisclaimerSection.jsx
export default function DisclaimerSection() {
  return (
    <div className="bg-base-200 border-t border-base-300 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs text-base-content/35 leading-relaxed">
          <span className="font-semibold text-base-content/45">
            Disclaimer:
          </span>{' '}
          AgentSmartly is an independent study tool, not affiliated with or
          endorsed by the California Department of Real Estate or any licensing
          authority. Practice questions are independently created for study
          purposes and are not actual exam questions. Use as a supplement to
          your official preparation materials.
        </p>
      </div>
    </div>
  )
}
