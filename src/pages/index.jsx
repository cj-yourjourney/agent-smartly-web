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
          {/* Left: Text Content — always first in DOM so it appears first on mobile */}
          <div className="flex flex-col gap-5">
            <h1
              className="font-display text-4xl md:text-5xl leading-tight hero-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              Pass the CA Real Estate{' '}
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

          {/* Hero Image — AFTER text in DOM, so it appears below H1 on mobile */}
          <div
            className="flex justify-center items-center hero-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full border border-base-300 hero-float">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/exam-readiness-score-05-04.png"
                alt="Exam Readiness Score dashboard — 84.5/100 On Track"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-base-200 py-12 border-y border-base-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '1,300+', label: 'Practice Questions' },
              { value: '134', label: 'Key Concepts' },
              { value: '7', label: 'Exam Topics' },
              { value: '500+', label: 'Exam Takers' }
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 py-6 px-4
                  ${i % 2 === 0 ? 'border-r border-base-300' : ''}
                  ${i < 2 ? 'border-b border-base-300 md:border-b-0' : ''}
                  ${i === 1 ? 'md:border-r md:border-base-300' : ''}
                  ${i === 2 ? 'md:border-r md:border-base-300' : ''}
                `}
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
                className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3"
              >
                <span className="text-base shrink-0">{t.icon}</span>
                <span className="text-sm font-medium flex-1">{t.title}</span>
                <span className="text-xs font-bold text-primary shrink-0 ml-1">
                  {t.pct}
                </span>
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

          {/* Feature 1 — Exam Readiness Score (image left) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/exam-readiness-score-05-04.png"
                alt="Exam Readiness Score dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="badge badge-primary badge-outline w-fit">
                01 — Exam Readiness Score
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                Know If You're Actually Ready
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                A composite score built on four weighted pillars — accuracy,
                question volume, topic coverage, and key concepts — calculated
                to match how the real DRE exam is structured. No more guessing
                whether your prep is working.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  '4-Pillar Score',
                  'DRE-Weighted',
                  'Study Freshness',
                  'On Track Indicator'
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

          {/* Feature 2 — Practice Questions (text left, image right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
            <div className="flex flex-col gap-4">
              <span className="badge badge-primary badge-outline w-fit">
                02 — Practice Questions
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                1,300+ Questions with Instant Explanations
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Practice the full 75-question timed exam or drill by topic.
                Every question comes with a detailed explanation and memory tip
                the moment you answer — so you learn <em>why</em>, not just
                what.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'Full Practice Exam',
                  'Study by Topic',
                  'Instant Explanations',
                  'Memory Tips'
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
            <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/question-05-04.png"
                alt="Practice question with instant explanation and memory tip"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Feature 3 — Key Concepts (image left) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/key-concept-05-04.png"
                alt="Key Concepts organized by topic with review tracking"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="badge badge-primary badge-outline w-fit">
                03 — Key Concepts
              </span>
              <h3 className="font-display text-3xl md:text-4xl">
                134 Concepts That Actually Stick
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Every essential term and rule from the DRE blueprint, organized
                by topic with definitions, memory tricks, and AI explanations on
                demand. Tap any concept for a deeper breakdown — and track which
                ones you've reviewed.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'Definitions',
                  'Memory Tricks',
                  'AI Explain',
                  'Review Tracking'
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

      {/* ── FOUNDER STORY ── */}
      <div className="py-20 px-4 bg-base-100 border-t border-base-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Photo + credential */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <img
                src="https://cjluo.com/static/media/profile.cb5ba9c13f9d23e2ea90.png"
                alt="CJ Luo — Founder of Agent Smartly"
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-xl border-4 border-base-200"
              />
              <div className="text-center lg:text-left">
                <p className="font-bold text-base-content">CJ Luo</p>
                <p className="text-base-content/45 text-sm mt-0.5">
                  Software Engineer · CA Real Estate Agent · Founder
                </p>
                <span className="badge badge-success badge-outline badge-sm mt-2">
                  ✅ Passed DRE Exam 2025
                </span>
              </div>
            </div>

            {/* Story snippet */}
            <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
              <p className="text-primary font-bold tracking-widest text-xs uppercase">
                Why This Exists
              </p>
              <h2 className="font-display text-2xl sm:text-3xl leading-snug">
                I built this because I{' '}
                <span className="font-display-italic text-primary">
                  needed it myself
                </span>
              </h2>
              <p className="text-base-content/60 leading-relaxed text-sm sm:text-base max-w-md">
                In 2024, I was laid off — because of AI. Looking for work that
                was genuinely human, I pivoted to real estate. Every prep tool I
                tried let me down, so I built my own from scratch using the
                official DRE blueprint. I passed on my first attempt in 2025.
                Then my friends used it. They passed too.
              </p>
              <button
                className="btn btn-outline btn-sm sm:btn-md"
                onClick={() => router.push(ROUTES.ABOUT)}
              >
                Read the full story →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="py-24 px-4 bg-base-100 border-t border-base-300">
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
                  className="w-full flex justify-between items-center px-6 py-5 text-left gap-4 hover:bg-base-200 transition-colors duration-150 bg-base-100"
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
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <div className="badge bg-white/15 text-white border-0 px-4 py-3 text-xs font-semibold tracking-wider uppercase">
            ✓ 3-Day Free Trial — No Credit Card Required
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-primary-content">
            Ready to Pass Your Exam?
          </h2>
          <p className="text-primary-content/70 text-lg max-w-md">
            Join 500+ CA real estate exam takers who prepared smarter with Agent
            Smartly.
          </p>
          {isAuthenticated ? (
            <button
              className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-xl mt-2"
              onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
            >
              Continue Practicing →
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-xl mt-2"
                onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
              >
                Start Free Trial →
              </button>
              <p className="text-primary-content/50 text-xs font-medium">
                3 days free · then $9.99 for 1-month access · no auto-renewal
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── DISCLAIMER ── */}
      <div className="bg-base-200 border-t border-base-300 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs text-base-content/35 leading-relaxed">
            <span className="font-semibold text-base-content/45">
              Disclaimer:
            </span>{' '}
            Agent Smartly is an independent study tool, not affiliated with or
            endorsed by the California Department of Real Estate or any
            licensing authority. Practice questions are independently created
            for study purposes and are not actual exam questions. Use as a
            supplement to your official preparation materials.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer footer-center p-10 pb-24 lg:pb-10 bg-base-200 text-base-content border-t border-base-300">
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

      {/* ── STICKY MOBILE CTA ── */}
      {!isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-base-100/95 backdrop-blur border-t border-base-300 px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-base-content truncate">
              Start your free 3-day trial
            </p>
            <p className="text-xs text-base-content/40">
              No credit card required
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm shrink-0"
            onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
          >
            Start Free →
          </button>
        </div>
      )}
    </div>
  )
}
