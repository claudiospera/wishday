import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, eventTypeEmoji } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-tiffany-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Wishday" width={36} height={36} className="rounded" />
            <span className="font-bold text-xl text-tiffany-700">Wishday</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="#come-funziona" className="hover:text-tiffany-700 transition-colors">
              Come funziona
            </Link>
            <Link href="/pricing" className="hover:text-tiffany-700 transition-colors">
              Prezzi
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Accedi
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: 'sm' }), 'bg-tiffany-700 hover:bg-tiffany-800 text-white')}>
              Inizia gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-tiffany-50 via-white to-amber-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-tiffany-100 text-tiffany-700 border-tiffany-200">
              ✨ Lista desideri per ogni occasione speciale
            </Badge>
            <h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Il tuo giorno speciale,{' '}
              <span className="text-tiffany-700">i tuoi desideri</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Crea la tua pagina personalizzata, condividila con gli invitati e ricevi esattamente
              i regali che vuoi — o contributi collettivi per quello speciale.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className={cn(buttonVariants({ size: 'lg' }), 'bg-tiffany-700 hover:bg-tiffany-800 text-white text-lg px-8')}>
                Crea la tua lista gratis
              </Link>
              <Link href="#come-funziona" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'text-lg px-8')}>
                Scopri come funziona
              </Link>
            </div>
            {/* Tipi evento */}
            <div className="flex flex-wrap gap-2 justify-center mt-10">
              {Object.entries(eventTypeEmoji).map(([key, emoji]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-tiffany-100 text-sm text-gray-600 shadow-sm"
                >
                  {emoji}{' '}
                  {key === 'birthday' ? 'Compleanno' :
                   key === 'wedding' ? 'Matrimonio' :
                   key === 'graduation' ? 'Laurea' :
                   key === 'baptism' ? 'Battesimo' : 'Altro'}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Come funziona */}
        <section id="come-funziona" className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Come funziona
            </h2>
            <p className="text-center text-gray-500 mb-12">Tre semplici passi per ricevere i regali che ami</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: '🎨', title: 'Crea il tuo evento', desc: 'Registrati, crea il tuo evento e personalizza la pagina con foto e descrizione.' },
                { step: '2', icon: '🎁', title: 'Aggiungi i desideri', desc: 'Inserisci i regali — singoli o collettivi. Aggiungi link al negozio, foto e prezzo.' },
                { step: '3', icon: '📤', title: 'Condividi con gli invitati', desc: 'Invia il link via WhatsApp o email. Gli invitati prenotano o contribuiscono.' },
              ].map((item) => (
                <Card key={item.step} className="border-tiffany-100 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-tiffany-100 flex items-center justify-center mx-auto mb-4 text-xl">
                      {item.icon}
                    </div>
                    <div className="text-xs font-bold text-tiffany-500 mb-2">PASSO {item.step}</div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="py-20 px-4 bg-gradient-to-br from-tiffany-50 to-amber-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-playfair)' }}>
              Tutto quello che ti serve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '💝', title: 'Regali collettivi', desc: 'Barra di avanzamento in tempo reale. Tutti contribuiscono, tu ricevi il regalo che ami.' },
                { icon: '🏦', title: 'Bonifico diretto', desc: 'Inserisci il tuo IBAN e genera un QR code. Nessuna commissione.' },
                { icon: '📱', title: 'PWA installabile', desc: "Aggiungi Wishday alla home del tuo telefono come una vera app." },
                { icon: '🔒', title: 'Pagamenti sicuri', desc: 'Stripe gestisce tutti i pagamenti. I tuoi fondi sono al sicuro.' },
                { icon: '📊', title: 'Dashboard completa', desc: 'Monitora prenotazioni, contributi e preleva i fondi quando vuoi.' },
                { icon: '🎊', title: 'Condivisione facile', desc: 'WhatsApp, Telegram, email — condividi il tuo link con un click.' },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-xl p-5 border border-tiffany-100 shadow-sm">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA finale */}
        <section className="py-20 px-4 bg-tiffany-700 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Pronto a creare la tua lista?
            </h2>
            <p className="text-tiffany-200 mb-8 text-lg">
              Gratis, senza carta di credito. In 2 minuti sei operativo.
            </p>
            <Link href="/register" className={cn(buttonVariants({ size: 'lg' }), 'bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg px-10')}>
              Inizia gratis ora →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="font-bold text-white">Wishday</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Wishday. Fatto con ❤️ in Italia.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Prezzi</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
