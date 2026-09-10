// features/marketing/components/YouTubeSection.jsx
import { Youtube, PlayCircle, ExternalLink } from 'lucide-react'

const CHANNEL_HANDLE = '@AgentSmartly'
const CHANNEL_URL = `https://www.youtube.com/${CHANNEL_HANDLE}`

// Top 6 videos, sorted to match the channel's "Popular" tab.
// Update the `id` fields with the real video IDs (the part after watch?v=).
// Reorder / swap out titles here whenever the popular ranking shifts.
const youtubeVideos = [
  {
    id: 'yXpeQu77QKg',
    title: 'Accretion Reliction Erosion Avulsion | CA Real Estate Exam'
  },
  {
    id: 'aRE6JNnsAtk',
    title: 'Stigmatized Property Explained | CA Real Estate Exam + Memory Trick'
  },
  {
    id: 'UaJ6HNrqYJE',
    title: 'Special vs General vs Universal Agent | CA Real Estate Exam'
  },
  {
    id: 'NFhBqxDxnfY',
    title: 'Zoning Classifications Explained | California Real Estate Exam Prep'
  },
  {
    id: 'qesg406cRMM',
    title:
      'Severance vs Annexation | California Real Estate Exam + Memory Tricks'
  },
  {
    id: 'pKDV0VRPOLQ',
    title:
      'CA Real Estate Exam: Doctrine of Prior Appropriation (+ Memory Trick)'
  }
]

export default function YouTubeSection() {
  return (
    <div className="py-24 px-4 bg-base-200 border-t border-base-300">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
          Free Lessons
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
          Learn With Us on YouTube
        </h2>
        <p className="text-center text-base-content/60 text-lg mb-4 max-w-xl mx-auto">
          Short, focused breakdowns of the concepts that trip people up most —
          straight from the same key concepts inside Agent Smartly.
        </p>

        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mb-12 text-sm font-semibold text-base-content/70 hover:text-primary transition-colors"
        >
          <Youtube className="w-5 h-5 text-primary" />
          {CHANNEL_HANDLE} on YouTube
          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {youtubeVideos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 overflow-hidden hover:border-primary/40 transition-colors"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
            >
              <div className="relative aspect-video bg-base-300 overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <PlayCircle
                    className="w-12 h-12 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="px-4 pb-4">
                <p className="font-semibold text-sm leading-snug line-clamp-2 text-base-content">
                  {video.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
