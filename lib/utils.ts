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
    label: 'Viola',
    gradient: 'from-purple-200 via-purple-100 to-amber-100',
    previewClass: 'bg-gradient-to-br from-purple-400 to-amber-300',
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

// Mappa stato wish item → etichetta italiana
export const wishItemStatusLabels: Record<string, string> = {
  available: 'Disponibile',
  partially_funded: 'Parzialmente finanziato',
  fully_funded: 'Obiettivo raggiunto',
  purchased: 'Acquistato',
  reserved: 'Già prenotato',
}
