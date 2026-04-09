import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini di Servizio — Wishday',
  description: 'Termini e condizioni di utilizzo della piattaforma Wishday.',
}

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-tiffany-700 font-semibold hover:underline text-sm">← Torna alla homepage</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold mb-2">Termini di Servizio</h1>
        <p className="text-gray-500 text-sm mb-8">Ultimo aggiornamento: aprile 2026</p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Accettazione dei termini</h2>
        <p className="text-gray-700">
          Utilizzando Wishday (<strong>wishday.it</strong>) accetti integralmente questi Termini di Servizio.
          Se non li accetti, ti chiediamo di non utilizzare la piattaforma.
          Il servizio è fornito da <strong>Wishday</strong> — contatto: <a href="mailto:info@wishday.it" className="text-tiffany-700">info@wishday.it</a>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Descrizione del servizio</h2>
        <p className="text-gray-700">
          Wishday è una piattaforma online che consente agli utenti di creare liste regalo per eventi
          (compleanni, matrimoni, lauree, battesimi, ecc.) e di ricevere contributi economici o prenotazioni
          di regali dagli ospiti invitati.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Registrazione e account</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Per utilizzare il servizio è necessario registrarsi con un indirizzo email valido.</li>
          <li>Devi avere almeno 18 anni per creare un account.</li>
          <li>Sei responsabile della riservatezza delle credenziali di accesso.</li>
          <li>Ci riserviamo il diritto di sospendere account in caso di violazione dei presenti termini.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Piani e pagamenti</h2>
        <p className="text-gray-700">
          Wishday offre un piano gratuito (Free) e un piano a pagamento (Premium). I pagamenti sono
          elaborati tramite <strong>Stripe</strong>. I prezzi sono indicati nella pagina{' '}
          <Link href="/pricing" className="text-tiffany-700">Prezzi</Link>.
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-2">
          <li>Gli abbonamenti si rinnovano automaticamente salvo disdetta.</li>
          <li>Puoi cancellare l&apos;abbonamento in qualsiasi momento dalla tua dashboard.</li>
          <li>Non sono previsti rimborsi per periodi parzialmente utilizzati, salvo quanto previsto dalla legge.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Commissioni sulle raccolte fondi</h2>
        <p className="text-gray-700">
          Wishday applica una commissione sulle raccolte fondi collettive elaborate tramite Stripe:
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li><strong>Piano Free:</strong> 5% sull&apos;importo raccolto + commissioni Stripe.</li>
          <li><strong>Piano Premium:</strong> 3% sull&apos;importo raccolto + commissioni Stripe.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          I bonifici diretti (IBAN/QR code) non prevedono commissioni da parte di Wishday.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. Contenuti degli utenti</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Sei responsabile dei contenuti che pubblichi (descrizioni, immagini, messaggi).</li>
          <li>Non è consentito pubblicare contenuti illegali, offensivi, diffamatori o che violino diritti di terzi.</li>
          <li>Ci riserviamo il diritto di rimuovere contenuti in violazione di questi termini.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Limitazione di responsabilità</h2>
        <p className="text-gray-700">
          Wishday non è responsabile per: eventuali interruzioni del servizio, perdita di dati dovuta
          a cause di forza maggiore, comportamenti scorretti di terzi utenti, o danni indiretti derivanti
          dall&apos;utilizzo della piattaforma. Il servizio è fornito &quot;così com&apos;è&quot;.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">8. Proprietà intellettuale</h2>
        <p className="text-gray-700">
          Il nome, il logo, il design e il codice sorgente di Wishday sono di proprietà esclusiva di Wishday.
          È vietata la riproduzione o l&apos;uso non autorizzato.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">9. Cancellazione dell&apos;account</h2>
        <p className="text-gray-700">
          Puoi cancellare il tuo account in qualsiasi momento dalla dashboard. La cancellazione comporta
          l&apos;eliminazione di tutti i tuoi dati entro 30 giorni, salvo obblighi di conservazione legale.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">10. Legge applicabile</h2>
        <p className="text-gray-700">
          I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente
          il Foro di residenza dell&apos;utente consumatore.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">11. Contatti</h2>
        <p className="text-gray-700">
          Per qualsiasi domanda scrivi a{' '}
          <a href="mailto:info@wishday.it" className="text-tiffany-700">info@wishday.it</a>.
        </p>

        <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400">
          <p>Wishday — <a href="mailto:info@wishday.it" className="hover:text-tiffany-700">info@wishday.it</a></p>
        </div>
      </main>
    </div>
  )
}
