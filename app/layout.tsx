import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AbjadProvider } from '../src/contexts/AbjadContext'
import { LanguageProvider } from '../src/contexts/LanguageContext'
import { getSeoConfig } from '../src/lib/seoConfig'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://asrar-everyday.vercel.app'

// Get SEO config for default language (English)
const seoConfig = getSeoConfig('en');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#312e81' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: seoConfig.title,
  description: seoConfig.siteDescription,
  keywords: [
    'abjad',
    'ilm al huruf',
    'ilm al adad',
    'islamic numerology',
    'arabic letters',
    'huruf',
    'adad',
    'islamic sciences',
    'sufism',
    'tijani',
    'west african islam',
    'islamic esotericism',
    'gematria',
    'abjad calculator',
    'jafr',
    'letter science',
    'number science',
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'fr-FR': '/fr',
      'ar-SA': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'ar_SA'],
    url: baseUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.title,
    description: seoConfig.siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Asrār Everyday - Islamic Sciences Calculator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.title,
    description: seoConfig.siteDescription,
    images: ['/og-image.png'],
  },
  authors: [
    {
      name: 'Asrār Everyday',
      url: baseUrl,
    },
  ],
  creator: 'Asrār Everyday',
  category: 'Education',
  classification: 'Islamic Sciences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <LanguageProvider>
          <AbjadProvider>
            {children}
          </AbjadProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
