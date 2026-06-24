// pages/learning/practice.jsx
import PracticeMode from '@/features/practice/PracticeMode'
import SubscriptionGuard from '@/features/auth/components/SubscriptionGuard'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function PracticePage() {
  return (
    <>
      <NextSeo {...PAGE_SEO.practice} />
      <SubscriptionGuard requireSubscription={true}>
        <PracticeMode />
      </SubscriptionGuard>
    </>
  )
}
