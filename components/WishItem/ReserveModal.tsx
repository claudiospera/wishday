'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { greetingCardConfig } from '@/lib/utils'
import type { WishItem } from '@/lib/types'

interface Props {
  item: WishItem
  onClose: () => void
  onSuccess: (updated: WishItem) => void
  eventType?: string
  eventTitle?: string
}

export default function ReserveModal({ item, onClose, onSuccess, eventType = 'other', eventTitle = '' }: Props) {
  const [step, setStep] = useState<'reserve' | 'card'>('reserve')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cardMessage, setCardMessage] = useState('')
  const [showGift, setShowGift] = useState(true)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const config = greetingCardConfig[eventType] ?? greetingCardConfig.other

  async function handleReserve() {
    if (!name) { toast.error('Inserisci il tuo nome'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishItemId: item.id, guestName: name, guestEmail: email }),
      })
      if (!res.ok) throw new Error('Errore prenotazione')
      const { data, error } = await supabase.from('wish_items').select('*').eq('id', item.id).single()
      if (error) throw error
      toast.success('Regalo prenotato! 🎁')
      onSuccess(data)
      setStep('card')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore prenotazione')
    } finally {
      setLoading(false)
    }
  }

  function buildCardText(): string {
    let text = `${config.decoration}\n\n${config.title}\n\n`
    if (cardMessage) text += `"${cardMessage}"\n\n`
    if (showGift) text += `🎁 Ti regalo: ${item.title}\n\n`
    text += `Con affetto,\n${name}\n\n— Wishday.it`
    return text
  }

  async function handleShare() {
    const text = buildCardText()
    if (typeof navigator !== 'undefined' && typeof (navigator as { share?: unknown }).share === 'function') {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title: `${config.title} - ${eventTitle}`, text })
      } catch {
        // annullato dall'utente
      }
    } else {
      await (navigator as Navigator).clipboard.writeText(text)
      toast.success('Testo copiato negli appunti!')
    }
  }

  const canShare = typeof navigator !== 'undefined' && typeof (navigator as { share?: unknown }).share === 'function'

  // Step 2: biglietto augurale
  if (step === 'card') {
    return (
      <Dialog open onOpenChange={onClose}>
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
              <div className="absolute top-2 left-2 text-lg opacity-30">{config.emoji}</div>
              <div className="absolute top-2 right-2 text-lg opacity-30">{config.emoji}</div>
              <div className="absolute bottom-2 left-2 text-lg opacity-30">{config.emoji}</div>
              <div className="absolute bottom-2 right-2 text-lg opacity-30">{config.emoji}</div>

              <div className="text-3xl tracking-widest">{config.decoration}</div>
              <div>
                <p className="font-bold text-xl text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {config.title}
                </p>
                {eventTitle && <p className="text-sm text-gray-500 mt-0.5">Per {eventTitle}</p>}
              </div>

              {cardMessage ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 text-sm italic text-gray-700 leading-relaxed border border-white/80">
                  &ldquo;{cardMessage}&rdquo;
                </div>
              ) : (
                <div className="bg-white/40 rounded-xl px-4 py-3 text-sm text-gray-400 italic">
                  Aggiungi un messaggio qui sotto...
                </div>
              )}

              {showGift && (
                <div className="bg-white/50 rounded-lg px-3 py-2 text-sm text-gray-600 border border-white/70">
                  🎁 <span className="font-medium">Ti regalo:</span> {item.title}
                </div>
              )}

              <div className="text-sm text-gray-600 pt-1">
                Con affetto, <span className="font-semibold text-gray-800">{name}</span>
              </div>
              <div className="text-xs text-gray-400 border-t border-white/50 pt-2">— Wishday.it</div>
            </div>

            <div className="space-y-1.5">
              <Label>Il tuo messaggio (opzionale)</Label>
              <Textarea
                placeholder="Scrivi un pensiero speciale..."
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-3 py-1">
              <Switch id="showGiftR" checked={showGift} onCheckedChange={setShowGift} />
              <Label htmlFor="showGiftR" className="cursor-pointer text-sm text-gray-700">
                Mostra cosa hai regalato
              </Label>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={onClose}>Chiudi</Button>
              <Button
                className="flex-1 bg-tiffany-700 hover:bg-tiffany-800 text-white"
                onClick={handleShare}
              >
                {canShare ? '📤 Condividi biglietto' : '📋 Copia testo'}
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center">Fai uno screenshot per salvare il biglietto come immagine</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 1: prenotazione
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prenota il regalo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-tiffany-50 rounded-lg p-3">
            <p className="font-medium text-sm">{item.title}</p>
          </div>
          <p className="text-sm text-gray-500">
            Inserisci il tuo nome per riservare questo regalo. Non verrà effettuato nessun pagamento — acquisterai il regalo in autonomia.
          </p>
          <div className="space-y-2">
            <Label>Il tuo nome *</Label>
            <Input placeholder="Mario Rossi" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email (opzionale)</Label>
            <Input type="email" placeholder="mario@esempio.it" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Annulla</Button>
            <Button
              className="flex-1 bg-tiffany-700 hover:bg-tiffany-800 text-white"
              onClick={handleReserve}
              disabled={loading}
            >
              {loading ? 'Prenotazione...' : '🎁 Prenota'}
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Dopo la prenotazione potrai creare un biglietto augurale da inviare al festeggiato 💌
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
