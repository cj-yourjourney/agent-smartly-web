// src/features/account/components/InfoRow.jsx

export default function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-base-200 last:border-0 min-h-[56px]">
      <div className="text-base-content/40 shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-sm text-base-content/50 w-28 shrink-0 font-medium">
        {label}
      </span>
      <span className="text-sm font-semibold text-base-content flex-1 text-right break-all">
        {value || '—'}
      </span>
    </div>
  )
}
