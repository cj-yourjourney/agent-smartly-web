// pages/learning/practice.jsx
import PracticeMode from '@/features/practice/PracticeMode'
import SubscriptionGuard from '@/features/auth/components/SubscriptionGuard'

export default function PracticePage() {
  return (
    <SubscriptionGuard requireSubscription={true}>
      <PracticeMode />
    </SubscriptionGuard>
  )
}
