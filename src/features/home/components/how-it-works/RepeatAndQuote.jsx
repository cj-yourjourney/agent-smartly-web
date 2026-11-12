// features/home/components/how-it-works/RepeatAndQuote.jsx
export default function RepeatAndQuote() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="rounded-2xl bg-base-200 border border-base-300 px-8 py-7 flex items-center gap-5">
        <div className="text-5xl font-bold text-primary shrink-0">×7</div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-base-content">
            Repeat for all 7 DRE exam topics
          </p>
          <p className="text-base-content/55 text-sm leading-relaxed">
            Agency Laws · Contracts · Financing · Property Ownership ·
            Valuation · Transfer · Practice of Real Estate
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-base-300 bg-base-100 px-7 py-6 flex gap-4 items-start">
        <div className="text-2xl shrink-0">💬</div>
        <div className="flex flex-col gap-1">
          <p className="text-base-content/80 text-sm leading-relaxed italic">
            "I review all key concepts in one topic like Contracts, then take a
            practice test in Contracts. I instantly see if I really understand
            them. Then repeat for all topics."
          </p>
          <p className="text-xs text-base-content/40 font-medium mt-1">
            — r/CalRealEstateExam · CA exam passer
          </p>
        </div>
      </div>
    </div>
  )
}
