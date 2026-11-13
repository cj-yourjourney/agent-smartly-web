import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/features/pricing/pricingConfig'

export default function CtaSection() {
  const router = useRouter()

  return (
    <div className="bg-base-200 border-t border-base-300">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-14 sm:py-16 text-center flex flex-col items-center gap-5">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-snug">
          You've seen how I got here.{' '}
          <span className="text-primary">Now let's get you there.</span>
        </h2>
        <p className="text-base-content/55 text-base sm:text-lg max-w-md">
          144 concepts. 7 topics. Start with 60 free questions — no credit card
          required.
        </p>
        <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
          <button
            className="btn btn-primary btn-lg w-full sm:w-auto min-w-56"
            onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
          >
            Start Free Trial →
          </button>
          <p className="text-base-content/40 text-xs font-medium">
            60 questions free · then from {PLANS[0].price} · no auto-renewal
          </p>
        </div>
      </div>
    </div>
  )
}
