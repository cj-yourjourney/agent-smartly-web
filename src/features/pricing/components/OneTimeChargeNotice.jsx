// src/features/pricing/components/OneTimeChargeNotice.jsx
//
//  Replaces:  src/features/account/components/OneTimeChargeNotice.jsx
//  Change:    imports plan data from pricingConfig instead of account/utils
// ─────────────────────────────────────────────────────────────────────────────
import { Info } from 'lucide-react'
import { DEFAULT_PLAN } from '../pricingConfig'

export default function OneTimeChargeNotice({ plan }) {
  const activePlan = plan ?? DEFAULT_PLAN

  return (
    <div className="flex items-start gap-3 bg-info/10 border border-info/30 rounded-xl px-4 py-3">
      <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
      <p className="text-xs text-base-content/70 leading-relaxed">
        <span className="font-semibold text-base-content">
          Charged once for {activePlan.price}
        </span>{' '}
        — no subscription, no auto-renew. Renew manually anytime.
      </p>
    </div>
  )
}
