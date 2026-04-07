// API per accedere al portale clienti Stripe (gestione abbonamento)
import { NextResponse } from 'next/server'
import { stripe, APP_URL } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    // Recupera la subscription per trovare il customer ID Stripe
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      return NextResponse.json({ error: 'Nessun abbonamento attivo' }, { status: 404 })
    }

    // Recupera il customer ID dalla subscription Stripe
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    const customerId = stripeSub.customer as string

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: unknown) {
    console.error('Errore portale Stripe:', err)
    const message = err instanceof Error ? err.message : 'Errore interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
