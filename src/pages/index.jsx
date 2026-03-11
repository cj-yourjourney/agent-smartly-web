// pages/index.jsx
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'

const topics = [
  {
    title: 'Property Ownership & Land Use Controls',
    pct: '15%',
    icon: '🏠',
    sub: 'Classes, encumbrances, water rights, environmental hazards'
  },
  {
    title: 'Laws of Agency & Fiduciary Duties',
    pct: '17%',
    icon: '🤝',
    sub: 'Agency creation, disclosure, responsibilities, termination'
  },
  {
    title: 'Property Valuation & Financial Analysis',
    pct: '14%',
    icon: '📊',
    sub: 'Value methods, financial analysis, appraisals'
  },
  {
    title: 'Financing',
    pct: '9%',
    icon: '🏦',
    sub: 'Loan types, mortgages, deeds of trust, credit laws'
  },
  {
    title: 'Transfer of Property',
    pct: '8%',
    icon: '📝',
    sub: 'Title insurance, deeds, escrow, tax aspects'
  },
  {
    title: 'Practice of Real Estate & Disclosures',
    pct: '25%',
    icon: '⚖️',
    sub: 'Fair housing, trust accounts, ethics, specialty areas'
  },
  {
    title: 'Contracts',
    pct: '12%',
    icon: '📄',
    sub: 'Listings, purchase contracts, promissory notes, options'
  }
]

const stats = [
  { value: '1,300+', label: 'Practice Questions' },
  { value: '134', label: 'Key Concepts' },
  { value: '7', label: 'Exam Topics' },
  { value: '100%', label: 'Free to Use' }
]

const features = [
  {
    icon: '📚',
    title: '1,300+ Practice Questions',
    desc: 'Every question maps directly to the official DRE Salesperson Exam blueprint — covering all 7 topics and every subtopic the real exam tests.',
    pills: ['All 7 Topics', 'Full Subtopics', 'DRE Aligned']
  },
  {
    icon: '🧠',
    title: '134 Key Concepts',
    desc: 'Bite-sized concept cards with definitions, memory tricks, real-world examples, and exam tips — so concepts stick, not just memorized answers.',
    pills: ['Definitions', 'Memory Tips', 'Examples']
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: "See your accuracy by topic, identify weak subtopics, track your streaks, and watch your mastery grow — know exactly when you're ready.",
    pills: ['Per-Topic Stats', 'Weak Areas', 'Accuracy Rate']
  }
]

const testimonials = [
  {
    text: 'I passed with an 82% on my first attempt. The practice questions were incredibly close to what showed up on the real exam — especially the Contracts and Agency sections.',
    author: 'Marcus T.',
    detail: 'Passed March 2025'
  },
  {
    text: "The key concepts section was a game changer. Having definitions AND memory tricks made the dense legal terminology actually stick. Couldn't recommend it more.",
    author: 'Sarah L.',
    detail: 'Passed January 2025'
  },
  {
    text: 'I loved seeing my progress by topic. When I saw my Property Ownership score was 76%, I knew exactly where to focus. Ended up mastering every category before exam day.',
    author: 'Diana R.',
    detail: 'Passed February 2025'
  }
]

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-base-100">
      {/* ── HERO ── */}
      <div className="hero min-h-[88vh] bg-base-200">
        <div className="hero-content text-center max-w-3xl flex-col gap-6">
          <div className="badge badge-outline badge-primary gap-2 py-3 px-4">
            <span className="badge badge-success badge-xs" />
            Free California Real Estate Exam Prep
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Pass Your CA Real Estate Exam on the{' '}
            <span className="text-primary italic">First Try</span>
          </h1>

          <p className="text-lg md:text-xl text-base-content/70 max-w-xl">
            Over 1,300 practice questions, 134 key concepts, and full progress
            tracking — built around the exact topics the DRE tests you on.
          </p>

          <div className="badge badge-success gap-2 py-3 px-5 text-sm font-semibold">
            ✓ 100% Free — No Credit Card Required
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {isAuthenticated ? (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
                >
                  Start Practicing Now →
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => router.push(ROUTES.LEARNING.PROGRESS)}
                >
                  View My Progress
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
                >
                  Start Practicing Free →
                </button>
                <button
                  className="btn btn-ghost btn-lg"
                  onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-neutral text-neutral-content py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="stats stats-horizontal w-full shadow-none bg-transparent">
            {stats.map((s, i) => (
              <div key={i} className="stat place-items-center">
                <div className="stat-value text-primary text-3xl md:text-4xl">
                  {s.value}
                </div>
                <div className="stat-desc text-neutral-content/50 text-sm mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="py-24 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-center text-base-content/60 text-lg mb-16 max-w-xl mx-auto">
            Three tools, working together, aligned to the official DRE exam
            blueprint.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="card-body gap-4">
                  <div className="text-4xl">{f.icon}</div>
                  <h3 className="card-title text-lg">{f.title}</h3>
                  <p className="text-base-content/65 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {f.pills.map((p, j) => (
                      <span
                        key={j}
                        className="badge badge-primary badge-outline badge-sm"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOPICS ── */}
      <div className="py-24 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            Exam Blueprint
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            All 7 DRE Exam Topics Covered
          </h2>
          <p className="text-center text-base-content/60 text-lg mb-14 max-w-xl mx-auto">
            Questions weighted to match the real exam. Focus where it counts
            most.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="card-body flex-row items-start gap-4 p-5">
                  <div className="text-3xl bg-base-200 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                    {t.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">{t.title}</div>
                    <div className="text-xs text-base-content/55 leading-relaxed mb-2">
                      {t.sub}
                    </div>
                    <span className="badge badge-primary badge-outline badge-xs">
                      {t.pct} of exam
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="py-24 px-4 bg-neutral text-neutral-content">
        <div className="max-w-5xl mx-auto">
          <p className="text-center font-bold tracking-widest text-xs uppercase mb-3 text-neutral-content/40">
            Results
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Trusted by CA Exam Takers
          </h2>
          <p className="text-center text-neutral-content/45 text-lg mb-14 max-w-xl mx-auto">
            Real people who used Agent Smartly to pass on the first try.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((r, i) => (
              <div
                key={i}
                className="card bg-neutral-focus border border-neutral-content/10 shadow-md"
              >
                <div className="card-body gap-3">
                  <div className="text-warning text-base tracking-widest">
                    ★★★★★
                  </div>
                  <p className="text-neutral-content/70 text-sm leading-relaxed">
                    "{r.text}"
                  </p>
                  <div className="mt-2">
                    <div className="font-semibold text-sm text-neutral-content">
                      {r.author}
                    </div>
                    <div className="text-xs text-neutral-content/35 mt-0.5">
                      {r.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-24 px-4 bg-base-100">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-primary text-primary-content shadow-2xl">
            <div className="card-body items-center text-center gap-5 py-16 px-8">
              <h2 className="card-title text-3xl md:text-4xl font-bold">
                Ready to Pass Your Exam?
              </h2>
              <p className="text-primary-content/75 text-lg max-w-md">
                Join hundreds of successful California real estate agents. Start
                practicing today — completely free.
              </p>
              {isAuthenticated ? (
                <button
                  className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none mt-2"
                  onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
                >
                  Continue Practicing →
                </button>
              ) : (
                <button
                  className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none mt-2"
                  onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
                >
                  Create Free Account →
                </button>
              )}
              <p className="text-primary-content/45 text-xs">
                No credit card required. Free forever.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold text-lg">
            <span className="text-primary">Agent</span> Smartly
          </p>
          <p className="text-base-content/50 text-sm">
            California Real Estate Exam Prep
          </p>
          <p className="text-base-content/40 text-xs mt-2">
            © {new Date().getFullYear()} Agent Smartly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
