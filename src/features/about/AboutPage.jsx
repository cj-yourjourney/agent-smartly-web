import { useEffect, useRef } from 'react'
import {
  BookOpen,
  Code2,
  Home,
  Lightbulb,
  Mail,
  ExternalLink,
  Sparkles,
  Trophy
} from 'lucide-react'
import ROUTES from '../../shared/constants/routes'
import { useRouter } from 'next/router'

const EXAM_TOPICS = [
  {
    title: 'Practice of Real Estate & Disclosures',
    percent: 25,
    color: 'bg-primary'
  },
  {
    title: 'Laws of Agency & Fiduciary Duties',
    percent: 17,
    color: 'bg-secondary'
  },
  { title: 'Property Ownership & Land Use', percent: 15, color: 'bg-accent' },
  {
    title: 'Property Valuation & Financial Analysis',
    percent: 14,
    color: 'bg-info'
  },
  { title: 'Contracts', percent: 12, color: 'bg-success' },
  { title: 'Financing', percent: 9, color: 'bg-warning' },
  { title: 'Transfer of Property', percent: 8, color: 'bg-error' }
]

const TimelineItem = ({
  icon: Icon,
  year,
  title,
  children,
  last = false,
  iconClass = 'bg-primary/10 text-primary',
  yearClass = 'text-primary'
}) => (
  <div className="fade-in-up flex gap-4">
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full ${iconClass} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="h-5 w-5" />
      </div>
      {!last && <div className="w-px flex-1 bg-base-300 mt-2" />}
    </div>
    <div className="pb-6">
      <p
        className={`text-xs font-semibold ${yearClass} uppercase tracking-widest mb-1`}
      >
        {year}
      </p>
      <h3 className="font-bold text-base-content text-lg mb-1">{title}</h3>
      <p className="text-base-content/70 leading-relaxed">{children}</p>
    </div>
  </div>
)

const AboutPage = () => {
  const router = useRouter()
  const observerRef = useRef(null)

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-up')

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observerRef.current.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observerRef.current.observe(el))

    // Fallback: make all visible after 1s in case observer fails
    const fallback = setTimeout(() => {
      elements.forEach((el) => el.classList.add('visible'))
    }, 1000)

    return () => {
      observerRef.current?.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <div className="min-h-screen bg-base-100">
      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .stat-card:nth-child(1) { transition-delay: 0.1s; }
        .stat-card:nth-child(2) { transition-delay: 0.2s; }
        .stat-card:nth-child(3) { transition-delay: 0.3s; }
      `}</style>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 pt-16 pb-0 px-4">
        <div className="max-w-3xl mx-auto text-center pb-10">
          <div className="badge badge-primary badge-outline mb-4 font-semibold tracking-wide">
            Licensed CA Real Estate Salesperson
          </div>
          <div className="mb-6">
            <img
              src="https://cjluo.com/static/media/profile.cb5ba9c13f9d23e2ea90.png"
              alt="CJ, founder of AgentSmartly and licensed California Real Estate Salesperson"
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-primary/20 shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-extrabold text-base-content mb-5 leading-tight">
            Hi, I'm <span className="text-primary">CJ</span> 👋
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Software engineer turned real estate student — I built the exam prep
            tool I wish had existed when I started studying.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-sm text-base-content/50">
              Have a question or just want to say hi?
            </p>
            <a
              href="mailto:agentsmartly@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-base-300 bg-base-100 text-base-content font-medium text-sm shadow hover:border-primary hover:text-primary hover:shadow-md transition-all duration-200"
            >
              <Mail className="h-4 w-4" />
              agentsmartly@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Social Proof Stats ── */}
      <div className="bg-base-200/60 border-y border-base-300 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success border border-success/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
              <span>🎉</span> Students who passed the CA DRE Salesperson Exam
            </div>
            <p className="text-base-content/70 text-sm font-medium">
              Here's what their AgentSmartly journey looked like
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              {
                value: '75–80%',
                label: 'Accuracy',
                desc: 'Average score on practice questions',
                color: 'text-primary'
              },
              {
                value: '300–500',
                label: 'Questions',
                desc: 'Practice questions completed before exam day',
                color: 'text-secondary'
              },
              {
                value: '70%+',
                label: 'Key Concepts',
                desc: 'Of 134 key concepts mastered before exam day',
                color: 'text-accent'
              }
            ].map(({ value, label, desc, color }) => (
              <div
                key={label}
                className="fade-in-up stat-card bg-base-100 rounded-2xl px-6 py-8 shadow-sm"
              >
                <p className={`text-3xl font-extrabold ${color} mb-1`}>
                  {value}
                </p>
                <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wide mb-1">
                  {label}
                </p>
                <p className="text-sm text-base-content/60 leading-snug">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-10 space-y-10">
        {/* ── Story Timeline ── */}
        <section>
          <h2 className="text-2xl font-bold text-base-content mb-10">
            The Story
          </h2>

          <TimelineItem
            icon={Code2}
            year="2016 →"
            title="Software Engineer, Full Stack"
          >
            I've been building web products for nearly a decade — from APIs to
            front-end interfaces. Code is the way I think through problems.
          </TimelineItem>

          <TimelineItem
            icon={Home}
            year="2022"
            title="Falling in love with real estate"
          >
            Like a lot of engineers, I got drawn into real estate as an
            investment and wealth-building path. The more I learned, the more I
            wanted to go deeper.
          </TimelineItem>

          <TimelineItem
            icon={BookOpen}
            year="2023"
            title="Discovering the Salesperson Exam"
          >
            The California DRE Salesperson Exam gave me exactly what I needed: a
            clear, structured learning path covering agency law, financing,
            contracts, valuations, and disclosures. A real curriculum, not just
            trivia.
          </TimelineItem>

          <TimelineItem
            icon={Lightbulb}
            year="2024"
            title="Nothing on the market worked for me"
          >
            I tried the books. I tried the apps. Every solution felt the same —
            disconnected question banks with no sense of{' '}
            <em>where you actually stand</em>. No alignment to the real exam
            blueprint. No way to know if I was spending time on the right
            topics. I kept studying harder, not smarter.
          </TimelineItem>

          <TimelineItem
            icon={Sparkles}
            year="The solution"
            title="So I built AgentSmartly"
            iconClass="bg-primary text-primary-content"
            yearClass="text-primary"
          >
            <strong className="text-base-content">
              Passing the Real Estate Agent exam — smartly.
            </strong>{' '}
            Every practice question, every key concept, every progress metric on
            this site is mapped directly to the official DRE exam blueprint. You
            always know what you're studying, why it matters, and how much it
            counts on the real exam.
          </TimelineItem>

          <TimelineItem
            icon={Trophy}
            year="2025"
            title="Passed. Licensed. Proof it works."
            last={true}
            iconClass="bg-success text-success-content"
            yearClass="text-success"
          >
            I sat the California DRE Salesperson Exam and passed on my{' '}
            <strong className="text-base-content">first try</strong> — studying
            exclusively with AgentSmartly. This isn't just a side project. It's
            the tool I personally relied on, and it delivered. Now I'm sharing
            it with everyone on the same path.
          </TimelineItem>
        </section>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── Blueprint Section ── */}
        <section>
          <div className="fade-in-up flex items-center justify-between flex-wrap gap-3 mb-2">
            <h2 className="text-2xl font-bold text-base-content">
              The Blueprint
            </h2>
            <a
              href="https://www.dre.ca.gov/examinees/SalesExamContent.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm gap-1 text-primary"
            >
              DRE Source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="fade-in-up text-base-content/70 mb-8 leading-relaxed">
            The California DRE publishes the official topic breakdown for the
            Salesperson Exam. This is the foundation AgentSmartly is built on —
            every feature maps to these seven categories so you study
            efficiently and target your weak spots.
          </p>

          <div className="space-y-4">
            {EXAM_TOPICS.map(({ title, percent, color }) => (
              <div key={title} className="fade-in-up">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-base-content">
                    {title}
                  </span>
                  <span className="text-sm font-bold text-base-content/50">
                    ~{percent}%
                  </span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2.5">
                  <div
                    className={`${color} h-2.5 rounded-full`}
                    style={{ width: `${Math.min(percent * 2.8, 72)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="fade-in-up mt-6 bg-base-200 rounded-xl p-4 text-sm text-base-content/60 flex gap-2 items-start">
            <span className="mt-0.5">💡</span>
            <span>
              To pass, you need at least{' '}
              <strong className="text-base-content">70%</strong> correct
              answers. Knowing which topics carry the most weight — and tracking
              your weaknesses per category — is what makes the difference
              between studying hard and studying smart.
            </span>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── How Questions Are Made ── */}
        <section>
          <div className="fade-in-up mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-2">
              How the Questions Are Made
            </h2>
            <p className="text-base-content/70 leading-relaxed">
              Every practice question goes through a rigorous process combining
              human real estate experts and AI — so you're never studying from a
              low-quality question bank.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Crafted from the Blueprint',
                desc: 'Each question is written specifically against a key concept within a topic and subtopic from the DRE exam blueprint — not generated randomly. You always know exactly what a question is testing.',
                color: 'text-primary',
                bg: 'bg-primary/10'
              },
              {
                step: '02',
                title: 'Distractors Added',
                desc: 'Wrong answer choices are carefully designed to reflect common misconceptions and real exam traps — not obvious fillers. This trains you to think critically, not just memorize.',
                color: 'text-secondary',
                bg: 'bg-secondary/10'
              },
              {
                step: '03',
                title: 'Validated for Accuracy',
                desc: 'Every question is reviewed by licensed California Real Estate Salespersons and cross-checked by AI for factual accuracy, alignment to current California DRE standards, and exam-appropriate difficulty.',
                color: 'text-accent',
                bg: 'bg-accent/10'
              }
            ].map(({ step, title, desc, color, bg }) => (
              <div
                key={step}
                className="fade-in-up flex gap-5 bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center font-extrabold text-sm`}
                >
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-base-content mb-1">{title}</h3>
                  <p className="text-sm text-base-content/65 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="fade-in-up mt-6 bg-base-200 rounded-xl p-4 text-sm text-base-content/60 flex gap-2 items-start">
            <span className="mt-0.5">🤝</span>
            <span>
              Licensed California Real Estate Salespersons set the standard for
              accuracy and relevance. AI helps us scale it — ensuring every
              question is consistent and aligned to what actually appears on the
              exam.
            </span>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── Always Improving ── */}
        <section className="fade-in-up">
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Always Getting Better
          </h2>
          <p className="text-base-content/70 leading-relaxed mb-6">
            AgentSmartly is a living product — not a static question bank that
            was built once and forgotten. Student feedback directly shapes every
            update.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '📬',
                title: 'You report it',
                desc: 'Students flag confusing questions, outdated content, or missing topics.'
              },
              {
                icon: '🔍',
                title: 'We review it',
                desc: 'Every piece of feedback is reviewed by a human, not just filtered by an algorithm.'
              },
              {
                icon: '✅',
                title: 'We ship it',
                desc: 'Fixes, improvements, and new content are pushed regularly — the site you use today is better than it was last month.'
              }
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm text-center"
              >
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-bold text-base-content mb-1">{title}</h3>
                <p className="text-sm text-base-content/60 leading-snug">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-base-content/70 flex gap-2 items-start">
            <span className="mt-0.5">💬</span>
            <span>
              Have a suggestion or spotted something off? Your feedback is taken
              seriously — reach out at{' '}
              <a
                href="mailto:agentsmartly@gmail.com"
                className="text-primary font-medium hover:underline"
              >
                agentsmartly@gmail.com
              </a>{' '}
              and you'll hear back from CJ directly.
            </span>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="divider" />

        {/* ── CTA ── */}
        <section className="fade-in-up text-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 rounded-3xl p-12 border border-base-300">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Ready to start?
          </p>
          <h2 className="text-3xl font-extrabold text-base-content mb-4">
            Study smart. Pass first try.
          </h2>
          <p className="text-base-content/60 max-w-md mx-auto mb-8 leading-relaxed">
            Join the students who used AgentSmartly to pass the California DRE
            Salesperson Exam — knowing exactly what to study and where they
            stood every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
              className="btn btn-primary btn-lg"
            >
              Start Studying Free
            </button>
            <button
              onClick={() => router.push(ROUTES.LEARNING.PRACTICE)}
              className="btn btn-ghost btn-lg border border-base-300"
            >
              Try a Practice Question
            </button>
          </div>
          <p className="mt-8 text-xs text-base-content/40">
            Based in California 🌴 · Built with Next.js · Not affiliated with
            the California DRE
          </p>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
