import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatDate, eventTypeEmoji, eventTypeLabels, eventThemes, themeColorMap, getCoverStyle } from '@/lib/utils'
import type { EventTheme } from '@/lib/types'
import CountdownTimer from '@/components/CountdownTimer'
import { InviteTemplateCard } from '@/components/InviteTemplate'
import WishItemCard from '@/components/WishItem/WishItemCard'
import IbanSection from './IbanSection'
import WishForm from './WishForm'
import MessagesDisplay from './MessagesDisplay'
import GreetingCardTrigger from './GreetingCardTrigger'
import ShippingAddressBox from './ShippingAddressBox'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

export default async function EventPublicPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
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
  const themeKey = event.theme ? event.theme as EventTheme : 'purple'
  const heroGradient = eventThemes[themeKey]?.gradient ?? eventThemes.purple.gradient
  const tc = themeColorMap[themeKey] ?? themeColorMap.purple

  // Parametri post-Stripe per biglietto augurale
  const contributionSuccess = sp.contribution === 'success'
  const senderName = typeof sp.from === 'string' ? decodeURIComponent(sp.from) : ''
  const giftName = typeof sp.gift === 'string' ? decodeURIComponent(sp.gift) : ''
  const defaultMsg = typeof sp.msg === 'string' ? decodeURIComponent(sp.msg) : ''

  return (
    <div className="min-h-screen" style={{ backgroundColor: tc.light }}>
      {/* Barra navigazione pubblica */}
      <div className="px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur border-b" style={{ borderColor: tc.border }}>
        <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <span className="text-sm font-semibold tracking-wide" style={{ color: tc.text }}>Wishday</span>
        </Link>
        <Link href="/login" className="text-xs font-medium transition-colors" style={{ color: tc.text }}>
          Accedi
        </Link>
      </div>

      {/* Hero con copertina */}
      <div className="relative">
        <div
          className={`h-64 md:h-80 bg-gradient-to-br ${heroGradient}`}
          style={getCoverStyle(event.cover_image_url)}
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

        {/* Indirizzo spedizione */}
        {event.shipping_address && (
          <ShippingAddressBox address={event.shipping_address} tc={tc} />
        )}

        {/* Invito caricato dall'organizzatore */}
        {event.invite_image_url && (
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: tc.text }}>
              📩 Invito
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-md border" style={{ borderColor: tc.border }}>
              {event.invite_image_url.startsWith('template:') ? (
                <div className="p-6" style={{ background: tc.muted }}>
                  <InviteTemplateCard
                    templateKey={event.invite_image_url.replace('template:', '')}
                    title={event.title}
                    date={event.date}
                    eventType={event.type}
                    hostName={(event.users as { full_name: string })?.full_name}
                    celebrantName={event.celebrant_name ?? null}
                    location={event.event_location ?? null}
                    rsvpPhone={event.rsvp_phone ?? null}
                    customEventType={event.custom_event_type ?? null}
                    mode="full"
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.invite_image_url}
                  alt="Invito all'evento"
                  className="w-full object-contain max-h-[500px]"
                />
              )}
            </div>
          </section>
        )}

        {/* WhatsApp festeggiato */}
        {event.rsvp_phone && (
          <div className="flex justify-center">
            <a
              href={`https://wa.me/${event.rsvp_phone.replace(/\s+/g, '').replace(/^\+/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.124 1.527 5.855L.057 23.084a.75.75 0 0 0 .916.917l5.228-1.47A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.715 9.715 0 0 1-4.963-1.364l-.356-.213-3.691 1.037 1.037-3.692-.214-.356A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
              </svg>
              Chatta su WhatsApp con il festeggiato
            </a>
          </div>
        )}

        {/* Conto alla rovescia */}
        {!isExpired && <CountdownTimer eventDate={event.date} />}

        {/* Messaggio di benvenuto */}
        {event.description && (
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: tc.border }}>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Wish list */}
        {wishItems && wishItems.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: tc.text }}>
              🎁 Lista desideri
            </h2>
            <div className="grid gap-4">
              {wishItems.map((item) => (
                <WishItemCard
                  key={item.id}
                  item={item}
                  hostPlan={hostPlan}
                  isExpired={isExpired}
                  eventType={event.type}
                  eventTitle={event.title}
                  themeKey={themeKey}
                  shippingAddress={event.shipping_address ?? undefined}
                />
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
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: tc.text }}>
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
          <div className="text-center py-4 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400">Creato con</span>
            <a href="/" className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="Wishday" width={20} height={20} className="rounded" />
              <span className="text-sm font-medium" style={{ color: tc.primary }}>Wishday</span>
            </a>
          </div>
        )}
      </div>

      {/* Biglietto augurale post-contributo Stripe */}
      {contributionSuccess && (
        <GreetingCardTrigger
          eventType={event.type}
          eventTitle={event.title}
          senderName={senderName}
          giftName={giftName}
          defaultMessage={defaultMsg}
        />
      )}
    </div>
  )
}
