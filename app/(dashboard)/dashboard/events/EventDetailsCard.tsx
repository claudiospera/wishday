'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Event, EventType } from '@/lib/types'

interface Props {
  event: Event
}

export default function EventDetailsCard({ event }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(event.title ?? '')
  const [type, setType] = useState<EventType>(event.type ?? 'birthday')
  const [date, setDate] = useState(event.date?.split('T')[0] ?? '')
  const [customEventType, setCustomEventType] = useState(event.custom_event_type ?? '')
  const [celebrantName, setCelebrantName] = useState(event.celebrant_name ?? '')
  const [eventLocation, setEventLocation] = useState(event.event_location ?? '')
  const [rsvpPhone, setRsvpPhone] = useState(event.rsvp_phone ?? '')
  const [description, setDescription] = useState(event.description ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !date) { toast.error('Nome evento e data sono obbligatori'); return }
    setLoading(true)
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title,
          type,
          date,
          description: description || null,
          celebrant_name: celebrantName || null,
          event_location: eventLocation || null,
          rsvp_phone: rsvpPhone || null,
          custom_event_type: customEventType || null,
        })
        .eq('id', event.id)
      if (error) throw error
      toast.success('Dettagli salvati!')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Dettagli evento</h2>

          <div className="space-y-2">
            <Label htmlFor="det-title">Nome evento *</Label>
            <Input
              id="det-title"
              placeholder="Es. Il mio 40° compleanno!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo evento *</Label>
              <Select value={type} onValueChange={(v) => setType(v as EventType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">🎂 Compleanno</SelectItem>
                  <SelectItem value="wedding">💍 Matrimonio</SelectItem>
                  <SelectItem value="graduation">🎓 Laurea</SelectItem>
                  <SelectItem value="baptism">🕊️ Battesimo</SelectItem>
                  <SelectItem value="other">🎉 Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="det-date">Data evento *</Label>
              <Input
                id="det-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {type === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="det-custom">Tipo di evento personalizzato</Label>
              <Input
                id="det-custom"
                placeholder="Es. Festa di pensionamento, Anniversario, ..."
                value={customEventType}
                onChange={(e) => setCustomEventType(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="det-celebrant">Nome festeggiato/a</Label>
            <Input
              id="det-celebrant"
              placeholder="Es. Claudia"
              value={celebrantName}
              onChange={(e) => setCelebrantName(e.target.value)}
            />
            <p className="text-xs text-gray-400">Appare in grande nell&apos;invito</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="det-location">Luogo dell&apos;evento</Label>
            <Input
              id="det-location"
              placeholder="Es. Via Roma 1, Milano"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="det-rsvp">WhatsApp del festeggiato (opzionale)</Label>
            <Input
              id="det-rsvp"
              placeholder="Es. +39 333 1234567"
              value={rsvpPhone}
              onChange={(e) => setRsvpPhone(e.target.value)}
            />
            <p className="text-xs text-gray-400">Gli ospiti potranno chattare su WhatsApp direttamente dalla pagina</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="det-desc">Messaggio di benvenuto</Label>
            <Textarea
              id="det-desc"
              placeholder="Scrivi un messaggio per i tuoi invitati..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-tiffany-700 hover:bg-tiffany-800 text-white"
              disabled={loading}
            >
              {loading ? 'Salvataggio...' : 'Salva dettagli'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
