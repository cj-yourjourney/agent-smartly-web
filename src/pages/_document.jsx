// pages/_document.jsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        {/* Add any global meta tags, fonts, or icons here */}
        {/* Google Fonts: Manrope */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        
      </Head>
      <body className="bg-base-200 text-base-content">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
