// pages/index.jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'

const faqs = [
  {
    q: 'How much does it cost?',
    a: '$9.99 gives you 1 month of full access — no auto-renewal, no subscription. Every new account starts with a free 3-day trial, no credit card required. When your access period ends, you can purchase another month if you need more time.'
  },
  {
    q: 'How many questions should I practice before the exam?',
    a: 'Most users who feel confident going into the exam have practiced between 300 and 500 questions. That gives you enough exposure to cover all 7 topics and their subtopics without burnout.'
  },
  {
    q: 'What accuracy score should I aim for?',
    a: "Users on Agent Smartly average around 75% accuracy. Aiming for 75–80% consistently across all topics is a strong signal that you're ready. If a specific topic is below 65%, focus there first."
  },
  {
    q: 'How many key concepts should I know?',
    a: "There are 134 key concepts mapped to the DRE exam. Most prepared users know around 70% (roughly 90–95 concepts) going in. You don't need to memorize every single one — focus on understanding, not rote memorization."
  },
  {
    q: 'How is this different from a prep book?',
    a: "Prep books give you static content. Agent Smartly tracks your progress, adapts to your weak areas, and surfaces exactly what you need to work on. You also get AI-powered explanations for any concept you don't understand."
  },
  {
    q: 'Does this cover the full DRE exam blueprint?',
    a: 'Yes. All 7 official DRE Salesperson Exam topics are covered, with questions weighted to match the real exam — so you spend more time on topics like Practice of Real Estate (25%) and less on lower-weight topics.'
  },
  {
    q: 'Do I need to create an account?',
    a: 'Yes, a free account is required to track your progress and save your practice history. Sign up takes under a minute — just an email and password, no credit card needed to start your 3-day trial.'
  }
]

const topics = [
  {
    title: 'Property Ownership & Land Use Controls and Regulations',
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
  { value: '$9.99', label: '1-Month Access' }
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
    text: 'I passed on my first attempt. The practice questions were incredibly close to what showed up on the real exam — especially the Contracts and Agency sections.',
    author: 'Marcus T.',
    detail: 'Passed March 2025'
  },
  {
    text: "The key concepts section was a game changer. Having definitions AND memory tricks made the dense legal terminology actually stick. Couldn't recommend it more.",
    author: 'Sarah L.',
    detail: 'Passed January 2025'
  },
  {
    text: 'I loved seeing my progress by topic. When I saw my Property Ownership accuracy was low, I knew exactly where to focus. Felt confident walking into the exam.',
    author: 'Diana R.',
    detail: 'Passed February 2025'
  }
]

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-base-100">
      {/* ── HERO ── */}
      <div className="min-h-[88vh] bg-base-200 flex items-center relative overflow-hidden hero-bg-dots">
        {/* Decorative blob behind image */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-5">
            <h1
              className="font-display text-4xl md:text-5xl leading-tight hero-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              Ace the CA Real Estate{' '}
              <span className="font-display-italic text-primary">
                Salesperson
              </span>{' '}
              Exam
            </h1>

            <p
              className="text-lg text-base-content/70 max-w-lg hero-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              Over 1,300 practice questions, 134 key concepts, and full progress
              tracking — built around the exact topics the DRE tests you on.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 mt-1 hero-fade-up"
              style={{ animationDelay: '240ms' }}
            >
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
                    className="btn btn-primary btn-lg hero-btn"
                    onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
                  >
                    Start Free Trial →
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

            <div
              className="flex flex-col gap-1.5 hero-fade-up"
              style={{ animationDelay: '360ms' }}
            >
              <p className="text-sm text-base-content/45 flex items-center gap-1.5">
                <span className="text-success text-base hero-check">✓</span>
                3-day free trial · No credit card required
              </p>
              <p className="text-sm text-base-content/45 flex items-center gap-1.5">
                <span className="text-success text-base hero-check">✓</span>
                $9.99 for 1-month access · One-time charge · Renew anytime
              </p>
            </div>
          </div>

          {/* Hero Image — stacked above text on mobile, right column on desktop */}
          <div
            className="flex justify-center items-center order-first lg:order-last hero-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm aspect-[3/4] hero-float">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/hero.jpg"
                alt="Person celebrating after passing exam"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-base-200 py-14 border-y border-base-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-base-300">
            {[
              { value: '1,300+', label: 'Practice Questions' },
              { value: '134', label: 'Key Concepts' },
              { value: '7', label: 'Exam Topics' },
              { value: '$9.99', label: '1-Month Access' }
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 py-2 px-4"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {s.value}
                </div>
                <div className="text-base-content/50 text-xs text-center mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOPICS ── */}
      <div className="py-16 px-4 bg-base-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            Exam Blueprint
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-center mb-10">
            All 7 DRE Exam Topics Covered
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topics.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-base-200 rounded-xl px-4 py-3"
              >
                <span className="text-base">{t.icon}</span>
                <span className="text-sm font-medium">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES SHOWCASE ── */}
      <div className="py-24 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-center text-base-content/60 text-lg mb-20 max-w-xl mx-auto">
            Three tools, working together, aligned to the official DRE
            salesperson exam blueprint.
          </p>

          {/* Feature 1 — Practice Questions (image left) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/practice+questions.png"
                alt="Practice Questions feature"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="badge badge-primary badge-outline w-fit">
                01 — Practice Questions
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                1,300+ Questions, DRE Aligned
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Every question maps directly to the official DRE Salesperson
                Exam blueprint. Practice the full exam or drill by topic — with
                subtopics and no time pressure.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'All 7 Topics',
                  'Full Subtopics',
                  'Study by Topic',
                  '75-Question Exam Mode'
                ].map((p) => (
                  <span
                    key={p}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 — Key Concepts (image right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
            <div className="flex flex-col gap-4 order-last lg:order-first">
              <span className="badge badge-primary badge-outline w-fit">
                02 — Key Concepts
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                134 Concepts That Actually Stick
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Bite-sized concept cards with definitions, memory tricks,
                real-world examples, and exam tips — organized by topic so you
                always know where you stand.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'Definitions',
                  'Memory Tricks',
                  'AI Explain',
                  'Organized by Topic'
                ].map((p) => (
                  <span
                    key={p}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200 order-first lg:order-last">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/key+concepts.png"
                alt="Key Concepts feature"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Feature 3 — Progress Tracking (image left) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/progress+trcking.png"
                alt="Progress Tracking feature"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="badge badge-primary badge-outline w-fit">
                03 — Progress Tracking
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                Know Exactly Where You Stand
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                See your accuracy by topic, spot weak areas, and track your
                streaks. When your numbers are strong, you'll walk into the exam
                with real confidence.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'Per-Topic Accuracy',
                  'Weak Area Detection',
                  'Streaks',
                  'Answer Breakdown'
                ].map((p) => (
                  <span
                    key={p}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="py-24 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-center font-bold tracking-widest text-xs uppercase mb-3 text-base-content/40">
            Results
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
            Trusted by CA Exam Takers
          </h2>
          <p className="text-center text-base-content/50 text-lg mb-14 max-w-xl mx-auto">
            Real people who prepared with Agent Smartly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                text: 'I only spent 1-2 days on AgentSmartly before my first exam and scored 68/70 — so close. I then switched to another prep site and did even worse. Coming back to AgentSmartly and really focusing on the key concepts and progress chart made all the difference. Third time, I passed.',
                author: 'Gabriel C.',
                detail: 'Passed March 2026',
                initials: 'GC',
                color: 'bg-primary'
              },
              {
                text: "The key concepts section was a game changer. Having definitions AND memory tricks made the dense legal terminology actually stick. Couldn't recommend it more.",
                author: 'Sarah L.',
                detail: 'Passed January 2025',
                initials: 'SL',
                color: 'bg-success'
              },
              {
                text: 'I loved seeing my progress by topic. When I saw my Property Ownership accuracy was low, I knew exactly where to focus. Felt confident walking into the exam.',
                author: 'Diana R.',
                detail: 'Passed February 2025',
                initials: 'DR',
                color: 'bg-warning'
              }
            ].map((r, i) => (
              <div
                key={i}
                className="card bg-base-100 border border-base-300 shadow-sm relative overflow-hidden"
              >
                <span className="absolute top-4 right-5 text-6xl text-base-content/5 font-serif leading-none select-none">
                  "
                </span>
                <div className="card-body gap-4">
                  <div className="text-warning text-sm tracking-widest">
                    ★★★★★
                  </div>
                  <p className="text-base-content/65 text-sm leading-relaxed">
                    "{r.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{r.author}</div>
                      <div className="text-xs text-base-content/40">
                        {r.detail}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="py-24 px-4 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            FAQ
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
            Common Questions
          </h2>
          <p className="text-center text-base-content/60 text-lg mb-14 max-w-xl mx-auto">
            Answers based on real data from users who prepared with Agent
            Smartly.
          </p>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-base-300 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-5 text-left gap-4 hover:bg-base-200 transition-colors duration-150"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-base">{faq.q}</span>
                  <span
                    className={`text-primary text-xl flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-base-content/65 text-sm leading-relaxed border-t border-base-300 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-28 px-4 bg-primary relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="badge bg-white/15 text-white border-0 px-4 py-3 text-xs font-semibold tracking-wider uppercase">
            ✓ 3-Day Free Trial — No Credit Card Required
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-primary-content">
            Ready to Ace Your Exam?
          </h2>
          <p className="text-primary-content/70 text-lg max-w-md">
            Join hundreds of California real estate exam takers who prepared
            smarter with Agent Smartly.
          </p>
          {isAuthenticated ? (
            <button
              className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-xl mt-2"
              onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
            >
              Continue Practicing →
            </button>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <button
                className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-xl mt-2"
                onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
              >
                Start Free Trial →
              </button>
              <p className="text-primary-content/50 text-xs font-medium">
                No subscription, ever.
              </p>
            </div>
          )}
          <p className="text-primary-content/40 text-xs">
            3 days free · then $9.99 for 1-month access, billed once · no
            auto-renewal
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold text-lg">
            <span className="text-primary">Agent</span> Smartly
          </p>
          <p className="text-base-content/50 text-sm">
            California Real Estate Salesperson Exam Prep
          </p>
          <p className="text-base-content/40 text-xs mt-2">
            © {new Date().getFullYear()} Agent Smartly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
