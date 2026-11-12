import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviews, fetchReviewSummary, setPage } from './state/reviewsSlice'
import ReviewCard from './components/ReviewCard'
import Pagination from './components/Pagination'
import RatingSummary from './components/RatingSummary'
import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'

const PAGE_SIZE = 10

export default function ReviewsPage() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { results, count, next, previous, page, status, error, summary } =
    useSelector((state) => state.reviews)

  useEffect(() => {
    dispatch(fetchReviews({ page, pageSize: PAGE_SIZE }))
  }, [dispatch, page])

  useEffect(() => {
    dispatch(fetchReviewSummary())
  }, [dispatch])

  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Reviews</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="md:sticky md:top-8">
          {summary.status === 'succeeded' && (
            <RatingSummary
              averageRating={summary.averageRating}
              count={summary.count}
              breakdown={summary.breakdown}
            />
          )}
        </div>

        <div className="rounded-2xl bg-base-100 border border-base-200 px-6">
          {status === 'loading' && results.length === 0 && (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-indigo-500" />
            </div>
          )}

          {status === 'failed' && (
            <div role="alert" className="alert alert-error my-6">
              <span>{error || 'Something went wrong loading reviews.'}</span>
            </div>
          )}

          {status === 'succeeded' && results.length === 0 && (
            <p className="text-base-content/60 text-center py-16">
              No reviews yet.
            </p>
          )}

          {results.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        hasPrevious={Boolean(previous)}
        hasNext={Boolean(next)}
        onPrev={() => previous && dispatch(setPage(page - 1))}
        onNext={() => next && dispatch(setPage(page + 1))}
      />
      {!isAuthenticated && (
        <div className="mt-12 rounded-2xl bg-primary/5 border-2 border-primary/20 px-6 py-10 text-center flex flex-col items-center gap-3">
          <h2 className="font-display text-2xl sm:text-3xl">
            Ready to be the next one who passes?
          </h2>
          <p className="text-base-content/60 text-sm">
            60 free questions · No credit card required
          </p>
          <button
            className="btn btn-primary btn-lg mt-2"
            onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
          >
            Start Free Trial →
          </button>
        </div>
      )}
    </div>
  )
}
