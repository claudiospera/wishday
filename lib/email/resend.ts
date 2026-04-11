// Servizio email tramite Resend
import { Resend } from 'resend'

let _resend: Resend | undefined
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

function FROM() {
  return `${process.env.RESEND_FROM_NAME ?? 'Wishday'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@wishday.it'}>`
}

// Email di conferma contributo all'invitato
export async function sendContributionConfirmation({
  to,
  contributorName,
  eventTitle,
  wishItemTitle,
  amount,
}: {
  to: string
  contributorName: string
  eventTitle: string
  wishItemTitle: string
  amount: number
}) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `Grazie per il tuo contributo a "${eventTitle}"!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #9de7d7;">🎉 Grazie, ${contributorName}!</h1>
        <p>Il tuo contributo di <strong>€${amount.toFixed(2)}</strong> per <strong>"${wishItemTitle}"</strong>
        nell'evento <strong>"${eventTitle}"</strong> è stato ricevuto con successo.</p>
        <p style="color: #6B7280; font-size: 14px;">CelebApp — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}

// Notifica al festeggiato quando riceve un contributo
export async function sendNewContributionNotification({
  to,
  hostName,
  contributorName,
  wishItemTitle,
  amount,
  message,
}: {
  to: string
  hostName: string
  contributorName: string
  wishItemTitle: string
  amount: number
  message?: string | null
}) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `Nuovo contributo per "${wishItemTitle}"!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #9de7d7;">🎁 Nuovo contributo ricevuto!</h1>
        <p>Ciao ${hostName}!</p>
        <p><strong>${contributorName}</strong> ha contribuito <strong>€${amount.toFixed(2)}</strong>
        al regalo <strong>"${wishItemTitle}"</strong>.</p>
        ${message ? `<p>Messaggio: <em>"${message}"</em></p>` : ''}
        <p style="color: #6B7280; font-size: 14px;">CelebApp — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}

// Notifica al festeggiato quando obiettivo raggiunto
export async function sendGoalReachedNotification({
  to,
  hostName,
  wishItemTitle,
  totalCollected,
}: {
  to: string
  hostName: string
  wishItemTitle: string
  totalCollected: number
}) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `🎉 Obiettivo raggiunto per "${wishItemTitle}"!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #F59E0B;">🎉 Obiettivo raggiunto!</h1>
        <p>Ciao ${hostName}!</p>
        <p>Il regalo collettivo <strong>"${wishItemTitle}"</strong> ha raggiunto il suo obiettivo!</p>
        <p>Totale raccolto: <strong>€${totalCollected.toFixed(2)}</strong></p>
        <p>Puoi richiedere il payout dalla tua dashboard.</p>
        <p style="color: #6B7280; font-size: 14px;">Wishday — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}

// Notifica admin per richiesta payout via IBAN
export async function sendPayoutRequestToAdmin({
  adminEmail,
  hostName,
  hostEmail,
  wishItemTitle,
  grossAmount,
  commissionAmount,
  netAmount,
  iban,
  bankOwner,
}: {
  adminEmail: string
  hostName: string
  hostEmail: string
  wishItemTitle: string
  grossAmount: number
  commissionAmount: number
  netAmount: number
  iban: string
  bankOwner: string
}) {
  return getResend().emails.send({
    from: FROM(),
    to: adminEmail,
    subject: `💰 Richiesta payout: ${hostName} — €${netAmount.toFixed(2)}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #0abab5;">💰 Nuova richiesta payout via IBAN</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #6B7280;">Utente</td><td style="padding: 8px; font-weight: 600;">${hostName} (${hostEmail})</td></tr>
          <tr style="background: #f9fafb;"><td style="padding: 8px; color: #6B7280;">Regalo</td><td style="padding: 8px; font-weight: 600;">${wishItemTitle}</td></tr>
          <tr><td style="padding: 8px; color: #6B7280;">Totale raccolto</td><td style="padding: 8px;">€${grossAmount.toFixed(2)}</td></tr>
          <tr style="background: #f9fafb;"><td style="padding: 8px; color: #6B7280;">Commissione (${((commissionAmount / grossAmount) * 100).toFixed(0)}%)</td><td style="padding: 8px; color: #ef4444;">− €${commissionAmount.toFixed(2)}</td></tr>
          <tr><td style="padding: 8px; color: #6B7280; font-weight: 700;">Da bonificare</td><td style="padding: 8px; font-weight: 700; color: #16a34a; font-size: 18px;">€${netAmount.toFixed(2)}</td></tr>
        </table>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0 0 4px; font-weight: 700;">IBAN destinatario:</p>
          <p style="margin: 0; font-family: monospace; font-size: 16px; letter-spacing: 1px;">${iban}</p>
          <p style="margin: 8px 0 0; color: #6B7280;">Intestatario: ${bankOwner}</p>
        </div>
      </div>
    `,
  })
}

// Conferma payout ricevuto all'utente
export async function sendPayoutConfirmationToUser({
  to,
  hostName,
  wishItemTitle,
  netAmount,
}: {
  to: string
  hostName: string
  wishItemTitle: string
  netAmount: number
}) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `Richiesta payout ricevuta — €${netAmount.toFixed(2)}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #0abab5;">✅ Richiesta ricevuta!</h1>
        <p>Ciao ${hostName},</p>
        <p>Abbiamo ricevuto la tua richiesta di payout di <strong>€${netAmount.toFixed(2)}</strong> per il regalo <strong>"${wishItemTitle}"</strong>.</p>
        <p>Effettueremo il bonifico entro 2-3 giorni lavorativi.</p>
        <p style="color: #6B7280; font-size: 14px;">Wishday — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}

// Email di benvenuto all'abbonamento Premium
export async function sendSubscriptionWelcomeEmail({
  to,
  userName,
  interval,
  currentPeriodEnd,
}: {
  to: string
  userName: string
  interval: 'monthly' | 'yearly'
  currentPeriodEnd: string
}) {
  const planLabel = interval === 'yearly' ? '€79/anno' : '€9,90/mese'
  const renewDate = new Date(currentPeriodEnd).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: '⭐ Benvenuto in Wishday Premium!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #0abab5;">⭐ Sei ufficialmente Premium!</h1>
        <p>Ciao ${userName},</p>
        <p>Il tuo abbonamento <strong>Wishday Premium</strong> (${planLabel}) è attivo.</p>
        <ul style="line-height: 1.8;">
          <li>Eventi illimitati</li>
          <li>Wish list illimitata</li>
          <li>Commissione ridotta al 3%</li>
          <li>Nessun branding Wishday sulle pagine</li>
          <li>Temi premium e supporto prioritario</li>
        </ul>
        <p>Il prossimo rinnovo è previsto per il <strong>${renewDate}</strong>. Puoi gestire il tuo abbonamento dalla <a href="https://wishday.it/dashboard/billing">dashboard</a>.</p>
        <p style="color: #6B7280; font-size: 14px;">Wishday — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}

// Notifica al festeggiato quando un regalo viene prenotato
export async function sendReservationNotification({
  to,
  hostName,
  guestName,
  wishItemTitle,
  eventTitle,
}: {
  to: string
  hostName: string
  guestName: string
  wishItemTitle: string
  eventTitle: string
}) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `🎁 "${wishItemTitle}" è stato prenotato!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #9de7d7;">🎁 Regalo prenotato!</h1>
        <p>Ciao ${hostName}!</p>
        <p><strong>${guestName}</strong> ha prenotato il regalo <strong>"${wishItemTitle}"</strong>
        per il tuo evento <strong>"${eventTitle}"</strong>.</p>
        <p>Lo acquisterà in autonomia — non aspettarti un pagamento online.</p>
        <p style="color: #6B7280; font-size: 14px;">Wishday — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}
