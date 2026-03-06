import type { Metadata } from 'next';
import { Poppins, Balsamiq_Sans } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

// Configuración de Poppins para el cuerpo del texto
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '600'],
  variable: '--font-poppins' // Variable para usar en CSS
});

// Configuración de Balsamiq Sans para los títulos
const balsamiq = Balsamiq_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-balsamiq' // Variable para usar en CSS
});

export const metadata: Metadata = {
  title: 'DIXEMA',
  description: 'Plataforma mayorista B2B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${balsamiq.variable}`}>
      <head>
        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="35x35"
          href="/images/logo-dixema.png"
        />

        {/* Font Awesome para iconos */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />

        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />

        {/* Swiper CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
      </head>

      <body>
        {children}

        {/* Scripts de terceros */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}