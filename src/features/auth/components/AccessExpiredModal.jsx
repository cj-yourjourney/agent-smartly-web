// src/features/auth/components/AccessExpiredModal.jsx
import { useRouter } from 'next/router'
import { Zap, CheckCircle, ArrowRight } from 'lucide-react'

const SUBSCRIPTION_PRICE = '$9.99'

const FEATURES = [
  'Unlimited practice questions',
  'Full topic coverage',
  'Progress tracking & analytics'
]

/**
 * AccessExpiredModal
 *
 * A full-viewport overlay rendered on top of blurred page content when the
 * user's trial or subscription has expired. The underlying page remains
 * visible (but dimmed and blurred) so the user can see what they're missing.
 *
 * Clicking "Subscribe" navigates to /profile where the Stripe form lives.
 */
export default function AccessExpiredModal() {
  const router = useRouter()

  const handleSubscribe = () => {
    router.push('/profile?upgrade=true')
  }

  return (
    /* Backdrop — blurs and dims the page content behind */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="expired-modal-title"
    >
      {/* Modal card */}
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header strip */}
        <div className="bg-warning/10 px-5 py-4 flex items-center gap-2 border-b border-warning/20">
          <Zap className="h-5 w-5 text-warning shrink-0" />
          <span
            id="expired-modal-title"
            className="text-sm font-semibold text-warning"
          >
            Trial Ended — Subscribe to Continue
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          {/* Feature list */}
          <ul className="space-y-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <CheckCircle className="h-4 w-4 text-success shrink-0" />
                <span className="text-base-content/75">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="divider my-0" />

          {/* Pricing note */}
          <p className="text-xs text-base-content/50 text-center">
            {SUBSCRIPTION_PRICE}&nbsp;/&nbsp;month &middot; cancel anytime
            &middot; no surprise fees
          </p>

          {/* CTA */}
          <button
            onClick={handleSubscribe}
            className="btn btn-primary w-full gap-2"
          >
            Subscribe now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
