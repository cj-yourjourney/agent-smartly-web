// src/features/pricing/components/PlanSelector.jsx
//
//  A drop-in plan-picker that is automatically sale-aware.
//  Reads PLANS from pricingConfig — no props needed for pricing data.
//
//  Usage (inside PaymentForm or anywhere):
//    import PlanSelector from '@/features/pricing/components/PlanSelector'
//    <PlanSelector selected={selectedPlan} onChange={setSelectedPlan} />
// ─────────────────────────────────────────────────────────────────────────────
import { PLANS, ACTIVE_SALE } from '../pricingConfig'

export default function PlanSelector({ selected, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wide block mb-2">
        Choose Your Plan
      </label>

      <div className="space-y-2">
        {PLANS.map((plan) => {
          const isSelected = selected?.id === plan.id

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange(plan)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl
                border-2 transition-all text-left
                ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-base-300 bg-base-100 hover:border-primary/40'
                }
              `}
            >
              {/* ── Left: radio + label ─────────────────────────────────── */}
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-4 h-4 rounded-full border-2 flex items-center
                    justify-center shrink-0
                    ${isSelected ? 'border-primary' : 'border-base-300'}
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>

                <div>
                  <span className="text-sm font-semibold text-base-content">
                    {plan.label}
                  </span>
                  <span className="text-xs text-base-content/50 ml-2">
                    {plan.description}
                  </span>
                </div>
              </div>

              {/* ── Right: price (+ strikethrough original when on sale) ── */}
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-bold text-base-content">
                  {plan.price}
                </span>

                {ACTIVE_SALE.enabled && plan.originalPrice && (
                  <span className="text-xs text-base-content/40 line-through">
                    {plan.originalPrice}
                  </span>
                )}

                {ACTIVE_SALE.enabled && plan.saleSavings && (
                  <span className="text-[10px] font-semibold text-success">
                    {plan.saleSavings}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
