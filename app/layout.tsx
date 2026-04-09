import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Wishday — La tua lista desideri per le occasioni speciali',
  description:
    'Crea la tua lista desideri per compleanni, matrimoni, lauree e battesimi. Gli invitati possono prenotare regali e contribuire collettivamente.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Wishday',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Wishday',
  },
}

export const viewport: Viewport = {
  themeColor: '#0abab5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
