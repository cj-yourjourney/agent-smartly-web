// pages/learning/key-concepts.jsx
import KeyConceptsOutline from '../../features/key-concepts/KeyConceptsOutline'
import SubscriptionGuard from '../../features/auth/components/SubscriptionGuard'

export default function KeyConceptsPage() {
  return (
    <SubscriptionGuard requireSubscription={true}>
      <KeyConceptsOutline />
    </SubscriptionGuard>
  )
}
