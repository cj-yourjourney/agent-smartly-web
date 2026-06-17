// src/features/onboarding/OnboardingPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  Gauge,
  ArrowRight,
  BookOpen,
  ListChecks,
  Repeat,
  Sparkles
} from 'lucide-react'
import ROUTES from '@/shared/constants/routes'

// ── Design tokens ─────────────────────────────────────────────────────────────
// hero-image.png uses a single indigo line-art color throughout, not the
// multi-color pillar palette from the old design — match that here.
const C = {
  primary: '#4f46e5'
}

// 4 slides, mirroring the hero diagram 1-2-3 + the repeat loop as the close
const STEPS = ['Review', 'Practice', 'Progress', 'Ready']
const STORAGE_KEY = 'onboarding_step'

// ── Step panel ────────────────────────────────────────────────────────────────
const StepPanel = ({ children, id }) => (
  <div key={id} className="ob-panel">
    {children}
  </div>
)

// ── Hero icon badge — the big circle-in-circle visual from hero-image.png ─────
// Same shape language on all three method slides: outer soft-tint circle,
// number badge top-left, lucide icon centered. Only the color/icon/number change.
const HeroBadge = ({ Icon, color, number, size = 132 }) => (
  <div className="relative mx-auto" style={{ width: size, height: size }}>
    <div
      className="absolute inset-0 rounded-full flex items-center justify-center"
      style={{ background: color + '14' }}
    >
      <Icon className="w-1/2 h-1/2" style={{ color }} strokeWidth={1.6} />
    </div>
    <div
      className="absolute -top-1 -left-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold shadow-md"
      style={{ background: color }}
    >
      {number}
    </div>
  </div>
)

// ── 1-7 repeat ribbon — small supporting detail on the final slide ────────────
const RepeatRibbon = () => (
  <div className="w-full flex flex-col items-center gap-2.5">
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <div key={n} className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border ${
              n === 1
                ? 'text-white border-transparent'
                : 'text-indigo-400 border-indigo-200'
            }`}
            style={n === 1 ? { background: C.primary } : undefined}
          >
            {n}
          </div>
          {n < 7 && (
            <div className="w-2 border-t border-dashed border-indigo-200 mx-0.5" />
          )}
        </div>
      ))}
    </div>
    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
      <Repeat className="w-3 h-3" strokeWidth={2.5} />
      Repeat for all 7 topics
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const isLast = step === STEPS.length - 1

  useEffect(() => {
    try {
      const s = parseInt(localStorage.getItem(STORAGE_KEY), 10)
      if (!isNaN(s) && s > 0 && s < STEPS.length) setStep(s)
    } catch (_) {}
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(step))
    } catch (_) {}
  }, [step])

  const goNext = useCallback(() => {
    if (isLast) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (_) {}
      router.push(ROUTES.LEARNING.PROGRESS)
    } else {
      setStep((s) => s + 1)
    }
  }, [isLast, router])

  const goBack = useCallback(() => setStep((s) => s - 1), [])

  const goSkip = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (_) {}
    router.push(ROUTES.LEARNING.PROGRESS)
  }, [router])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext()
      if (e.key === 'ArrowLeft' && step > 0) goBack()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goBack, step])

  const StepDots = () => (
    <div className="flex gap-2">
      {STEPS.map((_, i) => (
        <button
          key={i}
          onClick={() => i < step && setStep(i)}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === step
              ? 'w-6 bg-indigo-600'
              : i < step
                ? 'w-2 bg-indigo-300 cursor-pointer hover:bg-indigo-400'
                : 'w-2 bg-base-content/15 cursor-default'
          }`}
        />
      ))}
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes ob-in {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .ob-panel { animation: ob-in 0.35s cubic-bezier(0.22, 0.68, 0, 1.1) forwards; }
        .ob-wrap {
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .ob-wrap.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <div
        data-theme="light"
        className={`ob-wrap min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-10 ${visible ? 'visible' : ''}`}
      >
        {/* Progress segments — mobile & tablet (md:hidden). */}
        <div className="flex gap-1.5 mb-6 w-full max-w-[320px] md:hidden">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => i < step && setStep(i)}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                i === step
                  ? 'bg-indigo-600'
                  : i < step
                    ? 'bg-indigo-300 cursor-pointer hover:bg-indigo-400'
                    : 'bg-base-300 cursor-default'
              }`}
            />
          ))}
        </div>

        {/* ── Card ── */}
        <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-[348px] sm:max-w-[520px] md:max-w-[700px] overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* ══ SIDEBAR — md+ only ═══════════════════════════════════════════
                Slides 0-2 (Review/Practice/Progress) → HeroBadge, same shape
                                                          language as hero-image.png.
                Slide 3 (Ready)                        → trophy hero.
            ════════════════════════════════════════════════════════════════════ */}
            <div className="hidden md:flex flex-col items-center justify-between p-7 w-60 shrink-0 border-r border-base-200 bg-primary/5">
              <div className="flex flex-col items-center gap-5 w-full">
                <span className="text-lg font-bold">
                  <span className="text-primary">Agent</span> Smartly
                </span>

                {step === 0 && (
                  <HeroBadge Icon={BookOpen} color={C.primary} number={1} />
                )}
                {step === 1 && (
                  <HeroBadge Icon={ListChecks} color={C.primary} number={2} />
                )}
                {step === 2 && (
                  <HeroBadge Icon={Gauge} color={C.primary} number={3} />
                )}
                {step === 3 && (
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center mt-2 shadow-lg shadow-indigo-100"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}22, ${C.primary}44)`
                    }}
                  >
                    <Trophy
                      className="w-8 h-8 text-indigo-600"
                      strokeWidth={1.75}
                    />
                  </div>
                )}

                <div className="badge badge-ghost text-[10px] font-bold tracking-widest uppercase">
                  {STEPS[step]} · {step + 1} of {STEPS.length}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 mt-6">
                <StepDots />
                <p className="text-xs text-base-content/25 select-none">
                  <kbd className="kbd kbd-xs">→</kbd> next &nbsp;·&nbsp;{' '}
                  <kbd className="kbd kbd-xs">←</kbd> back
                </p>
              </div>
            </div>

            {/* ══ MAIN CONTENT ════════════════════════════════════════════════ */}
            <div className="flex-1 card-body px-6 py-7 sm:px-8 sm:py-8 md:px-7 md:py-7 gap-0 min-w-0">
              <div className="md:hidden text-center mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-primary">Agent</span> Smartly
                </span>
              </div>

              {/* ════ SLIDE 0 — REVIEW KEY CONCEPTS ═══════════════════════════ */}
              {step === 0 && (
                <StepPanel id="s0-review">
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="md:hidden">
                      <HeroBadge
                        Icon={BookOpen}
                        color={C.primary}
                        number={1}
                        size={120}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="badge badge-ghost text-[10px] font-bold tracking-widest uppercase mx-auto w-fit">
                        Step 1
                      </span>
                      <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-base-content leading-snug tracking-tight">
                        Review Key Concepts
                      </h1>
                      <p className="text-sm text-base-content/55 leading-relaxed max-w-[320px] mx-auto">
                        Learn the essential terms and rules for one topic at a
                        time — the real concepts the DRE actually tests.
                      </p>
                    </div>

                    <div
                      className="text-sm font-bold text-white px-4 py-2 rounded-full"
                      style={{ background: C.primary }}
                    >
                      Laws of Agency
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ════ SLIDE 1 — PRACTICE QUESTIONS ═════════════════════════════ */}
              {step === 1 && (
                <StepPanel id="s1-practice">
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="md:hidden">
                      <HeroBadge
                        Icon={ListChecks}
                        color={C.primary}
                        number={2}
                        size={120}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="badge badge-ghost text-[10px] font-bold tracking-widest uppercase mx-auto w-fit">
                        Step 2
                      </span>
                      <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-base-content leading-snug tracking-tight">
                        Practice Questions
                      </h1>
                      <p className="text-sm text-base-content/55 leading-relaxed max-w-[320px] mx-auto">
                        Drill questions on that same topic right after you learn
                        it — with explanations for every answer.
                      </p>
                    </div>

                    <div
                      className="text-sm font-bold text-white px-4 py-2 rounded-full"
                      style={{ background: C.primary }}
                    >
                      Same Topic
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ════ SLIDE 2 — CHECK YOUR PROGRESS ═══════════════════════════ */}
              {step === 2 && (
                <StepPanel id="s2-progress">
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="md:hidden">
                      <HeroBadge
                        Icon={Gauge}
                        color={C.primary}
                        number={3}
                        size={120}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="badge badge-ghost text-[10px] font-bold tracking-widest uppercase mx-auto w-fit">
                        Step 3
                      </span>
                      <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-base-content leading-snug tracking-tight">
                        Check Your Progress
                      </h1>
                      <p className="text-sm text-base-content/55 leading-relaxed max-w-[320px] mx-auto">
                        See exactly where you stand with a live score that tells
                        you when you're ready to sit the exam.
                      </p>
                    </div>

                    <div
                      className="text-sm font-bold text-white px-4 py-2 rounded-full"
                      style={{ background: C.primary }}
                    >
                      Exam Readiness Score
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ════ SLIDE 3 — READY / CTA ════════════════════════════════════ */}
              {step === 3 && (
                <StepPanel id="s3-ready">
                  <div className="flex flex-col items-center text-center gap-5">
                    {/* Trophy is the hero visual on this slide */}
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mt-1 shadow-lg shadow-indigo-100"
                      style={{
                        background: `linear-gradient(135deg, ${C.primary}22, ${C.primary}44)`
                      }}
                    >
                      <Trophy
                        className="w-10 h-10 text-indigo-600"
                        strokeWidth={1.75}
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-extrabold text-base-content tracking-tight">
                        You're all set! 🎉
                      </h2>
                      <p className="text-sm text-base-content/50 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                        Review, practice, check your score — then move to the
                        next topic.
                      </p>
                    </div>

                    {/* Small supporting detail, not the hero — per the loop in
                        the diagram, just a quiet reminder of the full cycle */}
                    <RepeatRibbon />

                    <div className="flex items-center gap-2 bg-indigo-50 ring-1 ring-indigo-100 rounded-2xl px-4 py-3 w-full justify-center">
                      <Sparkles
                        className="w-4 h-4 text-indigo-500 shrink-0"
                        strokeWidth={2.5}
                      />
                      <p className="text-xs text-indigo-700 font-semibold leading-relaxed">
                        500+ students have used this exact method to pass.
                      </p>
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-base-200">
                <button
                  className="btn btn-ghost btn-sm text-base-content/30 hover:text-base-content/55 px-2 font-medium"
                  onClick={goSkip}
                >
                  Skip
                </button>
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <button
                      className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-base-content"
                      onClick={goBack}
                    >
                      <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  )}
                  <button
                    className="btn btn-sm text-white gap-1.5 px-5 font-bold shadow-md transition-all active:scale-95"
                    style={{
                      background: C.primary,
                      borderColor: C.primary,
                      boxShadow: `0 4px 14px -2px ${C.primary}55`
                    }}
                    onClick={goNext}
                  >
                    {isLast ? (
                      <>
                        Let&apos;s Study{' '}
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </>
                    ) : (
                      <>
                        Next{' '}
                        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet step dots + keyboard hint */}
        <div className="flex gap-2 mt-5 md:hidden">
          <StepDots />
        </div>
        <p className="text-xs text-base-content/25 mt-3 hidden sm:block md:hidden select-none">
          <kbd className="kbd kbd-xs">→</kbd> next &nbsp;·&nbsp;{' '}
          <kbd className="kbd kbd-xs">←</kbd> back
        </p>
      </div>
    </>
  )
}
