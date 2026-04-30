// src/features/account/components/OneTimeChargeNotice.jsx
import { Info } from 'lucide-react'
import { ACCESS_PRICE } from '../utils'

export default function OneTimeChargeNotice() {
  return (
    <div className="flex items-start gap-3 bg-info/10 border border-info/30 rounded-xl px-4 py-3">
      <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
      <div className="text-xs text-base-content/70 leading-relaxed">
        <span className="font-semibold text-base-content">
          One-time charge — not a subscription.
        </span>{' '}
        Your card is charged once for {ACCESS_PRICE}. There are{' '}
        <span className="font-semibold">no recurring charges</span> and nothing
        auto-renews. You can renew manually anytime before your access expires.
      </div>
    </div>
  )
}
