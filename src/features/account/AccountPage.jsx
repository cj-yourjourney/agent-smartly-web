// src/features/account/AccountPage.jsx
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Calendar, Clock, Mail, User } from 'lucide-react'

import { fetchUserDetails } from '../auth/state/authSlice'
import {
  fetchSubscriptionStatus,
  setSubscriptionData
} from '../subscription/state/subscriptionSlice'

import {
  applyAccessActivated,
  fetchAccountData,
  selectAccountData,
  selectAccountLoading
} from './state/accountSlice'
import { formatDate } from './utils'
import ROUTES from '../../shared/constants/routes'

import AvatarCircle from './components/AvatarCircle'
import InfoRow from './components/InfoRow'
import UpgradeBanner from './components/UpgradeBanner'
import AccessSection from './components/AccessSection'
import SupportContact from './components/SupportContact'

// ─── AccountPage ───────────────────────────────────────────────────────────────

const AccountPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const {
    user,
    isAuthenticated,
    loading: authLoading
  } = useSelector((state) => state.auth)
  const accountData = useSelector(selectAccountData)
  const accountLoading = useSelector(selectAccountLoading)

  // Show upgrade banner when redirected here after access expired
  const showUpgradeBanner = router.query.upgrade === 'true'

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN)
      return
    }
    if (!user) dispatch(fetchUserDetails())
  }, [isAuthenticated, user, dispatch, router])

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchAccountData())
  }, [isAuthenticated, dispatch])

  // Called after a successful one-time payment
  const handleAccessActivated = useCallback(
    (paymentData) => {
      if (paymentData?.expires_at) {
        dispatch(applyAccessActivated(paymentData))
        // Keep the subscription slice in sync so guards react immediately
        dispatch(
          setSubscriptionData({
            has_access: true,
            subscription: {
              status: 'active',
              is_active: true,
              started_at: new Date().toISOString(),
              expires_at: paymentData.expires_at
            }
          })
        )
      }
      // Re-fetch fresh server state in the background
      dispatch(fetchAccountData())
      dispatch(fetchSubscriptionStatus())
    },
    [dispatch]
  )

  if (!isAuthenticated) return null

  if (authLoading || !user || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    )
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return (
    <div
      className="min-h-screen bg-base-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-lg mx-auto px-4 pt-8 pb-12 space-y-4">
        {/* Upgrade banner — only shown when redirected from a guarded page */}
        {showUpgradeBanner && !accountData?.has_access && <UpgradeBanner />}

        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <AvatarCircle username={user.username} />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-base-content tracking-tight">
              {fullName || user.username}
            </h1>
            {fullName && (
              <p className="text-sm text-base-content/50 mt-0.5">
                @{user.username}
              </p>
            )}
          </div>
        </div>

        {/* Access / Trial Section */}
        <AccessSection
          user={user}
          profileData={accountData}
          onSubscriptionActivated={handleAccessActivated}
        />

        {/* Support / Contact */}
        <SupportContact />

        {/* Account info card */}
        <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
