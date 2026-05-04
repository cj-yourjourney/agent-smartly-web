// src/features/auth/SignUpPage.jsx
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Mail,
  AtSign,
  GraduationCap,
  XCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import {
  registerUser,
  clearError,
  clearRegisterSuccess
} from './state/authSlice'
import ROUTES from '@/shared/constants/routes'

// ─── Constants ────────────────────────────────────────────────────────────────

const HEARD_ABOUT_OPTIONS = [
  { value: 'youtube', label: '▶ YouTube' },
  { value: 'google', label: '🔍 Google' },
  { value: 'reddit', label: '🤖 Reddit' },
  { value: 'tiktok', label: '🎵 TikTok' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'facebook', label: '👥 Facebook' },
  { value: 'referral', label: '🤝 A Friend' },
  { value: 'other', label: '✏️ Other' }
]

const EXAM_STATUS_OPTIONS = [
  { value: 'still_learning', label: '📚 Still in pre-licensing' },
  { value: 'just_finished', label: '🎓 Just finished pre-licensing' },
  { value: 'scheduled_no_date', label: '📅 Planning to schedule soon' },
  { value: 'retaker', label: '🔄 Retaker' }
]

// ─── Password strength helper ──────────────────────────────────────────────────

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score, label: 'Weak', color: 'bg-error' }
  if (score <= 3) return { score, label: 'Fair', color: 'bg-warning' }
  if (score === 4) return { score, label: 'Good', color: 'bg-info' }
  return { score, label: 'Strong', color: 'bg-success' }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Input wrapper with visible label and inline error
const FloatingInput = ({ label, error, children }) => (
  <div className="form-control w-full">
    <label className="label pb-1 pt-0">
      <span className="label-text font-medium text-base-content/80 text-sm">
        {label}
      </span>
    </label>
    {children}
    {error && (
      <label className="label pt-1 pb-0">
        <span className="label-text-alt text-error flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </span>
      </label>
    )}
  </div>
)

// Pill button — large touch target, clear selected state
const PillButton = ({ label, selected, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      min-h-[3rem] px-3 py-2.5 rounded-xl border text-sm font-medium
      transition-all duration-150 text-left active:scale-[0.97]
      ${
        selected
          ? 'bg-primary text-primary-content border-primary shadow-md ring-2 ring-primary/30'
          : 'bg-base-100 text-base-content/70 border-base-300 hover:border-primary/40 hover:bg-base-200'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {label}
  </button>
)

// Step progress — numbered circles with animated connecting line
const StepIndicator = ({ step }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {['Account Details', 'About You'].map((name, i) => {
        const n = i + 1
        const isActive = n === step
        const isComplete = n < step
        return (
          <div key={n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                transition-all duration-300 shrink-0
                ${
                  isComplete
                    ? 'bg-primary text-primary-content'
                    : isActive
                      ? 'bg-primary text-primary-content ring-4 ring-primary/20'
                      : 'bg-base-300 text-base-content/40'
                }
              `}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${isActive ? 'text-base-content' : 'text-base-content/40'}`}
              >
                {name}
              </span>
            </div>
            {i < 1 && (
              <div className="flex-1 mx-3 h-0.5 bg-base-300 relative w-16 sm:w-24">
                <div
                  className={`absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ${step > 1 ? 'w-full' : 'w-0'}`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  </div>
)

// ─── Page shell shared between success + form ─────────────────────────────────
// Keeps the full-screen mobile / centered-card desktop treatment consistent

const PageShell = ({ children }) => (
  <div className="min-h-screen bg-base-200 flex flex-col">
    <div className="flex-1 flex flex-col sm:items-center sm:justify-center sm:p-4">
      <div
        className="
        bg-base-100 flex-1 flex flex-col
        sm:flex-none sm:w-full sm:max-w-md sm:rounded-2xl sm:shadow-xl
      "
      >
        {children}
      </div>
    </div>
  </div>
)

// ─── Email sent success screen ────────────────────────────────────────────────

const VerifyEmailPrompt = ({ email, onBackToLogin }) => (
  <PageShell>
    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Mail
                className="h-10 w-10 text-primary-content"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-success rounded-full flex items-center justify-center shadow border-2 border-base-100">
              <Check
                className="h-3.5 w-3.5 text-success-content"
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-base-content mb-1">
          Check your inbox!
        </h2>
        <p className="text-base-content/60 text-sm mb-4">
          We sent a verification link to
        </p>

        <div className="inline-flex items-center gap-2 bg-base-200 rounded-full px-4 py-2 mb-6">
          <AtSign className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold text-base-content text-sm break-all">
            {email}
          </span>
        </div>

        <div className="bg-base-200 rounded-2xl p-4 text-left mb-5 space-y-3">
          {[
            'Open the email from AgentSmartly',
            'Click "Verify My Email"',
            "You'll be logged in automatically"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-base-content/80">{text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-base-content/40">
          Link expires in 24 hours · Didn't get it? Check your spam folder.
        </p>
      </div>
    </div>

    {/* Sticky bottom — safe area aware */}
    <div
      className="px-6 pb-6 pt-3 sm:px-8 sm:pb-8 border-t border-base-200"
      style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="divider text-xs text-base-content/30 mt-0 mb-3">
        WRONG EMAIL?
      </div>
      <button
        onClick={onBackToLogin}
        className="btn btn-ghost w-full h-12 text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>
    </div>
  </PageShell>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const SignUpPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error, isAuthenticated, registerSuccess } = useSelector(
    (state) => state.auth
  )

  const [step, setStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    heard_about_us: '',
    heard_about_us_other: '',
    exam_date: '',
    exam_status: ''
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  // Ref for scrollable form area — used to scroll to top on step change
  // and to scroll to first error on validation failure
  const scrollAreaRef = useRef(null)
  const errorRefs = useRef({})

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isAuthenticated && !registerSuccess) router.push(ROUTES.ONBOARDING)
  }, [isAuthenticated, registerSuccess, router])

  useEffect(() => {
    return () => {
      dispatch(clearError())
      dispatch(clearRegisterSuccess())
    }
  }, [dispatch])

  // ── Step transition ───────────────────────────────────────────────────────────

  const goToStep = (n) => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(n)
      setIsAnimating(false)
      // Scroll form area back to top on step change
      if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0
    }, 150)
  }

  // ── Scroll to first errored field ─────────────────────────────────────────────

  const scrollToFirstError = (errors) => {
    const firstKey = Object.keys(errors)[0]
    const el = errorRefs.current[firstKey]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.focus?.()
    }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleHeardAboutUs = (value) => {
    setFormData((prev) => ({
      ...prev,
      heard_about_us: value,
      heard_about_us_other: value !== 'other' ? '' : prev.heard_about_us_other
    }))
    if (validationErrors.heard_about_us) {
      setValidationErrors((prev) => ({ ...prev, heard_about_us: null }))
    }
  }

  const handleExamStatus = (value) => {
    setFormData((prev) => ({ ...prev, exam_status: value, exam_date: '' }))
    if (validationErrors.exam_status) {
      setValidationErrors((prev) => ({
        ...prev,
        exam_status: null,
        exam_date: null
      }))
    }
  }

  const handleExamDate = (e) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, exam_date: value, exam_status: '' }))
    if (validationErrors.exam_date) {
      setValidationErrors((prev) => ({
        ...prev,
        exam_date: null,
        exam_status: null
      }))
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const errors = {}
    if (!formData.username) errors.username = 'Username is required'
    else if (formData.username.length < 3)
      errors.username = 'Must be at least 3 characters'
    else if (formData.username.length > 30)
      errors.username = 'Must be 30 characters or fewer'

    if (!formData.email) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email address'

    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 8)
      errors.password = 'Must be at least 8 characters'

    if (!formData.password2) errors.password2 = 'Please confirm your password'
    else if (formData.password !== formData.password2)
      errors.password2 = 'Passwords do not match'

    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) scrollToFirstError(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors = {}
    if (!formData.heard_about_us)
      errors.heard_about_us = 'Please let us know how you found us'
    else if (
      formData.heard_about_us === 'other' &&
      !formData.heard_about_us_other.trim()
    )
      errors.heard_about_us_other = 'Please describe how you heard about us'

    if (!formData.exam_date && !formData.exam_status)
      errors.exam_status = 'Please pick a status or enter your exam date'

    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) scrollToFirstError(errors)
    return Object.keys(errors).length === 0
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (validateStep1()) goToStep(2)
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (!validateStep2()) return

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      heard_about_us: formData.heard_about_us,
      ...(formData.heard_about_us === 'other' && {
        heard_about_us_other: formData.heard_about_us_other.trim()
      }),
      ...(formData.exam_date
        ? { exam_date: formData.exam_date }
        : { exam_status: formData.exam_status })
    }

    try {
      await dispatch(registerUser(payload)).unwrap()
    } catch (err) {
      const step1Fields = ['username', 'email', 'password', 'password2']
      if (step1Fields.some((f) => err?.[f])) goToStep(1)
    }
  }

  // ── Error helpers ─────────────────────────────────────────────────────────────

  const getFieldError = (fieldName) => {
    if (validationErrors[fieldName]) return validationErrors[fieldName]
    if (error && typeof error === 'object' && error[fieldName]) {
      return Array.isArray(error[fieldName])
        ? error[fieldName][0]
        : error[fieldName]
    }
    return null
  }

  const getGeneralError = () => {
    if (error && typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    return null
  }

  const pwStrength = getPasswordStrength(formData.password)

  // Helper to attach both a scroll-target ref and pass through to the element
  const setErrorRef = (name) => (el) => {
    errorRefs.current[name] = el
  }

  // ── Success state ─────────────────────────────────────────────────────────────

  if (registerSuccess) {
    return (
      <VerifyEmailPrompt
        email={formData.email}
        onBackToLogin={() => router.push(ROUTES.AUTH.LOGIN)}
      />
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────────

  return (
    <PageShell>
      {/* ── Header — never scrolls ── */}
      <div className="px-6 pt-10 pb-4 sm:px-8 sm:pt-8 shrink-0">
        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="h-4 w-4 text-primary-content" />
          </div>
          <span className="font-bold text-base-content text-sm tracking-wide">
            AgentSmartly
          </span>
        </div>

        <h1 className="text-2xl font-bold text-base-content leading-tight mb-1">
          {step === 1 ? 'Create your account' : 'One last thing'}
        </h1>
        <p className="text-base-content/60 text-sm">
          {step === 1
            ? 'Start your CA Real Estate exam prep today'
            : 'Help us personalize your study plan'}
        </p>
      </div>

      {/* ── Step indicator — never scrolls ── */}
      <div className="px-6 sm:px-8 shrink-0">
        <StepIndicator step={step} />
      </div>

      {/* ── General error — never scrolls ── */}
      {getGeneralError() && (
        <div className="mx-6 sm:mx-8 mb-2 shrink-0">
          <div className="alert alert-error py-3">
            <XCircle className="shrink-0 h-5 w-5" />
            <span className="text-sm">{getGeneralError()}</span>
          </div>
        </div>
      )}

      {/* ── Scrollable form area ── */}
      <div
        ref={scrollAreaRef}
        className={`
          flex-1 overflow-y-auto px-6 sm:px-8 transition-opacity duration-150
          ${isAnimating ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {/* ───────────── STEP 1 ───────────── */}
        {step === 1 && (
          <form
            id="step1-form"
            onSubmit={handleStep1Submit}
            className="space-y-4 pb-4"
            noValidate
          >
            {/* Username */}
            <FloatingInput label="Username" error={getFieldError('username')}>
              <input
                ref={setErrorRef('username')}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. jsmith"
                autoComplete="username"
                autoCapitalize="none"
                className={`input input-bordered w-full h-12 text-base ${getFieldError('username') ? 'input-error' : ''}`}
                disabled={loading}
                autoFocus
              />
            </FloatingInput>

            {/* Email */}
            <FloatingInput label="Email address" error={getFieldError('email')}>
              <input
                ref={setErrorRef('email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                autoComplete="email"
                inputMode="email"
                className={`input input-bordered w-full h-12 text-base ${getFieldError('email') ? 'input-error' : ''}`}
                disabled={loading}
              />
            </FloatingInput>

            {/* Password */}
            <FloatingInput label="Password" error={getFieldError('password')}>
              <div className="relative">
                <input
                  ref={setErrorRef('password')}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`input input-bordered w-full h-12 text-base pr-11 ${getFieldError('password') ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 opacity-50" />
                  ) : (
                    <Eye className="h-5 w-5 opacity-50" />
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength.score ? pwStrength.color : 'bg-base-300'}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      pwStrength.score <= 1
                        ? 'text-error'
                        : pwStrength.score <= 3
                          ? 'text-warning'
                          : pwStrength.score === 4
                            ? 'text-info'
                            : 'text-success'
                    }`}
                  >
                    {pwStrength.label} password
                  </p>
                </div>
              )}
            </FloatingInput>

            {/* Confirm Password */}
            <FloatingInput
              label="Confirm password"
              error={getFieldError('password2')}
            >
              <div className="relative">
                <input
                  ref={setErrorRef('password2')}
                  type={showPassword2 ? 'text' : 'password'}
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`input input-bordered w-full h-12 text-base pr-11 ${getFieldError('password2') ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  onClick={() => setShowPassword2((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                >
                  {showPassword2 ? (
                    <EyeOff className="h-5 w-5 opacity-50" />
                  ) : (
                    <Eye className="h-5 w-5 opacity-50" />
                  )}
                </button>
              </div>
            </FloatingInput>

            {/* Sign in link */}
            <p className="text-center text-sm text-base-content/60 pt-1 pb-2">
              Already have an account?{' '}
              <a
                href={ROUTES.AUTH.LOGIN}
                className="link link-primary font-semibold"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(ROUTES.AUTH.LOGIN)
                }}
              >
                Sign in
              </a>
            </p>
          </form>
        )}

        {/* ───────────── STEP 2 ───────────── */}
        {step === 2 && (
          <form
            id="step2-form"
            onSubmit={handleStep2Submit}
            className="space-y-6 pb-4"
            noValidate
          >
            {/* Q1: How did you hear about us? */}
            <div ref={setErrorRef('heard_about_us')}>
              <p className="text-sm font-semibold text-base-content mb-3">
                How did you hear about us?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {HEARD_ABOUT_OPTIONS.map(({ value, label }) => (
                  <PillButton
                    key={value}
                    label={label}
                    selected={formData.heard_about_us === value}
                    onClick={() => handleHeardAboutUs(value)}
                    disabled={loading}
                  />
                ))}
              </div>

              {formData.heard_about_us === 'other' && (
                <input
                  type="text"
                  name="heard_about_us_other"
                  value={formData.heard_about_us_other}
                  onChange={handleChange}
                  placeholder="Tell us how you found us…"
                  className={`input input-bordered w-full h-12 mt-3 text-base ${getFieldError('heard_about_us_other') ? 'input-error' : ''}`}
                  disabled={loading}
                  autoFocus
                />
              )}

              {getFieldError('heard_about_us') && (
                <p className="text-error text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {getFieldError('heard_about_us')}
                </p>
              )}
              {getFieldError('heard_about_us_other') && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {getFieldError('heard_about_us_other')}
                </p>
              )}
            </div>

            {/* Q2: Exam date / status */}
            <div ref={setErrorRef('exam_status')}>
              <p className="text-sm font-semibold text-base-content mb-3">
                When is your CA Real Estate exam?
              </p>

              {/* Date picker — primary */}
              <div>
                <label className="label py-1">
                  <span className="label-text text-sm text-base-content/70">
                    I have a scheduled date
                  </span>
                </label>
                <input
                  type="date"
                  name="exam_date"
                  value={formData.exam_date}
                  onChange={handleExamDate}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input input-bordered w-full h-12 text-base ${getFieldError('exam_date') ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <p className="text-xs text-base-content/40 mt-1.5 pl-0.5">
                  No date yet? Pick your current stage below.
                </p>
              </div>

              {/* Status pills — secondary */}
              <div className="divider text-xs text-base-content/50 font-semibold my-3">
                DON'T HAVE A DATE YET?
              </div>
              <div className="grid grid-cols-1 gap-2">
                {EXAM_STATUS_OPTIONS.map(({ value, label }) => (
                  <PillButton
                    key={value}
                    label={label}
                    selected={formData.exam_status === value}
                    onClick={() => handleExamStatus(value)}
                    disabled={loading}
                  />
                ))}
              </div>

              {getFieldError('exam_status') && (
                <p className="text-error text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {getFieldError('exam_status')}
                </p>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ── Sticky bottom CTA — always visible, safe-area aware ── */}
      <div
        className="shrink-0 px-6 pt-3 pb-6 sm:px-8 sm:pb-8 bg-base-100 border-t border-base-200"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {step === 1 && (
          <button
            type="submit"
            form="step1-form"
            className="btn btn-primary w-full h-12 text-base"
            disabled={loading}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        )}

        {step === 2 && (
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-ghost h-12 px-4"
              onClick={() => {
                goToStep(1)
                dispatch(clearError())
              }}
              disabled={loading}
              aria-label="Go back to account details"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="submit"
              form="step2-form"
              className={`btn btn-primary flex-1 h-12 text-base ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account 🎓'}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}

export default SignUpPage
