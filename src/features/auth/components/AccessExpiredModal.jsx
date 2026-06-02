// src/features/auth/components/AccessExpiredModal.jsx
import { useRouter } from 'next/router'
import { Zap, CheckCircle, ArrowRight, Info } from 'lucide-react'
import ROUTES from '../../../shared/constants/routes'
import { TRIAL_QUESTION_LIMIT } from '../../account/utils'
import { PLANS } from '../../pricing/pricingConfig'

const FEATURES = [
  'Unlimited practice questions',
  'Full topic coverage',
  'Progress tracking & analytics'
]

/**
 * AccessExpiredModal
 *
 * Full-viewport overlay shown when the user has used all 60 free questions
 * and does not have an active paid subscription.
 *
 * The underlying page remains visible (dimmed) so the user can see what
 * they're missing. Clicking "Get access" navigates to /account?upgrade=true.
 */
export default function AccessExpiredModal() {
  const router = useRouter()

  const handleGetAccess = () => {
    router.push(`${ROUTES.ACCOUNT}?upgrade=true`)
  }

  // Always sourced from pricingConfig — the single source of truth for pricing & sales.
  // PLANS[0] is the cheapest plan (1-Week). When a sale is active, .price is the
  // discounted price and .originalPrice is the crossed-out retail price.
  const cheapestPlan = PLANS[0]
  const { price: salePrice, originalPrice } = cheapestPlan

  return (
    /* Backdrop */
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
            {TRIAL_QUESTION_LIMIT} Free Questions Used — Get Full Access
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          <p className="text-sm text-base-content/60">
            You&apos;ve completed your free trial. Unlock unlimited practice to
            keep preparing for your exam.
          </p>

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
                Plans from{' '}
                {originalPrice && (
                  <span className="line-through text-base-content/40 font-normal">
                    {originalPrice}
                  </span>
                )}{' '}
                {salePrice} — one-time charge.
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
