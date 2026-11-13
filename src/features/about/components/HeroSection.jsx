export default function HeroSection() {
  return (
    <div className="bg-base-200 border-b border-base-300">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Photo + byline */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <img
              src="https://cjluo.com/static/media/profile.cb5ba9c13f9d23e2ea90.png"
              alt="CJ Luo — Founder of Agent Smartly"
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-xl border-4 border-base-100"
            />
            <div className="text-center lg:text-left">
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

          {/* Headline + tags */}
          <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <p className="text-primary font-bold tracking-widest text-xs uppercase">
              The Story Behind Agent Smartly
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight">
              Built by an Engineer Who{' '}
              <span className="font-display-italic text-primary">
                Needed It Himself
              </span>
            </h1>
            <p className="text-base-content/60 text-base sm:text-lg leading-relaxed max-w-md">
              No prep book. No guesswork. Just{' '}
              <span className="font-semibold text-base-content">
                144 concepts
              </span>
              ,{' '}
              <span className="font-semibold text-base-content">7 topics</span>,
              and a clear loop that tells you exactly what to study next —
              built by someone who passed using it.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {[
                '🏙️ SF Bay Area since 2016',
                '💻 Software Engineer',
                '🏡 Real Estate Enthusiast',
                '✅ Passed DRE Exam 2025'
              ].map((tag) => (
                <span
                  key={tag}
                  className="badge badge-outline badge-md text-base-content/60 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Social proof stat strip */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-2 border-t border-base-300 w-full">
              {[
                { value: '500+', label: 'people passed' },
                { value: '144', label: 'concepts — nothing extra' },
                { value: '×7', label: "topics, then you're done" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center lg:items-start"
                >
                  <span className="text-base font-black text-base-content">
                    {stat.value}
                  </span>
                  <span className="text-xs text-base-content/45">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
