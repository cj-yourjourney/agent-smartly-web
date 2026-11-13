import { PILLARS } from '../../data/pillars'
import ReadinessDashboard from './ReadinessDashboard'

export default function BuildChapter() {
  return (
    <div className="card bg-primary/5 border border-primary/20 rounded-2xl overflow-hidden">
      <div className="bg-primary/10 px-5 sm:px-6 py-4 flex items-start gap-3 border-b border-primary/15">
        <span className="text-2xl mt-0.5 shrink-0">🛠️</span>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-primary/60 mb-0.5">
            2024–2025 — The Build
          </p>
          <h2 className="font-bold text-base-content text-base sm:text-lg leading-snug">
            So I built exactly what I needed
          </h2>
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-3 text-base-content/65 leading-relaxed text-sm sm:text-base">
        <p>
          I started with the{' '}
          <a
            href="https://www.dre.ca.gov/examinees/SalesExamContent.html#property"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/70"
          >
            official DRE Salesperson Examination Content Outline
          </a>{' '}
          and used it as the backbone for everything. Not guesswork — the actual
          exam blueprint. I mapped{' '}
          <span className="font-semibold text-base-content">
            144 key concepts
          </span>{' '}
          across{' '}
          <span className="font-semibold text-base-content">7 topics</span>,
          weighted exactly as the DRE does. Practice of Real Estate gets 25% of
          the exam — so it gets 25% of the questions. No topic gets more
          attention than it deserves.
        </p>
        <p>
          Then I built a simple loop:{' '}
          <span className="font-semibold text-base-content">
            review the key concepts in a topic → drill practice questions in
            that topic → check your score → move to the next topic.
          </span>{' '}
          Repeat × 7. That's the whole method. No guessing what to study next.
          No wasted sessions on topics you've already mastered.
        </p>
        <p>
          The last piece was the feature I wished I'd had from day one: an{' '}
          <span className="font-semibold text-base-content">
            Exam Readiness Score
          </span>{' '}
          — a composite score built on four pillars, all weighted to how the
          real exam is structured. It tells you not just how much you've done,
          but whether you're actually ready to sit.
        </p>
      </div>

      {/* Readiness Score Pillars */}
      <div className="px-5 sm:px-6 pb-5 space-y-2">
        <p className="text-xs font-bold tracking-widest uppercase text-base-content/40 mb-3">
          Exam Readiness Score — 4 Pillars
        </p>
        {PILLARS.map((p) => (
          <div key={p.label} className="bg-base-100 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-base-content">
                {p.label}
              </span>
              <span className="text-sm font-bold text-primary">
                {p.weight}%
              </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-1.5 mb-1.5">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: `${p.weight * 2}%` }}
              />
            </div>
            <p className="text-xs text-base-content/45">{p.desc}</p>
          </div>
        ))}
      </div>

      <ReadinessDashboard />
    </div>
  )
}
