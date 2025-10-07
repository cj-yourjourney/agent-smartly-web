// pages/_app.jsx
import { Provider } from 'react-redux'
import { store } from '../shared/redux/store'
import '../sytles/globals.css'


export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
