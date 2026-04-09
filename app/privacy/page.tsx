import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Wishday',
  description: 'Informativa sul trattamento dei dati personali di Wishday.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-tiffany-700 font-semibold hover:underline text-sm">← Torna alla homepage</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Ultimo aggiornamento: aprile 2026</p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Titolare del trattamento</h2>
        <p className="text-gray-700">
          Il titolare del trattamento dei dati personali è <strong>Wishday</strong>, contattabile all&apos;indirizzo email{' '}
          <a href="mailto:info@wishday.it" className="text-tiffany-700">info@wishday.it</a>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Dati raccolti</h2>
        <p className="text-gray-700">Raccogliamo i seguenti dati personali:</p>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li><strong>Dati di registrazione:</strong> nome, indirizzo email, password (cifrata).</li>
          <li><strong>Dati di pagamento:</strong> gestiti direttamente da Stripe Inc. Wishday non archivia dati di carte di credito.</li>
          <li><strong>Dati degli eventi:</strong> titolo, descrizione, data, immagini caricate volontariamente.</li>
          <li><strong>Dati degli ospiti:</strong> nome e messaggio inseriti volontariamente nella pagina pubblica dell&apos;evento.</li>
          <li><strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, log di accesso (raccolti automaticamente).</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Finalità del trattamento</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Erogare il servizio (gestione account, eventi, pagamenti).</li>
          <li>Inviare comunicazioni transazionali (conferma email, notifiche sui regali).</li>
          <li>Adempiere a obblighi di legge (fiscali, contabili).</li>
          <li>Prevenire frodi e garantire la sicurezza della piattaforma.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Base giuridica</h2>
        <p className="text-gray-700">
          Il trattamento si basa su: <strong>esecuzione del contratto</strong> (art. 6.1.b GDPR) per l&apos;erogazione del servizio;
          <strong> consenso</strong> (art. 6.1.a) per cookie non essenziali;
          <strong> obbligo legale</strong> (art. 6.1.c) per adempimenti fiscali.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Conservazione dei dati</h2>
        <p className="text-gray-700">
          I dati sono conservati per tutta la durata del rapporto contrattuale e per i successivi 10 anni
          per obblighi fiscali. I dati degli account cancellati vengono eliminati entro 30 giorni.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. Condivisione con terze parti</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li><strong>Supabase Inc.</strong> — database e autenticazione (USA, con garanzie adeguate).</li>
          <li><strong>Stripe Inc.</strong> — elaborazione pagamenti (USA, con garanzie adeguate).</li>
          <li><strong>Resend Inc.</strong> — invio email transazionali.</li>
          <li><strong>Vercel Inc.</strong> — hosting dell&apos;applicazione.</li>
        </ul>
        <p className="text-gray-700 mt-2">Non vendiamo né cediamo dati a terzi per scopi commerciali.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Diritti dell&apos;interessato</h2>
        <p className="text-gray-700">Ai sensi del GDPR hai diritto di:</p>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Accedere ai tuoi dati personali.</li>
          <li>Rettificarli o aggiornarli.</li>
          <li>Richiederne la cancellazione (&quot;diritto all&apos;oblio&quot;).</li>
          <li>Opporti al trattamento o chiederne la limitazione.</li>
          <li>Richiedere la portabilità dei dati.</li>
          <li>Revocare il consenso in qualsiasi momento.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Per esercitare questi diritti scrivi a{' '}
          <a href="mailto:info@wishday.it" className="text-tiffany-700">info@wishday.it</a>.
          Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali
          (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-tiffany-700">www.garanteprivacy.it</a>).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">8. Cookie</h2>
        <p className="text-gray-700">
          Per informazioni dettagliate sui cookie utilizzati consulta la nostra{' '}
          <Link href="/cookie" className="text-tiffany-700">Cookie Policy</Link>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">9. Modifiche</h2>
        <p className="text-gray-700">
          Ci riserviamo di aggiornare questa informativa. In caso di modifiche sostanziali ti informeremo
          tramite email o avviso nell&apos;applicazione.
        </p>

        <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400">
          <p>Wishday — <a href="mailto:info@wishday.it" className="hover:text-tiffany-700">info@wishday.it</a></p>
        </div>
      </main>
    </div>
  )
}
