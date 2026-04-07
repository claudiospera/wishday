// API per richiedere il payout dei fondi raccolti tramite Stripe Connect
import { NextRequest, NextResponse } from 'next/server'
import { stripe, calculateCommission } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { wishItemId, eventId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    // Verifica che l'utente sia il proprietario dell'evento
    const { data: event } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single()

    if (!event || event.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
    }

    // Recupera il wish item con l'importo raccolto
    const { data: item } = await supabase
      .from('wish_items')
      .select('collected_amount, title, price')
      .eq('id', wishItemId)
      .single()

    if (!item || item.collected_amount <= 0) {
      return NextResponse.json({ error: 'Nessun importo disponibile' }, { status: 400 })
    }

    // Recupera il profilo utente con stripe_account_id e piano
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_account_id, stripe_account_verified, plan')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_account_id) {
      return NextResponse.json({ error: 'Conto bancario non collegato. Configura Stripe Connect nelle impostazioni.' }, { status: 400 })
    }

    if (!profile.stripe_account_verified) {
      return NextResponse.json({ error: 'Conto bancario non ancora verificato.' }, { status: 400 })
    }

    const grossAmountCents = Math.round(item.collected_amount * 100)
    const commissionCents = calculateCommission(grossAmountCents, profile.plan)
    const netAmountCents = grossAmountCents - commissionCents

    // Crea il trasferimento Stripe Connect verso il conto del festeggiato
    const transfer = await stripe.transfers.create({
      amount: netAmountCents,
      currency: 'eur',
      destination: profile.stripe_account_id,
      description: `Payout regalo collettivo: ${item.title}`,
      metadata: {
        wishItemId,
        eventId,
        userId: user.id,
        grossAmount: grossAmountCents.toString(),
        commissionAmount: commissionCents.toString(),
      },
    })

    // Registra il payout nel database
    await supabase.from('payouts').insert({
      user_id: user.id,
      event_id: eventId,
      wish_item_id: wishItemId,
      amount: netAmountCents / 100,
      stripe_payout_id: transfer.id,
      status: 'completed',
      note: item.price != null && item.collected_amount < item.price
        ? 'Obiettivo non raggiunto — payout parziale'
        : 'Obiettivo raggiunto',
    })

    // Azzera il collected_amount del wish item
    await supabase
      .from('wish_items')
      .update({ collected_amount: 0, status: 'purchased' })
      .eq('id', wishItemId)

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      netAmount: netAmountCents / 100,
      commission: commissionCents / 100,
    })
  } catch (err: unknown) {
    console.error('Errore payout:', err)
    const message = err instanceof Error ? err.message : 'Errore interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
