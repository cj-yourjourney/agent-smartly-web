// features/home/components/CtaSection.jsx
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/features/pricing/pricingConfig'

export default function CtaSection() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="py-28 px-4 bg-primary relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
        <div className="badge bg-white/15 text-white border-0 px-4 py-3 text-xs font-semibold tracking-wider uppercase">
          ✓ 60 Free Questions — No Credit Card Required
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-primary-content">
          Start the Loop. Pass the Exam.
        </h2>
        <p className="text-primary-content/70 text-lg max-w-md">
          Review key concepts by topic. Practice questions in that topic. Repeat
          × 7. It's the most direct path — and it starts free.
        </p>
        {isAuthenticated ? (
          <button
            className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-xl mt-2"
            onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
          >
            Continue Practicing →
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none shadow-xl mt-2"
              onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
            >
              Start Free Trial →
            </button>
            <p className="text-primary-content/50 text-xs font-medium">
              60 questions free · then from {PLANS[0].price} · no auto-renewal
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
