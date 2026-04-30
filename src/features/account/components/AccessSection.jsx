// src/features/account/components/AccessSection.jsx
import { useCallback, useState } from 'react'
import {
  CheckCircle,
  CreditCard,
  Info,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { ACCESS_PRICE, formatDate, getTrialInfo } from '../utils'
import PaymentForm from './PaymentForm'

// ─── Sub-states ────────────────────────────────────────────────────────────────

function ActiveAccessCard({ subscription, onRenew }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="card bg-base-100 border border-success/30 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-success/10 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-success" />
          <span className="text-sm font-bold text-success">
            Full Access Active
          </span>
        </div>
        <span className="badge badge-success badge-sm badge-outline">
          One-time
        </span>
      </div>

      <div className="card-body p-4 space-y-3">
        <div className="flex justify-between text-sm py-1">
          <span className="text-base-content/50">Amount paid</span>
          <span className="font-semibold">{ACCESS_PRICE}</span>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span className="text-base-content/50">Access expires</span>
          <span className="font-semibold">
            {formatDate(subscription.expires_at)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-base-content/50 bg-base-200 rounded-xl px-3 py-2.5">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            This is <span className="font-semibold">not</span> a recurring
            subscription — nothing will auto-renew.
          </span>
        </div>

        <div className="divider my-1" />

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-sm btn-outline w-full gap-2 h-12"
          >
            <RefreshCw className="h-4 w-4" />
            Extend access by another month
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-base-content/50 leading-relaxed">
              This is a one-time charge. Paying now extends your access by one
              month — nothing auto-renews.
            </p>
            <PaymentForm onSuccess={onRenew} isRenewal />
            <button
              onClick={() => setShowForm(false)}
              className="btn btn-ghost btn-sm w-full mt-1 h-12"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SuccessCard({ expiresAt }) {
  return (
    <div className="card bg-success/10 border border-success/30 rounded-2xl shadow-sm">
      <div className="card-body p-5 flex flex-row items-start gap-3">
        <CheckCircle className="h-6 w-6 text-success shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-success">Access activated!</p>
          <p className="text-sm text-base-content/60 mt-1">
            You now have full access until {formatDate(expiresAt)}.
          </p>
        </div>
      </div>
    </div>
  )
}

function TrialActiveCard({ trial, dateJoined, onPurchase }) {
  const [showForm, setShowForm] = useState(false)
  const pct = Math.round(((TRIAL_DAYS - trial.daysLeft) / TRIAL_DAYS) * 100)

  return (
    <div className="space-y-3">
      {/* Trial progress */}
      <div className="card bg-base-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-base-content/60 uppercase tracking-wide">
            Free Trial
          </span>
          <div className="badge badge-success badge-outline gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            {trial.daysLeft} day{trial.daysLeft !== 1 ? 's' : ''} left
          </div>
        </div>
        <progress
          className="progress progress-primary w-full h-2"
          value={pct}
          max="100"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-base-content/40">
            Started {formatDate(dateJoined)}
          </span>
          <span className="text-xs text-base-content/40">
            Ends {formatDate(trial.trialEndDate)}
          </span>
        </div>
      </div>

      {/* Soft purchase CTA */}
      {!showForm ? (
        <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm">
          <div className="card-body p-5">
            <p className="text-base font-bold text-base-content">
              Get full access after your trial
            </p>
            <p className="text-sm text-base-content/50 mt-1 mb-1">
              {ACCESS_PRICE} one-time · no recurring charges · renew anytime
            </p>
            <p className="text-xs text-info font-semibold mb-4">
              Not a subscription — you will never be auto-charged.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary w-full gap-2 h-14 text-base"
            >
              <CreditCard className="h-5 w-5" />
              Get full access
            </button>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 border border-primary/20 rounded-2xl shadow-sm">
          <div className="card-body p-5 space-y-3">
            <p className="text-base font-bold text-base-content">
              Get full access · {ACCESS_PRICE} one-time
            </p>
            <p className="text-sm text-base-content/50">
              Your card is charged once today. Renew manually anytime — no
              auto-renewals, ever.
            </p>
            <PaymentForm onSuccess={onPurchase} />
            <button
              onClick={() => setShowForm(false)}
              className="btn btn-ghost btn-sm w-full h-12"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const FEATURES = [
  'Unlimited practice questions',
  'Full topic coverage',
  'Progress tracking & analytics'
]

function TrialEndedCard({ onPurchase }) {
  return (
    <div className="card bg-base-100 border border-warning/30 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-warning/10 px-4 py-3.5 flex items-center gap-2">
        <Zap className="h-5 w-5 text-warning" />
        <span className="text-sm font-bold text-warning">
          Trial Ended — Get Full Access
        </span>
      </div>
      <div className="card-body p-5 space-y-4">
        <ul className="space-y-2.5">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-4 w-4 text-success shrink-0" />
              <span className="text-base-content/70">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="divider my-0" />
        <PaymentForm onSuccess={onPurchase} />
      </div>
    </div>
  )
}

// ─── Orchestrator ──────────────────────────────────────────────────────────────

// Import TRIAL_DAYS here so TrialActiveCard can use it without prop-drilling
import { TRIAL_DAYS } from '../utils'

export default function AccessSection({
  user,
  profileData,
  onSubscriptionActivated
}) {
  const [successData, setSuccessData] = useState(null)

  const trial = getTrialInfo(user?.date_joined)
  const subscription = profileData?.subscription

  const handleSuccess = useCallback(
    (data) => {
      setSuccessData(data)
      onSubscriptionActivated(data)
    },
    [onSubscriptionActivated]
  )

  if (subscription?.is_active) {
    return (
      <ActiveAccessCard subscription={subscription} onRenew={handleSuccess} />
    )
  }

  if (successData) {
    return <SuccessCard expiresAt={successData.expires_at} />
  }

  if (trial?.isActive) {
    return (
      <TrialActiveCard
        trial={trial}
        dateJoined={user?.date_joined}
        onPurchase={handleSuccess}
      />
    )
  }

  return <TrialEndedCard onPurchase={handleSuccess} />
}
