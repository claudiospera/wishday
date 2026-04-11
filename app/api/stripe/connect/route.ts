// API per avviare l'onboarding Stripe Connect Express
import { NextResponse } from 'next/server'
import { stripe, APP_URL } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    const { data: profile } = await supabase
      .from('users')
      .select('stripe_account_id, email')
      .eq('id', user.id)
      .single()

    let accountId = profile?.stripe_account_id

    // Crea account Connect se non esiste
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'IT',
        email: profile?.email ?? user.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
        settings: {
          payouts: {
            schedule: { interval: 'manual' },
          },
        },
      })
      accountId = account.id

      // Salva l'ID account nel profilo utente
      await supabase
        .from('users')
        .update({ stripe_account_id: accountId })
        .eq('id', user.id)
    }

    // Genera link di onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${APP_URL}/dashboard/settings?stripe=refresh`,
      return_url: `${APP_URL}/dashboard/settings?stripe=success`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (err: unknown) {
    console.error('Errore Stripe Connect:', err)
    const message = err instanceof Error ? err.message : 'Errore interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
