import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disabilita PWA in sviluppo
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
  // Permetti immagini con tag <img> senza next/image nelle pagine pubbliche
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'wishday.it', 'www.wishday.it'],
    },
  },
}

export default pwaConfig(nextConfig)
