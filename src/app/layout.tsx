import '../styles/style.css'
import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DIXEMA',
  description: 'Plataforma mayorista B2B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="35x35"
          href="/images/logo-dixema.png"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
        {/*-- Linking Font Awesome for icons --*/}
        <link rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
        />
        {/*-- Linking Swiper CSS --*/}
        <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" 
        />

      </head>

      <body>
        {children}

        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" />
      </body>
    </html>
  )
}