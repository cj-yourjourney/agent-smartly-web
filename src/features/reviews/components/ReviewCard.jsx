import { useState } from 'react'

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-violet-500'
]

function getAvatarColor(name) {
  const index = name
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

const TRUNCATE_LENGTH = 220

export default function ReviewCard({ review }) {
  const { first_name, rating, content, created_at } = review
  const [expanded, setExpanded] = useState(false)

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const isLong = content.length > TRUNCATE_LENGTH
  const displayText =
    isLong && !expanded
      ? `${content.slice(0, TRUNCATE_LENGTH).trim()}…`
      : content

  return (
    <div className="group relative card bg-base-100 border border-base-200 rounded-2xl transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100">
      <div className="card-body gap-3 p-6">
        <svg
          className="absolute top-5 right-5 w-8 h-8 text-base-200 group-hover:text-indigo-100 transition-colors"
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7c0-1.7 1.3-3 3-3V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-7c0-1.7 1.3-3 3-3V8z" />
        </svg>

        <div className="flex items-center gap-3">
          <div
            className={`${getAvatarColor(first_name)} text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm shrink-0`}
          >
            {first_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold leading-tight">{first_name}</p>
            <p className="text-base-content/50 text-xs">{formattedDate}</p>
          </div>
        </div>

        <div
          className="rating rating-sm"
          aria-label={`${rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="radio"
              className="mask mask-star-2 bg-orange-400"
              checked={star === rating}
              readOnly
              disabled
            />
          ))}
        </div>

        <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-line">
          {displayText}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 text-xs font-semibold self-start hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  )
}
