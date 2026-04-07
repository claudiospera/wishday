'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Message } from '@/lib/types'

interface Props { eventId: string }

export default function MessagesView({ eventId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadMessages() }, [])

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  async function togglePublic(message: Message) {
    const { error } = await supabase
      .from('messages')
      .update({ is_public: !message.is_public })
      .eq('id', message.id)
    if (error) { toast.error('Errore aggiornamento'); return }
    await loadMessages()
  }

  async function deleteMessage(id: string) {
    if (!confirm('Eliminare questo messaggio?')) return
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) { toast.error('Errore eliminazione'); return }
    toast.success('Messaggio eliminato')
    await loadMessages()
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Caricamento...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{messages.length} auguri ricevuti</p>
      </div>

      {messages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-400">Nessun augurio ancora. Condividi il link con gli invitati!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{msg.sender_name}</span>
                      {msg.sender_email && (
                        <span className="text-xs text-gray-400">{msg.sender_email}</span>
                      )}
                      <Badge variant={msg.is_public ? 'default' : 'secondary'} className="text-xs">
                        {msg.is_public ? 'Pubblico' : 'Privato'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(msg.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Pubblico</span>
                      <Switch
                        checked={msg.is_public}
                        onCheckedChange={() => togglePublic(msg)}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-600 h-7 w-7 p-0"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
