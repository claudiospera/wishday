'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { inviteTemplates, templateConfig, InviteTemplateCard } from '@/components/InviteTemplate'
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

function parseInviteUrl(url: string | null | undefined): { key: string | null; palette: number } {
  if (!url?.startsWith('template:')) return { key: null, palette: 0 }
  const parts = url.replace('template:', '').split(':')
  return { key: parts[0], palette: parts[1] ? parseInt(parts[1]) : 0 }
}

export default function InviteEditor({ event, userId }: Props) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parsed = parseInviteUrl(event.invite_image_url)
  const [selectedKey, setSelectedKey] = useState<string | null>(parsed.key)
  const [selectedPalette, setSelectedPalette] = useState<number>(parsed.palette)
  const [customUrl, setCustomUrl] = useState<string | null>(() => {
    const url = event.invite_image_url
    if (url && !url.startsWith('template:')) return url
    return null
  })
  const [customUrlError, setCustomUrlError] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function saveTemplate(key: string, palette: number) {
    const value = palette > 0 ? `template:${key}:${palette}` : `template:${key}`
    const { error } = await supabase
      .from('events')
      .update({ invite_image_url: value })
      .eq('id', event.id)
    if (error) toast.error('Errore nel salvataggio')
  }

  async function handleTemplateSelect(key: string) {
    setSelectedKey(key)
    setSelectedPalette(0)
    setCustomUrl(null)
    setCustomUrlError(false)
    await saveTemplate(key, 0)
  }

  async function handlePaletteSelect(palette: number) {
    if (!selectedKey) return
    setSelectedPalette(palette)
    await saveTemplate(selectedKey, palette)
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

  const activeCfg = selectedKey ? templateConfig[selectedKey] : null
  const palettes = activeCfg?.palettes ?? []

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
          {/* Left: template grid + palette + upload */}
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

            {/* Palette picker */}
            {selectedKey && palettes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Variante colore</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Dot 0 = colore default */}
                  <button
                    type="button"
                    onClick={() => handlePaletteSelect(0)}
                    title="Colori originali"
                    style={{ background: inviteTemplates[selectedKey]?.previewBg }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedPalette === 0
                        ? 'border-gray-800 scale-110 shadow'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  />
                  {palettes.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePaletteSelect(i + 1)}
                      title={`Variante ${i + 1}`}
                      style={{ background: p.dot }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedPalette === i + 1
                          ? 'border-gray-800 scale-110 shadow'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

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

          {/* Right: phone mockup preview */}
          <div className="flex-shrink-0 space-y-2">
            <p className="text-sm font-medium text-gray-600">Anteprima</p>
            {/* Phone shell */}
            <div style={{
              position: 'relative',
              width: 260,
              background: '#1c1c1e',
              borderRadius: 44,
              padding: '52px 10px 58px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35), inset 0 0 0 1px #3a3a3c, inset 0 0 0 3px #2a2a2c',
            }}>
              {/* Side buttons */}
              <div style={{ position: 'absolute', left: -3, top: 100, width: 3, height: 32, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 142, width: 3, height: 52, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 204, width: 3, height: 52, background: '#3a3a3c', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', right: -3, top: 140, width: 3, height: 70, background: '#3a3a3c', borderRadius: '0 2px 2px 0' }} />
              {/* Notch / Dynamic Island */}
              <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#1c1c1e', borderRadius: 12, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0a0a0a' }} />
                <div style={{ width: 28, height: 8, borderRadius: 4, background: '#0a0a0a' }} />
              </div>
              {/* Screen bezel */}
              <div style={{ borderRadius: 32, overflow: 'hidden', background: '#000', position: 'relative' }}>
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
                    palette={selectedPalette}
                  />
                ) : customUrl && !customUrlError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={customUrl}
                    alt="Anteprima invito"
                    className="w-full"
                    style={{ aspectRatio: '400/560', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center text-gray-400 text-xs text-center p-4"
                    style={{ width: '100%', aspectRatio: '400/560', background: '#111' }}
                  >
                    Seleziona un template
                  </div>
                )}
              </div>
              {/* Home indicator */}
              <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 100, height: 4, background: '#48484a', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
