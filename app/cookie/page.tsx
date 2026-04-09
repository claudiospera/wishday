import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Wishday',
  description: 'Informativa sull\'uso dei cookie su Wishday.',
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-tiffany-700 font-semibold hover:underline text-sm">← Torna alla homepage</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Ultimo aggiornamento: aprile 2026</p>

        <p className="text-gray-700">
          Questa Cookie Policy spiega cosa sono i cookie, quali usiamo su Wishday e come puoi gestirli.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Cosa sono i cookie</h2>
        <p className="text-gray-700">
          I cookie sono piccoli file di testo salvati nel tuo browser quando visiti un sito web.
          Permettono al sito di riconoscere il tuo dispositivo nelle visite successive e di memorizzare
          preferenze o informazioni di sessione.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Cookie che utilizziamo</h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">Cookie tecnici / essenziali</h3>
        <p className="text-gray-700">
          Necessari per il funzionamento del servizio. Non richiedono consenso.
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">Nome</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Fornitore</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Scopo</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Durata</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="border border-gray-200 px-3 py-2">sb-*-auth-token</td>
                <td className="border border-gray-200 px-3 py-2">Supabase</td>
                <td className="border border-gray-200 px-3 py-2">Sessione autenticazione utente</td>
                <td className="border border-gray-200 px-3 py-2">Sessione</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">__stripe_mid</td>
                <td className="border border-gray-200 px-3 py-2">Stripe</td>
                <td className="border border-gray-200 px-3 py-2">Prevenzione frodi nei pagamenti</td>
                <td className="border border-gray-200 px-3 py-2">1 anno</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">__stripe_sid</td>
                <td className="border border-gray-200 px-3 py-2">Stripe</td>
                <td className="border border-gray-200 px-3 py-2">Sessione pagamento</td>
                <td className="border border-gray-200 px-3 py-2">30 min</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">wishday_cookie_consent</td>
                <td className="border border-gray-200 px-3 py-2">Wishday</td>
                <td className="border border-gray-200 px-3 py-2">Memorizza la tua scelta sul consenso cookie</td>
                <td className="border border-gray-200 px-3 py-2">1 anno</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-gray-500 text-sm mt-3">
          Al momento Wishday non utilizza cookie di profilazione, marketing o analitici di terze parti.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Come gestire i cookie</h2>
        <p className="text-gray-700">
          Puoi gestire o disabilitare i cookie tramite le impostazioni del tuo browser:
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
          <li><strong>Safari:</strong> Preferenze → Privacy → Gestisci dati sito web</li>
          <li><strong>Firefox:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
          <li><strong>Edge:</strong> Impostazioni → Privacy, ricerca e servizi → Cookie</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Attenzione: disabilitare i cookie essenziali potrebbe compromettere il funzionamento del servizio
          (es. impossibilità di effettuare il login o completare pagamenti).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Contatti</h2>
        <p className="text-gray-700">
          Per qualsiasi domanda sulla Cookie Policy scrivi a{' '}
          <a href="mailto:info@wishday.it" className="text-tiffany-700">info@wishday.it</a>.
        </p>

        <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400">
          <p>Wishday — <a href="mailto:info@wishday.it" className="hover:text-tiffany-700">info@wishday.it</a></p>
        </div>
      </main>
    </div>
  )
}
