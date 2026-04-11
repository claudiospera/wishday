// API per creare una sessione Stripe Checkout per un contributo collettivo
import { NextRequest, NextResponse } from 'next/server'
import { stripe, APP_URL, calculateCommission } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { wishItemId, contributorName, contributorEmail, amount, message } = await request.json()

    if (!wishItemId || !contributorName || !contributorEmail || !amount) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }
    if (amount < 5) {
      return NextResponse.json({ error: 'Importo minimo €5' }, { status: 400 })
    }

    const supabase = await createClient()

    // Recupera il wish item e l'evento per ottenere il piano del host
    const { data: item } = await supabase
      .from('wish_items')
      .select('*, events(id, slug, title, user_id, users(plan, stripe_account_id, stripe_account_verified))')
      .eq('id', wishItemId)
      .eq('type', 'collective')
      .single()

    if (!item) {
      return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 })
    }

    const event = item.events as {
      id: string; slug: string; title: string; user_id: string
      users: { plan: string; stripe_account_id: string | null; stripe_account_verified: boolean }
    }
    const amountCents = Math.round(amount * 100)

    // Usa destination charge se il host ha un account Connect verificato:
    // i soldi vanno direttamente al host e la commissione viene trattenuta automaticamente.
    const { plan, stripe_account_id, stripe_account_verified } = event.users
    const useDestination = !!stripe_account_id && !!stripe_account_verified

    // Crea la sessione Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: contributorEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Contributo per "${item.title}"`,
              description: `Evento: ${event.title}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      ...(useDestination && {
        payment_intent_data: {
          application_fee_amount: calculateCommission(amountCents, plan as 'free' | 'premium'),
          transfer_data: { destination: stripe_account_id! },
        },
      }),
      metadata: {
        wishItemId,
        contributorName,
        contributorEmail,
        amount: amount.toString(),
        message: message ?? '',
        eventId: event.id,
        hostUserId: event.user_id,
        paymentModel: useDestination ? 'destination' : 'platform',
      },
      success_url: `${APP_URL}/event/${event.slug}?contribution=success&from=${encodeURIComponent(contributorName)}&gift=${encodeURIComponent(item.title)}${message ? `&msg=${encodeURIComponent(message)}` : ''}`,
      cancel_url: `${APP_URL}/event/${event.slug}?contribution=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const stripeErr = err as Record<string, unknown>
    console.error('Errore checkout tipo:', stripeErr?.type)
    console.error('Errore checkout code:', stripeErr?.code)
    console.error('Errore checkout statusCode:', stripeErr?.statusCode)
    console.error('Errore checkout raw:', stripeErr?.raw)
    console.error('Errore checkout:', err)
    const message = err instanceof Error ? err.message : 'Errore interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
