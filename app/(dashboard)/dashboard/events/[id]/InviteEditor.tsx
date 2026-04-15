'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { inviteTemplates, InviteTemplateCard } from '@/components/InviteTemplate'
import type { Event } from '@/lib/types'

interface Props {
  event: Event
  userId: string
}

const TEMPLATE_CATEGORIES: { label: string; templates: string[] }[] = [
  { label: 'Compleanni adulti', templates: ['floreale-rosa', 'elegante-oro', 'notte-stellata', 'botanico', 'acquarello-blu'] },
  { label: 'Matrimonio', templates: ['matrimonio'] },
  { label: 'Laurea', templates: ['laurea'] },
  { label: 'Battesimo', templates: ['battesimo'] },
  { label: 'Compleanni bambini', templates: ['festa'] },
  { label: 'Generici', templates: ['generico-notte', 'generico-solare'] },
]

export default function InviteEditor({ event, userId }: Props) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    const url = event.invite_image_url
    if (url?.startsWith('template:')) return url.replace('template:', '')
    return null
  })
  const [customUrl, setCustomUrl] = useState<string | null>(() => {
    const url = event.invite_image_url
    if (url && !url.startsWith('template:')) return url
    return null
  })
  const [customUrlError, setCustomUrlError] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleTemplateSelect(key: string) {
    setSelectedKey(key)
    setCustomUrl(null)
    setCustomUrlError(false)
    const { error } = await supabase
      .from('events')
      .update({ invite_image_url: `template:${key}` })
      .eq('id', event.id)
    if (error) toast.error('Errore nel salvataggio')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Immagine troppo grande (max 10MB)')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/invite-bg-${event.id}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('invite-images')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('invite-images').getPublicUrl(path)
      const { error: updateError } = await supabase
        .from('events')
        .update({ invite_image_url: publicUrl })
        .eq('id', event.id)
      if (updateError) throw updateError
      setCustomUrl(publicUrl)
      setCustomUrlError(false)
      setSelectedKey(null)
      toast.success('Immagine caricata!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore nel caricamento')
    } finally {
      setUploading(false)
    }
  }

  async function removeCustom() {
    setCustomUrl(null)
    setCustomUrlError(false)
    setSelectedKey(null)
    await supabase.from('events').update({ invite_image_url: null }).eq('id', event.id)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="font-semibold text-gray-700">Invito digitale</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Scegli il template per l&apos;invito digitale da condividere con gli ospiti
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Left: template grid + upload */}
          <div className="flex-1 min-w-0 space-y-5">
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-600">Stile</p>
              {TEMPLATE_CATEGORIES.map(({ label, templates }) => (
                <div key={label} className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {templates.map((key) => {
                      const tpl = inviteTemplates[key]
                      if (!tpl) return null
                      const isSelected = selectedKey === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleTemplateSelect(key)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                            isSelected
                              ? 'border-tiffany-600 ring-2 ring-tiffany-400 scale-[1.03]'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          title={tpl.label}
                          style={{ aspectRatio: '4/3' }}
                        >
                          <div
                            className="w-full h-full flex flex-col items-center justify-center gap-1"
                            style={{ background: tpl.previewBg }}
                          >
                            <span className="text-2xl leading-none">{tpl.emoji}</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/35 py-0.5 px-1 text-center">
                            <span className="text-white text-[9px] font-medium leading-tight">{tpl.label}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom upload */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Oppure carica la tua immagine</p>
              <p className="text-xs text-gray-400">
                Invito da Canva, Instagram o altro — PNG, JPG, WebP (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploading ? '⏳ Caricamento...' : '📎 Carica immagine'}
                </button>
                {customUrl && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={customUrl}
                      alt="Anteprima upload"
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      onError={() => setCustomUrlError(true)}
                      onLoad={() => setCustomUrlError(false)}
                    />
                    <button
                      type="button"
                      onClick={removeCustom}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: preview */}
          <div className="flex-shrink-0 space-y-2">
            <p className="text-sm font-medium text-gray-600">Anteprima</p>
            <div style={{ width: 220 }}>
              {selectedKey ? (
                <InviteTemplateCard
                  templateKey={selectedKey}
                  title={event.title}
                  date={event.date}
                  eventType={event.type}
                  celebrantName={event.celebrant_name ?? null}
                  location={event.event_location ?? null}
                  rsvpPhone={event.rsvp_phone ?? null}
                  customEventType={event.custom_event_type ?? null}
                  mode="full"
                />
              ) : customUrl && !customUrlError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={customUrl}
                  alt="Anteprima invito"
                  className="w-full rounded-xl shadow-lg"
                  style={{ aspectRatio: '400/560', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-4"
                  style={{ width: 220, aspectRatio: '400/560' }}
                >
                  Seleziona un template per vedere l&apos;anteprima
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
