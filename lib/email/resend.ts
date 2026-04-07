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
        <h1 style="color: #7C3AED;">🎉 Grazie, ${contributorName}!</h1>
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
        <h1 style="color: #7C3AED;">🎁 Nuovo contributo ricevuto!</h1>
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
        <p style="color: #6B7280; font-size: 14px;">CelebApp — La piattaforma per i tuoi regali</p>
      </div>
    `,
  })
}
