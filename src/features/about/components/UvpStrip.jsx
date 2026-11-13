const ITEMS = [
  {
    icon: '📌',
    title: "144 concepts. That's it.",
    desc: 'Every question maps to the official DRE blueprint. No filler, no guesswork — only what the exam actually tests.'
  },
  {
    icon: '🔁',
    title: 'Review → Practice → Repeat ×7',
    desc: 'Study one topic, drill questions in that topic, move on. You always know exactly what to do next.'
  },
  {
    icon: '📊',
    title: "Know when you're ready",
    desc: 'Your Exam Readiness Score tracks accuracy, volume, coverage, and concepts — all weighted to match the real exam.'
  }
]

export default function UvpStrip() {
  return (
    <div className="bg-base-100 border-b border-base-200 py-8 px-5">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-base-content/35 mb-5">
          Why it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-base-200 rounded-2xl px-5 py-5 flex flex-col gap-2"
            >
              <span className="text-xl">{item.icon}</span>
              <p className="font-semibold text-base-content text-sm">
                {item.title}
              </p>
              <p className="text-base-content/55 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
