'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { generateSlug, eventThemes, coverGradients, getCoverStyle } from '@/lib/utils'
import { toast } from 'sonner'
import type { Event, EventType, EventTheme } from '@/lib/types'

interface Props {
  userId: string
  userPlan?: string
  event?: Event // Se passato, siamo in modalità modifica
}

export default function EventForm({ userId, userPlan, event }: Props) {
  const router = useRouter()
  const isEdit = !!event

  const [title, setTitle] = useState(event?.title ?? '')
  const [type, setType] = useState<EventType>(event?.type ?? 'birthday')
  const [date, setDate] = useState(event?.date?.split('T')[0] ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [slug, setSlug] = useState(event?.slug ?? '')
  const [isPublic, setIsPublic] = useState(event?.is_public ?? true)
  const [iban, setIban] = useState(event?.iban ?? '')
  const [bankOwnerName, setBankOwnerName] = useState(event?.bank_owner_name ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(event?.cover_image_url ?? '')
  const [theme, setTheme] = useState<EventTheme | null>(event?.theme ?? null)
  const [celebrantName, setCelebrantName] = useState(event?.celebrant_name ?? '')
  const [eventLocation, setEventLocation] = useState(event?.event_location ?? '')
  const [rsvpPhone, setRsvpPhone] = useState(event?.rsvp_phone ?? '')
  const [customEventType, setCustomEventType] = useState(event?.custom_event_type ?? '')
  const [shipName, setShipName] = useState('')
  const [shipStreet, setShipStreet] = useState('')
  const [shipCap, setShipCap] = useState('')
  const [shipCity, setShipCity] = useState('')
  const [shipProvince, setShipProvince] = useState('')
  const [shipCountry, setShipCountry] = useState('Italia')
  const [loading, setLoading] = useState(false)

  // Componi stringa indirizzo per il DB
  function buildShippingAddress(): string | null {
    const parts = [shipName, shipStreet, [shipCap, shipCity, shipProvince ? `(${shipProvince})` : ''].filter(Boolean).join(' '), shipCountry]
      .map((s) => s.trim()).filter(Boolean)
    return parts.length > 0 ? parts.join('\n') : null
  }
  const [uploadingImage, setUploadingImage] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const slugDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const supabase = createClient()

  // Controlla disponibilità slug (debounced)
  useEffect(() => {
    if (!slug || slug === event?.slug) { setSlugAvailable(null); return }
    setSlugAvailable(null)
    if (slugDebounce.current) clearTimeout(slugDebounce.current)
    slugDebounce.current = setTimeout(async () => {
      const { data } = await supabase.from('events').select('id').eq('slug', slug).maybeSingle()
      setSlugAvailable(!data)
    }, 500)
    return () => { if (slugDebounce.current) clearTimeout(slugDebounce.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Genera slug automatico dal titolo
  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit) {
      setSlug(generateSlug(value))
    }
  }

  // Upload immagine copertina su Supabase Storage
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Immagine troppo grande (max 5MB)'); return }
    setUploadingImage(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `covers/${userId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('wishday').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('wishday').getPublicUrl(path)
      setCoverImageUrl(publicUrl)
      toast.success('Immagine caricata!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore upload immagine')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !date || !slug) {
      toast.error('Compila tutti i campi obbligatori')
      return
    }
    if (slugAvailable === false) {
      toast.error('Lo slug non è disponibile')
      return
    }
    setLoading(true)
    try {
      if (isEdit && event) {
        // Aggiorna evento esistente
        const { error } = await supabase
          .from('events')
          .update({
            title, type, date, description, slug,
            is_public: isPublic, iban: iban || null,
            bank_owner_name: bankOwnerName || null,
            cover_image_url: coverImageUrl || null,
            theme: theme || null,
            shipping_address: buildShippingAddress(),
            celebrant_name: celebrantName || null,
            event_location: eventLocation || null,
            rsvp_phone: rsvpPhone || null,
            custom_event_type: customEventType || null,
          })
          .eq('id', event.id)
        if (error) throw error
        toast.success('Evento aggiornato!')
        router.refresh()
      } else {
        // Crea nuovo evento
        const { data, error } = await supabase
          .from('events')
          .insert({
            user_id: userId, title, type, date, description, slug,
            is_public: isPublic, iban: iban || null,
            bank_owner_name: bankOwnerName || null,
            cover_image_url: coverImageUrl || null,
            theme: theme || null,
            shipping_address: buildShippingAddress(),
            celebrant_name: celebrantName || null,
            event_location: eventLocation || null,
            rsvp_phone: rsvpPhone || null,
            custom_event_type: customEventType || null,
          })
          .select()
          .single()
        if (error) throw error
        toast.success('Evento creato!')
        router.push(`/dashboard/events/${data.id}`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore durante il salvataggio'
      if (message.includes('duplicate') || message.includes('unique')) {
        toast.error('Questo slug è già in uso. Scegli un nome diverso.')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Dettagli evento</h2>

          <div className="space-y-2">
            <Label htmlFor="title">Nome evento *</Label>
            <Input
              id="title"
              placeholder="Es. Il mio 40° compleanno!"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
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
              <Label htmlFor="date">Data evento *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {type === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="customEventType">Tipo di evento personalizzato</Label>
              <Input
                id="customEventType"
                placeholder="Es. Festa di pensionamento, Anniversario, ..."
                value={customEventType}
                onChange={(e) => setCustomEventType(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="celebrantName">Nome festeggiato/a</Label>
            <Input
              id="celebrantName"
              placeholder="Es. Claudia"
              value={celebrantName}
              onChange={(e) => setCelebrantName(e.target.value)}
            />
            <p className="text-xs text-gray-400">Appare in grande nell&apos;invito</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventLocation">Luogo dell&apos;evento</Label>
            <Input
              id="eventLocation"
              placeholder="Es. Via Roma 1, Milano"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsvpPhone">WhatsApp del festeggiato (opzionale)</Label>
            <Input
              id="rsvpPhone"
              placeholder="Es. +39 333 1234567"
              value={rsvpPhone}
              onChange={(e) => setRsvpPhone(e.target.value)}
            />
            <p className="text-xs text-gray-400">Gli ospiti potranno chattare su WhatsApp direttamente dalla pagina</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Messaggio di benvenuto</Label>
            <Textarea
              id="description"
              placeholder="Scrivi un messaggio per i tuoi invitati..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="font-semibold text-gray-700">URL e visibilità</h2>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug URL *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">wishday.it/event/</span>
              <div className="relative flex-1">
                <Input
                  id="slug"
                  placeholder="mario-40-compleanno"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  required
                  className={slugAvailable === false ? 'border-red-400 focus-visible:ring-red-400' : slugAvailable === true ? 'border-green-400 focus-visible:ring-green-400' : ''}
                />
                {slugAvailable === true && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>}
                {slugAvailable === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">✗</span>}
              </div>
            </div>
            {slugAvailable === false && <p className="text-xs text-red-500">Slug già in uso, scegline un altro.</p>}
            {slugAvailable !== false && <p className="text-xs text-gray-400">Solo lettere, numeri e trattini. Deve essere univoco.</p>}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <div>
              <Label htmlFor="isPublic" className="cursor-pointer">Pagina pubblica</Label>
              <p className="text-xs text-gray-400">
                {isPublic ? 'Chiunque con il link può vedere la tua pagina' : 'La pagina è nascosta'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tieni la pagina privata mentre prepari i regali, poi rendila pubblica per condividere il link con gli ospiti.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Foto copertina</h2>

          {/* Anteprima copertina */}
          {coverImageUrl && (
            <div className="relative h-40 rounded-lg overflow-hidden">
              {coverImageUrl.startsWith('gradient:') ? (
                <div className="w-full h-full" style={getCoverStyle(coverImageUrl)} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImageUrl} alt="Copertina" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}

          {/* Sfondi predefiniti — solo premium */}
          {userPlan === 'premium' && (
            <div className="space-y-2">
              <Label>Sfondi predefiniti</Label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(coverGradients).map(([key, preset]) => {
                  const selected = coverImageUrl === `gradient:${key}`
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCoverImageUrl(selected ? '' : `gradient:${key}`)}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selected ? 'border-tiffany-600 ring-2 ring-tiffany-400' : 'border-transparent hover:border-gray-300'
                      }`}
                      title={preset.label}
                    >
                      <div className="w-full h-full" style={{ background: preset.gradient }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg leading-none">{preset.emoji}</span>
                        <span className="text-white text-[10px] font-medium mt-0.5 drop-shadow">{preset.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imageUpload">Carica immagine (max 5MB)</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Oppure inserisci URL immagine</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tema colore */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-700">Tema colore</h2>
            <p className="text-xs text-gray-400 mt-0.5">Personalizza i colori della pagina pubblica del tuo evento</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(Object.entries(eventThemes) as [EventTheme, typeof eventThemes[EventTheme]][]).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key === theme ? null : key)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                  theme === key ? 'border-tiffany-600' : 'border-transparent hover:border-gray-200'
                }`}
                title={t.label}
              >
                <div className={`w-10 h-10 rounded-full ${t.previewClass}`} />
                <span className="text-xs text-gray-600">{t.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Bonifico diretto (opzionale)</h2>
          <p className="text-sm text-gray-400">
            Permetti agli invitati di fare un bonifico diretto senza commissioni
          </p>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              placeholder="IT60 X054 2811 1010 0000 0123 456"
              value={iban}
              onChange={(e) => setIban(e.target.value.replace(/\s/g, '').toUpperCase())}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankOwnerName">Intestatario del conto</Label>
            <Input
              id="bankOwnerName"
              placeholder="Mario Rossi"
              value={bankOwnerName}
              onChange={(e) => setBankOwnerName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-700">Indirizzo di spedizione (opzionale)</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Se compilato, verrà mostrato sulla pagina pubblica con un tasto "Copia indirizzo" — utile per gli invitati che vogliono far recapitare il regalo direttamente a casa tua.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipName">Nome destinatario</Label>
            <Input id="shipName" placeholder="Mario Rossi" value={shipName} onChange={(e) => setShipName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipStreet">Via e numero civico</Label>
            <Input id="shipStreet" placeholder="Via Roma 1" value={shipStreet} onChange={(e) => setShipStreet(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="shipCap">CAP</Label>
              <Input id="shipCap" placeholder="20121" maxLength={5} value={shipCap} onChange={(e) => setShipCap(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipCity">Città</Label>
              <Input id="shipCity" placeholder="Milano" value={shipCity} onChange={(e) => setShipCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipProvince">Prov.</Label>
              <Input id="shipProvince" placeholder="MI" maxLength={2} value={shipProvince} onChange={(e) => setShipProvince(e.target.value.toUpperCase())} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipCountry">Nazione</Label>
            <Input id="shipCountry" placeholder="Italia" value={shipCountry} onChange={(e) => setShipCountry(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annulla
        </Button>
        <Button
          type="submit"
          className="bg-tiffany-700 hover:bg-tiffany-800 text-white"
          disabled={loading || uploadingImage || uploadingInvite}
        >
          {loading ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : 'Crea evento'}
        </Button>
      </div>
    </form>
  )
}
