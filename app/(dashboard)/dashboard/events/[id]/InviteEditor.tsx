'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { inviteTemplates, templateConfig, INVITE_FONTS, InviteTemplateCard } from '@/components/InviteTemplate'
import type { Event } from '@/lib/types'

interface Props {
  event: Event
  userId: string
}

// Tutti i template in ordine piatto per la strip orizzontale
const ALL_TEMPLATES = [
  { group: 'Adulti', keys: ['floreale-rosa', 'elegante-oro', 'notte-stellata', 'botanico', 'acquarello-blu'] },
  { group: 'Matrimonio', keys: ['matrimonio'] },
  { group: 'Laurea', keys: ['laurea'] },
  { group: 'Battesimo', keys: ['battesimo'] },
  { group: 'Bambini', keys: ['festa', 'arcobaleno-kids', 'spazio-cosmico', 'unicorno-pastello'] },
  { group: 'Generici', keys: ['generico-notte', 'generico-solare'] },
  { group: 'Semplici', keys: ['minimalista', 'couture-nero'] },
]

const ALL_KEYS = ALL_TEMPLATES.flatMap(({ keys }) => keys)

function parseInviteUrl(url: string | null | undefined): { key: string | null; palette: number; font: number } {
  if (!url?.startsWith('template:')) return { key: null, palette: 0, font: 0 }
  const parts = url.replace('template:', '').split(':')
  return { key: parts[0] || null, palette: parseInt(parts[1] ?? '0') || 0, font: parseInt(parts[2] ?? '0') || 0 }
}

export default function InviteEditor({ event, userId }: Props) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parsed = parseInviteUrl(event.invite_image_url)
  const [selectedKey, setSelectedKey] = useState<string | null>(parsed.key)
  const [selectedPalette, setSelectedPalette] = useState<number>(parsed.palette)
  const [selectedFont, setSelectedFont] = useState<number>(parsed.font)
  const [customUrl, setCustomUrl] = useState<string | null>(() => {
    const url = event.invite_image_url
    if (url && !url.startsWith('template:')) return url
    return null
  })
  const [customUrlError, setCustomUrlError] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function saveTemplate(key: string, palette: number, font: number) {
    const { error } = await supabase
      .from('events')
      .update({ invite_image_url: `template:${key}:${palette}:${font}` })
      .eq('id', event.id)
    if (error) toast.error('Errore nel salvataggio')
  }

  async function handleTemplateSelect(key: string) {
    setSelectedKey(key)
    setSelectedPalette(0)
    setCustomUrl(null)
    setCustomUrlError(false)
    await saveTemplate(key, 0, selectedFont)
  }

  async function handlePaletteSelect(palette: number) {
    if (!selectedKey) return
    setSelectedPalette(palette)
    await saveTemplate(selectedKey, palette, selectedFont)
  }

  async function handleFontSelect(font: number) {
    setSelectedFont(font)
    if (selectedKey) await saveTemplate(selectedKey, selectedPalette, font)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Immagine troppo grande (max 10MB)'); return }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/invite-bg-${event.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('invite-images').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('invite-images').getPublicUrl(path)
      const { error: updateError } = await supabase.from('events').update({ invite_image_url: publicUrl }).eq('id', event.id)
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

  function handleShare() {
    const url = `${window.location.origin}/event/${event.slug}`
    navigator.clipboard.writeText(url).then(() => toast.success('Link copiato!')).catch(() => toast.error('Impossibile copiare'))
  }

  const activeCfg = selectedKey ? templateConfig[selectedKey] : null
  const palettes = activeCfg?.palettes ?? []

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h2 className="font-semibold text-gray-700">Invito digitale</h2>
          <p className="text-xs text-gray-400 mt-0.5">Scegli template, colore e font per il tuo invito</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left: pannello scrollabile */}
          <div className="flex-1 min-w-0 overflow-y-auto max-h-[600px] pr-2 space-y-4">

            {/* Template grid — tutti i template in griglia continua */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Stile</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_KEYS.map((key) => {
                  const tpl = inviteTemplates[key]
                  if (!tpl) return null
                  const isSelected = selectedKey === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTemplateSelect(key)}
                      title={tpl.label}
                      className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected ? 'border-tiffany-600 ring-2 ring-tiffany-400 scale-[1.05]' : 'border-transparent hover:border-gray-300'
                      }`}
                      style={{ width: 64, height: 48 }}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center gap-0.5" style={{ background: tpl.previewBg }}>
                        {tpl.emoji && <span className="text-lg leading-none">{tpl.emoji}</span>}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 px-0.5 text-center">
                        <span className="text-white text-[8px] font-medium leading-tight truncate block">{tpl.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Palette picker — dots a scorrimento orizzontale */}
            {selectedKey && palettes.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-gray-600">Variante colore</p>
                <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handlePaletteSelect(0)}
                    title="Originale"
                    style={{ background: inviteTemplates[selectedKey]?.previewBg, minWidth: 28, minHeight: 28 }}
                    className={`w-7 h-7 rounded-full border-2 flex-shrink-0 transition-all ${selectedPalette === 0 ? 'border-gray-800 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                  />
                  {palettes.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePaletteSelect(i + 1)}
                      title={`Variante ${i + 1}`}
                      style={{ background: p.dot, minWidth: 28, minHeight: 28 }}
                      className={`w-7 h-7 rounded-full border-2 flex-shrink-0 transition-all ${selectedPalette === i + 1 ? 'border-gray-800 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Font picker */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-600">Font</p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {INVITE_FONTS.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFontSelect(i)}
                    title={f.label}
                    className={`rounded-lg border-2 py-1.5 px-1 text-center transition-all ${selectedFont === i ? 'border-tiffany-600 bg-tiffany-50 scale-[1.04]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span style={{ fontFamily: f.fontFamily }} className="text-sm font-semibold text-gray-700 block">Aa</span>
                    <span className="text-[9px] text-gray-400 block leading-tight mt-0.5">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom upload */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-600">Oppure carica la tua immagine</p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP (max 10MB)</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
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
                    <img src={customUrl} alt="Anteprima" className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      onError={() => setCustomUrlError(true)} onLoad={() => setCustomUrlError(false)} />
                    <button type="button" onClick={removeCustom} className="text-xs text-red-500 hover:text-red-700">Rimuovi</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: phone mockup sticky */}
          <div className="flex-shrink-0 sticky top-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Anteprima</p>

            {/* Phone mockup — no background */}
            <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', gap:16 }}>

              {/* Phone frame */}
              <div style={{
                position:'relative',
                width:270,
                background:'linear-gradient(160deg,#2e2e2e,#1c1c1c)',
                borderRadius:52,
                padding:'14px 10px 18px',
                boxShadow:'0 0 0 1px rgba(0,0,0,0.12), 0 12px 40px rgba(0,0,0,0.18)',
              }}>
                {/* Notch */}
                <div style={{
                  position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
                  width:110, height:26, background:'#1c1c1c',
                  borderRadius:'0 0 18px 18px', zIndex:10,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                }}>
                  <div style={{ width:9, height:9, borderRadius:'50%', background:'#111', border:'1.5px solid #3a3a3a' }} />
                  <div style={{ width:36, height:7, borderRadius:4, background:'#111', border:'1.5px solid #3a3a3a' }} />
                </div>

                {/* Screen */}
                <div style={{ borderRadius:40, overflow:'hidden', lineHeight:0, position:'relative' }}>
                  {/* Status bar */}
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, height:30, zIndex:5,
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'0 16px',
                    background:'linear-gradient(to bottom,rgba(0,0,0,0.3),transparent)',
                  }}>
                    <span style={{ color:'#fff', fontSize:11, fontWeight:700, fontFamily:'system-ui' }}>9:41</span>
                    <span style={{ color:'#fff', fontSize:10, fontFamily:'system-ui', opacity:0.8 }}>● ● ●  ▐</span>
                  </div>

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
                      font={selectedFont}
                    />
                  ) : customUrl && !customUrlError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={customUrl} alt="Anteprima" style={{ width:'100%', aspectRatio:'400/560', objectFit:'cover', display:'block' }} />
                  ) : (
                    <div style={{ width:'100%', aspectRatio:'400/560', background:'#181818', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ color:'#444', fontSize:12, textAlign:'center', padding:'0 16px', lineHeight:1.4, fontFamily:'system-ui' }}>
                        Seleziona un template
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottoni azione */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:'100%' }}>
                <button
                  type="button"
                  onClick={handleShare}
                  className="transition-transform active:scale-95"
                  style={{ background:'#c7f0d8', color:'#166534', fontWeight:700, fontSize:13, padding:'12px 0', borderRadius:16, cursor:'pointer', border:'none', boxShadow:'0 2px 8px rgba(22,101,52,0.15)' }}
                >
                  📤 Condividi
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Funzionalità disponibile a breve')}
                  className="transition-transform active:scale-95"
                  style={{ background:'#bfdbfe', color:'#1e40af', fontWeight:700, fontSize:13, padding:'12px 0', borderRadius:16, cursor:'pointer', border:'none', boxShadow:'0 2px 8px rgba(30,64,175,0.15)' }}
                >
                  💾 Salva invito
                </button>
              </div>

            </div>{/* end dark showcase panel */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
