// src/pages/onboarding.jsx

import OnboardingPage from '@/features/onboarding/OnboardingPage'
import { NextSeo } from 'next-seo'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function Onboarding() {
  return (
  <>
    <NextSeo {...PAGE_SEO.onboarding} />
    <OnboardingPage />
  </>
  )
}
