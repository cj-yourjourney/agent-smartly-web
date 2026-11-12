// features/home/HomePage.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import SaleBanner from '@/features/pricing/components/SaleBanner'
import YouTubeSection from '@/features/marketing/components/YouTubeSection'
import ReviewsSection from '@/features/marketing/components/ReviewsSection'
import {
  fetchReviewSummary,
  fetchFeaturedReviews
} from '@/features/reviews/state/reviewsSlice'
import HeroSection from './components/HeroSection'
import UvpSection from './components/UvpSection'
import StatsBar from './components/StatsBar'
import HowItWorksSection from './components/how-it-works/HowItWorksSection'
import PricingSection from './components/PricingSection'
import FounderSection from './components/FounderSection'
import FaqSection from './components/FaqSection'
import CtaSection from './components/CtaSection'
import DisclaimerSection from './components/DisclaimerSection'
import FooterSection from './components/FooterSection'
import StickyMobileCta from './components/StickyMobileCta'

export default function HomePage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchReviewSummary())
    dispatch(fetchFeaturedReviews())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-base-100">
      <SaleBanner />
      <HeroSection />
      <UvpSection />
      <StatsBar />
      <ReviewsSection />
      <HowItWorksSection />
      <YouTubeSection />
      <PricingSection />
      <FounderSection />
      <FaqSection />
      <CtaSection />
      <DisclaimerSection />
      <FooterSection />
      <StickyMobileCta />
    </div>
  )
}
