// pages/_app.jsx
import '../sytles/globals.css' // Make sure Tailwind/DaisyUI is imported here

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
