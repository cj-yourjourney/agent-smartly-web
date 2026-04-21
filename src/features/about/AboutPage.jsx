// src/features/about/AboutPage.jsx
import { useRouter } from 'next/router'
import { ROUTES } from '@/shared/constants/routes'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-base-100">
      {/* ── HERO ── */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo side */}
            <div className="flex flex-col items-center lg:items-start gap-5">
              <img
                src="https://cjluo.com/static/media/profile.cb5ba9c13f9d23e2ea90.png"
                alt="CJ Luo — Founder of Agent Smartly"
                className="w-52 h-52 rounded-2xl object-cover shadow-xl border-4 border-base-100"
              />
              <div>
                <p className="font-bold text-base-content text-lg">CJ Luo</p>
                <p className="text-base-content/50 text-sm mt-0.5">
                  Software Engineer · CA Real Estate Agent · Founder
                </p>
                <a
                  href="mailto:agentsmartly@gmail.com"
                  className="text-sm text-primary hover:underline mt-1 block"
                >
                  agentsmartly@gmail.com
                </a>
              </div>
            </div>

            {/* Text side */}
            <div className="flex flex-col gap-5">
              <p className="text-primary font-bold tracking-widest text-xs uppercase">
                The Story Behind Agent Smartly
              </p>
              <h1 className="font-display text-4xl md:text-5xl leading-tight">
                Built by an Engineer Who{' '}
                <span className="font-display-italic text-primary">
                  Needed It Himself
                </span>
              </h1>
              <p className="text-base-content/60 text-lg leading-relaxed">
                This isn't a product built by a big company. It's a project born
                out of a layoff, a career pivot, and the stubborn belief that if
                you can't find the right tool — you build it.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  '🏙️ SF Bay Area since 2016',
                  '💻 Software Engineer',
                  '🏡 Real Estate Enthusiast',
                  '✅ Passed DRE Exam 2025'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-outline badge-md text-base-content/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-6">
        {/* Chapter 1 — The Builder */}
        <div className="card bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="bg-base-200 px-6 py-4 flex items-center gap-3 border-b border-base-300">
            <span className="text-2xl">💻</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-base-content/40">
                2016 — The Builder
              </p>
              <h2 className="font-bold text-base-content text-lg leading-tight">
                I've always loved building things
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3 text-base-content/65 leading-relaxed">
            <p>
              I've been a software engineer in the San Francisco Bay Area since
              2016 — building everything from websites to apps, shipping
              features, solving problems with code. It's not just a career for
              me. It's genuinely how I think.
            </p>
            <p>
              On weekends, my wife and I love visiting open houses. There's
              something about walking through a beautiful home — imagining the
              people who'll live there, the stories those walls will hold. Real
              estate always felt alive to me in a way that spreadsheets never
              could.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-base-300" />
        </div>

        {/* Chapter 2 — The Turning Point */}
        <div className="card bg-warning/5 border border-warning/25 rounded-2xl overflow-hidden">
          <div className="bg-warning/10 px-6 py-4 flex items-center gap-3 border-b border-warning/20">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-warning/70">
                2024 — The Turning Point
              </p>
              <h2 className="font-bold text-base-content text-lg leading-tight">
                I got laid off. Because of AI.
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3 text-base-content/65 leading-relaxed">
            <p>
              In 2024, my company let me go. The reason? AI. The very technology
              I'd spent years working alongside was now displacing the roles
              around it — including mine. I'd be lying if I said I wasn't
              shaken. I was shocked, lost, and honestly a little angry.
            </p>
            <p>
              But sitting with that uncertainty, something became clear: I
              wanted work that required being genuinely human. Face-to-face.
              Present. Irreplaceable. Real estate kept coming back to me — a
              career built on trust, relationships, and showing up in person.
              Hard to automate. Easy to love.
            </p>
          </div>
          <div className="mx-6 mb-6 rounded-xl border-l-4 border-warning bg-warning/10 px-5 py-4">
            <p className="text-base-content/75 italic leading-relaxed text-sm">
              "The irony isn't lost on me — a software engineer, displaced by
              AI, pivoting to one of the most human-centered industries there
              is."
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-base-300" />
        </div>

        {/* Chapter 3 — The Problem */}
        <div className="card bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="bg-base-200 px-6 py-4 flex items-center gap-3 border-b border-base-300">
            <span className="text-2xl">😤</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-base-content/40">
                2024 — The Problem
              </p>
              <h2 className="font-bold text-base-content text-lg leading-tight">
                Every prep tool I tried let me down
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3 text-base-content/65 leading-relaxed">
            <p>
              I enrolled in my pre-licensing course and started preparing for
              the DRE exam. I tried everything — prep books, flashcard apps,
              third-party exam sites. None of them felt right. The questions
              didn't map cleanly to the official DRE blueprint. The explanations
              were shallow. There was no way to know if I was actually ready or
              just spinning my wheels.
            </p>
            <p>
              As an engineer, there's a thought pattern that's hard to turn off:{' '}
              <span className="font-semibold text-base-content">
                if I can't find the right solution, I'll just build it.
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-base-300" />
        </div>

        {/* Chapter 4 — Building */}
        <div className="card bg-primary/5 border border-primary/20 rounded-2xl overflow-hidden">
          <div className="bg-primary/10 px-6 py-4 flex items-center gap-3 border-b border-primary/15">
            <span className="text-2xl">🛠️</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-primary/60">
                2024 — Building Agent Smartly
              </p>
              <h2 className="font-bold text-base-content text-lg leading-tight">
                So I built exactly what I needed
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3 text-base-content/65 leading-relaxed">
            <p>
              I started with the{' '}
              <a
                href="https://www.dre.ca.gov/examinees/SalesExamContent.html#property"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/70"
              >
                official DRE Salesperson Examination Content Outline
              </a>{' '}
              and used it as the backbone for everything — every practice
              question, every key concept, every topic weight. Not guesswork.
              The actual exam blueprint.
            </p>
            <p>
              Then I built the feature I wished I'd had from day one: an{' '}
              <span className="font-semibold text-base-content">
                Exam Readiness Score
              </span>
              . Not just a completion percentage — a composite score built on
              four pillars weighted to how the real exam is structured. It also
              factors in study freshness — because cramming three months ago and
              doing nothing since doesn't mean you're ready today.
            </p>
          </div>

          {/* Readiness Score Pillars */}
          <div className="px-6 pb-6 space-y-2">
            <p className="text-xs font-bold tracking-widest uppercase text-base-content/40 mb-3">
              Exam Readiness Score — 4 Pillars
            </p>
            {[
              {
                label: 'Accuracy',
                weight: 45,
                desc: 'Weighted by DRE topic weight'
              },
              {
                label: 'Question Volume',
                weight: 25,
                desc: 'Target: 300 questions answered'
              },
              {
                label: 'Topic Coverage',
                weight: 15,
                desc: '25+ questions per topic'
              },
              {
                label: 'Key Concepts',
                weight: 15,
                desc: '134 concepts, time-tracked'
              }
            ].map((p) => (
              <div key={p.label} className="bg-base-100 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-base-content">
                    {p.label}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {p.weight}%
                  </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-1.5 mb-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${p.weight * 2}%` }}
                  />
                </div>
                <p className="text-xs text-base-content/45">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-base-300" />
        </div>

        {/* Chapter 5 — The Proof */}
        <div className="card bg-success/5 border border-success/25 rounded-2xl overflow-hidden">
          <div className="bg-success/10 px-6 py-4 flex items-center gap-3 border-b border-success/20">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-success/60">
                2025 — The Proof
              </p>
              <h2 className="font-bold text-base-content text-lg leading-tight">
                I passed on my first try
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3 text-base-content/65 leading-relaxed">
            <p>
              In 2025, I sat for the DRE Salesperson Exam using Agent Smartly as
              my primary prep tool. I passed on the first attempt. That moment
              meant everything — not just because I'd earned my license, but
              because it proved the approach actually worked.
            </p>
            <p>
              I started sharing it with friends who were also preparing. They
              passed too. Word spread through referrals — no ads, no marketing
              budget, just people telling other people it worked. That organic
              growth told me something real was here.
            </p>
          </div>
          <div className="mx-6 mb-6 bg-success/10 border border-success/20 rounded-xl px-5 py-4 flex items-center gap-4">
            <span className="text-3xl">✅</span>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Passed the CA DRE Salesperson Exam on the{' '}
              <span className="font-semibold text-base-content">
                first attempt
              </span>
              , 2025. Shared with friends — they passed too.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-base-300" />
        </div>

        {/* Chapter 6 — Today */}
        <div className="card bg-primary border-0 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3 border-b border-primary-content/10">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-primary-content/50">
                Today — The Mission
              </p>
              <h2 className="font-bold text-primary-content text-lg leading-tight">
                This is my full-time work now
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3 text-primary-content/75 leading-relaxed">
            <p>
              Maintaining and improving Agent Smartly is my full-time job and
              genuine passion. It sits at the intersection of everything I care
              about — software, real estate, and helping people reach a goal
              that actually changes their lives.
            </p>
            <p>
              Every question, every concept, every feature on this site exists
              because I needed it myself first. I know exactly what it feels
              like to sit in that exam room. I built this so you walk in
              prepared.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-base-200 border-t border-base-300">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl md:text-4xl">
            Ready to Start Preparing?
          </h2>
          <p className="text-base-content/55 text-lg max-w-md">
            Start your free 3-day trial — no credit card required.
          </p>
          <div className="flex flex-col items-center gap-1.5">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
            >
              Start Free Trial →
            </button>
            <p className="text-base-content/40 text-xs font-medium">
              No subscription, ever.
            </p>
          </div>
          <p className="text-base-content/35 text-xs">
            3 days free · then $9.99 for 1-month access, billed once · no
            auto-renewal
          </p>
        </div>
      </div>
    </div>
  )
}
