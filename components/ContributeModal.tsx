'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatEuro, calculateProgress, themeColorMap } from '@/lib/utils'
import { toast } from 'sonner'
import type { WishItem } from '@/lib/types'

interface Props {
  item: WishItem
  hostPlan: string
  onClose: () => void
  onSuccess: (updated: WishItem) => void
  eventType?: string
  eventTitle?: string
  themeKey?: string
}

export default function ContributeModal({
  item, hostPlan, onClose, onSuccess, themeKey = 'purple',
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState(item.suggested_contribution?.toString() ?? '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const tc = themeColorMap[themeKey] ?? themeColorMap.purple
  const commission = hostPlan === 'premium' ? 1 : 3
  const progress = calculateProgress(item.collected_amount, item.price)
  const remaining = Math.max(item.price - item.collected_amount, 0)

  async function handleCheckout() {
    if (!name || !email) { toast.error('Inserisci nome ed email'); return }
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount < 5) { toast.error('Importo minimo €5'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishItemId: item.id,
          contributorName: name,
          contributorEmail: email,
          amount: numAmount,
          message: message || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Errore checkout')
      // Redirect a Stripe Checkout
      window.location.href = data.url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore durante il pagamento')
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contribuisci al regalo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Info regalo */}
          <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: tc.muted }}>
            <p className="font-semibold">{item.title}</p>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{formatEuro(item.collected_amount)} raccolti</span>
                <span className="font-medium" style={{ color: tc.text }}>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${progress}%`, backgroundColor: tc.progress }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Obiettivo: {formatEuro(item.price)} • Mancano: {formatEuro(remaining)}
              </p>
            </div>
          </div>

          {item.suggested_contribution && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(item.suggested_contribution!.toString())}
                style={{ borderColor: tc.border, color: tc.text }}
              >
                Quota suggerita {formatEuro(item.suggested_contribution)}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input placeholder="Mario Rossi" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="mario@esempio.it" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Importo (€) — minimo €5</Label>
            <Input
              type="number"
              min="5"
              step="1"
              placeholder="25"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Messaggio (opzionale)</Label>
            <Textarea
              placeholder="Un pensiero per il festeggiato..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
          </div>

          <p className="text-xs text-gray-400">
            Commissione piattaforma: {commission}% • Pagamento sicuro con Stripe
          </p>
          <p className="text-xs text-gray-400">
            Dopo il pagamento potrai creare un biglietto augurale da inviare al festeggiato 💌
          </p>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Annulla</Button>
            <Button
              className="flex-1 text-white"
              style={{ backgroundColor: tc.primary }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Reindirizzamento...' : `💳 Paga ${amount ? formatEuro(parseFloat(amount)) : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
