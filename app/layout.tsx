import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AbjadProvider } from '../src/contexts/AbjadContext'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://asrar-everyday.vercel.app'

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
  title: 'Asrār Everyday - ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Calculator',
  description: 'Explore the Islamic sciences of Letter Numerology (ʿIlm al-Ḥurūf) and Number Science (ʿIlm al-ʿAdad). Calculate Abjad values, discover elemental associations, and receive traditional spiritual guidance based on classical sources. Educational and cultural exploration tool - not for divination.',
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
    siteName: 'Asrār Everyday',
    title: 'Asrār Everyday - ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Calculator',
    description: 'Explore the Islamic sciences of Letter Numerology and Number Science with our comprehensive Abjad calculator and spiritual guidance tool.',
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
    title: 'Asrār Everyday - ʿIlm al-Ḥurūf & ʿIlm al-ʿAdad Calculator',
    description: 'Explore Islamic Letter Numerology and Number Science with Abjad calculator and spiritual guidance.',
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
      <body>
        <AbjadProvider>
          {children}
        </AbjadProvider>
      </body>
    </html>
  )
}
