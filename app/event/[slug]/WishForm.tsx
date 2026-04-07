'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Props { eventId: string }

export default function WishForm({ eventId }: Props) {
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!senderName || !content) { toast.error('Inserisci nome e messaggio'); return }
    setLoading(true)
    try {
      const { error } = await supabase.from('messages').insert({
        event_id: eventId,
        sender_name: senderName,
        sender_email: senderEmail || null,
        content,
        is_public: isPublic,
      })
      if (error) throw error
      setSent(true)
      toast.success('Augurio inviato! 🎉')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore invio augurio')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="border-purple-100 bg-purple-50">
        <CardContent className="py-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-semibold text-purple-700">Augurio inviato con successo!</p>
          <p className="text-sm text-gray-500 mt-1">Grazie per il tuo messaggio!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-100 shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Il tuo nome *</Label>
              <Input
                id="senderName"
                placeholder="Mario Rossi"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email (opzionale)</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="mario@esempio.it"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Il tuo augurio *</Label>
            <Textarea
              id="content"
              placeholder="Scrivi il tuo messaggio..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="isPublic" className="cursor-pointer text-sm">
                {isPublic ? 'Visibile a tutti' : 'Solo per il festeggiato'}
              </Label>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              {loading ? 'Invio...' : '💌 Invia augurio'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
