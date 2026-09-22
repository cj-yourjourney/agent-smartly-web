import { NextSeo } from 'next-seo'
import ReviewsPage from '@/features/reviews/ReviewsPage'
import { PAGE_SEO } from '@/shared/constants/seoConfig'

export default function Reviews() {
  return (
    <>
      <NextSeo {...PAGE_SEO.reviews} />
      <ReviewsPage />
    </>
  )
}
