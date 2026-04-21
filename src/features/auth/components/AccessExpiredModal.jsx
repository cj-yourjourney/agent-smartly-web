// src/features/auth/components/AccessExpiredModal.jsx
import { useRouter } from 'next/router'
import { Zap, CheckCircle, ArrowRight, Info } from 'lucide-react'
import ROUTES from '../../../shared/constants/routes'

const ACCESS_PRICE = '$9.99'

const FEATURES = [
  'Unlimited practice questions',
  'Full topic coverage',
  'Progress tracking & analytics'
]

/**
 * AccessExpiredModal
 *
 * A full-viewport overlay rendered on top of blurred page content when the
 * user's trial or access has expired. The underlying page remains visible
 * (but dimmed and blurred) so the user can see what they're missing.
 *
 * Clicking "Get access" navigates to /account where the Stripe form lives.
 */
export default function AccessExpiredModal() {
  const router = useRouter()

  const handleGetAccess = () => {
    router.push(`${ROUTES.ACCOUNT}?upgrade=true`)
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
            Trial Ended — Get Full Access
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

          {/* One-time charge notice */}
          <div className="flex items-start gap-2 bg-info/10 border border-info/30 rounded-lg px-3 py-2.5">
            <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
            <p className="text-xs text-base-content/70 leading-relaxed">
              <span className="font-semibold text-base-content">
                {ACCESS_PRICE} one-time charge.
              </span>{' '}
              Not a subscription — nothing auto-renews. Renew manually anytime.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleGetAccess}
            className="btn btn-primary w-full gap-2"
          >
            Get full access
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
