// src/features/auth/ResetPasswordPage.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { confirmPasswordReset, clearError } from './state/authSlice'
import ROUTES from '@/shared/constants/routes'

const ResetPasswordPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading } = useSelector((state) => state.auth)

  // 'idle' | 'ready' | 'success' | 'error' | 'missing_token'
  const [status, setStatus] = useState('idle')
  const [token, setToken] = useState(null)
  const [formData, setFormData] = useState({ password: '', password2: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (!router.isReady) return
    const { token: t } = router.query
    if (!t) {
      setStatus('missing_token')
    } else {
      setToken(t)
      setStatus('ready')
    }
  }, [router.isReady, router.query])

  const validate = () => {
    const errors = {}
    if (!formData.password) {
      errors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.'
    }
    if (!formData.password2) {
      errors.password2 = 'Please confirm your password.'
    } else if (formData.password !== formData.password2) {
      errors.password2 = 'Passwords do not match.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: null }))
    if (serverError) setServerError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await dispatch(
        confirmPasswordReset({
          token,
          password: formData.password,
          password2: formData.password2
        })
      ).unwrap()
      setStatus('success')
    } catch (err) {
      const msg = err?.error || err?.detail || 'Reset failed. Please try again.'
      const isExpired =
        msg.toLowerCase().includes('expired') ||
        msg.toLowerCase().includes('invalid')
      if (isExpired) {
        setStatus('error')
      }
      setServerError(msg)
    }
  }

  // ── Missing token ──
  if (status === 'missing_token') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Invalid link</h2>
            <p className="text-base-content/60 text-sm mb-6">
              This link is missing a reset token. Please use the link from your
              email exactly as sent.
            </p>
            <button
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="btn btn-primary w-full"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ──
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Password updated!</h2>
            <p className="text-base-content/60 text-sm mb-8">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <button
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="btn btn-primary w-full"
            >
              Sign In →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Expired / invalid token error ──
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Link expired</h2>
            <p className="text-base-content/60 text-sm mb-6 leading-relaxed">
              {serverError}
            </p>
            <button
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="btn btn-primary w-full"
            >
              Request a new link
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Form (idle / ready) ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
            Set new password
          </h2>
          <p className="text-center text-base-content/60 text-sm mb-6">
            Choose a strong password for your account.
          </p>

          {serverError && status !== 'error' && (
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
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password */}
            <div className="form-control w-full">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New password (min 8 characters)"
                  className={`input input-bordered w-full pr-10 ${fieldErrors.password ? 'input-error' : ''}`}
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
              {fieldErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {fieldErrors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm password */}
            <div className="form-control w-full">
              <div className="relative">
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`input input-bordered w-full pr-10 ${fieldErrors.password2 ? 'input-error' : ''}`}
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
              {fieldErrors.password2 && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {fieldErrors.password2}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="text-sm text-base-content/50 hover:text-primary"
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
