'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('wishday_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('wishday_cookie_consent', 'accepted')
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('wishday_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-300 flex-1">
          Utilizziamo cookie tecnici essenziali per il funzionamento del sito (autenticazione e pagamenti).
          Non usiamo cookie di profilazione o marketing.{' '}
          <Link href="/cookie" className="underline hover:text-white">
            Cookie Policy
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={reject}
            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent"
          >
            Rifiuta
          </Button>
          <Button
            size="sm"
            onClick={accept}
            className="bg-tiffany-500 hover:bg-tiffany-600 text-white border-0"
          >
            Accetta
          </Button>
        </div>
      </div>
    </div>
  )
}
