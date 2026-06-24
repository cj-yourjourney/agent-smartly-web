// pages/learning/progress.jsx
import ProgressPage from '@/features/progress/ProgressPage'
import SubscriptionGuard from '@/features/auth/components/SubscriptionGuard'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function Progress() {
  return (
    // requireSubscription={false} → only checks login, not subscription status
    <>
      <NextSeo {...PAGE_SEO.progress} />
      <SubscriptionGuard requireSubscription={false}>
        <ProgressPage />
      </SubscriptionGuard>
    </>
  )
}
