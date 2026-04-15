'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { INVITE_TEMPLATES, type TemplateKey } from './invite-templates'

const TEMPLATE_CATEGORIES: { label: string; templates: TemplateKey[] }[] = [
  { label: 'Compleanni adulti', templates: ['botanico', 'sabbia', 'nero'] },
  { label: 'Matrimonio', templates: ['matrimonio'] },
  { label: 'Laurea', templates: ['laurea'] },
  { label: 'Battesimo', templates: ['battesimo'] },
  { label: 'Compleanni bambini', templates: ['bimbi', 'spazio'] },
  { label: 'Generici', templates: ['generico'] },
]
import type { Event } from '@/lib/types'

interface Props {
  event: Event
  userId: string
}

const EVENT_LABELS: Record<string, string> = {
  birthday: 'Compleanno',
  wedding: 'Matrimonio',
  graduation: 'Laurea',
  baptism: 'Battesimo',
  other: 'Evento Speciale',
}

export default function InviteEditor({ event, userId }: Props) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [templateKey, setTemplateKey] = useState<TemplateKey>(
    (event.invite_template as TemplateKey | undefined) ?? 'botanico'
  )
  const [paletteIdx, setPaletteIdx] = useState<number>(event.invite_palette ?? 0)
  const [customBg, setCustomBg] = useState<string | null>(event.invite_image_url ?? null)
  const [customBgError, setCustomBgError] = useState(false)
  const [uploading, setUploading] = useState(false)

  const template = INVITE_TEMPLATES[templateKey]
  const palette = template.palettes[paletteIdx]

  const dateFormatted = event.date
    ? new Date(event.date).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''
  const eventLabel = EVENT_LABELS[event.type] ?? 'Evento Speciale'

  async function save(newTemplate: TemplateKey, newPalette: number) {
    const { error } = await supabase
      .from('events')
      .update({ invite_template: newTemplate, invite_palette: newPalette })
      .eq('id', event.id)
    if (error) toast.error('Errore nel salvataggio')
  }

  function handleTemplateChange(key: TemplateKey) {
    setTemplateKey(key)
    setPaletteIdx(0)
    save(key, 0)
  }

  function handlePaletteChange(idx: number) {
    setPaletteIdx(idx)
    save(templateKey, idx)
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
      setCustomBg(publicUrl)
      setCustomBgError(false)
      toast.success('Immagine caricata!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore nel caricamento')
    } finally {
      setUploading(false)
    }
  }

  async function removeCustomBg() {
    setCustomBg(null)
    setCustomBgError(false)
    await supabase.from('events').update({ invite_image_url: null }).eq('id', event.id)
  }

  const previewBg = (customBg && !customBgError)
    ? `url(${customBg}) center / cover no-repeat`
    : palette.bg

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="font-semibold text-gray-700">Invito digitale</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Scegli stile e palette per l&apos;invito digitale da condividere con gli ospiti
          </p>
        </div>

        {/* Template selector */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">Stile</p>
          {TEMPLATE_CATEGORIES.map(({ label, templates }) => (
            <div key={label} className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTemplateChange(key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      templateKey === key
                        ? 'bg-tiffany-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {INVITE_TEMPLATES[key].name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left col: palette + upload */}
          <div className="space-y-5 flex-1 min-w-0">
            {/* Palette swatches */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Palette colori</p>
              <div className="flex gap-3 flex-wrap">
                {template.palettes.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePaletteChange(idx)}
                    title={p.name}
                    className={`w-8 h-8 rounded-full transition-all ${
                      paletteIdx === idx
                        ? 'ring-2 ring-offset-2 ring-tiffany-500 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ background: p.bg }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400">{palette.name}</p>
            </div>

            {/* Custom image upload */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Sfondo personalizzato</p>
              <p className="text-xs text-gray-400">
                Carica un&apos;immagine per sostituire lo sfondo del template (max 10MB)
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
                  {uploading ? '⏳ Caricamento...' : '📎 Carica immagine custom'}
                </button>
                {customBg && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={customBg}
                      alt="Sfondo personalizzato"
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      onError={() => setCustomBgError(true)}
                      onLoad={() => setCustomBgError(false)}
                    />
                    <button
                      type="button"
                      onClick={removeCustomBg}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right col: phone frame preview */}
          <div className="flex-shrink-0 space-y-2">
            <p className="text-sm font-medium text-gray-600">Anteprima</p>

            <div className="relative mx-auto" style={{ width: 196, height: 392 }}>
              {/* Phone shell */}
              <div className="absolute inset-0 rounded-[2rem] border-[7px] border-gray-800 shadow-2xl overflow-hidden bg-black">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-gray-900 rounded-full z-20" />

                {/* Screen */}
                <div className="absolute inset-0" style={{ background: previewBg }}>
                  <div
                    className="flex flex-col items-center justify-center h-full px-4 text-center pt-5"
                    style={{ fontFamily: `'${template.font}', serif` }}
                  >
                    {/* Tag evento */}
                    <div
                      className="text-[8px] tracking-widest uppercase mb-3 px-2.5 py-0.5 rounded-full border"
                      style={{ color: palette.tag, borderColor: `${palette.tag}55` }}
                    >
                      {eventLabel}
                    </div>

                    {/* Separatore top */}
                    <div className="flex items-center gap-1.5 mb-2 w-full justify-center">
                      <div className="h-px flex-1 max-w-[36px]" style={{ background: palette.sep }} />
                      <span style={{ color: palette.sep, fontSize: 6 }}>✦</span>
                      <div className="h-px flex-1 max-w-[36px]" style={{ background: palette.sep }} />
                    </div>

                    {/* Nome festeggiato */}
                    <div
                      className="text-[18px] font-bold leading-tight mb-1 px-2"
                      style={{
                        color: palette.nameColor,
                        fontStyle: template.italic ? 'italic' : 'normal',
                      }}
                    >
                      {event.celebrant_name || event.title}
                    </div>

                    {/* Separatore bottom */}
                    <div className="flex items-center gap-1.5 my-2 w-full justify-center">
                      <div className="h-px flex-1 max-w-[36px]" style={{ background: palette.sep }} />
                      <span style={{ color: palette.sep, fontSize: 6 }}>✦</span>
                      <div className="h-px flex-1 max-w-[36px]" style={{ background: palette.sep }} />
                    </div>

                    {/* Tipo evento */}
                    <div
                      className="text-[9px] tracking-wide uppercase mb-2.5"
                      style={{ color: palette.event }}
                    >
                      ti invita al suo {eventLabel.toLowerCase()}
                    </div>

                    {/* Data */}
                    {dateFormatted && (
                      <div className="text-[8px] mb-1" style={{ color: palette.date }}>
                        {dateFormatted}
                      </div>
                    )}

                    {/* Luogo */}
                    {event.event_location && (
                      <div className="text-[7px] opacity-90 mt-0.5 px-2 leading-relaxed" style={{ color: palette.venue }}>
                        {event.event_location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
