// features/home/components/FounderSection.jsx
import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'

export default function FounderSection() {
  const router = useRouter()

  return (
    <div className="py-20 px-4 bg-base-100 border-t border-base-200">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Photo + credential */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <img
              src="https://cjluo.com/static/media/profile.cb5ba9c13f9d23e2ea90.png"
              alt="CJ Luo — Founder of AgentSmartly"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-xl border-4 border-base-200"
            />
            <div className="text-center lg:text-left">
              <p className="font-bold text-base-content">CJ Luo</p>
              <p className="text-base-content/45 text-sm mt-0.5">
                Software Engineer · CA Real Estate Agent · Founder
              </p>
              <span className="badge badge-success badge-outline badge-sm mt-2">
                ✅ Passed DRE Exam 2025
              </span>
            </div>
          </div>

          {/* Story snippet */}
          <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <p className="text-primary font-bold tracking-widest text-xs uppercase">
              Why This Exists
            </p>
            <h2 className="font-display text-2xl sm:text-3xl leading-snug">
              I built this because I{' '}
              <span className="font-display-italic text-primary">
                needed it myself
              </span>
            </h2>
            <p className="text-base-content/60 leading-relaxed text-sm sm:text-base max-w-md">
              In 2024, I was laid off — because of AI. Looking for work that was
              genuinely human, I pivoted to real estate. Every prep tool I tried
              let me down, so I built my own from scratch using the official DRE
              blueprint. I passed on my first attempt in 2025. Then my friends
              used it. They passed too.
            </p>
            <button
              className="btn btn-outline btn-sm sm:btn-md"
              onClick={() => router.push(ROUTES.ABOUT)}
            >
              Read the full story →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
