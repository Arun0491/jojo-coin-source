import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en" data-bs-theme="dark">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src="/assets/js/plugins.js" strategy="beforeInteractive" />
      </body>
    </Html>
  )
}
