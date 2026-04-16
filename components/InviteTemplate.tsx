'use client'

import React from 'react'
import { formatDate, eventTypeEmoji } from '@/lib/utils'

// ─── Font disponibili per l'invito ───────────────────────────────────────────

export const INVITE_FONTS: { label: string; fontFamily: string; preview: string }[] = [
  { label: 'Georgia',    fontFamily: 'Georgia, "Times New Roman", serif',              preview: 'Aa' },
  { label: 'Playfair',   fontFamily: 'var(--font-playfair), Georgia, serif',           preview: 'Aa' },
  { label: 'Cormorant',  fontFamily: 'var(--font-cormorant), Georgia, serif',          preview: 'Aa' },
  { label: 'Nunito',     fontFamily: 'var(--font-nunito), system-ui, sans-serif',      preview: 'Aa' },
  { label: 'Jakarta',    fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif',preview: 'Aa' },
  { label: 'Dancing',    fontFamily: 'var(--font-dancing), cursive',                   preview: 'Aa' },
  { label: 'Pacifico',   fontFamily: 'var(--font-pacifico), cursive',                  preview: 'Aa' },
]

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
  'battesimo':       { label: 'Battesimo',         emoji: '👼', previewBg: 'linear-gradient(135deg,#e8f6ff,#c8e4ff)' },
  'laurea':          { label: 'Laurea',             emoji: '',   previewBg: 'linear-gradient(135deg,#d8e4f8,#c0d0ee)' },
  'minimalista':     { label: 'Minimalista',        emoji: '',   previewBg: 'linear-gradient(135deg,#fafaf7,#f0ede6)' },
  'couture-nero':    { label: 'Couture Nero',       emoji: '',   previewBg: 'linear-gradient(135deg,#0c0c0c,#1a1a1a)' },
  'generico-notte':  { label: 'Notte Festiva',      emoji: '✨', previewBg: 'linear-gradient(135deg,#080818,#1a1040)' },
  'generico-solare': { label: 'Solare',             emoji: '☀️', previewBg: 'linear-gradient(135deg,#fffbe0,#ffd868)' },
  'matrimonio':       { label: 'Matrimonio',          emoji: '',   previewBg: 'linear-gradient(135deg,#fefdf8,#f5eedc)' },
  'arcobaleno-kids':  { label: 'Arcobaleno Kids',    emoji: '🎈', previewBg: 'linear-gradient(135deg,#fffde7,#fff9c4)' },
  'spazio-cosmico':   { label: 'Spazio Cosmico',     emoji: '🚀', previewBg: 'linear-gradient(135deg,#0a0e2a,#141b4d)' },
  'unicorno-pastello':{ label: 'Unicorno Pastello',  emoji: '🦄', previewBg: 'linear-gradient(135deg,#fce4ec,#e1bee7)' },
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

const BattesimoSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    <circle cx="70" cy="90" r="55" fill="#88c4f0" opacity="0.18" />
    <circle cx="330" cy="110" r="44" fill="#66aaee" opacity="0.15" />
    <circle cx="60" cy="460" r="48" fill="#88c4f0" opacity="0.18" />
    <circle cx="340" cy="450" r="40" fill="#66aaee" opacity="0.15" />
    {/* Dove top-left */}
    <path d="M52,58 C58,47 76,46 80,56 C84,67 70,76 58,72 C48,69 47,62 52,58Z" fill="white" opacity="0.55" />
    <path d="M80,56 C89,49 98,53 91,62Z" fill="white" opacity="0.5" />
    {/* Dove top-right */}
    <path d="M320,68 C326,57 344,56 348,66 C352,77 338,86 326,82 C316,79 315,72 320,68Z" fill="white" opacity="0.55" />
    <path d="M348,66 C357,59 366,63 359,72Z" fill="white" opacity="0.5" />
    {/* Cross top-center */}
    <line x1="200" y1="28" x2="200" y2="52" stroke="#5590bb" strokeWidth="1.6" opacity="0.35" />
    <line x1="189" y1="37" x2="211" y2="37" stroke="#5590bb" strokeWidth="1.6" opacity="0.35" />
    {/* Dashed border */}
    <rect x="18" y="18" width="364" height="524" rx="10" fill="none" stroke="#88aad4" strokeWidth="1.2" strokeDasharray="7 5" opacity="0.45" />
  </svg>
)

const LaureaSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    <rect x="14" y="14" width="372" height="532" rx="4" fill="none" stroke="#3a5a9e" strokeWidth="1.3" opacity="0.35" />
    <rect x="22" y="22" width="356" height="516" rx="3" fill="none" stroke="#5070bb" strokeWidth="0.8" opacity="0.22" />
    {[[22,22,0],[378,22,90],[378,538,180],[22,538,270]].map(([x,y,rot],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
        <line x1="0" y1="0" x2="24" y2="0" stroke="#3a5a9e" strokeWidth="1.6" opacity="0.5" />
        <line x1="0" y1="0" x2="0" y2="24" stroke="#3a5a9e" strokeWidth="1.6" opacity="0.5" />
        <circle cx="0" cy="0" r="3" fill="#5070bb" opacity="0.6" />
      </g>
    ))}
    {[[80,50],[200,34],[320,50],[80,510],[200,526],[320,510]].map(([cx,cy],i) => (
      <polygon key={i} transform={`translate(${cx},${cy})`}
        points="0,-8 2.2,-3 8,-3 3.5,1.2 5.5,7.5 0,3.5 -5.5,7.5 -3.5,1.2 -8,-3 -2.2,-3"
        fill="#d4aa44" opacity={i===1||i===4 ? 0.6 : 0.35} />
    ))}
    <circle cx="200" cy="280" r="145" fill="none" stroke="#5070bb" strokeWidth="0.5" opacity="0.1" />
  </svg>
)

const NotteFestvaSVG = () => {
  const pts = [
    [40,40],[80,20],[155,45],[240,22],[310,40],[372,28],[25,130],[100,90],[200,108],[295,78],[382,100],
    [48,220],[170,198],[312,178],[382,225],[28,330],[132,352],[260,318],[372,340],[62,440],[182,458],
    [302,438],[376,420],[38,522],[118,542],[228,518],[342,530],[388,508],
  ]
  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {pts.map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i%4===0?2.5:i%3===0?1.5:1} fill={['#cc99ff','#ffffff','#aa77ee','#ddbbff'][i%4]} opacity={0.25+((i%3)*0.15)} />
      ))}
      {[[60,80],[340,58],[200,28],[105,198],[298,178],[60,420],[340,400]].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy})`} opacity="0.45">
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#cc99ff" strokeWidth="0.9" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#cc99ff" strokeWidth="0.9" />
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#cc99ff" strokeWidth="0.5" />
          <line x1="5" y1="-5" x2="-5" y2="5" stroke="#cc99ff" strokeWidth="0.5" />
        </g>
      ))}
      <rect x="16" y="16" width="368" height="528" rx="4" fill="none" stroke="#8844cc" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

const SolareSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    <circle cx="200" cy="58" r="24" fill="#ffd060" opacity="0.3" />
    <circle cx="200" cy="58" r="16" fill="#ffb800" opacity="0.28" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle,i) => {
      const rad = (angle * Math.PI) / 180
      return <line key={i} x1={200+Math.cos(rad)*28} y1={58+Math.sin(rad)*28} x2={200+Math.cos(rad)*40} y2={58+Math.sin(rad)*40} stroke="#dd9900" strokeWidth="1.3" opacity="0.38" />
    })}
    <circle cx="42" cy="105" r="38" fill="#ffcc44" opacity="0.1" />
    <circle cx="358" cy="118" r="30" fill="#ffaa22" opacity="0.1" />
    <circle cx="48" cy="455" r="32" fill="#ffcc44" opacity="0.1" />
    <circle cx="355" cy="448" r="38" fill="#ffaa22" opacity="0.1" />
    <rect x="16" y="16" width="368" height="528" rx="4" fill="none" stroke="#dd9900" strokeWidth="1" opacity="0.22" />
  </svg>
)

const MatrimonioSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    {/* Corner organic curves */}
    <path d="M0,130 Q0,0 130,0" fill="none" stroke="#c9a96e" strokeWidth="1.3" opacity="0.35" />
    <path d="M0,175 Q0,0 175,0" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.2" />
    <path d="M400,130 Q400,0 270,0" fill="none" stroke="#c9a96e" strokeWidth="1.3" opacity="0.35" />
    <path d="M400,175 Q400,0 225,0" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.2" />
    <path d="M0,430 Q0,560 130,560" fill="none" stroke="#c9a96e" strokeWidth="1.3" opacity="0.35" />
    <path d="M0,385 Q0,560 175,560" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.2" />
    <path d="M400,430 Q400,560 270,560" fill="none" stroke="#c9a96e" strokeWidth="1.3" opacity="0.35" />
    <path d="M400,385 Q400,560 225,560" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.2" />
    {/* Center subtle diamond */}
    <polygon points="200,268 208,276 200,284 192,276" fill="none" stroke="#c9a96e" strokeWidth="1" opacity="0.3" />
    {/* Thin border */}
    <rect x="24" y="24" width="352" height="512" rx="2" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.25" />
  </svg>
)

const ArcobaleniKidsSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    {[[40,40,14],[360,50,10],[320,30,8],[70,85,12],[350,180,8],[30,220,10],[55,410,14],[370,430,10],[45,510,8],[355,500,12],[195,22,9],[215,545,11]].map(([x,y,s],i) => (
      <g key={i} transform={`translate(${x},${y})`}>
        <polygon points={`0,-${s} ${s*0.31},-${s*0.31} ${s},${s*0.38} ${s*0.31},${s*0.1} ${s*0.59},${s*0.81} 0,${s*0.5} -${s*0.59},${s*0.81} -${s*0.31},${s*0.1} -${s},${s*0.38} -${s*0.31},-${s*0.31}`} fill="#fbbf24" opacity={0.65+(i%3)*0.12} />
      </g>
    ))}
    <rect x="16" y="16" width="368" height="528" rx="4" fill="none" stroke="#fb923c" strokeWidth="1" opacity="0.25" />
  </svg>
)

const SpazioCosmicoSVG = () => {
  const stars = [[50,60],[100,40],[200,30],[300,55],[350,40],[30,150],[380,130],[20,300],[390,280],[60,420],[330,400],[150,500],[280,520],[180,80],[250,200],[70,250],[340,340]]
  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="sglow" cx="50%" cy="25%" r="45%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="560" fill="url(#sglow)"/>
      {stars.map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r={i%3===0?2.5:1.5} fill="white" opacity={0.3+0.5*(i%3)/2}/>)}
      <rect x="0" y="485" width="400" height="75" fill="rgba(20,10,50,0.55)" rx="0"/>
    </svg>
  )
}

const UnicornoPastelloSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    <circle cx="380" cy="80" r="110" fill="#c084fc" opacity="0.18"/>
    <circle cx="20" cy="500" r="90" fill="#f9a8d4" opacity="0.22"/>
    <circle cx="350" cy="480" r="70" fill="#818cf8" opacity="0.15"/>
    {[[65,110],[330,150],[75,330],[355,310],[160,490],[290,430]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`}>
        <line x1="-7" y1="0" x2="7" y2="0" stroke="#c084fc" strokeWidth="1.5" opacity="0.45"/>
        <line x1="0" y1="-7" x2="0" y2="7" stroke="#c084fc" strokeWidth="1.5" opacity="0.45"/>
        <circle cx="0" cy="0" r="1.5" fill="#e879f9" opacity="0.6"/>
      </g>
    ))}
    <rect x="14" y="14" width="372" height="532" rx="6" fill="none" stroke="#e879f9" strokeWidth="1" opacity="0.2"/>
  </svg>
)

const MinimalistaSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    <rect x="14" y="14" width="372" height="532" rx="1" fill="none" stroke="#c9a96e" strokeWidth="0.8" opacity="0.45"/>
    <rect x="22" y="22" width="356" height="516" rx="1" fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.25"/>
  </svg>
)

const CoutureNeroSVG = () => (
  <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
    <rect x="14" y="14" width="372" height="532" rx="1" fill="none" stroke="#c9a96e" strokeWidth="0.8" opacity="0.6"/>
    <rect x="22" y="22" width="356" height="516" rx="1" fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.35"/>
    {[[22,22,0],[378,22,90],[378,538,180],[22,538,270]].map(([x,y,rot],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
        <line x1="0" y1="0" x2="16" y2="0" stroke="#c9a96e" strokeWidth="1" opacity="0.5"/>
        <line x1="0" y1="0" x2="0" y2="16" stroke="#c9a96e" strokeWidth="1" opacity="0.5"/>
      </g>
    ))}
    <g transform="translate(200,290)">
      <line x1="-40" y1="0" x2="-6" y2="0" stroke="#c9a96e" strokeWidth="0.7" opacity="0.5"/>
      <line x1="6" y1="0" x2="40" y2="0" stroke="#c9a96e" strokeWidth="0.7" opacity="0.5"/>
      <polygon points="0,-4 4,0 0,4 -4,0" fill="#c9a96e" opacity="0.6"/>
    </g>
  </svg>
)

// ─── Configurazione rendering ────────────────────────────────────────────────

type PaletteOverride = {
  dot: string
  bg: string
  titleColor: string
  textColor: string
  subtitleColor: string
  tagBg: string
  tagColor: string
}

export const templateConfig: Record<string, {
  bg: string
  titleColor: string
  textColor: string
  subtitleColor: string
  tagBg: string
  tagColor: string
  overrideTag?: string
  emojiHeader?: string
  footerLabel?: string
  separator?: 'line' | 'dots' | 'star' | 'dot' | 'rainbow'
  useTitleAsSubtitle?: boolean
  SVGDecoration: () => React.ReactElement
  palettes?: PaletteOverride[]
}> = {
  'floreale-rosa': {
    bg: 'linear-gradient(160deg,#fff0f7 0%,#fce7f3 45%,#ffe4e6 100%)',
    titleColor: '#881337',
    textColor: '#9f1239',
    subtitleColor: '#be185d',
    tagBg: '#fce7f3',
    tagColor: '#9d174d',
    SVGDecoration: FlorealeRosaSVG,
    palettes: [
      { dot:'#a78bfa', bg:'linear-gradient(160deg,#f5f3ff,#ede9fe,#e8e0ff)', titleColor:'#4c1d95', textColor:'#5b21b6', subtitleColor:'#7c3aed', tagBg:'#ede9fe', tagColor:'#6d28d9' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff8f0,#fed7aa,#fddbc4)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'#fed7aa', tagColor:'#9a3412' },
      { dot:'#4ade80', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'rgba(14,165,233,0.1)', tagColor:'#0c4a6e' },
      { dot:'#eab308', bg:'linear-gradient(160deg,#fefce8,#fef9c3,#fef08a)', titleColor:'#713f12', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(234,179,8,0.1)', tagColor:'#713f12' },
      { dot:'#e879f9', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f3e8ff)', titleColor:'#581c87', textColor:'#6b21a8', subtitleColor:'#7e22ce', tagBg:'rgba(168,85,247,0.1)', tagColor:'#581c87' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#fff1f2,#ffe4e6,#ffd6d9)', titleColor:'#881337', textColor:'#9f1239', subtitleColor:'#be185d', tagBg:'#ffe4e6', tagColor:'#9d174d' },
      { dot:'#475569', bg:'linear-gradient(160deg,#f8fafc,#f1f5f9,#e2e8f0)', titleColor:'#0f172a', textColor:'#1e293b', subtitleColor:'#475569', tagBg:'rgba(15,23,42,0.1)', tagColor:'#1e293b' },
      { dot:'#d97706', bg:'linear-gradient(160deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#78350f', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(217,119,6,0.1)', tagColor:'#78350f' },
    ],
  },
  'elegante-oro': {
    bg: 'linear-gradient(160deg,#fefce8 0%,#fef9c3 55%,#fef3c7 100%)',
    titleColor: '#1c1917', textColor: '#44403c', subtitleColor: '#92400e',
    tagBg: '#fef3c7', tagColor: '#78350f',
    SVGDecoration: EleganteOroSVG,
    palettes: [
      { dot:'#94a3b8', bg:'linear-gradient(160deg,#f8fafc,#e2e8f0,#f1f5f9)', titleColor:'#0f172a', textColor:'#334155', subtitleColor:'#475569', tagBg:'#e2e8f0', tagColor:'#334155' },
      { dot:'#fb7185', bg:'linear-gradient(160deg,#fff1f2,#fecdd3,#ffd6d9)', titleColor:'#881337', textColor:'#9f1239', subtitleColor:'#be185d', tagBg:'#fecdd3', tagColor:'#9d174d' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'#bae6fd', tagColor:'#0369a1' },
      { dot:'#4ade80', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#a78bfa', bg:'linear-gradient(160deg,#f5f3ff,#ede9fe,#e8e0ff)', titleColor:'#4c1d95', textColor:'#5b21b6', subtitleColor:'#7c3aed', tagBg:'#ede9fe', tagColor:'#6d28d9' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#fed7aa,#fcd3a2)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.1)', tagColor:'#7c2d12' },
      { dot:'#e879f9', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f3e8ff)', titleColor:'#581c87', textColor:'#6b21a8', subtitleColor:'#7e22ce', tagBg:'rgba(168,85,247,0.1)', tagColor:'#581c87' },
      { dot:'#1a1a1a', bg:'linear-gradient(160deg,#1a0e00,#2d1800,#422200)', titleColor:'#fde68a', textColor:'#fcd34d', subtitleColor:'#fbbf24', tagBg:'rgba(251,191,36,0.12)', tagColor:'#fcd34d' },
      { dot:'#2dd4bf', bg:'linear-gradient(160deg,#f0fdfa,#ccfbf1,#99f6e4)', titleColor:'#134e4a', textColor:'#115e59', subtitleColor:'#0d9488', tagBg:'rgba(13,148,136,0.1)', tagColor:'#134e4a' },
    ],
  },
  'notte-stellata': {
    bg: 'linear-gradient(160deg,#0f0c29 0%,#302b63 55%,#24243e 100%)',
    titleColor: '#fef9c3', textColor: '#e2e8f0', subtitleColor: '#fde68a',
    tagBg: 'rgba(253,230,138,0.15)', tagColor: '#fde68a',
    SVGDecoration: NotteStellataGVG,
    palettes: [
      { dot:'#a855f7', bg:'linear-gradient(160deg,#1a0533,#3b0764,#2d0a50)', titleColor:'#e9d5ff', textColor:'#d8b4fe', subtitleColor:'#c084fc', tagBg:'rgba(216,180,254,0.15)', tagColor:'#c084fc' },
      { dot:'#10b981', bg:'linear-gradient(160deg,#042f2e,#134e4a,#0f3f3c)', titleColor:'#ccfbf1', textColor:'#a7f3d0', subtitleColor:'#6ee7b7', tagBg:'rgba(110,231,183,0.15)', tagColor:'#6ee7b7' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#050a18,#0a1428,#101c38)', titleColor:'#bfdbfe', textColor:'#93c5fd', subtitleColor:'#3b82f6', tagBg:'rgba(147,197,253,0.15)', tagColor:'#93c5fd' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#1a0010,#3b0a20,#2d0a18)', titleColor:'#fecdd3', textColor:'#fda4af', subtitleColor:'#fb7185', tagBg:'rgba(251,113,133,0.15)', tagColor:'#fda4af' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#1a1000,#2d2000,#3d2e00)', titleColor:'#fde68a', textColor:'#fcd34d', subtitleColor:'#fbbf24', tagBg:'rgba(251,191,36,0.15)', tagColor:'#fcd34d' },
      { dot:'#e2e8f0', bg:'linear-gradient(160deg,#0f172a,#1e293b,#0f172a)', titleColor:'#f1f5f9', textColor:'#cbd5e1', subtitleColor:'#94a3b8', tagBg:'rgba(148,163,184,0.15)', tagColor:'#cbd5e1' },
      { dot:'#4ade80', bg:'linear-gradient(160deg,#052e16,#064e3b,#065f46)', titleColor:'#dcfce7', textColor:'#bbf7d0', subtitleColor:'#4ade80', tagBg:'rgba(74,222,128,0.15)', tagColor:'#bbf7d0' },
      { dot:'#c084fc', bg:'linear-gradient(160deg,#2e1065,#4c1d95,#3b0764)', titleColor:'#f3e8ff', textColor:'#e9d5ff', subtitleColor:'#c084fc', tagBg:'rgba(192,132,252,0.15)', tagColor:'#e9d5ff' },
      { dot:'#f97316', bg:'linear-gradient(160deg,#1c0700,#431407,#7c2d12)', titleColor:'#fed7aa', textColor:'#fdba74', subtitleColor:'#fb923c', tagBg:'rgba(249,115,22,0.15)', tagColor:'#fdba74' },
    ],
  },
  'botanico': {
    bg: 'linear-gradient(160deg,#0a3d1f 0%,#166534 60%,#14532d 100%)',
    titleColor: '#f0fdf4', textColor: '#dcfce7', subtitleColor: '#86efac',
    tagBg: 'rgba(134,239,172,0.15)', tagColor: '#86efac',
    SVGDecoration: BotanicoSVG,
    palettes: [
      { dot:'#4ade80', bg:'linear-gradient(160deg,#f0fdf4,#dcfce7,#d1fae5)', titleColor:'#14532d', textColor:'#166534', subtitleColor:'#15803d', tagBg:'rgba(21,128,61,0.1)', tagColor:'#166534' },
      { dot:'#84cc16', bg:'linear-gradient(160deg,#1a1a00,#2d3300,#1e2500)', titleColor:'#d9e8a0', textColor:'#b5cc6a', subtitleColor:'#8aaa2a', tagBg:'rgba(138,170,42,0.15)', tagColor:'#8aaa2a' },
      { dot:'#34d399', bg:'linear-gradient(160deg,#ecfdf5,#a7f3d0,#6ee7b7)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(4,120,87,0.1)', tagColor:'#064e3b' },
      { dot:'#a3e635', bg:'linear-gradient(160deg,#f7fee7,#ecfccb,#d9f99d)', titleColor:'#365314', textColor:'#3f6212', subtitleColor:'#4d7c0f', tagBg:'rgba(77,124,15,0.1)', tagColor:'#365314' },
      { dot:'#7dd3fc', bg:'linear-gradient(160deg,#f0fdfa,#ccfbf1,#99f6e4)', titleColor:'#134e4a', textColor:'#115e59', subtitleColor:'#0d9488', tagBg:'rgba(13,148,136,0.1)', tagColor:'#134e4a' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#fde8c8,#fcd3a2)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.1)', tagColor:'#7c2d12' },
      { dot:'#f9a8d4', bg:'linear-gradient(160deg,#fdf2f8,#fce7f3,#fbd5e9)', titleColor:'#831843', textColor:'#9d174d', subtitleColor:'#be185d', tagBg:'rgba(190,24,93,0.1)', tagColor:'#831843' },
      { dot:'#e5e7eb', bg:'linear-gradient(160deg,#f9fafb,#f3f4f6,#e5e7eb)', titleColor:'#111827', textColor:'#1f2937', subtitleColor:'#374151', tagBg:'rgba(55,65,81,0.1)', tagColor:'#111827' },
      { dot:'#c4b5fd', bg:'linear-gradient(160deg,#faf5ff,#f3e8ff,#ede9fe)', titleColor:'#4c1d95', textColor:'#5b21b6', subtitleColor:'#7c3aed', tagBg:'rgba(124,58,237,0.1)', tagColor:'#4c1d95' },
    ],
  },
  'festa': {
    bg: 'linear-gradient(160deg,#fdf4ff 0%,#fce7f3 50%,#fef9ee 100%)',
    titleColor: '#1e1b4b', textColor: '#312e81', subtitleColor: '#6d28d9',
    tagBg: '#f3e8ff', tagColor: '#5b21b6',
    SVGDecoration: FestaColorataSVG,
    palettes: [
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#ffedd5,#fef3c7)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'#ffedd5', tagColor:'#9a3412' },
      { dot:'#22d3ee', bg:'linear-gradient(160deg,#ecfeff,#cffafe,#e0f7fa)', titleColor:'#164e63', textColor:'#155e75', subtitleColor:'#0891b2', tagBg:'#cffafe', tagColor:'#0e7490' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#fff1f2,#ffe4e6,#fecdd3)', titleColor:'#881337', textColor:'#9f1239', subtitleColor:'#be185d', tagBg:'#ffe4e6', tagColor:'#9d174d' },
      { dot:'#a3e635', bg:'linear-gradient(160deg,#f7fee7,#ecfccb,#d9f99d)', titleColor:'#365314', textColor:'#3f6212', subtitleColor:'#4d7c0f', tagBg:'rgba(77,124,15,0.1)', tagColor:'#365314' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#713f12', textColor:'#78350f', subtitleColor:'#b45309', tagBg:'rgba(245,158,11,0.1)', tagColor:'#713f12' },
      { dot:'#818cf8', bg:'linear-gradient(160deg,#eef2ff,#e0e7ff,#c7d2fe)', titleColor:'#1e1b4b', textColor:'#312e81', subtitleColor:'#4338ca', tagBg:'#e0e7ff', tagColor:'#3730a3' },
      { dot:'#34d399', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#f472b6', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f5d0fe)', titleColor:'#701a75', textColor:'#86198f', subtitleColor:'#a21caf', tagBg:'rgba(162,28,175,0.1)', tagColor:'#701a75' },
      { dot:'#94a3b8', bg:'linear-gradient(160deg,#f8fafc,#f1f5f9,#e2e8f0)', titleColor:'#0f172a', textColor:'#1e293b', subtitleColor:'#475569', tagBg:'rgba(15,23,42,0.08)', tagColor:'#0f172a' },
    ],
  },
  'acquarello-blu': {
    bg: 'linear-gradient(160deg,#eff6ff 0%,#dbeafe 50%,#e0f2fe 100%)',
    titleColor: '#1e3a8a', textColor: '#1e40af', subtitleColor: '#2563eb',
    tagBg: '#dbeafe', tagColor: '#1d4ed8',
    SVGDecoration: AcquarelloBluSVG,
    palettes: [
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'#bae6fd', tagColor:'#0369a1' },
      { dot:'#6366f1', bg:'linear-gradient(160deg,#eef2ff,#e0e7ff,#c7d2fe)', titleColor:'#1e1b4b', textColor:'#312e81', subtitleColor:'#4338ca', tagBg:'#e0e7ff', tagColor:'#3730a3' },
      { dot:'#34d399', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#fed7aa,#fcd3a2)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.1)', tagColor:'#7c2d12' },
      { dot:'#a78bfa', bg:'linear-gradient(160deg,#f5f3ff,#ede9fe,#e8e0ff)', titleColor:'#4c1d95', textColor:'#5b21b6', subtitleColor:'#7c3aed', tagBg:'#ede9fe', tagColor:'#6d28d9' },
      { dot:'#f9a8d4', bg:'linear-gradient(160deg,#fdf2f8,#fce7f3,#ffd6e8)', titleColor:'#831843', textColor:'#9d174d', subtitleColor:'#be185d', tagBg:'rgba(190,24,93,0.1)', tagColor:'#831843' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#713f12', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(217,119,6,0.1)', tagColor:'#78350f' },
      { dot:'#1e293b', bg:'linear-gradient(160deg,#0f172a,#1e293b,#1e3a5f)', titleColor:'#e0f2fe', textColor:'#bae6fd', subtitleColor:'#7dd3fc', tagBg:'rgba(125,211,252,0.15)', tagColor:'#bae6fd' },
      { dot:'#86efac', bg:'linear-gradient(160deg,#f0fdf4,#dcfce7,#d1fae5)', titleColor:'#14532d', textColor:'#166534', subtitleColor:'#15803d', tagBg:'rgba(21,128,61,0.1)', tagColor:'#14532d' },
    ],
  },
  'battesimo': {
    bg: 'linear-gradient(160deg,#e8f6ff 0%,#c8e4ff 55%,#d8f0ff 100%)',
    titleColor: '#0a2040', textColor: '#1a5080', subtitleColor: '#5590bb',
    tagBg: 'rgba(68,136,187,0.13)', tagColor: '#336699',
    separator: 'dots',
    SVGDecoration: BattesimoSVG,
    palettes: [
      { dot:'#ec4899', bg:'linear-gradient(160deg,#fff0f5,#fce7f0,#ffd6e8)', titleColor:'#5a0028', textColor:'#881349', subtitleColor:'#b1407a', tagBg:'rgba(177,64,122,0.12)', tagColor:'#881349' },
      { dot:'#a78bfa', bg:'linear-gradient(160deg,#f5f3ff,#ede9fe,#e8e0ff)', titleColor:'#4c1d95', textColor:'#5b21b6', subtitleColor:'#7c3aed', tagBg:'#ede9fe', tagColor:'#6d28d9' },
      { dot:'#4ade80', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#713f12', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(217,119,6,0.1)', tagColor:'#78350f' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#fed7aa,#fcd3a2)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.1)', tagColor:'#7c2d12' },
      { dot:'#818cf8', bg:'linear-gradient(160deg,#eef2ff,#e0e7ff,#c7d2fe)', titleColor:'#1e1b4b', textColor:'#312e81', subtitleColor:'#4338ca', tagBg:'#e0e7ff', tagColor:'#3730a3' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#fff1f2,#ffe4e6,#fecdd3)', titleColor:'#881337', textColor:'#9f1239', subtitleColor:'#be185d', tagBg:'#ffe4e6', tagColor:'#9d174d' },
      { dot:'#94a3b8', bg:'linear-gradient(160deg,#f8fafc,#f1f5f9,#e2e8f0)', titleColor:'#0f172a', textColor:'#1e293b', subtitleColor:'#475569', tagBg:'rgba(15,23,42,0.08)', tagColor:'#0f172a' },
      { dot:'#2dd4bf', bg:'linear-gradient(160deg,#f0fdfa,#ccfbf1,#99f6e4)', titleColor:'#134e4a', textColor:'#115e59', subtitleColor:'#0d9488', tagBg:'rgba(13,148,136,0.1)', tagColor:'#134e4a' },
    ],
  },
  'laurea': {
    bg: 'linear-gradient(160deg,#d8e4f8 0%,#c0d0ee 55%,#ccd8f0 100%)',
    titleColor: '#1a2a6e', textColor: '#2a3a8e', subtitleColor: '#d4aa44',
    tagBg: 'rgba(26,42,110,0.1)', tagColor: '#1a2a6e',
    separator: 'star',
    useTitleAsSubtitle: true,
    SVGDecoration: LaureaSVG,
    palettes: [
      { dot:'#475569', bg:'linear-gradient(160deg,#f8fafc,#e2e8f0,#f1f5f9)', titleColor:'#0f172a', textColor:'#1e293b', subtitleColor:'#64748b', tagBg:'rgba(15,23,42,0.1)', tagColor:'#0f172a' },
      { dot:'#d97706', bg:'linear-gradient(160deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#78350f', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(217,119,6,0.1)', tagColor:'#78350f' },
      { dot:'#10b981', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#c084fc', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f3e8ff)', titleColor:'#581c87', textColor:'#6b21a8', subtitleColor:'#7e22ce', tagBg:'rgba(168,85,247,0.1)', tagColor:'#581c87' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#fff1f2,#ffe4e6,#fecdd3)', titleColor:'#881337', textColor:'#9f1239', subtitleColor:'#be185d', tagBg:'#ffe4e6', tagColor:'#9d174d' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'rgba(14,165,233,0.1)', tagColor:'#0c4a6e' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#fed7aa,#fcd3a2)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.1)', tagColor:'#7c2d12' },
      { dot:'#1e3a8a', bg:'linear-gradient(160deg,#0f172a,#1e293b,#1e3a5f)', titleColor:'#e0f2fe', textColor:'#bae6fd', subtitleColor:'#7dd3fc', tagBg:'rgba(125,211,252,0.15)', tagColor:'#bae6fd' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#1a0e00,#2d1800,#422200)', titleColor:'#fde68a', textColor:'#fcd34d', subtitleColor:'#fbbf24', tagBg:'rgba(251,191,36,0.15)', tagColor:'#fcd34d' },
    ],
  },
  'generico-notte': {
    bg: 'linear-gradient(160deg,#080818 0%,#12102a 55%,#1a1040 100%)',
    titleColor: '#ffffff', textColor: '#ddbbff', subtitleColor: '#8844cc',
    tagBg: 'rgba(200,150,255,0.15)', tagColor: '#cc99ff',
    overrideTag: 'sei invitato',
    separator: 'dot',
    useTitleAsSubtitle: true,
    SVGDecoration: NotteFestvaSVG,
    palettes: [
      { dot:'#3b82f6', bg:'linear-gradient(160deg,#050a18,#0a1428,#101c38)', titleColor:'#bfdbfe', textColor:'#93c5fd', subtitleColor:'#3b82f6', tagBg:'rgba(147,197,253,0.15)', tagColor:'#93c5fd' },
      { dot:'#10b981', bg:'linear-gradient(160deg,#052e16,#064e3b,#065f46)', titleColor:'#dcfce7', textColor:'#bbf7d0', subtitleColor:'#4ade80', tagBg:'rgba(74,222,128,0.15)', tagColor:'#bbf7d0' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#1a0010,#3b0020,#200010)', titleColor:'#fecdd3', textColor:'#fda4af', subtitleColor:'#fb7185', tagBg:'rgba(251,113,133,0.15)', tagColor:'#fda4af' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#1a0e00,#2d1800,#1a1200)', titleColor:'#fde68a', textColor:'#fcd34d', subtitleColor:'#fbbf24', tagBg:'rgba(251,191,36,0.15)', tagColor:'#fcd34d' },
      { dot:'#2dd4bf', bg:'linear-gradient(160deg,#042f2e,#064e3b,#065f46)', titleColor:'#ccfbf1', textColor:'#a7f3d0', subtitleColor:'#2dd4bf', tagBg:'rgba(45,212,191,0.15)', tagColor:'#a7f3d0' },
      { dot:'#e879f9', bg:'linear-gradient(160deg,#2e1065,#4c1d95,#1a0533)', titleColor:'#f3e8ff', textColor:'#e9d5ff', subtitleColor:'#c084fc', tagBg:'rgba(192,132,252,0.15)', tagColor:'#e9d5ff' },
      { dot:'#94a3b8', bg:'linear-gradient(160deg,#0f172a,#1e293b,#0f172a)', titleColor:'#f1f5f9', textColor:'#cbd5e1', subtitleColor:'#94a3b8', tagBg:'rgba(148,163,184,0.15)', tagColor:'#cbd5e1' },
      { dot:'#f97316', bg:'linear-gradient(160deg,#1c0700,#431407,#7c2d12)', titleColor:'#fed7aa', textColor:'#fdba74', subtitleColor:'#fb923c', tagBg:'rgba(249,115,22,0.15)', tagColor:'#fdba74' },
      { dot:'#e2e8f0', bg:'linear-gradient(160deg,#020617,#0f172a,#020617)', titleColor:'#ffffff', textColor:'#e2e8f0', subtitleColor:'#94a3b8', tagBg:'rgba(226,232,240,0.1)', tagColor:'#e2e8f0' },
    ],
  },
  'generico-solare': {
    bg: 'linear-gradient(160deg,#fffbe0 0%,#fff0a0 50%,#ffd868 100%)',
    titleColor: '#1a0800', textColor: '#884400', subtitleColor: '#bb7700',
    tagBg: 'rgba(180,100,0,0.08)', tagColor: '#884400',
    overrideTag: 'sei invitato!',
    separator: 'line',
    useTitleAsSubtitle: true,
    SVGDecoration: SolareSVG,
    palettes: [
      { dot:'#f97316', bg:'linear-gradient(160deg,#fff3e0,#ffe0b2,#ffcc80)', titleColor:'#4a1500', textColor:'#7c2d12', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.08)', tagColor:'#7c2d12' },
      { dot:'#10b981', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#fff1f2,#ffe4e6,#fecdd3)', titleColor:'#881337', textColor:'#9f1239', subtitleColor:'#be185d', tagBg:'#ffe4e6', tagColor:'#9d174d' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'rgba(14,165,233,0.1)', tagColor:'#0c4a6e' },
      { dot:'#c084fc', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f3e8ff)', titleColor:'#581c87', textColor:'#6b21a8', subtitleColor:'#7e22ce', tagBg:'rgba(168,85,247,0.1)', tagColor:'#581c87' },
      { dot:'#475569', bg:'linear-gradient(160deg,#f8fafc,#f1f5f9,#e2e8f0)', titleColor:'#0f172a', textColor:'#1e293b', subtitleColor:'#475569', tagBg:'rgba(15,23,42,0.08)', tagColor:'#0f172a' },
      { dot:'#1a1a1a', bg:'linear-gradient(160deg,#1a0e00,#2d1800,#422200)', titleColor:'#fde68a', textColor:'#fcd34d', subtitleColor:'#fbbf24', tagBg:'rgba(251,191,36,0.12)', tagColor:'#fcd34d' },
      { dot:'#86efac', bg:'linear-gradient(160deg,#f0fdf4,#dcfce7,#d1fae5)', titleColor:'#14532d', textColor:'#166534', subtitleColor:'#15803d', tagBg:'rgba(21,128,61,0.1)', tagColor:'#14532d' },
      { dot:'#e879f9', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f5d0fe)', titleColor:'#701a75', textColor:'#86198f', subtitleColor:'#a21caf', tagBg:'rgba(162,28,175,0.1)', tagColor:'#701a75' },
    ],
  },
  'matrimonio': {
    bg: 'linear-gradient(170deg,#fefdf8 0%,#f8f4e8 55%,#f5eedc 100%)',
    titleColor: '#3e2723', textColor: '#5d4037', subtitleColor: '#8d6e47',
    tagBg: 'rgba(201,169,110,0.12)', tagColor: '#8d6e47',
    separator: 'star',
    SVGDecoration: MatrimonioSVG,
    palettes: [
      { dot:'#f43f5e', bg:'linear-gradient(170deg,#fdf2f4,#fce7eb,#fad4da)', titleColor:'#4a0010', textColor:'#6b1c2e', subtitleColor:'#9d4255', tagBg:'rgba(157,66,85,0.12)', tagColor:'#6b1c2e' },
      { dot:'#a78bfa', bg:'linear-gradient(170deg,#f5f3ff,#ede9fe,#e8e0ff)', titleColor:'#4c1d95', textColor:'#5b21b6', subtitleColor:'#7c3aed', tagBg:'#ede9fe', tagColor:'#6d28d9' },
      { dot:'#38bdf8', bg:'linear-gradient(170deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'rgba(14,165,233,0.1)', tagColor:'#0c4a6e' },
      { dot:'#10b981', bg:'linear-gradient(170deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#fbbf24', bg:'linear-gradient(170deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#713f12', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(245,158,11,0.1)', tagColor:'#713f12' },
      { dot:'#475569', bg:'linear-gradient(170deg,#f8fafc,#f1f5f9,#e2e8f0)', titleColor:'#0f172a', textColor:'#1e293b', subtitleColor:'#475569', tagBg:'rgba(15,23,42,0.08)', tagColor:'#0f172a' },
      { dot:'#1a1a1a', bg:'linear-gradient(170deg,#0f172a,#1e293b,#1e3a5f)', titleColor:'#e0f2fe', textColor:'#bae6fd', subtitleColor:'#7dd3fc', tagBg:'rgba(125,211,252,0.15)', tagColor:'#bae6fd' },
      { dot:'#f97316', bg:'linear-gradient(170deg,#fff7ed,#fed7aa,#fcd3a2)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'rgba(194,65,12,0.1)', tagColor:'#7c2d12' },
      { dot:'#e879f9', bg:'linear-gradient(170deg,#fdf4ff,#fae8ff,#f3e8ff)', titleColor:'#581c87', textColor:'#6b21a8', subtitleColor:'#7e22ce', tagBg:'rgba(168,85,247,0.1)', tagColor:'#581c87' },
    ],
  },
  'arcobaleno-kids': {
    bg: 'linear-gradient(160deg,#fffde7 0%,#fff9c4 50%,#fff3e0 100%)',
    titleColor: '#c2185b', textColor: '#e65100', subtitleColor: '#7b1fa2',
    tagBg: 'rgba(123,31,162,0.08)', tagColor: '#7b1fa2',
    emojiHeader: '🎈 🎂 🎈',
    overrideTag: 'SUPER FESTA! 🎉',
    separator: 'rainbow',
    SVGDecoration: ArcobaleniKidsSVG,
    palettes: [
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#fff1f2,#ffe4e6,#fecdd3)', titleColor:'#881337', textColor:'#be185d', subtitleColor:'#e11d48', tagBg:'#ffe4e6', tagColor:'#9d174d' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#f0f9ff,#e0f2fe,#bae6fd)', titleColor:'#0c4a6e', textColor:'#075985', subtitleColor:'#0369a1', tagBg:'#bae6fd', tagColor:'#0369a1' },
      { dot:'#4ade80', bg:'linear-gradient(160deg,#ecfdf5,#d1fae5,#a7f3d0)', titleColor:'#064e3b', textColor:'#065f46', subtitleColor:'#047857', tagBg:'rgba(16,185,129,0.1)', tagColor:'#065f46' },
      { dot:'#c084fc', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f3e8ff)', titleColor:'#581c87', textColor:'#6b21a8', subtitleColor:'#7e22ce', tagBg:'rgba(168,85,247,0.1)', tagColor:'#581c87' },
      { dot:'#fb923c', bg:'linear-gradient(160deg,#fff7ed,#ffedd5,#fef3c7)', titleColor:'#7c2d12', textColor:'#9a3412', subtitleColor:'#c2410c', tagBg:'#ffedd5', tagColor:'#9a3412' },
      { dot:'#818cf8', bg:'linear-gradient(160deg,#eef2ff,#e0e7ff,#c7d2fe)', titleColor:'#1e1b4b', textColor:'#312e81', subtitleColor:'#4338ca', tagBg:'#e0e7ff', tagColor:'#3730a3' },
      { dot:'#2dd4bf', bg:'linear-gradient(160deg,#f0fdfa,#ccfbf1,#99f6e4)', titleColor:'#134e4a', textColor:'#115e59', subtitleColor:'#0d9488', tagBg:'rgba(13,148,136,0.1)', tagColor:'#134e4a' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#fffbeb,#fef3c7,#fde68a)', titleColor:'#713f12', textColor:'#92400e', subtitleColor:'#b45309', tagBg:'rgba(217,119,6,0.1)', tagColor:'#78350f' },
      { dot:'#f472b6', bg:'linear-gradient(160deg,#fdf4ff,#fae8ff,#f5d0fe)', titleColor:'#701a75', textColor:'#86198f', subtitleColor:'#a21caf', tagBg:'rgba(162,28,175,0.1)', tagColor:'#701a75' },
    ],
  },
  'spazio-cosmico': {
    bg: 'linear-gradient(160deg,#0a0e2a 0%,#141b4d 55%,#1a2060 100%)',
    titleColor: '#ffffff', textColor: '#ffd600', subtitleColor: '#8080ff',
    tagBg: 'rgba(255,255,255,0.1)', tagColor: '#e8f0ff',
    emojiHeader: '🚀',
    overrideTag: 'MISSIONE COMPLEANNO',
    separator: 'star',
    useTitleAsSubtitle: true,
    SVGDecoration: SpazioCosmicoSVG,
    palettes: [
      { dot:'#a855f7', bg:'linear-gradient(160deg,#1a0533,#3b0764,#2d0a50)', titleColor:'#e9d5ff', textColor:'#c084fc', subtitleColor:'#a855f7', tagBg:'rgba(168,85,247,0.15)', tagColor:'#e9d5ff' },
      { dot:'#10b981', bg:'linear-gradient(160deg,#042f2e,#064e3b,#052e16)', titleColor:'#ccfbf1', textColor:'#4ade80', subtitleColor:'#10b981', tagBg:'rgba(16,185,129,0.15)', tagColor:'#ccfbf1' },
      { dot:'#38bdf8', bg:'linear-gradient(160deg,#050a18,#0a1428,#0c1a3a)', titleColor:'#e0f2fe', textColor:'#7dd3fc', subtitleColor:'#38bdf8', tagBg:'rgba(56,189,248,0.15)', tagColor:'#e0f2fe' },
      { dot:'#f43f5e', bg:'linear-gradient(160deg,#1a0010,#3b0020,#200010)', titleColor:'#fecdd3', textColor:'#fb7185', subtitleColor:'#f43f5e', tagBg:'rgba(244,63,94,0.15)', tagColor:'#fecdd3' },
      { dot:'#fbbf24', bg:'linear-gradient(160deg,#1a0e00,#2d1800,#1c1000)', titleColor:'#fde68a', textColor:'#fbbf24', subtitleColor:'#d97706', tagBg:'rgba(251,191,36,0.15)', tagColor:'#fde68a' },
      { dot:'#2dd4bf', bg:'linear-gradient(160deg,#042f2e,#134e4a,#0f3f3c)', titleColor:'#ccfbf1', textColor:'#2dd4bf', subtitleColor:'#0d9488', tagBg:'rgba(45,212,191,0.15)', tagColor:'#ccfbf1' },
      { dot:'#e2e8f0', bg:'linear-gradient(160deg,#020617,#0f172a,#020617)', titleColor:'#ffffff', textColor:'#e2e8f0', subtitleColor:'#94a3b8', tagBg:'rgba(226,232,240,0.1)', tagColor:'#e2e8f0' },
      { dot:'#f97316', bg:'linear-gradient(160deg,#1c0700,#431407,#7c2d12)', titleColor:'#fed7aa', textColor:'#fb923c', subtitleColor:'#f97316', tagBg:'rgba(249,115,22,0.15)', tagColor:'#fed7aa' },
      { dot:'#818cf8', bg:'linear-gradient(160deg,#1e1b4b,#312e81,#1e1b4b)', titleColor:'#e0e7ff', textColor:'#818cf8', subtitleColor:'#6366f1', tagBg:'rgba(99,102,241,0.15)', tagColor:'#e0e7ff' },
    ],
  },
  'minimalista': {
    bg: 'linear-gradient(160deg,#fafaf7 0%,#f5f2ec 55%,#f0ede6 100%)',
    titleColor: '#2c2317', textColor: '#5a4a35', subtitleColor: '#9a8a72',
    tagBg: 'rgba(156,140,114,0.1)', tagColor: '#7a6a55',
    separator: 'line',
    SVGDecoration: MinimalistaSVG,
    palettes: [
      { dot:'#c9a96e', bg:'linear-gradient(160deg,#fdfaf0,#f5eedc,#ede5cc)', titleColor:'#3e2810', textColor:'#6e5030', subtitleColor:'#9e7840', tagBg:'rgba(201,169,110,0.1)', tagColor:'#8e6820' },
      { dot:'#94a3b8', bg:'linear-gradient(160deg,#f8fafc,#f1f5f9,#e8edf2)', titleColor:'#1e293b', textColor:'#334155', subtitleColor:'#64748b', tagBg:'rgba(30,41,59,0.08)', tagColor:'#334155' },
      { dot:'#f9a8d4', bg:'linear-gradient(160deg,#fdf8fa,#fce7f0,#f9d8e6)', titleColor:'#4a1020', textColor:'#7a3048', subtitleColor:'#aa6070', tagBg:'rgba(200,80,100,0.1)', tagColor:'#7a3048' },
      { dot:'#a7f3d0', bg:'linear-gradient(160deg,#f0fdf6,#e0f9ec,#cef5e0)', titleColor:'#0a3020', textColor:'#205040', subtitleColor:'#408060', tagBg:'rgba(40,120,80,0.08)', tagColor:'#205040' },
      { dot:'#bae6fd', bg:'linear-gradient(160deg,#f0f9ff,#e0f0f8,#cce8f4)', titleColor:'#102030', textColor:'#204060', subtitleColor:'#406080', tagBg:'rgba(20,60,100,0.08)', tagColor:'#204060' },
      { dot:'#fde68a', bg:'linear-gradient(160deg,#fffdf0,#fff8d0,#fff4b0)', titleColor:'#302800', textColor:'#504010', subtitleColor:'#806820', tagBg:'rgba(120,100,0,0.08)', tagColor:'#504010' },
    ],
  },
  'couture-nero': {
    bg: 'linear-gradient(160deg,#0c0c0c 0%,#141414 55%,#1a1a1a 100%)',
    titleColor: '#f5f0e8', textColor: '#c0b090', subtitleColor: '#c9a96e',
    tagBg: 'rgba(201,169,110,0.1)', tagColor: '#c9a96e',
    separator: 'star',
    SVGDecoration: CoutureNeroSVG,
    palettes: [
      { dot:'#e0d0b8', bg:'linear-gradient(160deg,#0c0c0c,#141414)', titleColor:'#f5f0e8', textColor:'#d0c0a0', subtitleColor:'#c9a96e', tagBg:'rgba(201,169,110,0.1)', tagColor:'#c9a96e' },
      { dot:'#e0c0c0', bg:'linear-gradient(160deg,#0c0a0a,#181010)', titleColor:'#f5ece8', textColor:'#c89898', subtitleColor:'#c08888', tagBg:'rgba(192,128,128,0.1)', tagColor:'#c89898' },
      { dot:'#c0d0e8', bg:'linear-gradient(160deg,#080c14,#101820)', titleColor:'#e8f0f8', textColor:'#9ab8d8', subtitleColor:'#7090c0', tagBg:'rgba(112,144,192,0.1)', tagColor:'#9ab8d8' },
      { dot:'#c8e8c0', bg:'linear-gradient(160deg,#080e08,#101810)', titleColor:'#e8f5e8', textColor:'#98c898', subtitleColor:'#70a870', tagBg:'rgba(112,168,112,0.1)', tagColor:'#98c898' },
      { dot:'#e0d0f8', bg:'linear-gradient(160deg,#0c0818,#181020)', titleColor:'#f0e8ff', textColor:'#c0a0e0', subtitleColor:'#9870c8', tagBg:'rgba(152,112,200,0.1)', tagColor:'#c0a0e0' },
      { dot:'#d4d4d4', bg:'linear-gradient(160deg,#0a0a0a,#1c1c1c)', titleColor:'#f0f0f0', textColor:'#c8c8c8', subtitleColor:'#909090', tagBg:'rgba(200,200,200,0.1)', tagColor:'#c8c8c8' },
    ],
  },
  'unicorno-pastello': {
    bg: 'linear-gradient(135deg,#fce4ec 0%,#f8bbd0 30%,#e1bee7 65%,#d1c4e9 100%)',
    titleColor: '#4a148c', textColor: '#880e4f', subtitleColor: '#9c27b0',
    tagBg: 'rgba(156,39,176,0.1)', tagColor: '#4a148c',
    emojiHeader: '🦄 🌈 🎀',
    overrideTag: 'UNICORN PARTY ✨',
    separator: 'rainbow',
    SVGDecoration: UnicornoPastelloSVG,
    palettes: [
      { dot:'#38bdf8', bg:'linear-gradient(135deg,#e0f7fa,#b2ebf2,#e1f5fe,#b3e5fc)', titleColor:'#006064', textColor:'#00838f', subtitleColor:'#0097a7', tagBg:'rgba(0,151,167,0.1)', tagColor:'#006064' },
      { dot:'#fb923c', bg:'linear-gradient(135deg,#fff8e1,#ffe0b2,#fce4ec,#ffd7cc)', titleColor:'#e65100', textColor:'#bf360c', subtitleColor:'#d84315', tagBg:'rgba(216,67,21,0.1)', tagColor:'#e65100' },
      { dot:'#4ade80', bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9,#dcedc8,#f0f4c3)', titleColor:'#1b5e20', textColor:'#2e7d32', subtitleColor:'#388e3c', tagBg:'rgba(56,142,60,0.1)', tagColor:'#1b5e20' },
      { dot:'#fbbf24', bg:'linear-gradient(135deg,#fffde7,#fff9c4,#fff8e1,#fff3e0)', titleColor:'#f57f17', textColor:'#f57c00', subtitleColor:'#ff8f00', tagBg:'rgba(255,143,0,0.1)', tagColor:'#f57f17' },
      { dot:'#f43f5e', bg:'linear-gradient(135deg,#fce4ec,#f8bbd0,#ffcdd2,#ef9a9a)', titleColor:'#880e4f', textColor:'#ad1457', subtitleColor:'#c2185b', tagBg:'rgba(194,24,91,0.1)', tagColor:'#880e4f' },
      { dot:'#818cf8', bg:'linear-gradient(135deg,#e8eaf6,#c5cae9,#e8eaf6,#d1c4e9)', titleColor:'#1a237e', textColor:'#283593', subtitleColor:'#3949ab', tagBg:'rgba(57,73,171,0.1)', tagColor:'#1a237e' },
      { dot:'#2dd4bf', bg:'linear-gradient(135deg,#e0f2f1,#b2dfdb,#e8f5e9,#c8e6c9)', titleColor:'#004d40', textColor:'#00695c', subtitleColor:'#00796b', tagBg:'rgba(0,121,107,0.1)', tagColor:'#004d40' },
      { dot:'#94a3b8', bg:'linear-gradient(135deg,#fafafa,#f5f5f5,#eeeeee,#e0e0e0)', titleColor:'#212121', textColor:'#424242', subtitleColor:'#616161', tagBg:'rgba(33,33,33,0.08)', tagColor:'#212121' },
      { dot:'#e879f9', bg:'linear-gradient(135deg,#f3e5f5,#e1bee7,#fce4ec,#f8bbd0)', titleColor:'#4a148c', textColor:'#6a1b9a', subtitleColor:'#7b1fa2', tagBg:'rgba(123,31,162,0.1)', tagColor:'#4a148c' },
    ],
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
  palette?: number
  font?: number
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
  palette,
  font,
}: InviteTemplateCardProps) {
  const cfg = templateConfig[templateKey]
  if (!cfg) return null

  const paletteOverride = palette != null && palette > 0 && cfg.palettes?.[palette - 1]
  const activeCfg = paletteOverride ? { ...cfg, ...paletteOverride } : cfg

  const fontFamily = (font != null && INVITE_FONTS[font]) ? INVITE_FONTS[font].fontFamily : INVITE_FONTS[0].fontFamily

  const { SVGDecoration } = cfg
  const emoji = eventTypeEmoji[eventType] ?? '🎉'
  const formattedDate = formatDate(date)
  const typeLabel = eventTypeLabel(eventType, customEventType)

  if (mode === 'thumb') {
    return (
      <div style={{ width: 160, height: 100, background: activeCfg.bg, borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <SVGDecoration />
        <span style={{ fontSize: 22, position: 'relative', zIndex: 1 }}>{emoji}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: activeCfg.titleColor, textAlign: 'center', padding: '0 8px', lineHeight: 1.2, position: 'relative', zIndex: 1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      background: activeCfg.bg,
      borderRadius: 16,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 40px',
      boxSizing: 'border-box',
      fontFamily: fontFamily,
      margin: '0 auto',
    }}>
      <SVGDecoration />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {/* Emoji header (per template kids) */}
        {activeCfg.emojiHeader && (
          <div style={{ fontSize: 26, letterSpacing: 6, lineHeight: 1 }}>{activeCfg.emojiHeader}</div>
        )}
        {/* Tag evento */}
        <div style={{ background: activeCfg.tagBg, color: activeCfg.tagColor, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 20, fontFamily: fontFamily }}>
          {activeCfg.overrideTag ?? (title || 'Il tuo evento')}
        </div>

        {/* Nome festeggiato */}
        {celebrantName && (
          <h1 style={{ margin: 0, fontSize: 38, fontWeight: 700, color: activeCfg.titleColor, lineHeight: 1.15, textAlign: 'center', fontStyle: 'italic', fontFamily: fontFamily }}>
            {celebrantName}
          </h1>
        )}

        {/* Tipologia festa o titolo evento */}
        <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: activeCfg.textColor, lineHeight: 1.3, textAlign: 'center', fontFamily: fontFamily }}>
          {activeCfg.useTitleAsSubtitle ? (title || typeLabel) : typeLabel}
        </p>

        {/* Separatore */}
        {activeCfg.separator === 'rainbow' ? (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {['#f43f5e','#fb923c','#fbbf24','#4ade80','#38bdf8','#818cf8','#e879f9'].map((c,i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
            ))}
          </div>
        ) : activeCfg.separator === 'dots' ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: activeCfg.subtitleColor, opacity: 0.55, display: 'inline-block' }} />)}
          </div>
        ) : activeCfg.separator === 'star' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 1.5, background: activeCfg.subtitleColor, opacity: 0.5 }} />
            <span style={{ color: activeCfg.subtitleColor, fontSize: 13, opacity: 0.8 }}>★</span>
            <div style={{ width: 36, height: 1.5, background: activeCfg.subtitleColor, opacity: 0.5 }} />
          </div>
        ) : activeCfg.separator === 'dot' ? (
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeCfg.subtitleColor, opacity: 0.55, display: 'inline-block' }} />
        ) : (
          <div style={{ width: 48, height: 2, background: activeCfg.subtitleColor, borderRadius: 2, opacity: 0.5 }} />
        )}

        {/* Data */}
        <p style={{ margin: 0, fontSize: 16, color: activeCfg.textColor, fontFamily: fontFamily, fontWeight: 500 }}>
          {formattedDate}
        </p>

        {/* Luogo */}
        {location && (
          <p style={{ margin: 0, fontSize: 13, color: activeCfg.subtitleColor, fontFamily: fontFamily, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
            {location}
          </p>
        )}

        {/* Footer label (per template speciali) */}
        {activeCfg.footerLabel && (
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: activeCfg.subtitleColor, fontFamily: fontFamily, opacity: 0.7 }}>
            {activeCfg.footerLabel}
          </p>
        )}
      </div>
    </div>
  )
}
