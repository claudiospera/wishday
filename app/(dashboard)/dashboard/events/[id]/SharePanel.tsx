'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface Props { event: Event }

export default function SharePanel({ event }: Props) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishday.it'
  const pageUrl = `${APP_URL}/event/${event.slug}`
  const shareText = `🎉 Partecipa al mio ${event.title}! Guarda la mia wish list e scegli il regalo perfetto: ${pageUrl}`

  function copyLink() {
    navigator.clipboard.writeText(pageUrl)
    toast.success('Link copiato!')
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Condividi la tua pagina</h2>

        {/* URL */}
        <div className="flex gap-2">
          <Input value={pageUrl} readOnly className="text-sm" />
          <Button variant="outline" onClick={copyLink}>Copia</Button>
        </div>

        {/* Pulsanti social */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <span>📱</span> WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <span>✈️</span> Telegram
          </a>
          <a
            href={`mailto:?subject=La mia wish list — ${event.title}&body=${encodeURIComponent(shareText)}`}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <span>📧</span> Email
          </a>
          <Button variant="outline" onClick={copyLink} className="text-sm">
            🔗 Copia link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
