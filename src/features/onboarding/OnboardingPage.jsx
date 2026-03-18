// src/features/onboarding/OnboardingPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { ClipboardCheck, BookOpen, BarChart2, Trophy } from 'lucide-react'
import ROUTES from '@/shared/constants/routes'

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <ClipboardCheck className="w-7 h-7" />,
    stat: '1,300+',
    title: 'Practice Questions',
    desc: 'Exam-style questions covering every topic tested by the California DRE — from contracts to fair housing.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    stat: '134',
    title: 'Key Concepts',
    desc: 'Bite-sized cards with plain-English explanations. Ask the AI to go deeper on any concept.',
    color: 'text-secondary',
    bg: 'bg-secondary/10'
  },
  {
    icon: <BarChart2 className="w-7 h-7" />,
    stat: '3 Pillars',
    title: 'Progress Tracking',
    desc: 'Volume, accuracy, and topic coverage combine into one live Exam Readiness score with specific next steps.',
    color: 'text-accent',
    bg: 'bg-accent/10'
  }
]

const SUCCESS_MILESTONES = [
  {
    value: '300+',
    label: 'Questions Practiced',
    sub: 'Volume builds pattern recognition — the more you see, the less the exam surprises you.',
    progress: 100,
    color: 'progress-primary'
  },
  {
    value: '75%+',
    label: 'Overall Accuracy',
    sub: 'Consistency matters more than perfection. Aim to stay above 75% across all topics.',
    progress: 75,
    color: 'progress-secondary'
  },
  {
    value: '80%',
    label: 'Key Concepts Understood',
    sub: "That's at least 107 of the 134 concepts. The exam tests comprehension, not memorization.",
    progress: 80,
    color: 'progress-accent'
  }
]

const STEPS = ['Welcome', 'Your Tools', 'Path to Pass']
const STORAGE_KEY = 'onboarding_step'

// ── Animated step wrapper ────────────────────────────────────────────────────
// Re-keying on `step` unmounts/remounts the div, retriggering the animation
const StepPanel = ({ children, step }) => (
  <div key={step} style={{ animation: 'stepIn 0.25s ease forwards' }}>
    {children}
  </div>
)

// ── Component ─────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  const isLast = step === STEPS.length - 1

  // ── Restore saved step + fade-in on mount ──
  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10)
      if (!isNaN(saved) && saved > 0 && saved < STEPS.length) {
        setStep(saved)
      }
    } catch (_) {}
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // ── Persist current step ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(step))
    } catch (_) {}
  }, [step])

  // ── Navigation handlers ──
  const handleNext = useCallback(() => {
    if (isLast) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (_) {}
      router.push(ROUTES.LEARNING.PROGRESS)
    } else {
      setStep((s) => s + 1)
    }
  }, [isLast, router])

  const handleBack = useCallback(() => {
    setStep((s) => s - 1)
  }, [])

  // Skip goes to Progress too — not HOME
  const handleSkip = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (_) {}
    router.push(ROUTES.LEARNING.PROGRESS)
  }, [router])

  // ── Keyboard navigation ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft' && step > 0) handleBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handleBack, step])

  return (
    <>
      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        data-theme="light"
        className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease'
        }}
      >
        {/* ── Stepper ── */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-xs font-semibold transition-all
                  ${
                    i === step
                      ? 'text-primary'
                      : i < step
                        ? 'text-base-content/50 cursor-pointer hover:text-base-content/70'
                        : 'text-base-content/25 cursor-default'
                  }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-200
                  ${
                    i === step
                      ? 'border-primary bg-primary text-primary-content'
                      : i < step
                        ? 'border-base-content/30 bg-base-content/10 text-base-content/50'
                        : 'border-base-content/20 text-base-content/25'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  className={`w-8 h-px transition-all duration-300
                  ${i < step ? 'bg-base-content/30' : 'bg-base-content/15'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="card bg-base-100 shadow-xl w-full max-w-2xl">
          <div className="card-body p-8 sm:p-10">
            {/* STEP 0 — Welcome */}
            {step === 0 && (
              <StepPanel step={0}>
                <div className="flex flex-col items-center text-center gap-5">
                  <div className="badge badge-primary badge-outline text-xs tracking-widest uppercase font-mono">
                    CA Real Estate Salesperson Exam Prep
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-base-content leading-tight">
                    Welcome — let&apos;s get
                    <br className="hidden sm:block" /> you ready to pass.
                  </h1>
                  <p className="text-base-content/60 text-base max-w-md leading-relaxed">
                    Everything you need to pass the California real estate
                    salesperson exam — organized, trackable, and built around
                    how the test actually works.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-1">
                    {[
                      '1,300+ Questions',
                      '134 Key Concepts',
                      'Progress Tracking'
                    ].map((f) => (
                      <span
                        key={f}
                        className="badge badge-ghost text-sm py-3 px-4"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </StepPanel>
            )}

            {/* STEP 1 — Your Tools */}
            {step === 1 && (
              <StepPanel step={1}>
                <div className="flex flex-col gap-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
                      Your study toolkit
                    </h2>
                    <p className="text-base-content/55 text-sm">
                      Three tools, each doing a specific job.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {FEATURES.map(({ icon, stat, title, desc, color, bg }) => (
                      <div
                        key={title}
                        className="flex gap-4 items-start p-4 rounded-2xl bg-base-200"
                      >
                        <div
                          className={`${bg} ${color} p-3 rounded-xl shrink-0`}
                        >
                          {icon}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className={`text-xl font-extrabold ${color}`}>
                              {stat}
                            </span>
                            <span className="font-semibold text-base-content text-sm">
                              {title}
                            </span>
                          </div>
                          <p className="text-base-content/60 text-sm leading-relaxed">
                            {desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </StepPanel>
            )}

            {/* STEP 2 — Path to Pass */}
            {step === 2 && (
              <StepPanel step={2}>
                <div className="flex flex-col gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-warning mb-3">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-wider">
                        Success Pattern
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
                      What passing students have in common
                    </h2>
                    <p className="text-base-content/55 text-sm max-w-sm mx-auto">
                      Users who passed the real exam shared a clear pattern.
                      Here&apos;s what to aim for.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    {SUCCESS_MILESTONES.map(
                      ({ value, label, sub, progress, color }) => (
                        <div key={label} className="flex flex-col gap-2">
                          <div className="flex justify-between items-end">
                            <div>
                              <span className="font-extrabold text-lg text-base-content">
                                {value}
                              </span>
                              <span className="ml-2 font-semibold text-sm text-base-content/70">
                                {label}
                              </span>
                            </div>
                            <span className="text-xs text-base-content/40 font-mono">
                              {progress}%
                            </span>
                          </div>
                          <progress
                            className={`progress ${color} w-full h-2.5`}
                            value={progress}
                            max="100"
                          />
                          <p className="text-xs text-base-content/50 leading-relaxed">
                            {sub}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <p className="text-xs text-center text-base-content/40 mt-1">
                    Your Progress page tracks all three automatically as you
                    study.
                  </p>
                </div>
              </StepPanel>
            )}

            {/* ── Navigation ── */}
            <div className="card-actions justify-between items-center mt-8 pt-6 border-t border-base-200">
              <button
                className="btn btn-ghost btn-sm text-base-content/40"
                onClick={handleSkip}
              >
                Skip for now
              </button>
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={handleBack}>
                    ← Back
                  </button>
                )}
                <button className="btn btn-primary" onClick={handleNext}>
                  {isLast ? 'Start Studying →' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step dots ── */}
        <div className="flex gap-2 mt-6">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300
                ${i === step ? 'bg-primary w-5' : 'bg-base-content/20 w-2'}`}
            />
          ))}
        </div>

        {/* ── Keyboard hint ── */}
        <p className="text-xs text-base-content/25 mt-4 hidden sm:block">
          Press <kbd className="kbd kbd-xs">→</kbd> to advance
          {' · '}
          <kbd className="kbd kbd-xs">←</kbd> to go back
        </p>
      </div>
    </>
  )
}
