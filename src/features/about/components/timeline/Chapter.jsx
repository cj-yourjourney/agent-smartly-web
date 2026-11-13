export default function Chapter({
  accentClass = '',
  headerClass = '',
  borderClass = 'border-base-200',
  icon,
  year,
  title,
  children
}) {
  return (
    <div
      className={`card border rounded-2xl overflow-hidden ${accentClass} ${borderClass}`}
    >
      <div
        className={`px-5 sm:px-6 py-4 flex items-start gap-3 border-b ${headerClass}`}
      >
        <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase opacity-50 mb-0.5">
            {year}
          </p>
          <h2 className="font-bold text-base-content text-base sm:text-lg leading-snug">
            {title}
          </h2>
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-3 text-base-content/65 leading-relaxed text-sm sm:text-base">
        {children}
      </div>
    </div>
  )
}
