// src/pages/_app.jsx
import { Provider } from 'react-redux'
import { DefaultSeo } from 'next-seo'
import { store } from '../shared/redux/store'
import { DEFAULT_SEO } from '../shared/constants/seoConfig'
import AuthProvider from '../features/auth/components/AuthProvider'
import Navbar from '../shared/components/Navbar'
import '../sytles/globals.css'

function MyApp({ Component, pageProps }) {
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
