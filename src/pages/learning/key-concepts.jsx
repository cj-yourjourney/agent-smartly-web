// pages/learning/key-concepts.jsx
import KeyConceptsOutline from '../../features/key-concepts/KeyConceptsOutline'
import SubscriptionGuard from '../../features/auth/components/SubscriptionGuard'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function KeyConceptsPage() {
  return (
    <>
      <NextSeo {...PAGE_SEO.keyConcepts} />
      <SubscriptionGuard requireSubscription={true}>
        <KeyConceptsOutline />
      </SubscriptionGuard>
    </>
  )
}
