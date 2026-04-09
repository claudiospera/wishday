// API per richiedere payout via bonifico IBAN (manuale da admin)
import { NextRequest, NextResponse } from 'next/server'
import { calculateCommission } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendPayoutRequestToAdmin, sendPayoutConfirmationToUser } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  try {
    const { wishItemId, eventId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    // Verifica proprietà evento
    const { data: event } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single()

    if (!event || event.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
    }

    // Recupera wish item
    const { data: item } = await supabase
      .from('wish_items')
      .select('collected_amount, title, price')
      .eq('id', wishItemId)
      .single()

    if (!item || item.collected_amount <= 0) {
      return NextResponse.json({ error: 'Nessun importo disponibile' }, { status: 400 })
    }

    // Recupera profilo utente con IBAN e piano
    const { data: profile } = await supabase
      .from('users')
      .select('payout_iban, payout_bank_owner, plan, email, full_name')
      .eq('id', user.id)
      .single()

    if (!profile?.payout_iban) {
      return NextResponse.json({ error: 'IBAN non configurato. Vai nelle impostazioni e inserisci il tuo IBAN.' }, { status: 400 })
    }

    const grossAmountCents = Math.round(item.collected_amount * 100)
    const commissionCents = calculateCommission(grossAmountCents, profile.plan)
    const netAmountCents = grossAmountCents - commissionCents
    const netAmount = netAmountCents / 100
    const commissionAmount = commissionCents / 100

    const adminEmail = process.env.ADMIN_EMAIL!
    const hostName = profile.full_name ?? 'Utente'

    // Registra il payout come "pending" nel database
    const admin = await createAdminClient()
    await admin.from('payouts').insert({
      user_id: user.id,
      event_id: eventId,
      wish_item_id: wishItemId,
      amount: netAmount,
      stripe_payout_id: null,
      status: 'pending',
      note: `Bonifico IBAN — ${profile.payout_iban}`,
    })

    // Azzera il collected_amount
    await admin
      .from('wish_items')
      .update({ collected_amount: 0, status: 'purchased' })
      .eq('id', wishItemId)

    // Invia email all'admin
    await sendPayoutRequestToAdmin({
      adminEmail,
      hostName,
      hostEmail: profile.email,
      wishItemTitle: item.title,
      grossAmount: item.collected_amount,
      commissionAmount,
      netAmount,
      iban: profile.payout_iban,
      bankOwner: profile.payout_bank_owner ?? hostName,
    }).catch(console.error)

    // Invia conferma all'utente
    await sendPayoutConfirmationToUser({
      to: profile.email,
      hostName,
      wishItemTitle: item.title,
      netAmount,
    }).catch(console.error)

    return NextResponse.json({ success: true, netAmount, commission: commissionAmount })
  } catch (err: unknown) {
    console.error('Errore payout IBAN:', err)
    const message = err instanceof Error ? err.message : 'Errore interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
