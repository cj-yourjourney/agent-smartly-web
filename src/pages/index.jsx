// pages/index.jsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS, ACTIVE_SALE } from '@/features/pricing/pricingConfig'
import SaleBanner from '@/features/pricing/components/SaleBanner'

const faqs = [
  {
    q: 'How much does it cost?',
    // NOTE: price strings are generated at render time from pricingConfig.js — do not hardcode here
    a: '__PRICING_FAQ__'
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
    a: 'Yes, a free account is required to track your progress and save your practice history. Sign up takes under a minute — just an email and password, no credit card needed to start your 60-question free trial.'
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

  // Build the FAQ pricing answer dynamically from pricingConfig
  const pricingFaqAnswer = (() => {
    const planList = PLANS.map((p) => `${p.price} for ${p.description}`).join(
      ', '
    )
    const saleNote = ACTIVE_SALE.enabled
      ? ` (${ACTIVE_SALE.discountPct}% off during the ${ACTIVE_SALE.label} — regular prices are ${PLANS.map((p) => `${p.originalPrice} for ${p.description}`).join(', ')})`
      : ''
    return `Plans start at ${planList}${saleNote} — no auto-renewal, no subscription. Every new account gets 60 free practice questions — no credit card required. When your free questions run out, you can purchase any plan anytime.`
  })()

  return (
    <div className="min-h-screen bg-base-100">
      <SaleBanner />
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
              Pass the CA Real Estate Salesperson Exam —{' '}
              <span className="font-display-italic text-primary">
                Without the Overwhelm
              </span>
            </h1>

            <p
              className="text-lg text-base-content/70 max-w-lg hero-fade-up"
              style={{ animationDelay: '120ms' }}
            >
              Skip the textbooks.{' '}
              <span className="font-semibold text-base-content">
                134 concepts. 7 topics.
              </span>{' '}
              Review a topic, practice questions on it, check your score. Repeat
              × 7. That's the whole method.
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
                500+ people passed the CA real estate exam using Agent Smartly
              </p>
              <p className="text-sm text-base-content/45 flex items-center gap-1.5">
                <span className="text-success text-base hero-check">✓</span>
                60 free questions · No credit card required
              </p>
            </div>
          </div>

          {/* Hero Image — AFTER text in DOM, so it appears below H1 on mobile       */}
          {/* hero-float lives directly on the <img> so the GPU compositing layer    */}
          {/* IS the image itself — rasterized at full device pixel ratio (sharp 2x) */}
          {/* drop-shadow replaces box-shadow so no wrapper div needs overflow:hidden */}
          <div
            className="flex justify-center items-center hero-fade-up relative z-10"
            style={{ animationDelay: '200ms' }}
          >
            <img
              src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/hero-image.png"
              alt="Study method: Review Key Concepts → Practice Questions → Check Your Progress, repeated for all 7 DRE exam topics"
              className="w-full h-auto block hero-float"
              style={{
                filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.10))'
              }}
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-base-200 py-12 border-y border-base-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '134', label: 'Essential Key Concepts' },
              { value: '7', label: 'Exam Topics — Review & Practice Each' },
              { value: '1,300+', label: 'Practice Questions' },
              { value: '500+', label: 'Exams Passed' }
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

      {/* ── HOW IT WORKS ── */}
      <div className="py-24 px-4 bg-base-100 border-t border-base-200">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
            Less Material. More Clarity. Faster Pass.
          </h2>
          <p className="text-center text-base-content/60 text-lg mb-10 max-w-2xl mx-auto">
            Most CA exam prep sites give you prep books, video lectures, and
            thousands of random questions — so much you don't know where to
            start. Agent Smartly does the opposite: only the essentials, in a
            clear order, with one tool for each step.
          </p>

          {/* Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-base-300 bg-base-200 px-6 py-5 flex flex-col gap-3">
              <p className="text-xs font-bold tracking-widest uppercase text-base-content/40">
                Other prep sites
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  'Hundreds of random questions',
                  'Prep books with everything in them',
                  'No clear starting point',
                  'You guess what matters',
                  'Overwhelming, not guiding'
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-base-content/50"
                  >
                    <span className="text-error mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-5 flex flex-col gap-3">
              <p className="text-xs font-bold tracking-widest uppercase text-primary">
                Agent Smartly
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  '134 concepts — only what the DRE tests',
                  'Organized by the 7 exact exam topics',
                  'Three steps, always know what to do next',
                  'Review → Practice → Check Progress',
                  'Direct, focused, nothing extra'
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-base-content/70"
                  >
                    <span className="text-success mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="flex flex-col gap-4 lg:order-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shrink-0">
                  1
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-primary">
                  Review
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl">
                Learn the Key Concepts in One Topic
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Start with the{' '}
                <span className="font-semibold text-base-content">
                  134 essential key concepts
                </span>{' '}
                — the real terms, rules, and definitions the DRE actually tests.
                Nothing more. Study one subject at a time (e.g., Agency Laws)
                with definitions, memory tricks, and AI explanations built in.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '134 Key Concepts',
                  '7 Topics Organized',
                  'Memory Tricks',
                  'AI Explain',
                  'Review Tracking'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:order-2">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/key-concept-05-04.png"
                alt="Key Concepts page — 134 concepts organized by topic"
                className="w-full h-auto block rounded-2xl border border-base-200"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Divider arrow */}
          <div className="flex items-center justify-center mb-24 gap-4">
            <div className="flex-1 h-px bg-base-300" />
            <span className="text-primary text-2xl">↓</span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="lg:order-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shrink-0">
                  2
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-primary">
                  Practice
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl">
                Drill Questions in That Same Topic
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Immediately test what you just learned with{' '}
                <span className="font-semibold text-base-content">
                  1,300+ topic-filtered practice questions
                </span>
                . Every answer comes with a full explanation and memory tip — so
                you learn why, not just what. Aim for 70%+ before moving on.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Study by Topic',
                  '1,300+ Questions',
                  'Instant Explanations',
                  'Memory Tips',
                  'Full Practice Exam'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:order-1 grid grid-cols-2 gap-4">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/practice-mode-05-04.png"
                alt="Practice mode — choose topic or full exam"
                className="w-full h-auto block rounded-2xl border border-base-200"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
                loading="lazy"
              />
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/question-05-04.png"
                alt="Practice question with instant explanation"
                className="w-full h-auto block rounded-2xl border border-base-200"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Divider arrow */}
          <div className="flex items-center justify-center mb-24 gap-4">
            <div className="flex-1 h-px bg-base-300" />
            <span className="text-primary text-2xl">↓</span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="flex flex-col gap-4 lg:order-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg shrink-0">
                  3
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-primary">
                  Check Progress
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl">
                Know Exactly Where You Stand
              </h3>
              <p className="text-base-content/65 text-lg leading-relaxed">
                Your{' '}
                <span className="font-semibold text-base-content">
                  Exam Readiness Score
                </span>{' '}
                tracks accuracy, question volume, topic coverage, and key
                concepts reviewed — all weighted to match the real DRE exam. See
                which topic to focus on next and know when you're actually ready
                to sit the exam.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Readiness Score',
                  'Per-Topic Accuracy',
                  'DRE-Weighted',
                  'On Track Indicator'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:order-2">
              <img
                src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/exam-readiness-score-05-04.png"
                alt="Exam Readiness Score dashboard"
                className="w-full h-auto block rounded-2xl border border-base-200"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* ×7 + Reddit quote */}
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
                  "I review all key concepts in one topic like Contracts, then
                  take a practice test in Contracts. I instantly see if I really
                  understand them. Then repeat for all topics."
                </p>
                <p className="text-xs text-base-content/40 font-medium mt-1">
                  — r/CalRealEstateExam · CA exam passer
                </p>
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
            500+ People Passed With Agent Smartly
          </h2>
          <p className="text-center text-base-content/50 text-lg mb-14 max-w-xl mx-auto">
            Real CA exam passers who prepared with Agent Smartly. Here's what
            they said.
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

      {/* ── PRICING ── */}
      <div className="py-24 px-4 bg-base-100 border-t border-base-200">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
            Pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-3">
            One-Time Payment.
          </h2>
          <p className="text-center text-base-content/55 text-base mb-8 max-w-sm mx-auto">
            All plans include everything. Pick how long you need.
          </p>

          {/* Plan rows — same style as account page */}
          <div className="flex flex-col gap-2 mb-6">
            {PLANS.map((plan) => {
              const isPopular = plan.id === 'month'
              return (
                <div
                  key={plan.id}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all
                    ${
                      isPopular
                        ? 'border-primary bg-primary/5'
                        : 'border-base-300 bg-base-100'
                    }
                  `}
                >
                  {/* Left: duration */}
                  <div className="flex items-center gap-3">
                    {isPopular && (
                      <span className="badge badge-primary badge-sm font-semibold hidden sm:inline-flex">
                        Popular
                      </span>
                    )}
                    <div>
                      <span className="text-sm font-semibold text-base-content">
                        {plan.label}
                      </span>
                      <span className="text-xs text-base-content/45 ml-2">
                        {plan.description}
                      </span>
                    </div>
                  </div>

                  {/* Right: price */}
                  <div className="flex flex-col items-end leading-tight">
                    <span className="text-sm font-bold text-base-content">
                      {plan.price}
                    </span>
                    {ACTIVE_SALE.enabled && plan.originalPrice && (
                      <span className="text-xs text-base-content/35 line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                    {ACTIVE_SALE.enabled && plan.saleSavings && (
                      <span className="text-[10px] font-semibold text-success">
                        {plan.saleSavings}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Single CTA */}
          <button
            className="btn btn-primary w-full h-12 text-base mb-5"
            onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
          >
            Start Free — Pick a Plan Later →
          </button>

          {/* Trust line */}
          <p className="text-center text-xs text-base-content/35">
            60 questions free · no credit card to start · one-time charge · no
            auto-renewal
          </p>
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
                    {faq.a === '__PRICING_FAQ__' ? pricingFaqAnswer : faq.a}
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
            ✓ 60 Free Questions — No Credit Card Required
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-primary-content">
            Start the Loop. Pass the Exam.
          </h2>
          <p className="text-primary-content/70 text-lg max-w-md">
            Review key concepts by topic. Practice questions in that topic.
            Repeat × 7. It's the most direct path — and it starts free.
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
                60 questions free · then from {PLANS[0].price} · no auto-renewal
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
              Start with 60 free questions
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
