// src/features/onboarding/OnboardingPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Target,
  Zap,
  Layers,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Trophy,
  CircleCheck,
  Gauge,
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import ROUTES from '@/shared/constants/routes'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  accuracy: '#4f46e5',
  volume: '#ec4899',
  topics: '#14b8a6',
  concepts: '#f59e0b'
}

const PILLARS = [
  {
    key: 'accuracy',
    icon: Target,
    weight: 45,
    label: 'Accuracy',
    target: '82%+ correct',
    why: 'Answering correctly is the single biggest predictor of passing.',
    color: C.accuracy,
    textCls: 'text-indigo-600',
    bgCls: 'bg-indigo-50',
    ringCls: 'ring-indigo-100'
  },
  {
    key: 'volume',
    icon: Zap,
    weight: 25,
    label: 'Volume',
    target: '300 questions',
    why: 'Reps build pattern recognition — the more you see, the less surprises you.',
    color: C.volume,
    textCls: 'text-pink-600',
    bgCls: 'bg-pink-50',
    ringCls: 'ring-pink-100'
  },
  {
    key: 'topics',
    icon: Layers,
    weight: 15,
    label: 'Topic Coverage',
    target: '25+ Qs per topic',
    why: 'The exam pulls from all 7 subject areas. No blind spots allowed.',
    color: C.topics,
    textCls: 'text-teal-600',
    bgCls: 'bg-teal-50',
    ringCls: 'ring-teal-100'
  },
  {
    key: 'concepts',
    icon: Lightbulb,
    weight: 15,
    label: 'Key Concepts',
    target: '107 of 134 concepts',
    why: 'The exam tests comprehension. Read to understand, not memorize.',
    color: C.concepts,
    textCls: 'text-amber-600',
    bgCls: 'bg-amber-50',
    ringCls: 'ring-amber-100'
  }
]

const RING_GRADIENT = `conic-gradient(
  ${C.accuracy} 0% 45%,
  ${C.volume}   45% 70%,
  ${C.topics}   70% 85%,
  ${C.concepts} 85% 100%
)`

const STEPS = ['Score', 'Pillars', 'Targets', 'Ready']
const STORAGE_KEY = 'onboarding_step'

// ── Ring visualization ────────────────────────────────────────────────────────
const RingDisplay = ({ size = 148 }) => (
  <div className="relative mx-auto" style={{ width: size, height: size }}>
    <div
      className="absolute inset-0 rounded-full"
      style={{ background: RING_GRADIENT }}
    />
    <div className="absolute inset-[14px] rounded-full bg-base-100 flex flex-col items-center justify-center gap-0.5 shadow-inner">
      <Gauge className="w-5 h-5 text-base-content/30 mb-0.5" strokeWidth={2} />
      <span
        className="text-3xl font-black leading-none tracking-tight"
        style={{ color: C.accuracy }}
      >
        80+
      </span>
      <span className="text-[9px] font-bold text-base-content/35 tracking-[0.18em] uppercase">
        target
      </span>
    </div>
  </div>
)

// ── Score meter — step 3 sidebar only ────────────────────────────────────────
// Replaces the ring on the final step so it doesn't compete with the trophy
// hero on the right panel. Reinforces the North Star by showing where the
// user starts (0) and what they're aiming for (80+).
const ScoreMeter = () => (
  <div className="w-full flex flex-col items-center gap-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold text-base-content/35 uppercase tracking-widest">
        Your score starts at
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-5xl font-black leading-none"
          style={{ color: C.accuracy }}
        >
          0
        </span>
        <span className="text-xl font-bold text-base-content/20">/ 100</span>
      </div>
    </div>

    <div className="w-full relative pb-6">
      <div className="h-2.5 bg-base-300 rounded-full overflow-hidden">
        <div
          className="h-full w-0 rounded-full"
          style={{ background: C.accuracy }}
        />
      </div>
      {/* Target marker at 80% */}
      <div
        className="absolute top-0 bottom-6 w-px bg-base-content/30"
        style={{ left: '80%' }}
      />
      <div
        className="absolute bottom-0 text-[9px] font-extrabold uppercase tracking-wider"
        style={{
          left: '80%',
          transform: 'translateX(-50%)',
          color: C.accuracy
        }}
      >
        80+ = pass
      </div>
    </div>

    <div className="flex items-start gap-2 bg-base-200 rounded-xl p-3 w-full">
      <TrendingUp
        className="w-3.5 h-3.5 shrink-0 mt-0.5"
        style={{ color: C.accuracy }}
        strokeWidth={2.5}
      />
      <p className="text-[11px] text-base-content/50 leading-relaxed">
        Every session moves this score. Your Progress page tracks it live.
      </p>
    </div>
  </div>
)

// ── Step panel ────────────────────────────────────────────────────────────────
const StepPanel = ({ children, id }) => (
  <div key={id} className="ob-panel">
    {children}
  </div>
)

// ── Weight bar ────────────────────────────────────────────────────────────────
function WeightBar({ activeKey = null }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex h-2 w-full gap-[3px] rounded-full overflow-hidden">
        {PILLARS.map(({ key, weight, color }) => (
          <div
            key={key}
            style={{
              width: `${weight}%`,
              background: color,
              opacity: activeKey && activeKey !== key ? 0.25 : 1,
              transition: 'opacity 0.2s',
              borderRadius: 99
            }}
          />
        ))}
      </div>
      <div className="flex w-full">
        {PILLARS.map(({ key, weight, textCls }) => (
          <div
            key={key}
            style={{ width: `${weight}%` }}
            className="flex justify-center"
          >
            <span
              className={`text-[10px] font-extrabold leading-none ${
                activeKey && activeKey !== key
                  ? 'text-base-content/25'
                  : textCls
              }`}
            >
              {weight}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [hoveredKey, setHovered] = useState(null)
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
        .pillar-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .pillar-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -6px rgba(0,0,0,0.10); }
      `}</style>

      <div
        data-theme="light"
        className={`ob-wrap min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-10 ${visible ? 'visible' : ''}`}
      >
        {/* Progress segments — mobile & tablet (md:hidden).
            Three breakpoints for the card:
            - default (<640px):  348px, single-column
            - sm (640–767px):    520px, single-column, more breathing room
            - md (768px+):       700px, two-column sidebar layout             */}
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
                FIX: bg-primary/5 replaces the hardcoded from-indigo-50 gradient.
                     DaisyUI's "primary" token adapts to any theme, dark mode safe.

                Steps 0–2 → ring + weight bar (weight bar reacts to step 1 hover).
                Step  3   → ScoreMeter, no ring, so there's a single hero visual
                            per panel (trophy on right, meter on left).
            ════════════════════════════════════════════════════════════════════ */}
            <div className="hidden md:flex flex-col items-center justify-between p-7 w-60 shrink-0 border-r border-base-200 bg-primary/5">
              <div className="flex flex-col items-center gap-5 w-full">
                <span className="text-lg font-bold">
                  <span className="text-primary">Agent</span> Smartly
                </span>

                {step < 3 ? (
                  <>
                    <RingDisplay size={132} />
                    <WeightBar activeKey={hoveredKey} />
                    <p className="text-xs text-base-content/40 text-center leading-relaxed">
                      One score. Four inputs.
                      <br />
                      Your North Star to passing.
                    </p>
                  </>
                ) : (
                  <ScoreMeter />
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

              {/* ════ STEP 0 ════════════════════════════════════════════════ */}
              {step === 0 && (
                <StepPanel id="s0">
                  <div className="flex flex-col gap-5">
                    {/* Ring + weight bar: mobile & tablet only */}
                    <div className="md:hidden flex flex-col items-center gap-5">
                      <RingDisplay size={148} />
                      <WeightBar />
                    </div>

                    <div className="flex flex-col gap-3 text-center md:text-left">
                      <span className="badge badge-ghost text-[10px] font-bold tracking-widest uppercase mx-auto md:mx-0 w-fit">
                        CA Real Estate Exam Prep
                      </span>
                      <h1 className="text-[1.6rem] md:text-[1.8rem] font-extrabold text-base-content leading-snug tracking-tight">
                        One number tells you
                        <br />
                        if you're ready to pass.
                      </h1>
                      <p className="text-sm text-base-content/55 leading-relaxed">
                        Your{' '}
                        <strong className="text-base-content/80">
                          Exam Readiness Score
                        </strong>{' '}
                        (0–100) is your North Star. It combines four weighted
                        signals into a single live metric that tells you exactly
                        where you stand — and what to fix.
                      </p>
                    </div>

                    {/* Desktop only: pillar chips balance the right panel vs sidebar ring */}
                    <div className="hidden md:flex flex-col gap-2">
                      <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">
                        Built from 4 pillars
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {PILLARS.map(
                          ({ key, label, color, weight, icon: Icon }) => (
                            <div
                              key={key}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                              style={{ background: color + '18', color }}
                            >
                              <Icon className="w-3 h-3" strokeWidth={2.5} />
                              {label}
                              <span style={{ opacity: 0.55 }}>· {weight}%</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ════ STEP 1 ════════════════════════════════════════════════ */}
              {step === 1 && (
                <StepPanel id="s1">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-base-content leading-snug tracking-tight">
                        4 pillars drive
                        <br />
                        your score.
                      </h2>
                      <p className="text-xs text-base-content/45 mt-1 font-medium">
                        Bigger weight = bigger impact. Hover to highlight.
                      </p>
                    </div>

                    {/* Weight bar mobile/tablet only — desktop: sidebar reacts via shared hoveredKey */}
                    <div className="md:hidden">
                      <WeightBar activeKey={hoveredKey} />
                    </div>

                    <div className="flex flex-col gap-2">
                      {PILLARS.map(
                        ({
                          key,
                          icon: Icon,
                          weight,
                          label,
                          why,
                          color,
                          textCls,
                          bgCls,
                          ringCls
                        }) => (
                          <div
                            key={key}
                            className={`pillar-card flex items-center gap-3 p-3.5 rounded-2xl ring-1 ${bgCls} ${ringCls} cursor-default`}
                            onMouseEnter={() => setHovered(key)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${textCls}`}
                              style={{ background: color + '22' }}
                            >
                              <Icon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-sm font-bold ${textCls}`}
                                >
                                  {label}
                                </span>
                                <span
                                  className="text-[10px] font-extrabold text-white px-1.5 py-0.5 rounded-full leading-none shrink-0"
                                  style={{ background: color }}
                                >
                                  {weight}%
                                </span>
                              </div>
                              <div className="h-1 rounded-full bg-white/80 mb-1.5">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${weight}%`,
                                    background: color,
                                    opacity: hoveredKey === key ? 1 : 0.7
                                  }}
                                />
                              </div>
                              <p className="text-xs text-base-content/55 leading-snug">
                                {why}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ════ STEP 2 ════════════════════════════════════════════════ */}
              {step === 2 && (
                <StepPanel id="s2">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Trophy
                          className="w-4 h-4 text-amber-500"
                          strokeWidth={2.5}
                        />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                          What passing looks like
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-base-content leading-snug tracking-tight">
                        Hit these numbers,
                        <br />
                        pass the exam.
                      </h2>
                    </div>

                    <div className="flex flex-col gap-2">
                      {PILLARS.map(
                        ({
                          key,
                          icon: Icon,
                          label,
                          target,
                          weight,
                          color,
                          textCls,
                          bgCls,
                          ringCls
                        }) => (
                          <div
                            key={key}
                            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl ring-1 ${bgCls} ${ringCls}`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${textCls}`}
                              style={{ background: color + '22' }}
                            >
                              <Icon className="w-4 h-4" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-base-content/40 leading-none mb-0.5">
                                {label}
                              </p>
                              <p
                                className={`text-sm font-extrabold ${textCls} leading-tight`}
                              >
                                {target}
                              </p>
                            </div>
                            <div
                              className="text-[11px] font-bold px-2 py-1 rounded-full text-white shrink-0"
                              style={{ background: color }}
                            >
                              {weight}%
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex items-start gap-2.5 bg-indigo-50 ring-1 ring-indigo-100 rounded-2xl p-3.5">
                      <CircleCheck
                        className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <p className="text-xs text-indigo-700 leading-relaxed">
                        Your <strong>Progress page</strong> tracks all four
                        automatically — you'll always know exactly what to work
                        on next.
                      </p>
                    </div>
                  </div>
                </StepPanel>
              )}

              {/* ════ STEP 3 ════════════════════════════════════════════════ */}
              {step === 3 && (
                <StepPanel id="s3">
                  <div className="flex flex-col items-center text-center gap-5">
                    {/* Trophy is the sole hero — no ring competing on desktop
                        because the sidebar shows ScoreMeter instead */}
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mt-1 shadow-lg shadow-indigo-100"
                      style={{
                        background: `linear-gradient(135deg, ${C.accuracy}22, ${C.accuracy}44)`
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
                      <p className="text-sm text-base-content/50 mt-1.5 max-w-[220px] mx-auto leading-relaxed">
                        Your Progress page shows your live score and exactly
                        what to study next.
                      </p>
                    </div>

                    <div className="w-full flex flex-col gap-1.5">
                      {[
                        {
                          color: C.accuracy,
                          Icon: Target,
                          text: '82%+ correct',
                          label: 'Accuracy',
                          pct: '45%'
                        },
                        {
                          color: C.volume,
                          Icon: Zap,
                          text: '300 questions practiced',
                          label: 'Volume',
                          pct: '25%'
                        },
                        {
                          color: C.topics,
                          Icon: Layers,
                          text: '25+ Qs per topic',
                          label: 'Topic Coverage',
                          pct: '15%'
                        },
                        {
                          color: C.concepts,
                          Icon: Lightbulb,
                          text: '107+ key concepts read',
                          label: 'Key Concepts',
                          pct: '15%'
                        }
                      ].map(({ color, Icon, text, label, pct }) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left"
                          style={{
                            background: color + '10',
                            borderLeft: `3px solid ${color}`
                          }}
                        >
                          <Icon
                            className="w-4 h-4 shrink-0"
                            style={{ color }}
                            strokeWidth={2}
                          />
                          <span className="flex-1 text-xs font-semibold text-base-content/70 leading-snug">
                            {text}
                          </span>
                          <span
                            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-white shrink-0"
                            style={{ background: color }}
                          >
                            {pct}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-base-content/30 font-medium -mt-1">
                      Score updates live every time you study.
                    </p>
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
                      background: C.accuracy,
                      borderColor: C.accuracy,
                      boxShadow: `0 4px 14px -2px ${C.accuracy}55`
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
