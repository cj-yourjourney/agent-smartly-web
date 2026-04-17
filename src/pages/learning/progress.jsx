// pages/learning/progress.jsx
import ProgressPage from '@/features/progress/ProgressPage'
import SubscriptionGuard from '@/features/auth/components/SubscriptionGuard'

export default function Progress() {
  return (
    // requireSubscription={false} → only checks login, not subscription status
    <SubscriptionGuard requireSubscription={false}>
      <ProgressPage />
    </SubscriptionGuard>
  )
}
