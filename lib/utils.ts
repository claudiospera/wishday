import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatta un importo in euro
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// Genera uno slug da una stringa
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // rimuove accenti
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60)
}

// Calcola la percentuale di avanzamento di un regalo collettivo
export function calculateProgress(collected: number, target: number): number {
  if (target === 0) return 0
  return Math.min(Math.round((collected / target) * 100), 100)
}

// Formatta la data in italiano
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Calcola i giorni rimanenti all'evento
export function getDaysUntilEvent(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(dateString)
  eventDate.setHours(0, 0, 0, 0)
  const diff = eventDate.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Mappa tipo evento → etichetta italiana
export const eventTypeLabels: Record<string, string> = {
  birthday: 'Compleanno',
  wedding: 'Matrimonio',
  graduation: 'Laurea',
  baptism: 'Battesimo',
  other: 'Altro',
}

// Mappa tipo evento → emoji
export const eventTypeEmoji: Record<string, string> = {
  birthday: '🎂',
  wedding: '💍',
  graduation: '🎓',
  baptism: '🕊️',
  other: '🎉',
}

// Temi colore per le pagine evento (solo piano premium)
export const eventThemes = {
  purple: {
    label: 'Tiffany',
    gradient: 'from-tiffany-200 via-tiffany-100 to-amber-100',
    previewClass: 'bg-gradient-to-br from-tiffany-400 to-amber-300',
  },
  rose: {
    label: 'Rosa',
    gradient: 'from-rose-200 via-pink-100 to-rose-50',
    previewClass: 'bg-gradient-to-br from-rose-400 to-pink-300',
  },
  indigo: {
    label: 'Blu',
    gradient: 'from-indigo-200 via-blue-100 to-indigo-50',
    previewClass: 'bg-gradient-to-br from-indigo-400 to-blue-300',
  },
  emerald: {
    label: 'Verde',
    gradient: 'from-emerald-200 via-teal-100 to-emerald-50',
    previewClass: 'bg-gradient-to-br from-emerald-400 to-teal-300',
  },
  amber: {
    label: 'Arancio',
    gradient: 'from-amber-200 via-yellow-100 to-orange-50',
    previewClass: 'bg-gradient-to-br from-amber-400 to-orange-300',
  },
} as const

// Palette colori per ogni tema (usata con inline styles per evitare problemi con Tailwind purge)
export const themeColorMap: Record<string, {
  primary: string; hover: string; light: string; muted: string; border: string; text: string; progress: string
}> = {
  purple: { primary: '#0abab5', hover: '#077c79', light: '#edfafa', muted: '#d5f5f5', border: '#aae9e8', text: '#077c79', progress: '#3bc8c7' },
  rose:   { primary: '#E11D48', hover: '#BE123C', light: '#FFF1F2', muted: '#FFE4E6', border: '#FECDD3', text: '#BE123C', progress: '#FB7185' },
  indigo: { primary: '#4338CA', hover: '#3730A3', light: '#EEF2FF', muted: '#E0E7FF', border: '#C7D2FE', text: '#3730A3', progress: '#6366F1' },
  emerald:{ primary: '#059669', hover: '#047857', light: '#ECFDF5', muted: '#D1FAE5', border: '#A7F3D0', text: '#047857', progress: '#34D399' },
  amber:  { primary: '#D97706', hover: '#B45309', light: '#FFFBEB', muted: '#FEF3C7', border: '#FDE68A', text: '#B45309', progress: '#FBBF24' },
}

// Configurazione biglietti augurali per tipo evento
export const greetingCardConfig: Record<string, {
  bg: string; title: string; decoration: string; emoji: string
}> = {
  birthday: {
    bg: 'linear-gradient(135deg, #fff9c4 0%, #ffd6b0 50%, #ffb7c5 100%)',
    title: 'Tanti Auguri!',
    decoration: '🎈 🎂 🎈',
    emoji: '🎉',
  },
  wedding: {
    bg: 'linear-gradient(135deg, #fff8f0 0%, #fde8d8 50%, #ffd1e8 100%)',
    title: 'Felicitazioni!',
    decoration: '💐 💍 💐',
    emoji: '🥂',
  },
  graduation: {
    bg: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #b3d4ef 100%)',
    title: 'Congratulazioni!',
    decoration: '🎓 ⭐ 🎓',
    emoji: '🏆',
  },
  baptism: {
    bg: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e8f5e9 100%)',
    title: 'Auguri!',
    decoration: '🕊️ ✨ 🕊️',
    emoji: '🌟',
  },
  other: {
    bg: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 50%, #f0fff4 100%)',
    title: 'Auguri!',
    decoration: '✨ 🎊 ✨',
    emoji: '💫',
  },
}

// Mappa stato wish item → etichetta italiana
export const wishItemStatusLabels: Record<string, string> = {
  available: 'Disponibile',
  partially_funded: 'Parzialmente finanziato',
  fully_funded: 'Obiettivo raggiunto',
  purchased: 'Acquistato',
  reserved: 'Già prenotato',
}
