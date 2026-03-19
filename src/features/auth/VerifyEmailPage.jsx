// src/features/auth/VerifyEmailPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { verifyEmail } from './state/authSlice'
import ROUTES from '@/shared/constants/routes'

// ─── States ──────────────────────────────────────────────────────────────────

const VerifyingState = () => (
  <div className="text-center">
    <div className="flex justify-center mb-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
    <h2 className="text-2xl font-bold text-base-content mb-2">
      Verifying your email…
    </h2>
    <p className="text-base-content/50 text-sm">
      This will only take a moment.
    </p>
  </div>
)

const SuccessState = () => (
  <div className="text-center animate-[fadeIn_0.4s_ease]">
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
    <h2 className="text-2xl font-bold text-base-content mb-2">
      Email verified!
    </h2>
    <p className="text-base-content/50 text-sm mb-1">
      Your account is active. Redirecting you now…
    </p>
    <span className="loading loading-dots loading-sm text-primary mt-2"></span>
  </div>
)

const ErrorState = ({ message, isExpired, onGoToSignup, onGoToLogin }) => (
  <div className="text-center animate-[fadeIn_0.4s_ease]">
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
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
    </div>

    <h2 className="text-2xl font-bold text-base-content mb-2">
      {isExpired ? 'Link expired' : 'Verification failed'}
    </h2>
    <p className="text-base-content/60 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
      {message}
    </p>

    <div className="flex flex-col gap-3">
      {isExpired && (
        <button onClick={onGoToSignup} className="btn btn-primary w-full">
          Register again
        </button>
      )}
      <button
        onClick={onGoToLogin}
        className={
          isExpired ? 'btn btn-ghost w-full' : 'btn btn-primary w-full'
        }
      >
        Go to sign in
      </button>
    </div>
  </div>
)

const MissingTokenState = ({ onGoToSignup }) => (
  <div className="text-center animate-[fadeIn_0.4s_ease]">
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
    <h2 className="text-2xl font-bold text-base-content mb-2">Invalid link</h2>
    <p className="text-base-content/60 text-sm mb-6">
      This link is missing a verification token. Please use the link from your
      email exactly as sent.
    </p>
    <button onClick={onGoToSignup} className="btn btn-primary w-full">
      Back to sign up
    </button>
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

const VerifyEmailPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading } = useSelector((state) => state.auth)

  // 'idle' | 'verifying' | 'success' | 'error' | 'missing_token'
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // router.query is empty on first render in Next.js — wait until it's ready
    if (!router.isReady) return

    const { token } = router.query

    if (!token) {
      setStatus('missing_token')
      return
    }

    const runVerification = async () => {
      setStatus('verifying')
      try {
        await dispatch(verifyEmail(token)).unwrap()
        setStatus('success')
        // Brief pause so the user sees the success state before redirect
        setTimeout(() => router.replace(ROUTES.ONBOARDING), 1500)
      } catch (err) {
        const message =
          err?.error || err?.detail || 'Verification failed. Please try again.'
        const expired =
          typeof message === 'string' &&
          (message.toLowerCase().includes('expired') ||
            message.toLowerCase().includes('register again'))
        setIsExpired(expired)
        setErrorMessage(message)
        setStatus('error')
      }
    }

    runVerification()
  }, [router.isReady, router.query]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body py-12">
          {(status === 'idle' || status === 'verifying' || loading) && (
            <VerifyingState />
          )}
          {status === 'success' && <SuccessState />}
          {status === 'error' && (
            <ErrorState
              message={errorMessage}
              isExpired={isExpired}
              onGoToSignup={() => router.push(ROUTES.AUTH.SIGNUP)}
              onGoToLogin={() => router.push(ROUTES.AUTH.LOGIN)}
            />
          )}
          {status === 'missing_token' && (
            <MissingTokenState
              onGoToSignup={() => router.push(ROUTES.AUTH.SIGNUP)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
