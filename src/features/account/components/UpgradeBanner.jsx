// src/features/account/components/UpgradeBanner.jsx
import { AlertTriangle } from 'lucide-react'

export default function UpgradeBanner() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-warning/10 border border-warning/40 rounded-2xl px-4 py-4 mb-5"
    >
      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-warning">
          Your access has expired
        </p>
        <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
          Purchase access below to continue using practice questions and key
          concepts. It's a one-time charge — no auto-renewals.
        </p>
      </div>
    </div>
  )
}
