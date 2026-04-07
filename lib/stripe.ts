// Configurazione e helpers Stripe
import Stripe from 'stripe'

// Istanza Stripe server-side (lazy: inizializzata al primo utilizzo, non al build)
let _stripe: Stripe | undefined

export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    if (!_stripe) {
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-01-27.acacia',
        typescript: true,
      })
    }
    const value = (_stripe as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as Function).bind(_stripe) : value
  },
})

// Calcola la commissione della piattaforma in base al piano
export function getPlatformCommission(plan: 'free' | 'premium'): number {
  return plan === 'premium'
    ? Number(process.env.STRIPE_PLATFORM_COMMISSION_PREMIUM ?? 1) / 100
    : Number(process.env.STRIPE_PLATFORM_COMMISSION_FREE ?? 3) / 100
}

// Calcola l'importo netto dopo la commissione (in centesimi per Stripe)
export function calculateNetAmount(grossAmountCents: number, plan: 'free' | 'premium'): number {
  const commission = getPlatformCommission(plan)
  return Math.floor(grossAmountCents * (1 - commission))
}

// Calcola la commissione in centesimi
export function calculateCommission(grossAmountCents: number, plan: 'free' | 'premium'): number {
  const commission = getPlatformCommission(plan)
  return Math.ceil(grossAmountCents * commission)
}

// URL base applicazione
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
