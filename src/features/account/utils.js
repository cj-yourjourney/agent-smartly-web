// src/features/account/utils.js

export const TRIAL_DAYS = 3
export const ACCESS_PRICE = '$9.99'

// ─── Trial helpers ─────────────────────────────────────────────────────────────

export function getTrialInfo(dateJoinedStr) {
  if (!dateJoinedStr) return null
  const joined = new Date(dateJoinedStr)
  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const daysUsed = Math.floor((now - joined) / msPerDay)
  const daysLeft = Math.max(TRIAL_DAYS - daysUsed, 0)
  const trialEndDate = new Date(joined.getTime() + TRIAL_DAYS * msPerDay)
  return { daysUsed, daysLeft, isActive: daysLeft > 0, trialEndDate }
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ─── Stripe loader ─────────────────────────────────────────────────────────────

// Dynamically load Stripe.js once across the session
let stripePromise = null

export function getStripe(publicKey) {
  if (!stripePromise && publicKey) {
    stripePromise = new Promise((resolve) => {
      if (window.Stripe) {
        resolve(window.Stripe(publicKey))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => resolve(window.Stripe(publicKey))
      document.head.appendChild(script)
    })
  }
  return stripePromise
}
