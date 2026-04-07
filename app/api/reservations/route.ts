import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendReservationNotification } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  const { wishItemId, guestName, guestEmail } = await request.json()

  if (!wishItemId || !guestName) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // Aggiorna il wish item
  const { data: item, error } = await supabase
    .from('wish_items')
    .update({ status: 'reserved', reserved_by_name: guestName, reserved_by_email: guestEmail || null })
    .eq('id', wishItemId)
    .select('title, event_id')
    .single()

  if (error || !item) {
    return NextResponse.json({ error: 'Errore prenotazione' }, { status: 500 })
  }

  // Recupera dati evento e host per l'email
  const { data: eventData } = await supabase
    .from('events')
    .select('title, users(email, full_name)')
    .eq('id', item.event_id)
    .single()

  if (eventData) {
    const usersData = eventData.users as unknown as { email: string; full_name: string }[] | { email: string; full_name: string } | null
    const host = Array.isArray(usersData) ? usersData[0] : usersData
    if (host?.email) {
      await sendReservationNotification({
        to: host.email,
        hostName: host.full_name ?? 'Festeggiato',
        guestName,
        wishItemTitle: item.title,
        eventTitle: eventData.title,
      }).catch(console.error)
    }
  }

  return NextResponse.json({ success: true })
}
