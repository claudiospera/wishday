'use client'

import React from 'react'
import { formatDate, eventTypeEmoji } from '@/lib/utils'

// ─── Definizione template ────────────────────────────────────────────────────

export const inviteTemplates: Record<string, {
  label: string
  emoji: string
  previewBg: string
}> = {
  'floreale-rosa':   { label: 'Floreale Rosa',    emoji: '🌸', previewBg: 'linear-gradient(135deg,#fce7f3,#fecdd3)' },
  'elegante-oro':    { label: 'Elegante Oro',      emoji: '✨', previewBg: 'linear-gradient(135deg,#fefce8,#fde68a)' },
  'notte-stellata':  { label: 'Notte Stellata',    emoji: '🌙', previewBg: 'linear-gradient(135deg,#1e1b4b,#4f46e5)' },
  'botanico':        { label: 'Botanico',          emoji: '🌿', previewBg: 'linear-gradient(135deg,#052e16,#166534)' },
  'festa':           { label: 'Festa Colorata',    emoji: '🎉', previewBg: 'linear-gradient(135deg,#fdf4ff,#fce7f3)' },
  'acquarello-blu':  { label: 'Acquarello Blu',    emoji: '💙', previewBg: 'linear-gradient(135deg,#eff6ff,#bfdbfe)' },
}

// ─── Decorazioni SVG per ogni template ──────────────────────────────────────

const FlorealeRosaSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    {/* Fiore grande top-left */}
    <g transform="translate(60,60)">
      {[0,72,144,216,288].map(r => <ellipse key={r} cx="0" cy="-22" rx="11" ry="17" fill="#f9a8d4" opacity="0.75" transform={`rotate(${r})`} />)}
      <circle cx="0" cy="0" r="9" fill="#fbbf24" />
    </g>
    {/* Fiore piccolo top-left */}
    <g transform="translate(110,30)">
      {[0,72,144,216,288].map(r => <ellipse key={r} cx="0" cy="-12" rx="6" ry="10" fill="#fecdd3" opacity="0.7" transform={`rotate(${r})`} />)}
      <circle cx="0" cy="0" r="5" fill="#fde68a" />
    </g>
    {/* Foglie top-left */}
    <path d="M20,100 C30,75 60,72 54,95 C48,118 12,115 20,100Z" fill="#86efac" opacity="0.6" />
    <path d="M75,75 C85,52 108,50 102,72 C96,94 68,90 75,75Z" fill="#4ade80" opacity="0.5" />
    {/* Fiore grande bottom-right */}
    <g transform="translate(340,500)">
      {[0,72,144,216,288].map(r => <ellipse key={r} cx="0" cy="-22" rx="11" ry="17" fill="#fda4af" opacity="0.75" transform={`rotate(${r})`} />)}
      <circle cx="0" cy="0" r="9" fill="#fbbf24" />
    </g>
    {/* Fiore piccolo bottom-right */}
    <g transform="translate(295,530)">
      {[0,72,144,216,288].map(r => <ellipse key={r} cx="0" cy="-12" rx="6" ry="10" fill="#f9a8d4" opacity="0.7" transform={`rotate(${r})`} />)}
      <circle cx="0" cy="0" r="5" fill="#fde68a" />
    </g>
    {/* Foglie bottom-right */}
    <path d="M380,460 C370,435 340,432 346,455 C352,478 388,474 380,460Z" fill="#86efac" opacity="0.6" />
    <path d="M325,485 C315,462 288,460 294,482 C300,504 332,500 325,485Z" fill="#4ade80" opacity="0.5" />
    {/* Bordino */}
    <rect x="16" y="16" width="368" height="528" rx="4" fill="none" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.5" />
  </svg>
)

const EleganteOroSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    {/* Doppio bordo dorato */}
    <rect x="14" y="14" width="372" height="532" rx="3" fill="none" stroke="#b45309" strokeWidth="1" opacity="0.6" />
    <rect x="22" y="22" width="356" height="516" rx="2" fill="none" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
    {/* Ornamento angoli */}
    {[[22,22,0],[378,22,90],[378,538,180],[22,538,270]].map(([x,y,rot],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
        <line x1="0" y1="0" x2="20" y2="0" stroke="#b45309" strokeWidth="1.2" />
        <line x1="0" y1="0" x2="0" y2="20" stroke="#b45309" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="2.5" fill="#d97706" />
      </g>
    ))}
    {/* Divisore ornamentale centrale */}
    <g transform="translate(200,280)">
      <line x1="-70" y1="0" x2="-18" y2="0" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />
      <line x1="18" y1="0" x2="70" y2="0" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />
      <polygon points="0,-6 6,0 0,6 -6,0" fill="#d97706" opacity="0.8" />
      <circle cx="-15" cy="0" r="2" fill="#b45309" opacity="0.6" />
      <circle cx="15" cy="0" r="2" fill="#b45309" opacity="0.6" />
    </g>
    {/* Divisore top */}
    <g transform="translate(200,160)">
      <line x1="-50" y1="0" x2="-10" y2="0" stroke="#b45309" strokeWidth="0.8" opacity="0.5" />
      <line x1="10" y1="0" x2="50" y2="0" stroke="#b45309" strokeWidth="0.8" opacity="0.5" />
      <circle cx="0" cy="0" r="3" fill="#d97706" opacity="0.7" />
    </g>
  </svg>
)

const NotteStellataGVG = () => {
  const stars = [
    [60,40],[320,55],[180,30],[100,110],[340,90],[240,70],[40,180],[360,160],[130,200],[280,140],
    [70,320],[350,300],[200,350],[100,400],[310,380],[160,450],[370,440],[55,480],[280,500],[140,520],
  ]
  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {stars.map(([cx,cy],i) => {
        const s = [3,4,5,3,4,5,3,4,5,3,4,5,3,4,5,3,4,5,3,4][i]
        return <circle key={i} cx={cx} cy={cy} r={s/2} fill="#fde68a" opacity={0.4 + (i%3)*0.2} />
      })}
      {/* Stelle grandi */}
      {[[200,80],[80,300],[320,380]].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <polygon points="0,-8 2,-3 7,-3 3,1 5,7 0,3 -5,7 -3,1 -7,-3 -2,-3" fill="#fde68a" opacity="0.7" />
        </g>
      ))}
      {/* Luna */}
      <path d="M340,40 A25,25 0 1 1 340,90 A18,18 0 1 0 340,40Z" fill="#fde68a" opacity="0.6" />
      {/* Bordo sottile */}
      <rect x="16" y="16" width="368" height="528" rx="4" fill="none" stroke="#fde68a" strokeWidth="0.8" opacity="0.3" />
    </svg>
  )
}

const BotanicoSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    {/* Foglie sinistra */}
    <path d="M0,180 C20,130 70,120 60,160 C50,200 -5,195 0,180Z" fill="#4ade80" opacity="0.35" />
    <path d="M0,230 C25,185 80,175 68,212 C56,250 -8,245 0,230Z" fill="#86efac" opacity="0.3" />
    <path d="M0,280 C30,240 75,230 65,265 C55,300 -5,295 0,280Z" fill="#4ade80" opacity="0.25" />
    <path d="M-10,140 C15,100 55,95 48,128 C41,160 -12,155 -10,140Z" fill="#bbf7d0" opacity="0.2" />
    {/* Ramoscello sinistra */}
    <path d="M0,320 C20,260 15,200 8,150" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.4" />
    {/* Foglie destra */}
    <path d="M400,180 C380,130 330,120 340,160 C350,200 405,195 400,180Z" fill="#4ade80" opacity="0.35" />
    <path d="M400,230 C375,185 320,175 332,212 C344,250 408,245 400,230Z" fill="#86efac" opacity="0.3" />
    <path d="M400,280 C370,240 325,230 335,265 C345,300 405,295 400,280Z" fill="#4ade80" opacity="0.25" />
    {/* Ramoscello destra */}
    <path d="M400,320 C380,260 385,200 392,150" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.4" />
    {/* Fiori piccoli */}
    {[[60,80],[340,100],[30,480],[370,460]].map(([cx,cy],i) => (
      <g key={i} transform={`translate(${cx},${cy})`}>
        {[0,72,144,216,288].map(r => <ellipse key={r} cx="0" cy="-8" rx="4" ry="7" fill="#bbf7d0" opacity="0.5" transform={`rotate(${r})`} />)}
        <circle cx="0" cy="0" r="3" fill="#fde68a" opacity="0.7" />
      </g>
    ))}
    {/* Bordo */}
    <rect x="16" y="16" width="368" height="528" rx="4" fill="none" stroke="#86efac" strokeWidth="1" opacity="0.3" />
  </svg>
)

const FestaColorataSVG = () => {
  const confetti = [
    [40,30,'#f97316',8,4,15],[90,60,'#ec4899',6,3,-20],[160,20,'#8b5cf6',7,3,30],
    [230,50,'#06b6d4',5,4,-10],[300,25,'#f59e0b',8,3,25],[360,55,'#10b981',6,4,-30],
    [30,120,'#e11d48',5,3,20],[130,95,'#3b82f6',7,4,-15],[200,110,'#f97316',6,3,40],
    [320,100,'#8b5cf6',8,3,-25],[380,130,'#ec4899',5,4,10],
    [20,460,'#06b6d4',7,3,30],[80,500,'#f59e0b',5,4,-20],[150,480,'#10b981',8,3,15],
    [250,510,'#e11d48',6,4,-35],[330,490,'#3b82f6',7,3,20],[380,470,'#f97316',5,3,-10],
    [60,530,'#8b5cf6',8,4,25],[200,540,'#ec4899',6,3,-15],[310,535,'#06b6d4',7,4,35],
  ]
  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {confetti.map(([cx,cy,fill,w,h,rot],i) => (
        <rect key={i} x={Number(cx)-Number(w)/2} y={Number(cy)-Number(h)/2} width={w} height={h} rx="1" fill={String(fill)} opacity="0.55" transform={`rotate(${rot},${cx},${cy})`} />
      ))}
      {/* Stelline */}
      {[[200,40],[50,300],[350,270]].map(([cx,cy],i) => (
        <polygon key={i} transform={`translate(${cx},${cy})`} points="0,-9 2.5,-3.5 9,-3.5 4,1 6,8 0,4 -6,8 -4,1 -9,-3.5 -2.5,-3.5" fill="#f97316" opacity="0.5" />
      ))}
      {/* Palloncini stilizzati */}
      {[[80,200,'#ec4899'],[310,190,'#8b5cf6'],[195,215,'#f97316']].map(([cx,cy,fill],i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <ellipse cx="0" cy="0" rx="10" ry="13" fill={String(fill)} opacity="0.3" />
          <line x1="0" y1="13" x2="2" y2="30" stroke={String(fill)} strokeWidth="0.8" opacity="0.3" />
        </g>
      ))}
    </svg>
  )
}

const AcquarelloBluSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    {/* Macchie acquarello */}
    <ellipse cx="80" cy="80" rx="70" ry="55" fill="#bfdbfe" opacity="0.25" />
    <ellipse cx="320" cy="100" rx="60" ry="50" fill="#93c5fd" opacity="0.2" />
    <ellipse cx="60" cy="460" rx="65" ry="50" fill="#bfdbfe" opacity="0.22" />
    <ellipse cx="340" cy="480" rx="70" ry="55" fill="#93c5fd" opacity="0.18" />
    {/* Ondine decorative */}
    <path d="M0,520 C60,510 80,530 140,520 C200,510 220,530 280,520 C340,510 360,530 400,520" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
    <path d="M0,535 C60,525 80,545 140,535 C200,525 220,545 280,535 C340,525 360,545 400,535" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.25" />
    {/* Cerchi concentrici top */}
    <circle cx="200" cy="70" r="45" fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.35" />
    <circle cx="200" cy="70" r="58" fill="none" stroke="#bfdbfe" strokeWidth="0.6" opacity="0.25" />
    {/* Puntini decorativi */}
    {[[30,200],[370,220],[25,350],[375,370],[100,500],[300,510]].map(([cx,cy],i) => (
      <circle key={i} cx={cx} cy={cy} r="3" fill="#60a5fa" opacity="0.3" />
    ))}
    {/* Bordo acquarello */}
    <rect x="14" y="14" width="372" height="532" rx="8" fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity="0.35" />
  </svg>
)

// ─── Configurazione rendering ────────────────────────────────────────────────

const templateConfig: Record<string, {
  bg: string
  titleColor: string
  textColor: string
  subtitleColor: string
  tagBg: string
  tagColor: string
  SVGDecoration: () => React.ReactElement
}> = {
  'floreale-rosa': {
    bg: 'linear-gradient(160deg,#fff0f7 0%,#fce7f3 45%,#ffe4e6 100%)',
    titleColor: '#881337',
    textColor: '#9f1239',
    subtitleColor: '#be185d',
    tagBg: '#fce7f3',
    tagColor: '#9d174d',
    SVGDecoration: FlorealeRosaSVG,
  },
  'elegante-oro': {
    bg: 'linear-gradient(160deg,#fefce8 0%,#fef9c3 55%,#fef3c7 100%)',
    titleColor: '#1c1917',
    textColor: '#44403c',
    subtitleColor: '#92400e',
    tagBg: '#fef3c7',
    tagColor: '#78350f',
    SVGDecoration: EleganteOroSVG,
  },
  'notte-stellata': {
    bg: 'linear-gradient(160deg,#0f0c29 0%,#302b63 55%,#24243e 100%)',
    titleColor: '#fef9c3',
    textColor: '#e2e8f0',
    subtitleColor: '#fde68a',
    tagBg: 'rgba(253,230,138,0.15)',
    tagColor: '#fde68a',
    SVGDecoration: NotteStellataGVG,
  },
  'botanico': {
    bg: 'linear-gradient(160deg,#0a3d1f 0%,#166534 60%,#14532d 100%)',
    titleColor: '#f0fdf4',
    textColor: '#dcfce7',
    subtitleColor: '#86efac',
    tagBg: 'rgba(134,239,172,0.15)',
    tagColor: '#86efac',
    SVGDecoration: BotanicoSVG,
  },
  'festa': {
    bg: 'linear-gradient(160deg,#fdf4ff 0%,#fce7f3 50%,#fef9ee 100%)',
    titleColor: '#1e1b4b',
    textColor: '#312e81',
    subtitleColor: '#6d28d9',
    tagBg: '#f3e8ff',
    tagColor: '#5b21b6',
    SVGDecoration: FestaColorataSVG,
  },
  'acquarello-blu': {
    bg: 'linear-gradient(160deg,#eff6ff 0%,#dbeafe 50%,#e0f2fe 100%)',
    titleColor: '#1e3a8a',
    textColor: '#1e40af',
    subtitleColor: '#2563eb',
    tagBg: '#dbeafe',
    tagColor: '#1d4ed8',
    SVGDecoration: AcquarelloBluSVG,
  },
}

// ─── Componente principale ───────────────────────────────────────────────────

interface InviteTemplateCardProps {
  templateKey: string
  title: string
  date: string
  eventType: string
  hostName?: string | null
  celebrantName?: string | null
  location?: string | null
  rsvpPhone?: string | null
  customEventType?: string | null
  mode?: 'full' | 'thumb'
}

function eventTypeLabel(eventType: string, customEventType?: string | null): string {
  if (eventType === 'birthday') return 'Festa di Compleanno'
  if (eventType === 'wedding') return 'Matrimonio'
  if (eventType === 'graduation') return 'Cerimonia di Laurea'
  if (eventType === 'baptism') return 'Battesimo'
  return customEventType || 'Evento Speciale'
}

export function InviteTemplateCard({
  templateKey,
  title,
  date,
  eventType,
  celebrantName,
  location,
  rsvpPhone,
  customEventType,
  mode = 'full',
}: InviteTemplateCardProps) {
  const cfg = templateConfig[templateKey]
  if (!cfg) return null

  const { SVGDecoration } = cfg
  const emoji = eventTypeEmoji[eventType] ?? '🎉'
  const formattedDate = formatDate(date)
  const typeLabel = eventTypeLabel(eventType, customEventType)

  if (mode === 'thumb') {
    return (
      <div style={{ width: 160, height: 100, background: cfg.bg, borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <SVGDecoration />
        <span style={{ fontSize: 22, position: 'relative', zIndex: 1 }}>{emoji}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: cfg.titleColor, textAlign: 'center', padding: '0 8px', lineHeight: 1.2, position: 'relative', zIndex: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {celebrantName || title || 'Il tuo evento'}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 400,
      aspectRatio: '400/560',
      background: cfg.bg,
      borderRadius: 16,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 40px',
      boxSizing: 'border-box',
      fontFamily: '"Georgia", "Times New Roman", serif',
      margin: '0 auto',
    }}>
      <SVGDecoration />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {/* Tipo di evento - tag */}
        <div style={{ background: cfg.tagBg, color: cfg.tagColor, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 20, fontFamily: 'system-ui, sans-serif' }}>
          {emoji} {title || 'Il tuo evento'}
        </div>

        {/* Nome festeggiato */}
        {celebrantName && (
          <h1 style={{ margin: 0, fontSize: 38, fontWeight: 700, color: cfg.titleColor, lineHeight: 1.15, textAlign: 'center', fontStyle: 'italic' }}>
            {celebrantName}
          </h1>
        )}

        {/* Tipologia festa */}
        <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: cfg.textColor, lineHeight: 1.3, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          {typeLabel}
        </p>

        {/* Linea decorativa */}
        <div style={{ width: 48, height: 2, background: cfg.subtitleColor, borderRadius: 2, opacity: 0.5 }} />

        {/* Data */}
        <p style={{ margin: 0, fontSize: 16, color: cfg.textColor, fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}>
          {formattedDate}
        </p>

        {/* Luogo */}
        {location && (
          <p style={{ margin: 0, fontSize: 13, color: cfg.subtitleColor, fontFamily: 'system-ui, sans-serif', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
            {location}
          </p>
        )}

      </div>
    </div>
  )
}
