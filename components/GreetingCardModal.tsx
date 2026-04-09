'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { greetingCardConfig } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
  eventType: string
  eventTitle: string
  senderName: string
  giftName?: string
  defaultMessage?: string
}

export default function GreetingCardModal({
  open, onClose, eventType, eventTitle, senderName, giftName, defaultMessage = '',
}: Props) {
  const [message, setMessage] = useState(defaultMessage)
  const [showGift, setShowGift] = useState(true)

  const config = greetingCardConfig[eventType] ?? greetingCardConfig.other

  function buildCardText(): string {
    let text = `${config.decoration}\n\n${config.title}\n\n`
    if (message) text += `"${message}"\n\n`
    if (showGift && giftName) text += `🎁 Ti regalo: ${giftName}\n\n`
    text += `Con affetto,\n${senderName}\n\n— Wishday.it`
    return text
  }

  async function handleShare() {
    const text = buildCardText()
    if (typeof navigator !== 'undefined' && typeof (navigator as { share?: unknown }).share === 'function') {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title: `${config.title} - ${eventTitle}`, text })
      } catch {
        // l'utente ha annullato
      }
    } else {
      await (navigator as Navigator).clipboard.writeText(text)
      toast.success('Testo copiato negli appunti!')
    }
  }

  const canShare = typeof navigator !== 'undefined' && typeof (navigator as { share?: unknown }).share === 'function'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Il tuo biglietto augurale 💌</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Anteprima biglietto */}
          <div
            style={{ background: config.bg }}
            className="rounded-2xl p-6 text-center shadow-md space-y-3 relative overflow-hidden"
          >
            {/* Decorazione angoli */}
            <div className="absolute top-2 left-2 text-lg opacity-30">{config.emoji}</div>
            <div className="absolute top-2 right-2 text-lg opacity-30">{config.emoji}</div>
            <div className="absolute bottom-2 left-2 text-lg opacity-30">{config.emoji}</div>
            <div className="absolute bottom-2 right-2 text-lg opacity-30">{config.emoji}</div>

            <div className="text-3xl tracking-widest">{config.decoration}</div>

            <div>
              <p
                className="font-bold text-xl text-gray-800"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {config.title}
              </p>
              {eventTitle && (
                <p className="text-sm text-gray-500 mt-0.5">Per {eventTitle}</p>
              )}
            </div>

            {message ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 text-sm italic text-gray-700 leading-relaxed border border-white/80">
                &ldquo;{message}&rdquo;
              </div>
            ) : (
              <div className="bg-white/40 rounded-xl px-4 py-3 text-sm text-gray-400 italic">
                Aggiungi un messaggio qui sotto...
              </div>
            )}

            {showGift && giftName && (
              <div className="bg-white/50 rounded-lg px-3 py-2 text-sm text-gray-600 border border-white/70">
                🎁 <span className="font-medium">Ti regalo:</span> {giftName}
              </div>
            )}

            <div className="text-sm text-gray-600 pt-1">
              Con affetto,{' '}
              <span className="font-semibold text-gray-800">{senderName}</span>
            </div>
            <div className="border-t border-white/50 pt-2 flex items-center justify-center gap-1.5">
              <Image src="/logo.png" alt="Wishday" width={16} height={16} className="rounded opacity-60" />
              <span className="text-xs text-gray-400">Wishday.it</span>
            </div>
          </div>

          {/* Messaggio personalizzato */}
          <div className="space-y-1.5">
            <Label>Il tuo messaggio (opzionale)</Label>
            <Textarea
              placeholder="Scrivi un pensiero speciale per il festeggiato..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          {/* Toggle mostra regalo */}
          {giftName && (
            <div className="flex items-center gap-3 py-1">
              <Switch
                id="showGift"
                checked={showGift}
                onCheckedChange={setShowGift}
              />
              <Label htmlFor="showGift" className="cursor-pointer text-sm text-gray-700">
                Mostra cosa hai regalato
              </Label>
            </div>
          )}

          {/* Azioni */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Chiudi
            </Button>
            <Button
              className="flex-1 bg-tiffany-700 hover:bg-tiffany-800 text-white"
              onClick={handleShare}
            >
              {canShare ? '📤 Condividi' : '📋 Copia testo'}
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Fai uno screenshot per salvare il biglietto come immagine
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
