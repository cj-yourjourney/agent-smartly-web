// src/features/about/AboutPage.jsx
import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'

const TESTIMONIALS = [
  {
    quote:
      'I failed the DRE exam once before finding Agent Smartly. The readiness score showed me exactly where I was weak. Passed second time with zero doubt.',
    name: 'Marcus T.',
    detail: 'Passed DRE Exam · Los Angeles',
    emoji: '🏡'
  },
  {
    quote:
      'Every other prep site felt like a guessing game. This one is built by someone who actually took the exam. The topic weights alone are worth it.',
    name: 'Priya S.',
    detail: 'Passed DRE Exam · San Jose',
    emoji: '✅'
  },
  {
    quote:
      'CJ told me about this before it was even public. I used it for 3 weeks and walked into the exam feeling genuinely ready. First try.',
    name: 'Daniel R.',
    detail: 'Passed DRE Exam · Sacramento',
    emoji: '🎯'
  }
]

const PILLARS = [
  { label: 'Accuracy', weight: 45, desc: 'Weighted by DRE topic weight' },
  {
    label: 'Question Volume',
    weight: 25,
    desc: 'Target: 300 questions answered'
  },
  { label: 'Topic Coverage', weight: 15, desc: '25+ questions per topic' },
  { label: 'Key Concepts', weight: 15, desc: '134 concepts, time-tracked' }
]

// ── Small reusable connector line ─────────────────────────────────────────────
function Connector() {
  return (
    <div className="flex justify-center my-1">
      <div className="w-px h-8 bg-base-300" />
    </div>
  )
}

// ── Chapter card shell ─────────────────────────────────────────────────────────
function Chapter({
  accentClass = '',
  headerClass = '',
  borderClass = 'border-base-200',
  icon,
  year,
  title,
  children
}) {
  return (
    <div
      className={`card border rounded-2xl overflow-hidden ${accentClass} ${borderClass}`}
    >
      <div
        className={`px-5 sm:px-6 py-4 flex items-start gap-3 border-b ${headerClass}`}
      >
        <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase opacity-50 mb-0.5">
            {year}
          </p>
          <h2 className="font-bold text-base-content text-base sm:text-lg leading-snug">
            {title}
          </h2>
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-3 text-base-content/65 leading-relaxed text-sm sm:text-base">
        {children}
      </div>
    </div>
  )
}

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-base-100">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Photo + byline */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <img
                src="https://cjluo.com/static/media/profile.cb5ba9c13f9d23e2ea90.png"
                alt="CJ Luo — Founder of Agent Smartly"
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-xl border-4 border-base-100"
              />
              <div className="text-center lg:text-left">
                <p className="font-bold text-base-content text-lg">CJ Luo</p>
                <p className="text-base-content/50 text-sm mt-0.5">
                  Software Engineer · CA Real Estate Agent · Founder
                </p>
                <a
                  href="mailto:agentsmartly@gmail.com"
                  className="text-sm text-primary hover:underline mt-1 block"
                >
                  agentsmartly@gmail.com
                </a>
              </div>
            </div>

            {/* Headline + tags */}
            <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
              <p className="text-primary font-bold tracking-widest text-xs uppercase">
                The Story Behind Agent Smartly
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight">
                Built by an Engineer Who{' '}
                <span className="font-display-italic text-primary">
                  Needed It Himself
                </span>
              </h1>
              <p className="text-base-content/60 text-base sm:text-lg leading-relaxed max-w-md">
                This isn't a product built by a big company. It's a project born
                out of a layoff, a career pivot, and the stubborn belief that if
                you can't find the right tool — you build it.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {[
                  '🏙️ SF Bay Area since 2016',
                  '💻 Software Engineer',
                  '🏡 Real Estate Enthusiast',
                  '✅ Passed DRE Exam 2025'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-outline badge-md text-base-content/60 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ─────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-1">
        {/* Chapter 1 — The Builder */}
        <Chapter
          icon="💻"
          year="2016 — The Builder"
          title="I've always loved building things"
        >
          <p>
            I've been a software engineer in the San Francisco Bay Area since
            2016 — building everything from websites to apps, shipping features,
            solving problems with code. It's not just a career for me. It's how
            I think.
          </p>
          <p>
            On weekends, my wife and I love visiting open houses. There's
            something about walking through a beautiful home — imagining the
            people who'll live there, the stories those walls will hold. Real
            estate always felt alive to me in a way that spreadsheets never
            could.
          </p>
        </Chapter>

        <Connector />

        {/* Chapter 2 — The Turning Point */}
        <Chapter
          icon="⚡"
          year="2024 — The Turning Point"
          title="I got laid off. Because of AI."
          accentClass="bg-warning/5"
          borderClass="border-warning/25"
          headerClass="bg-warning/10 border-warning/20"
        >
          <p>
            In 2024, my company let me go. The reason? AI. The very technology
            I'd spent years working alongside was now displacing the roles
            around it — including mine. I'd be lying if I said I wasn't shaken.
            I was shocked, lost, and honestly a little angry.
          </p>
          <p>
            But sitting with that uncertainty, something became clear: I wanted
            work that required being genuinely human. Face-to-face. Present.
            Irreplaceable. Real estate kept coming back to me — a career built
            on trust, relationships, and showing up in person. Hard to automate.
            Easy to love.
          </p>
          <div className="rounded-xl border-l-4 border-warning bg-warning/10 px-4 sm:px-5 py-4 !mt-4">
            <p className="text-base-content/75 italic leading-relaxed text-sm">
              "The irony isn't lost on me — a software engineer, displaced by
              AI, pivoting to one of the most human-centered industries there
              is."
            </p>
          </div>
        </Chapter>

        <Connector />

        {/* Chapter 3 — The Problem */}
        <Chapter
          icon="😤"
          year="2024 — The Problem"
          title="Every prep tool I tried let me down"
        >
          <p>
            I enrolled in my pre-licensing course and started preparing for the
            DRE exam. I tried everything — prep books, flashcard apps,
            third-party exam sites. None of them felt right. The questions
            didn't map cleanly to the official DRE blueprint. The explanations
            were shallow. There was no way to know if I was actually ready or
            just spinning my wheels.
          </p>
          <p>
            As an engineer, there's a thought pattern that's hard to turn off:{' '}
            <span className="font-semibold text-base-content">
              if I can't find the right solution, I'll just build it.
            </span>
          </p>
        </Chapter>

        <Connector />

        {/* Chapter 4 — Building */}
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
              and used it as the backbone for everything — every practice
              question, every key concept, every topic weight. Not guesswork.
              The actual exam blueprint.
            </p>
            <p>
              Then I built the feature I wished I'd had from day one: an{' '}
              <span className="font-semibold text-base-content">
                Exam Readiness Score
              </span>
              . Not just a completion percentage — a composite score built on
              four pillars weighted to how the real exam is structured. It also
              factors in study freshness, because cramming three months ago and
              doing nothing since doesn't mean you're ready today.
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

          {/* Dashboard mockup */}
          <div className="px-5 sm:px-6 pb-6">
            <div className="rounded-2xl border border-primary/20 bg-base-100 overflow-hidden shadow-md">
              {/* Mock browser bar */}
              <div className="bg-base-200 px-4 py-2.5 flex items-center gap-2 border-b border-base-300">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <div className="flex-1 bg-base-300 rounded-md h-5 mx-4 flex items-center px-2">
                  <span className="text-[10px] text-base-content/30 font-mono">
                    agentsmartly.com/dashboard
                  </span>
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Score header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-0.5">
                      Exam Readiness
                    </p>
                    <p className="text-3xl font-black text-primary">
                      87
                      <span className="text-lg font-bold text-base-content/30">
                        /100
                      </span>
                    </p>
                  </div>
                  <div
                    className="radial-progress text-primary text-xs font-bold"
                    style={{
                      '--value': 87,
                      '--size': '4rem',
                      '--thickness': '4px'
                    }}
                    aria-label="87%"
                  >
                    87%
                  </div>
                </div>
                {/* Mini topic bars */}
                <div className="space-y-2">
                  {[
                    {
                      topic: 'Property Ownership',
                      pct: 91,
                      color: 'bg-success'
                    },
                    { topic: 'Contracts', pct: 78, color: 'bg-warning' },
                    { topic: 'Finance', pct: 84, color: 'bg-primary' },
                    { topic: 'Agency', pct: 95, color: 'bg-success' }
                  ].map((t) => (
                    <div key={t.topic} className="flex items-center gap-3">
                      <p className="text-xs text-base-content/55 w-32 shrink-0 truncate">
                        {t.topic}
                      </p>
                      <div className="flex-1 bg-base-300 rounded-full h-1.5">
                        <div
                          className={`${t.color} h-1.5 rounded-full`}
                          style={{ width: `${t.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-base-content/60 w-8 text-right">
                        {t.pct}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-base-content/30 text-center pt-1">
                  ↑ What your dashboard looks like as you study
                </p>
              </div>
            </div>
          </div>
        </div>

        <Connector />

        {/* Chapter 5 — The Proof */}
        <div className="card bg-success/5 border border-success/25 rounded-2xl overflow-hidden">
          <div className="bg-success/10 px-5 sm:px-6 py-4 flex items-start gap-3 border-b border-success/20">
            <span className="text-2xl mt-0.5 shrink-0">🎉</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-success/60 mb-0.5">
                2025 — The Proof
              </p>
              <h2 className="font-bold text-base-content text-base sm:text-lg leading-snug">
                I passed on my first try
              </h2>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-5 space-y-3 text-base-content/65 leading-relaxed text-sm sm:text-base">
            <p>
              In 2025, I sat for the DRE Salesperson Exam using Agent Smartly as
              my primary prep tool. When I walked out of that exam room and saw
              the word{' '}
              <span className="font-semibold text-base-content">PASS</span> on
              the screen, I just stood there for a moment. My wife had driven me
              to the test center that morning. I called her before I even made
              it to the parking lot.
            </p>
            <p>
              It meant everything — not just because I'd earned my license, but
              because it proved the approach actually worked. I hadn't just
              studied hard. I had studied <span className="italic">smart</span>.
            </p>
            <p>
              I started sharing it with friends who were also preparing. They
              passed too. Word spread through referrals — no ads, no marketing
              budget, just people telling other people it worked. That organic
              growth told me something real was here.
            </p>
          </div>
          <div className="mx-5 sm:mx-6 mb-6 bg-success/10 border border-success/20 rounded-xl px-4 sm:px-5 py-4 flex items-center gap-4">
            <span className="text-3xl shrink-0">✅</span>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Passed the CA DRE Salesperson Exam on the{' '}
              <span className="font-semibold text-base-content">
                first attempt
              </span>
              , 2025. Shared with friends — they passed too.
            </p>
          </div>
        </div>

        <Connector />

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold tracking-widest uppercase text-base-content/40 text-center pb-1">
            What others are saying
          </p>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card bg-base-100 border border-base-200 rounded-2xl px-5 sm:px-6 py-5 flex flex-col gap-3"
            >
              <p className="text-base-content/70 leading-relaxed text-sm sm:text-base italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-base-200 border border-base-300 flex items-center justify-center text-base shrink-0">
                  {t.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    {t.name}
                  </p>
                  <p className="text-xs text-base-content/45">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Connector />

        {/* Chapter 6 — Today */}
        <div className="card bg-primary border-0 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 py-4 flex items-start gap-3 border-b border-primary-content/10">
            <span className="text-2xl mt-0.5 shrink-0">🚀</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-primary-content/50 mb-0.5">
                Today — The Mission
              </p>
              <h2 className="font-bold text-primary-content text-base sm:text-lg leading-snug">
                This is my full-time work now
              </h2>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-5 space-y-3 text-primary-content/75 leading-relaxed text-sm sm:text-base">
            <p>
              Maintaining and improving Agent Smartly is my full-time job and
              genuine passion. It sits at the intersection of everything I care
              about — software, real estate, and helping people reach a goal
              that actually changes their lives.
            </p>
            <p>
              Every question, every concept, every feature on this site exists
              because I needed it myself first. I know exactly what it feels
              like to sit in that exam room. I built this so you walk in
              prepared.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <div className="bg-base-200 border-t border-base-300">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 py-14 sm:py-16 text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-snug">
            You've seen how I got here.{' '}
            <span className="text-primary">Now let's get you there.</span>
          </h2>
          <p className="text-base-content/55 text-base sm:text-lg max-w-md">
            Start your free 3-day trial — no credit card required.
          </p>
          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
            <button
              className="btn btn-primary btn-lg w-full sm:w-auto min-w-56"
              onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
            >
              Start Free Trial →
            </button>
            <p className="text-base-content/40 text-xs font-medium">
              3 days free · then $9.99 for 1-month access · no auto-renewal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
