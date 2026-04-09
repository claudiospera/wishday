// Webhook Stripe — gestisce eventi di pagamento in modo sicuro
import { NextRequest, NextResponse } from 'next/server'
import { stripe, calculateCommission, calculateNetAmount } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import {
  sendContributionConfirmation,
  sendNewContributionNotification,
  sendGoalReachedNotification,
} from '@/lib/email/resend'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Firma mancante' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    console.error('Errore verifica webhook:', err)
    return NextResponse.json({ error: 'Firma non valida' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    // ===== Contributo completato =====
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const meta = session.metadata

      if (!meta?.wishItemId) break // Non è un contributo

      const amount = parseFloat(meta.amount)

      // Salva il contributo nel database
      const { error: contribError } = await supabase.from('contributions').insert({
        wish_item_id: meta.wishItemId,
        contributor_name: meta.contributorName,
        contributor_email: meta.contributorEmail,
        amount,
        message: meta.message || null,
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'completed',
      })

      if (contribError) {
        console.error('Errore salvataggio contributo:', contribError)
        break
      }

      // Aggiorna collected_amount e contributors_count del wish item
      const { data: item } = await supabase
        .from('wish_items')
        .select('title, collected_amount, contributors_count, price, event_id')
        .eq('id', meta.wishItemId)
        .single()

      if (item) {
        const newCollected = (item.collected_amount ?? 0) + amount
        const newCount = (item.contributors_count ?? 0) + 1
        const isFullyFunded = newCollected >= item.price

        await supabase
          .from('wish_items')
          .update({
            collected_amount: newCollected,
            contributors_count: newCount,
            status: isFullyFunded ? 'fully_funded' : newCollected > 0 ? 'partially_funded' : 'available',
          })
          .eq('id', meta.wishItemId)

        // Email conferma all'invitato
        await sendContributionConfirmation({
          to: meta.contributorEmail,
          contributorName: meta.contributorName,
          eventTitle: session.metadata?.eventTitle ?? 'Evento',
          wishItemTitle: item.title,
          amount,
        }).catch(console.error)

        // Notifica al festeggiato
        const { data: eventData } = await supabase
          .from('events')
          .select('title, users(email, full_name)')
          .eq('id', item.event_id)
          .single()

        if (eventData) {
          const usersData = (eventData.users as unknown as { email: string; full_name: string }[] | { email: string; full_name: string } | null)
          const hostUser = Array.isArray(usersData) ? usersData[0] : usersData
          const hostEmail = hostUser?.email ?? ''
          const hostName = hostUser?.full_name ?? 'Festeggiato'

          await sendNewContributionNotification({
            to: hostEmail,
            hostName,
            contributorName: meta.contributorName,
            wishItemTitle: item.title,
            amount,
            message: meta.message || null,
          }).catch(console.error)

          // Notifica obiettivo raggiunto
          if (isFullyFunded) {
            await sendGoalReachedNotification({
              to: hostEmail,
              hostName,
              wishItemTitle: item.title,
              totalCollected: newCollected,
            }).catch(console.error)
          }
        }
      }
      break
    }

    // ===== Subscription attivata/aggiornata =====
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Trova l'utente tramite stripe_customer_id (da metadata)
      const { data: subRecord } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (!subRecord) break

      const isActive = subscription.status === 'active'
      const periodEnd = subscription.items.data[0]?.current_period_end
      const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null

      // Aggiorna o crea il record sottoscrizione
      await supabase.from('subscriptions').upsert({
        stripe_subscription_id: subscription.id,
        user_id: subRecord.user_id,
        plan: 'premium',
        status: subscription.status as 'active' | 'cancelled' | 'past_due',
        current_period_end: currentPeriodEnd,
      })

      // Aggiorna il piano utente
      await supabase
        .from('users')
        .update({ plan: isActive ? 'premium' : 'free' })
        .eq('id', subRecord.user_id)

      console.log(`Subscription ${subscription.id} aggiornata per utente ${subRecord.user_id}`)
      break
    }

    // ===== Subscription cancellata =====
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      const { data: subRecord } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (!subRecord) break

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)

      await supabase
        .from('users')
        .update({ plan: 'free' })
        .eq('id', subRecord.user_id)

      console.log(`Subscription ${subscription.id} cancellata`)
      break
    }

    // ===== Stripe Connect — account verificato =====
    case 'account.updated': {
      const account = event.data.object as Stripe.Account
      if (account.charges_enabled && account.payouts_enabled) {
        await supabase
          .from('users')
          .update({ stripe_account_verified: true })
          .eq('stripe_account_id', account.id)
      }
      break
    }

    default:
      console.log(`Evento webhook non gestito: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
