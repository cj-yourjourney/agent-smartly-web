// src/features/auth/SignUpPage.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  registerUser,
  clearError,
  clearRegisterSuccess
} from './state/authSlice'
import ROUTES from '@/shared/constants/routes'

// ─── Email Check Illustration ────────────────────────────────────────────────
const EmailSentIllustration = () => (
  <div className="flex justify-center mb-6">
    <div className="relative">
      {/* Envelope */}
      <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary-content"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      {/* Badge */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center shadow-md border-2 border-base-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-success-content"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  </div>
)

// ─── Success State (shown after registration) ─────────────────────────────────
const VerifyEmailPrompt = ({ email, onBackToLogin }) => (
  <div className="text-center animate-[fadeIn_0.4s_ease]">
    <EmailSentIllustration />

    <h2 className="text-2xl font-bold text-base-content mb-2">
      Check your inbox
    </h2>
    <p className="text-base-content/60 text-sm mb-6">
      We sent a verification link to
    </p>

    {/* Email pill */}
    <div className="inline-flex items-center gap-2 bg-base-200 rounded-full px-4 py-2 mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-primary shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
        />
      </svg>
      <span className="font-semibold text-base-content text-sm">{email}</span>
    </div>

    {/* Steps */}
    <div className="bg-base-200 rounded-2xl p-5 text-left mb-6 space-y-3">
      {[
        { step: '1', text: 'Open the email from AgentSmartly' },
        { step: '2', text: 'Click the "Verify My Email" button' },
        { step: '3', text: "You'll be logged in automatically" }
      ].map(({ step, text }) => (
        <div key={step} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            {step}
          </div>
          <span className="text-sm text-base-content/80">{text}</span>
        </div>
      ))}
    </div>

    {/* Expiry note */}
    <div className="flex items-center justify-center gap-1.5 text-xs text-base-content/40 mb-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Link expires in 24 hours. Didn't get it? Check your spam folder.
    </div>

    <div className="divider text-xs text-base-content/30">WRONG EMAIL?</div>

    <button
      onClick={onBackToLogin}
      className="btn btn-ghost btn-sm mt-2 text-primary"
    >
      ← Back to sign in
    </button>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const SignUpPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error, isAuthenticated, registerSuccess } = useSelector(
    (state) => state.auth
  )

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  })

  const [validationErrors, setValidationErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  // Only redirect if already logged in when landing on this page
  useEffect(() => {
    if (isAuthenticated && !registerSuccess) {
      router.push(ROUTES.ONBOARDING)
    }
  }, [isAuthenticated, registerSuccess, router])

  useEffect(() => {
    return () => {
      dispatch(clearError())
      dispatch(clearRegisterSuccess())
    }
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.username) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    } else if (formData.username.length > 30) {
      errors.username = 'Username must be at most 30 characters'
    }

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!formData.password2) {
      errors.password2 = 'Please confirm your password'
    } else if (formData.password !== formData.password2) {
      errors.password2 = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    if (!validateForm()) return

    try {
      await dispatch(registerUser(formData)).unwrap()
      // On success, registerSuccess becomes true → shows VerifyEmailPrompt below
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

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
    if (error && error.message) return error.message
    if (error && error.error) return error.error
    return null
  }

  // ── After successful registration: show email verification prompt ──
  if (registerSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <VerifyEmailPrompt
              email={formData.email}
              onBackToLogin={() => router.push(ROUTES.AUTH.LOGIN)}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Registration form ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
            Create Account
          </h2>
          <p className="text-center text-base-content/70 mb-6">Join us today</p>

          {getGeneralError() && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{getGeneralError()}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="form-control w-full">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className={`input input-bordered w-full ${
                  getFieldError('username') ? 'input-error' : ''
                }`}
                disabled={loading}
              />
              {getFieldError('username') && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {getFieldError('username')}
                  </span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`input input-bordered w-full ${
                  getFieldError('email') ? 'input-error' : ''
                }`}
                disabled={loading}
              />
              {getFieldError('email') && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {getFieldError('email')}
                  </span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min 8 characters)"
                  className={`input input-bordered w-full pr-10 ${
                    getFieldError('password') ? 'input-error' : ''
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {getFieldError('password') && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {getFieldError('password')}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control w-full">
              <div className="relative">
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`input input-bordered w-full pr-10 ${
                    getFieldError('password2') ? 'input-error' : ''
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword2(!showPassword2)}
                  tabIndex={-1}
                >
                  {showPassword2 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {getFieldError('password2') && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {getFieldError('password2')}
                  </span>
                </label>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>
          <div className="text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <a
                href={ROUTES.AUTH.LOGIN}
                className="link link-primary font-semibold"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(ROUTES.AUTH.LOGIN)
                }}
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
