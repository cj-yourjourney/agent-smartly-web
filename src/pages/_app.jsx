// src/pages/_app.jsx
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { Provider } from 'react-redux'
import { DefaultSeo } from 'next-seo'
import { store } from '../shared/redux/store'
import { DEFAULT_SEO } from '../shared/constants/seoConfig'
import AuthProvider from '../features/auth/components/AuthProvider'
import Navbar from '../shared/components/Navbar'
import '../sytles/globals.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init('phc_RVwdiW3q1GG2KWzeAnxGuMFNPBbq53am6SgCZ5oYnJJ', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2025-05-24',
        person_profiles: 'identified_only',
        loaded: (ph) => {
          ph.register({ app: 'agentsmartly' })
        }
      })
    }
  }, [])

  return (
    <Provider store={store}>
      <DefaultSeo {...DEFAULT_SEO} />
      <AuthProvider>
        <div className="min-h-screen bg-base-200">
          <Navbar />
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </AuthProvider>
    </Provider>
  )
}

export default MyApp
