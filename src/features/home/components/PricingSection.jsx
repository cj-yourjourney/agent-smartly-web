// features/home/components/PricingSection.jsx
import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS, ACTIVE_SALE } from '@/features/pricing/pricingConfig'

export default function PricingSection() {
  const router = useRouter()

  return (
    <div className="py-24 px-4 bg-base-100 border-t border-base-200">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
          Pricing
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-center mb-3">
          One-Time Payment.
        </h2>
        <p className="text-center text-base-content/55 text-base mb-8 max-w-sm mx-auto">
          All plans include everything. Pick how long you need.
        </p>

        {/* Plan rows — same style as account page */}
        <div className="flex flex-col gap-2 mb-6">
          {PLANS.map((plan) => {
            const isPopular = plan.id === 'month'
            return (
              <div
                key={plan.id}
                className={`
                    flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all
                    ${
                      isPopular
                        ? 'border-primary bg-primary/5'
                        : 'border-base-300 bg-base-100'
                    }
                  `}
              >
                {/* Left: duration */}
                <div className="flex items-center gap-3">
                  {isPopular && (
                    <span className="badge badge-primary badge-sm font-semibold hidden sm:inline-flex">
                      Popular
                    </span>
                  )}
                  <div>
                    <span className="text-sm font-semibold text-base-content">
                      {plan.label}
                    </span>
                  </div>
                </div>

                {/* Right: price */}
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-sm font-bold text-base-content">
                    {plan.price}
                  </span>
                  {ACTIVE_SALE.enabled && plan.originalPrice && (
                    <span className="text-xs text-base-content/35 line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                  {ACTIVE_SALE.enabled && plan.saleSavings && (
                    <span className="text-[10px] font-semibold text-success">
                      {plan.saleSavings}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Single CTA */}
        <button
          className="btn btn-primary w-full h-12 text-base mb-5"
          onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
        >
          Start Free — Pick a Plan Later →
        </button>

        {/* Trust line */}
        <p className="text-center text-xs text-base-content/35">
          60 questions free · no credit card to start · one-time charge · no
          auto-renewal
        </p>
      </div>
    </div>
  )
}
