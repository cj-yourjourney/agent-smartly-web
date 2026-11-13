// features/about/AboutPage.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import SaleBanner from '@/features/pricing/components/SaleBanner'
import ReviewsSection from '@/features/marketing/components/ReviewsSection'
import {
  fetchReviewSummary,
  fetchFeaturedReviews
} from '@/features/reviews/state/reviewsSlice'
import HeroSection from './components/HeroSection'
import UvpStrip from './components/UvpStrip'
import TimelineSection from './components/timeline/TimelineSection'
import PricingSection from './components/PricingSection'
import CtaSection from './components/CtaSection'

export default function AboutPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchReviewSummary())
    dispatch(fetchFeaturedReviews())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-base-100">
      <SaleBanner />
      <HeroSection />
      <UvpStrip />
      <TimelineSection />
      <ReviewsSection />
      <PricingSection />
      <CtaSection />
    </div>
  )
}
