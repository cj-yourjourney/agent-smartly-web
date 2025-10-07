// src/pages/_app.jsx
import { Provider } from 'react-redux'
import { store } from '../shared/redux/store'
import Navbar from '../shared/components/Navbar'
import '../sytles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </Provider>
  )
}

export default MyApp
