import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviews, fetchReviewSummary, setPage } from './state/reviewsSlice'
import ReviewCard from './components/ReviewCard'
import Pagination from './components/Pagination'
import RatingSummary from './components/RatingSummary'

const PAGE_SIZE = 10

export default function ReviewsPage() {
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
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Reviews</h1>

        {summary.status === 'succeeded' && (
          <RatingSummary
            averageRating={summary.averageRating}
            count={summary.count}
            breakdown={summary.breakdown}
          />
        )}
      </div>

      {status === 'loading' && results.length === 0 && (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-indigo-500" />
        </div>
      )}

      {status === 'failed' && (
        <div role="alert" className="alert alert-error">
          <span>{error || 'Something went wrong loading reviews.'}</span>
        </div>
      )}

      {status === 'succeeded' && results.length === 0 && (
        <p className="text-base-content/60 text-center py-16">
          No reviews yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {results.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        hasPrevious={Boolean(previous)}
        hasNext={Boolean(next)}
        onPrev={() => previous && dispatch(setPage(page - 1))}
        onNext={() => next && dispatch(setPage(page + 1))}
      />
    </div>
  )
}
