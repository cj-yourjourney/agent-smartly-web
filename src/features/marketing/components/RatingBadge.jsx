import Link from 'next/link'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'

export default function RatingBadge() {
  const { status, averageRating, count } = useSelector(
    (state) => state.reviews.summary
  )
  if (status !== 'succeeded' || !count) return null

  return (
    <Link
      href={ROUTES.REVIEWS}
      className="inline-flex items-center gap-2 text-sm w-fit hover:opacity-80 transition-opacity"
    >
      <span className="text-warning tracking-widest">★★★★★</span>
      <span className="font-semibold text-base-content">
        {Number(averageRating).toFixed(1)}
      </span>
      <span className="text-base-content/50 underline underline-offset-2">
        from {count} student reviews
      </span>
    </Link>
  )
}
