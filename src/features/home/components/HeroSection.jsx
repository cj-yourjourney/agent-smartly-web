// features/home/components/HeroSection.jsx
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'
import RatingBadge from '@/features/marketing/components/RatingBadge'

export default function HeroSection() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-[88vh] bg-base-200 flex items-center relative overflow-hidden hero-bg-dots">
      {/* Decorative blob behind image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content — always first in DOM so it appears first on mobile */}
        <div className="flex flex-col gap-5">
          <h1
            className="font-display text-4xl md:text-5xl leading-tight hero-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            144 Key Concepts.
            <br />
            Pass the CA Real Estate Salesperson Exam —<br />
            <span className="italic text-primary">Nothing More.</span>
          </h1>

          <p
            className="text-lg text-base-content/70 max-w-lg hero-fade-up"
            style={{ animationDelay: '120ms' }}
          >
            <span className="font-semibold text-base-content">7 topics.</span>{' '}
            Review. Practice. Check. Repeat.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 mt-1 hero-fade-up"
            style={{ animationDelay: '240ms' }}
          >
            {isAuthenticated ? (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
                >
                  Start Practicing Now →
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => router.push(ROUTES.LEARNING.PROGRESS)}
                >
                  View My Progress
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg hero-btn"
                  onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
                >
                  Start Free Trial →
                </button>
                <button
                  className="btn btn-ghost btn-lg"
                  onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          <div
            className="flex flex-col gap-1.5 hero-fade-up"
            style={{ animationDelay: '360ms' }}
          >
            <RatingBadge />
            <p className="text-sm text-base-content/45 flex items-center gap-1.5">
              <span className="text-success text-base hero-check">✓</span>
              500+ people passed the CA real estate exam using AgentSmartly
            </p>
            <p className="text-sm text-base-content/45 flex items-center gap-1.5">
              <span className="text-success text-base hero-check">✓</span>
              60 free questions · No credit card required
            </p>
          </div>
        </div>

        {/* Hero Image — AFTER text in DOM, so it appears below H1 on mobile       */}
        {/* hero-float lives directly on the <img> so the GPU compositing layer    */}
        {/* IS the image itself — rasterized at full device pixel ratio (sharp 2x) */}
        {/* drop-shadow replaces box-shadow so no wrapper div needs overflow:hidden */}
        <div
          className="flex justify-center items-center hero-fade-up relative z-10"
          style={{ animationDelay: '200ms' }}
        >
          <img
            src="https://agent-smartly-images.s3.us-west-1.amazonaws.com/hero-image.png"
            alt="Study method: Review Key Concepts → Practice Questions → Check Your Progress, repeated for all 7 DRE exam topics"
            className="w-full h-auto block hero-float"
            style={{
              filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.10))'
            }}
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}
