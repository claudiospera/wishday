'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { WishItem } from '@/lib/types'

interface Props {
  item: WishItem
  onClose: () => void
  onSuccess: (updated: WishItem) => void
}

export default function ReserveModal({ item, onClose, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleReserve() {
    if (!name) { toast.error('Inserisci il tuo nome'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('wish_items')
        .update({
          status: 'reserved',
          reserved_by_name: name,
          reserved_by_email: email || null,
        })
        .eq('id', item.id)
        .select()
        .single()
      if (error) throw error
      toast.success('Regalo prenotato! 🎁')
      onSuccess(data)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore prenotazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prenota il regalo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-3">
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
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
              onClick={handleReserve}
              disabled={loading}
            >
              {loading ? 'Prenotazione...' : '🎁 Prenota'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
