// pages/index.jsx
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[90vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Ace Your California Real Estate Agent Exam
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-base-content/80">
              Master all 7 topics with{' '}
              <span className="text-primary font-semibold">Agent Smartly</span>{' '}
              — Your complete exam prep solution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push('/practice')}
                    className="btn btn-primary btn-lg"
                  >
                    Start Practicing
                  </button>
                  <button
                    onClick={() => router.push('/progress')}
                    className="btn btn-outline btn-lg"
                  >
                    View Progress
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/signup')}
                    className="btn btn-primary btn-lg"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="btn btn-outline btn-lg"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to Pass
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-2xl mb-2">
                  Comprehensive Coverage
                </h3>
                <p className="text-base-content/70">
                  Practice questions covering all 7 main topics and every
                  subtopic on the California real estate exam
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-2xl mb-2">
                  Track Your Progress
                </h3>
                <p className="text-base-content/70">
                  Monitor your performance with detailed analytics and identify
                  weak areas to focus on
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-2xl mb-2">Smart Practice</h3>
                <p className="text-base-content/70">
                  Focus on specific topics or take full practice exams to
                  simulate the real test experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="py-20 px-4 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Master All 7 Core Topics
          </h2>
          <p className="text-center text-base-content/70 mb-12 text-lg">
            Complete coverage of the California Real Estate Salesperson Exam
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Property Ownership', icon: '🏠' },
              { title: 'Land Use & Regulations', icon: '📋' },
              { title: 'Valuation & Economics', icon: '💰' },
              { title: 'Financing', icon: '🏦' },
              { title: 'Transfer of Property', icon: '📝' },
              { title: 'Practice of Real Estate', icon: '🤝' },
              { title: 'Contracts', icon: '📄' }
            ].map((topic, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-base-100 rounded-lg shadow"
              >
                <div className="text-4xl">{topic.icon}</div>
                <div className="font-semibold text-lg">{topic.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Pass Your Exam?</h2>
          <p className="text-xl text-base-content/70 mb-8">
            Join hundreds of successful California real estate agents who
            prepared with Agent Smartly
          </p>
          {isAuthenticated ? (
            <button
              onClick={() => router.push('/practice')}
              className="btn btn-primary btn-lg"
            >
              Continue Practicing
            </button>
          ) : (
            <button
              onClick={() => router.push('/signup')}
              className="btn btn-primary btn-lg"
            >
              Start Practicing Now
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold text-lg">
            <span className="text-primary">Agent</span> Smartly
          </p>
          <p className="text-base-content/70">
            California Real Estate Exam Prep
          </p>
          <p className="text-sm text-base-content/60 mt-4">
            © {new Date().getFullYear()} Agent Smartly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
