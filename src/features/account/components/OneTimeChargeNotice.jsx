// src/features/account/components/OneTimeChargeNotice.jsx
import { Info } from 'lucide-react'
import { DEFAULT_PLAN } from '../../pricing/pricingConfig'

export default function OneTimeChargeNotice({ plan }) {
  const activePlan = plan ?? DEFAULT_PLAN

  return (
    <div className="flex items-start gap-3 bg-info/10 border border-info/30 rounded-xl px-4 py-3">
      <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
      <div className="text-xs text-base-content/70 leading-relaxed">
        <span className="font-semibold text-base-content">
          One-time charge — not a subscription.
        </span>{' '}
        Charged once for {activePlan.price}, nothing auto-renews.
      </div>
    </div>
  )
}
