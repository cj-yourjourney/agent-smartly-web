// features/home/components/how-it-works/StepDivider.jsx
export default function StepDivider() {
  return (
    <div className="flex items-center justify-center mb-24 gap-4">
      <div className="flex-1 h-px bg-base-300" />
      <span className="text-primary text-2xl">↓</span>
      <div className="flex-1 h-px bg-base-300" />
    </div>
  )
}
