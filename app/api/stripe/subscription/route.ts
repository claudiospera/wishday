// API per creare una sessione Stripe Checkout per un abbonamento Premium
import { NextRequest, NextResponse } from 'next/server'
import { stripe, APP_URL } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { interval } = await request.json() // 'monthly' | 'yearly'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    const { data: profile } = await supabase
      .from('users')
      .select('email, stripe_customer_id, billing_name, billing_address, tax_id')
      .eq('id', user.id)
      .single()

    const email = profile?.email ?? user.email!
    const billingAddress = profile?.billing_address as {
      line1?: string; city?: string; postal_code?: string; country?: string
    } | null

    // Crea o aggiorna il Customer Stripe con i dati fiscali dell'utente.
    // Questo è necessario perché automatic_tax calcola l'IVA in base all'indirizzo del cliente.
    let customerId = profile?.stripe_customer_id ?? null
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: profile?.billing_name ?? undefined,
        address: billingAddress ? {
          line1: billingAddress.line1 ?? '',
          city: billingAddress.city ?? '',
          postal_code: billingAddress.postal_code ?? '',
          country: billingAddress.country ?? 'IT',
        } : undefined,
      })
      customerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id)
    } else {
      await stripe.customers.update(customerId, {
        name: profile?.billing_name ?? undefined,
        address: billingAddress ? {
          line1: billingAddress.line1 ?? '',
          city: billingAddress.city ?? '',
          postal_code: billingAddress.postal_code ?? '',
          country: billingAddress.country ?? 'IT',
        } : undefined,
      })
    }

    const priceId = interval === 'yearly'
      ? process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!
      : process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      customer_update: { name: 'auto', address: 'auto' },
      metadata: {
        userId: user.id,
        plan: 'premium',
        interval,
      },
      success_url: `${APP_URL}/dashboard/billing?subscription=success`,
      cancel_url: `${APP_URL}/dashboard/billing`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Errore subscription checkout:', err)
    const message = err instanceof Error ? err.message : 'Errore interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
