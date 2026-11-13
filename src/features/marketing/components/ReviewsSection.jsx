import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'
import {
  pickFeaturedReviews,
  formatReviewDate,
  getAvatarColor
} from '@/features/reviews/utils'

// Reviews longer than this get clamped by line-clamp-6, so show "Read more"
const CLAMP_CHARS = 260

// Shown only if the reviews API fails or returns nothing
const FALLBACK = [
  {
    id: 'f1',
    title: '',
    content:
      'I only spent 1-2 days on AgentSmartly before my first exam and scored 68/70 — so close. I then switched to another prep site and did even worse. Coming back to AgentSmartly and really focusing on the key concepts and progress chart made all the difference. Third time, I passed.',
    first_name: 'Gabriel',
    rating: 5,
    dateLabel: 'Passed March 2026'
  },
  {
    id: 'f2',
    title: '',
    content:
      "The key concepts section was a game changer. Having definitions AND memory tricks made the dense legal terminology actually stick. Couldn't recommend it more.",
    first_name: 'Sarah',
    rating: 5,
    dateLabel: 'Passed January 2025'
  },
  {
    id: 'f3',
    title: '',
    content:
      'I loved seeing my progress by topic. When I saw my Property Ownership accuracy was low, I knew exactly where to focus. Felt confident walking into the exam.',
    first_name: 'Diana',
    rating: 5,
    dateLabel: 'Passed February 2025'
  }
]

function ReviewTile({ review }) {
  const { first_name, title, content, rating, created_at, dateLabel } = review
  const date = dateLabel || formatReviewDate(created_at)
  const fullDate = created_at
    ? new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : undefined
  // Fallback reviews don't exist on the reviews page, so no link for them
  const isLong = !dateLabel && content.length > CLAMP_CHARS

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm relative overflow-hidden shrink-0 snap-start w-[85%] md:w-auto">
      <span className="absolute top-4 right-5 text-6xl text-base-content/5 font-serif leading-none select-none">
        "
      </span>
      <div className="card-body gap-3">
        <div className="text-warning text-sm tracking-widest">
          {'★'.repeat(rating)}
        </div>
        {title && <h3 className="font-semibold">{title}</h3>}
        <p className="text-base-content/65 text-sm leading-relaxed line-clamp-6">
          {content}
        </p>
        {isLong && (
          <Link
            href={ROUTES.REVIEWS}
            className="text-primary text-sm font-medium hover:underline -mt-1"
          >
            Read more
          </Link>
        )}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <div
            className={`w-9 h-9 rounded-full ${getAvatarColor(
              first_name
            )} flex items-center justify-center text-white text-xs font-bold shrink-0`}
          >
            {first_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm">{first_name}</div>
            <div className="text-xs text-base-content/40">
              {created_at ? (
                <time
                  dateTime={created_at}
                  title={fullDate}
                  suppressHydrationWarning
                >
                  {date}
                </time>
              ) : (
                date
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { featured, summary } = useSelector((state) => state.reviews)

  const picked = pickFeaturedReviews(featured.results, 6)
  const loading = featured.status === 'idle' || featured.status === 'loading'
  const items = picked.length > 0 ? picked : loading ? [] : FALLBACK
  const hasSummary = summary.status === 'succeeded' && summary.count > 0

  return (
    <div className="py-24 px-4 bg-base-200">
      <div className="max-w-5xl mx-auto">
        <p className="text-center font-bold tracking-widest text-xs uppercase mb-3 text-base-content/40">
          Results
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
          500+ People Passed With AgentSmartly
        </h2>

        {hasSummary ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-14">
            <span className="text-warning text-lg tracking-widest">★★★★★</span>
            <span className="text-base-content/60">
              <span className="font-bold text-base-content">
                {Number(summary.averageRating).toFixed(1)}
              </span>{' '}
              average from {summary.count} student reviews
            </span>
          </div>
        ) : (
          <p className="text-center text-base-content/50 text-lg mb-14 max-w-xl mx-auto">
            Real CA exam passers who prepared with AgentSmartly. Here's what
            they said.
          </p>
        )}

        {/* Mobile: swipe row. Desktop: 3-column grid */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 -mx-4 px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
          {loading && picked.length === 0
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="skeleton h-56 rounded-2xl shrink-0 w-[85%] md:w-auto"
                />
              ))
            : items.map((r) => <ReviewTile key={r.id} review={r} />)}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          {!isAuthenticated && (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
            >
              Start Free Trial →
            </button>
          )}
          <Link
            href={ROUTES.REVIEWS}
            className={`btn btn-lg ${isAuthenticated ? 'btn-primary' : 'btn-ghost'}`}
          >
            {hasSummary
              ? `Read all ${summary.count} reviews →`
              : 'Read all reviews →'}
          </Link>
        </div>
        {!isAuthenticated && (
          <p className="text-center text-xs text-base-content/40 mt-3">
            60 free questions · No credit card required
          </p>
        )}
      </div>
    </div>
  )
}
