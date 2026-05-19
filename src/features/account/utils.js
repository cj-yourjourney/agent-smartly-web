// src/features/account/utils.js

export const TRIAL_QUESTION_LIMIT = 60
export const ACCESS_PRICE = '$9.99'

// ─── Trial helpers ─────────────────────────────────────────────────────────────

/**
 * Returns trial progress info based on questions answered.
 *
 * @param {number} questionsUsed   - trial_questions_used from the profile endpoint
 * @param {number} questionsLimit  - trial_questions_limit from the profile endpoint (default 60)
 */
export function getTrialInfo(
  questionsUsed,
  questionsLimit = TRIAL_QUESTION_LIMIT
) {
  if (questionsUsed === undefined || questionsUsed === null) return null

  const used = Math.min(questionsUsed, questionsLimit) // cap display at limit
  const questionsLeft = Math.max(questionsLimit - questionsUsed, 0)
  const pctUsed = Math.round((used / questionsLimit) * 100)

  return {
    questionsUsed: used,
    questionsLeft,
    questionsLimit,
    pctUsed,
    isActive: questionsLeft > 0
  }
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
