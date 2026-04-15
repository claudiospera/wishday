import type { Metadata, Viewport } from 'next'
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Nunito,
  Plus_Jakarta_Sans,
  Dancing_Script,
  Pacifico,
} from 'next/font/google'
import { Toaster } from 'sonner'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
})

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const pacifico = Pacifico({
  variable: '--font-pacifico',
  subsets: ['latin'],
  weight: '400',
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
  themeColor: '#9de7d7',
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
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${nunito.variable} ${plusJakarta.variable} ${dancingScript.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="top-right" richColors />
        <CookieBanner />
      </body>
    </html>
  )
}
