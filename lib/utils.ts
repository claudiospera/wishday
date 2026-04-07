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

// Mappa stato wish item → etichetta italiana
export const wishItemStatusLabels: Record<string, string> = {
  available: 'Disponibile',
  partially_funded: 'Parzialmente finanziato',
  fully_funded: 'Obiettivo raggiunto',
  purchased: 'Acquistato',
  reserved: 'Già prenotato',
}
