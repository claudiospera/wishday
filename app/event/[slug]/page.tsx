import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatDate, eventTypeEmoji, eventTypeLabels } from '@/lib/utils'
import CountdownTimer from '@/components/CountdownTimer'
import WishItemCard from '@/components/WishItem/WishItemCard'
import IbanSection from './IbanSection'
import WishForm from './WishForm'
import MessagesDisplay from './MessagesDisplay'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('title, description, cover_image_url').eq('slug', slug).single()
  if (!event) return { title: 'Evento non trovato' }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishday.it'
  const description = event.description ?? `Scopri la wish list per ${event.title}`
  const images = event.cover_image_url ? [{ url: event.cover_image_url, width: 1200, height: 630 }] : []
  return {
    title: `${event.title} — Wishday`,
    description,
    openGraph: {
      title: event.title,
      description,
      url: `${appUrl}/event/${slug}`,
      type: 'website',
      siteName: 'Wishday',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: event.cover_image_url ? [event.cover_image_url] : [],
    },
  }
}

export default async function EventPublicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*, users(full_name, plan)')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!event) notFound()

  const { data: wishItems } = await supabase
    .from('wish_items')
    .select('*')
    .eq('event_id', event.id)
    .order('sort_order', { ascending: true })

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('event_id', event.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const hostPlan = (event.users as { full_name: string; plan: string })?.plan ?? 'free'
  const showBranding = hostPlan === 'free'
  const isExpired = event.date ? new Date(event.date) < new Date() : false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero con copertina */}
      <div className="relative">
        <div
          className="h-64 md:h-80 bg-gradient-to-br from-purple-200 via-purple-100 to-amber-100"
          style={event.cover_image_url ? {
            backgroundImage: `url(${event.cover_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{eventTypeEmoji[event.type]}</span>
              <span className="text-sm font-medium bg-white/20 backdrop-blur rounded-full px-3 py-0.5">
                {eventTypeLabels[event.type]}
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {event.title}
            </h1>
            <p className="text-white/80 text-sm">
              {formatDate(event.date)} •{' '}
              {(event.users as { full_name: string })?.full_name}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Banner evento concluso */}
        {isExpired && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🎊</span>
            <div>
              <p className="font-semibold text-amber-800">Evento concluso</p>
              <p className="text-sm text-amber-700">L&apos;evento si è già svolto. La lista è visibile ma non sono accettati nuovi contributi o prenotazioni.</p>
            </div>
          </div>
        )}

        {/* Conto alla rovescia */}
        {!isExpired && <CountdownTimer eventDate={event.date} />}

        {/* Messaggio di benvenuto */}
        {event.description && (
          <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Wish list */}
        {wishItems && wishItems.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              🎁 Lista desideri
            </h2>
            <div className="grid gap-4">
              {wishItems.map((item) => (
                <WishItemCard key={item.id} item={item} hostPlan={hostPlan} isExpired={isExpired} />
              ))}
            </div>
          </section>
        )}

        {/* Sezione IBAN */}
        {event.iban && (
          <IbanSection iban={event.iban} bankOwnerName={event.bank_owner_name} />
        )}

        {/* Form auguri */}
        {!isExpired && (
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              💬 Lascia un augurio
            </h2>
            <WishForm eventId={event.id} />
          </section>
        )}

        {/* Auguri pubblici */}
        {messages && messages.length > 0 && (
          <MessagesDisplay messages={messages} />
        )}

        {/* Branding piano free */}
        {showBranding && (
          <div className="text-center py-4 text-sm text-gray-400">
            Creato con{' '}
            <a href="/" className="text-purple-600 hover:underline font-medium">Wishday</a>
            {' '}🎉
          </div>
        )}
      </div>
    </div>
  )
}
