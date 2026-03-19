// features/auth/LoginPage.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { loginUser, clearError, requestPasswordReset } from './state/authSlice'
import ROUTES from '@/shared/constants/routes'

// ─── Forgot Password Modal ────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [localError, setLocalError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setLocalError('Please enter your email address.')
      return
    }
    setLocalLoading(true)
    setLocalError(null)
    try {
      await dispatch(requestPasswordReset(email.trim().toLowerCase())).unwrap()
      setSubmitted(true)
    } catch (err) {
      // Backend always returns 200 to prevent enumeration — this only fires on network errors
      setLocalError(err?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLocalLoading(false)
    }
  }

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleBackdropClick}
    >
      <div className="card w-full max-w-sm bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-xl font-bold text-base-content">
                {submitted ? 'Check your inbox' : 'Reset your password'}
              </h3>
              <p className="text-sm text-base-content/50 mt-1">
                {submitted
                  ? `We sent a reset link to ${email}`
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle -mt-1 -mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sent state */}
          {submitted ? (
            <div className="mt-4 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-base-content/60 text-center leading-relaxed">
                Click the link in the email to set a new password. The link
                expires in <strong>1 hour</strong>.
              </p>
              <p className="text-xs text-base-content/40 text-center">
                Didn't get it? Check your spam folder.
              </p>
              <button onClick={onClose} className="btn btn-primary w-full mt-2">
                Back to sign in
              </button>
            </div>
          ) : (
            /* Email form */
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {localError && (
                <div className="alert alert-error py-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-5 w-5"
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
                  <span>{localError}</span>
                </div>
              )}
              <div className="form-control w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (localError) setLocalError(null)
                  }}
                  placeholder="your@email.com"
                  className="input input-bordered w-full"
                  disabled={localLoading}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-full ${localLoading ? 'loading' : ''}`}
                disabled={localLoading}
              >
                {localLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost w-full btn-sm"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.LEARNING.PRACTICE)
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return
    try {
      await dispatch(loginUser(formData)).unwrap()
    } catch (err) {
      console.error('Login failed', err)
    }
  }

  // Parse error — backend returns "Please verify your email..." for unverified users
  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.detail || error?.non_field_errors?.[0] || null

  const isUnverifiedError = errorMessage
    ?.toLowerCase()
    .includes('verify your email')

  return (
    <>
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}

      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-base-content/70 mb-6">
              Sign in to your account
            </p>

            {/* Error alert */}
            {errorMessage && (
              <div
                className={`alert mb-4 ${isUnverifiedError ? 'alert-warning' : 'alert-error'}`}
              >
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
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="form-control w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input input-bordered w-full"
                  disabled={loading}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control w-full">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="input input-bordered w-full pr-10"
                    disabled={loading}
                    required
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

                {/* Forgot password link — sits right under the password field */}
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="divider">OR</div>
            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{' '}
                <a
                  href={ROUTES.AUTH.SIGNUP}
                  className="link link-primary font-semibold"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(ROUTES.AUTH.SIGNUP)
                  }}
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
