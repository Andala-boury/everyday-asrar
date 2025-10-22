import './globals.css'
import type { Metadata } from 'next'
import { AbjadProvider } from '../src/contexts/AbjadContext'

export const metadata: Metadata = {
  title: 'Asrār Everyday - Islamic Numerology Explorer',
  description: 'Explore ʿIlm al-Ḥurūf (Science of Letters) and ʿIlm al-ʿAdad (Science of Numbers)',
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
