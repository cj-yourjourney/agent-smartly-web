export default function StudyGroup() {
  const topics = [
    'Property Ownership and Land Use Controls and Regulations',
    'Laws of Agency and Fiduciary Duties',
    'Property Valuation and Financial Analysis',
    'Financing',
    'Transfer of Property',
    'Practice of Real Estate and Disclosures (Includes Specialty Areas)',
    'Contracts'
  ]

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">
              California Real Estate Salesperson Exam Study Group
            </h1>
            <p className="text-xl mb-8">
              Join fellow exam candidates every Thursday for collaborative study
              sessions
            </p>
            <a
              href="https://meet.google.com/ivm-eqtn-xfi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              Join Study Session
            </a>
            <p className="mt-4 text-sm opacity-70">
              Every Thursday • 6:00 - 7:00 PM PST
            </p>
          </div>
        </div>
      </div>

      {/* Session Format */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Session Format</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Intros</h3>
              <p className="text-sm opacity-70">5 minutes</p>
              <p>Meet your study partners and connect with fellow candidates</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Practice Questions</h3>
              <p className="text-sm opacity-70">40 minutes</p>
              <p>
                Work through 20 questions together, discuss answers, and clarify
                concepts
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg">Study Tips</h3>
              <p className="text-sm opacity-70">15 minutes</p>
              <p>Share what works and learn effective test-taking techniques</p>
            </div>
          </div>
        </div>

        {/* Topics Rotation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Weekly Topics</h2>
          <p className="text-center mb-8 opacity-80">
            Each week focuses on one of the seven main exam topics
          </p>

          <div className="space-y-3">
            {topics.map((topic, index) => (
              <div key={index} className="card bg-base-100 shadow-sm">
                <div className="card-body py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="badge badge-neutral">{index + 1}</div>
                    <p className="flex-1">{topic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="card bg-primary text-primary-content shadow-lg">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl mb-4">
              Ready to Study Together?
            </h2>
            <p className="mb-6">
              Join us this Thursday at 6:00 PM PST for focused, collaborative
              exam preparation
            </p>
            <a
              href="https://meet.google.com/ivm-eqtn-xfi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              Join on Google Meet
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-100 text-base-content">
        <div>
          <p className="font-semibold">Weekly Online Study Sessions</p>
          <p>Every Thursday • 6:00 - 7:00 PM PST</p>
        </div>
      </footer>
    </div>
  )
}
