// src/features/profile/ProfilePage.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { fetchUserDetails } from '../auth/state/authSlice'
import { User, Mail, Calendar, Clock, Zap, ShieldCheck } from 'lucide-react'
import ROUTES from '../../shared/constants/routes'

const TRIAL_DAYS = 3

/**
 * Computes trial info from a date_joined ISO string.
 * Returns { daysUsed, daysLeft, isActive, trialEndDate }
 */
function getTrialInfo(dateJoinedStr) {
  if (!dateJoinedStr) return null

  const joined = new Date(dateJoinedStr)
  const now = new Date()
  const msPerDay = 1000 * 60 * 60 * 24
  const daysUsed = Math.floor((now - joined) / msPerDay)
  const daysLeft = Math.max(TRIAL_DAYS - daysUsed, 0)
  const trialEndDate = new Date(joined.getTime() + TRIAL_DAYS * msPerDay)

  return {
    daysUsed,
    daysLeft,
    isActive: daysLeft > 0,
    trialEndDate
  }
}

/**
 * Formats an ISO date string as "Month Day, Year"
 * e.g. "April 14, 2025"
 */
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function AvatarCircle({ username }) {
  const initial = username ? username.charAt(0).toUpperCase() : 'U'
  return (
    <div className="avatar placeholder">
      <div className="bg-primary text-primary-content rounded-full w-20">
        <span className="text-3xl font-semibold">{initial}</span>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-base-200 last:border-0">
      <div className="text-base-content/40 shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm text-base-content/50 w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-base-content">
        {value || '—'}
      </span>
    </div>
  )
}

function TrialBadge({ trial }) {
  if (!trial) return null

  if (trial.isActive) {
    return (
      <div className="badge badge-success badge-outline gap-1 text-xs font-medium">
        <ShieldCheck className="h-3 w-3" />
        {trial.daysLeft} day{trial.daysLeft !== 1 ? 's' : ''} left in trial
      </div>
    )
  }

  return (
    <div className="badge badge-warning badge-outline gap-1 text-xs font-medium">
      <Zap className="h-3 w-3" />
      Trial ended
    </div>
  )
}

function TrialProgressBar({ trial }) {
  if (!trial) return null

  const pct = Math.round(((TRIAL_DAYS - trial.daysLeft) / TRIAL_DAYS) * 100)

  return (
    <div className="card bg-base-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
          Free Trial
        </span>
        <TrialBadge trial={trial} />
      </div>

      <progress
        className={`progress w-full ${trial.isActive ? 'progress-primary' : 'progress-warning'}`}
        value={pct}
        max="100"
      />

      <div className="flex justify-between mt-1">
        <span className="text-xs text-base-content/40">
          Started {formatDate(trial.trialEndDate - TRIAL_DAYS * 86400000)}
        </span>
        <span className="text-xs text-base-content/40">
          Ends {formatDate(trial.trialEndDate)}
        </span>
      </div>

      {!trial.isActive && (
        <p className="text-xs text-base-content/50 mt-2">
          Your free trial has ended. Subscribe to continue practicing.
        </p>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN)
      return
    }
    if (!user) {
      dispatch(fetchUserDetails())
    }
  }, [isAuthenticated, user, dispatch, router])

  if (!isAuthenticated) return null

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    )
  }

  const trial = getTrialInfo(user.date_joined)

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <AvatarCircle username={user.username} />

          <div className="text-center">
            <h1 className="text-xl font-bold text-base-content">
              {fullName || user.username}
            </h1>
            {fullName && (
              <p className="text-sm text-base-content/50">@{user.username}</p>
            )}
          </div>
        </div>

        {/* Trial Card */}
        <div className="mb-4">
          <TrialProgressBar trial={trial} />
        </div>

        {/* Account Info Card */}
        <div className="card bg-base-100 border border-base-200 rounded-xl">
          <div className="card-body p-4">
            <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
              Account
            </h2>

            <InfoRow icon={User} label="Username" value={user.username} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow
              icon={Calendar}
              label="Member since"
              value={formatDate(user.date_joined)}
            />
            <InfoRow
              icon={Clock}
              label="Last login"
              value={user.last_login ? formatDate(user.last_login) : 'Just now'}
            />
            <InfoRow
              icon={Zap}
              label="Credits"
              value={user.credits !== undefined ? `${user.credits}` : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
