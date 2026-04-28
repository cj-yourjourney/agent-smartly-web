// features/auth/LoginPage.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { loginUser, clearError, requestPasswordReset } from './state/authSlice'
import ROUTES from '@/shared/constants/routes'
import { X, Mail, XCircle, Eye, EyeOff } from 'lucide-react'

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
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sent state */}
          {submitted ? (
            <div className="mt-4 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-success" />
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
                  <XCircle className="shrink-0 h-5 w-5" />
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

      <div className="min-h-screen flex items-center justify-center bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body px-6 py-8 sm:px-8">
            {/* Brand mark */}
            <div className="text-center mb-2">
              <span className="text-2xl font-bold">
                <span className="text-primary">Agent</span>Smartly
              </span>
            </div>
            <h2 className="card-title text-2xl sm:text-3xl font-bold text-center justify-center mb-1">
              Welcome Back
            </h2>
            <p className="text-center text-base-content/60 text-sm sm:text-base mb-5">
              Sign in to your account
            </p>

            {/* Error alert */}
            {errorMessage && (
              <div
                className={`alert mb-4 ${isUnverifiedError ? 'alert-warning' : 'alert-error'}`}
              >
                <XCircle className="stroke-current shrink-0 h-6 w-6" />
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
                  className="input input-bordered w-full h-12"
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
                    className="input input-bordered w-full pr-11 h-12"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
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
              <div className="form-control mt-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full h-12 text-base ${loading ? 'loading' : ''}`}
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
