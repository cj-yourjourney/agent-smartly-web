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

export default function ReviewCard({ review }) {
  const { first_name, title, rating, content, created_at } = review

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="py-6 border-b border-base-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`${getAvatarColor(first_name)} text-white rounded-full w-11 h-11 flex items-center justify-center font-semibold text-sm shrink-0`}
        >
          {first_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold leading-tight">{first_name}</p>
          <p className="text-base-content/50 text-xs">{formattedDate}</p>
        </div>
      </div>

      <div
        className="rating rating-sm mb-2"
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

      {title && <h3 className="font-semibold text-base mb-1.5">{title}</h3>}

      <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  )
}
