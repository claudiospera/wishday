import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Intestazione */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">🎉</span>
            <span className="font-bold text-xl text-purple-700">Wishday</span>
          </Link>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Prezzi semplici e trasparenti
          </h1>
          <p className="text-gray-500 text-lg">
            Inizia gratis, passa a Premium quando ne hai bisogno
          </p>
        </div>

        {/* Piani */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Per iniziare</CardDescription>
              <div className="text-4xl font-bold mt-3">
                €0
                <span className="text-lg font-normal text-gray-400">/mese</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  { label: '1 evento attivo', ok: true },
                  { label: 'Fino a 10 prodotti per wish list', ok: true },
                  { label: 'Regali collettivi con Stripe', ok: true },
                  { label: 'Commissione 3% sui contributi', ok: true, note: true },
                  { label: 'Pagina pubblica condivisibile', ok: true },
                  { label: 'Bonifico diretto con QR code', ok: true },
                  { label: 'Branding Wishday nella pagina', ok: false },
                  { label: 'Wish list illimitata', ok: false },
                  { label: 'Commissione ridotta all\'1%', ok: false },
                  { label: 'Temi premium', ok: false },
                ].map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    <span className={f.ok ? 'text-green-500' : 'text-gray-300'}>
                      {f.ok ? '✓' : '✗'}
                    </span>
                    <span className={f.ok ? 'text-gray-700' : 'text-gray-400'}>
                      {f.label}
                      {f.note && <span className="text-xs text-amber-600 ml-1">(vs 1% Premium)</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className={cn(buttonVariants({ variant: 'outline' }), 'w-full mt-4')}>
                Inizia gratis
              </Link>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="border-purple-400 ring-2 ring-purple-400 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-purple-700 text-white text-sm px-4 py-1">
                ⭐ Più popolare
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>⭐</span> Premium
              </CardTitle>
              <CardDescription>Per chi celebra spesso</CardDescription>
              <div className="mt-3 space-y-1">
                <div className="text-4xl font-bold text-purple-700">
                  €9,90
                  <span className="text-lg font-normal text-gray-400">/mese</span>
                </div>
                <p className="text-sm text-gray-400">
                  oppure <strong className="text-gray-600">€79/anno</strong>{' '}
                  <span className="text-green-600 text-xs">(risparmi €39,80)</span>
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  { label: 'Eventi illimitati', ok: true },
                  { label: 'Wish list illimitata', ok: true },
                  { label: 'Regali collettivi con Stripe', ok: true },
                  { label: 'Commissione solo 1% sui contributi', ok: true },
                  { label: 'Nessun branding Wishday', ok: true },
                  { label: 'Pagina pubblica condivisibile', ok: true },
                  { label: 'Bonifico diretto con QR code', ok: true },
                  { label: 'Temi grafici premium', ok: true },
                  { label: 'Supporto prioritario', ok: true },
                  { label: 'Statistiche avanzate', ok: true },
                ].map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500">✓</span>
                    <span className="text-gray-700">{f.label}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 pt-2">
                <Link href="/register" className={cn(buttonVariants(), 'w-full bg-purple-700 hover:bg-purple-800 text-white')}>
                  Inizia con Premium — €9,90/mese
                </Link>
                <Link href="/register" className={cn(buttonVariants({ variant: 'outline' }), 'w-full border-purple-300 text-purple-700')}>
                  Annuale — €79/anno
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
            Domande frequenti
          </h2>
          {[
            {
              q: 'Come funziona la commissione sui contributi?',
              a: 'Quando un invitato contribuisce a un regalo collettivo, la piattaforma trattiene automaticamente il 3% (Free) o l\'1% (Premium) prima di trasferire i fondi al festeggiato tramite Stripe Connect.',
            },
            {
              q: 'Posso prelevare i fondi anche se l\'obiettivo non è raggiunto?',
              a: 'Sì! Il festeggiato può richiedere il payout in qualsiasi momento, indipendentemente dal fatto che l\'obiettivo sia stato raggiunto o meno.',
            },
            {
              q: 'Il bonifico diretto prevede commissioni?',
              a: 'No! Il bonifico diretto tramite IBAN non prevede nessuna commissione da parte nostra. Gli eventuali costi bancari sono a carico di chi effettua il bonifico.',
            },
            {
              q: 'Posso cancellare il piano Premium in qualsiasi momento?',
              a: 'Sì, puoi cancellare in qualsiasi momento dal portale clienti Stripe. Il piano resterà attivo fino alla fine del periodo già pagato.',
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b pb-4">
              <p className="font-semibold mb-2">{faq.q}</p>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="text-purple-600 hover:underline text-sm">
            ← Torna alla homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
