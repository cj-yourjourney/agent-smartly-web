// features/home/components/StickyMobileCta.jsx
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants/routes'

export default function StickyMobileCta() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-base-100/95 backdrop-blur border-t border-base-300 px-4 py-3 flex items-center gap-3 shadow-lg">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-base-content truncate">
          Start with 60 free questions
        </p>
        <p className="text-xs text-base-content/40">No credit card required</p>
      </div>
      <button
        className="btn btn-primary btn-sm shrink-0"
        onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
      >
        Start Free →
      </button>
    </div>
  )
}
