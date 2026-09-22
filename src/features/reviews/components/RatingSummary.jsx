export default function RatingSummary({ averageRating, count, breakdown }) {
  if (!count) return null

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 px-8 py-7 flex flex-col md:flex-row gap-8 md:items-center">
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-6xl font-bold text-indigo-600 leading-none">
          {averageRating}
        </div>
        <div className="flex flex-col gap-1">
          <div
            className="rating rating-md"
            aria-label={`${averageRating} out of 5 average stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                className="mask mask-star-2 bg-orange-400"
                checked={star === Math.round(averageRating)}
                readOnly
                disabled
              />
            ))}
          </div>
          <p className="text-base-content/60 text-sm">
            Based on {count} review{count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-w-[200px]">
        {[5, 4, 3, 2, 1].map((star) => {
          const starCount = breakdown[star] || 0
          const percent = count ? Math.round((starCount / count) * 100) : 0

          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 text-base-content/60">{star}</span>
              <div className="flex-1 h-1.5 rounded-full bg-base-200 overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-6 text-right text-base-content/50">
                {starCount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
