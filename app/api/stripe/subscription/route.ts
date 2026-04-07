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
      .select('email')
      .eq('id', user.id)
      .single()

    const priceId = interval === 'yearly'
      ? process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!
      : process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: profile?.email ?? user.email,
      line_items: [{ price: priceId, quantity: 1 }],
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
