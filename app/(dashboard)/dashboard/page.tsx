import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Settings } from 'lucide-react'
import { cn, formatDate, eventTypeEmoji, eventTypeLabels } from '@/lib/utils'
import type { Event } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Recupera eventi dell'utente
  const { data: events } = await supabase
    .from('events')
    .select('*, wish_items(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Recupera profilo per controllare il piano
  const { data: profile } = await supabase
    .from('users')
    .select('plan, full_name')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.plan === 'premium'
  const maxEvents = isPremium ? Infinity : 1
  const canCreateEvent = (events?.length ?? 0) < maxEvents

  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ciao, {profile?.full_name?.split(' ')[0] ?? 'utente'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Gestisci i tuoi eventi e le wish list</p>
        </div>
        {canCreateEvent ? (
          <Link href="/dashboard/events/new" className={cn(buttonVariants(), 'bg-tiffany-700 hover:bg-tiffany-800 text-white')}>
            <Plus className="w-4 h-4 mr-2" />
            Nuovo evento
          </Link>
        ) : (
          <Link href="/dashboard/billing" className={cn(buttonVariants({ variant: 'outline' }), 'border-amber-400 text-amber-700')}>
            ⭐ Abbonati — €79/anno
          </Link>
        )}
      </div>

      {/* Banner piano free */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-amber-800">Piano Free</p>
            <p className="text-sm text-amber-600">
              1 evento attivo, max 10 prodotti, commissione 3% sui contributi
            </p>
          </div>
          <Link href="/dashboard/billing" className={cn(buttonVariants({ size: 'sm' }), 'bg-amber-500 hover:bg-amber-600 text-white')}>
            ⭐ Abbonati — €79/anno
          </Link>
        </div>
      )}

      {/* Lista eventi */}
      {events && events.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event: Event & { wish_items: { count: number }[] }) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow border-gray-200">
              {/* Copertina evento */}
              <div
                className="h-32 rounded-t-lg bg-gradient-to-br from-tiffany-100 to-amber-100 relative overflow-hidden"
                style={event.cover_image_url ? {
                  backgroundImage: `url(${event.cover_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {}}
              >
                <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                  <span className="text-2xl">
                    {eventTypeEmoji[event.type] ?? '🎉'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={event.is_public ? 'default' : 'secondary'}
                    className={event.is_public ? 'bg-green-500' : ''}
                  >
                    {event.is_public ? 'Pubblico' : 'Privato'}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">{event.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  {eventTypeLabels[event.type]} • {formatDate(event.date)}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-xs text-gray-400 mb-3">
                  {(event.wish_items as unknown as { count: number }[])?.[0]?.count ?? 0} prodotti nella wish list
                </p>
                <div className="flex gap-2">
                  <Link href={`/dashboard/events/${event.id}`} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'flex-1')}>
                    <Settings className="w-3 h-3 mr-1" />
                    Gestisci
                  </Link>
                  {event.is_public && (
                    <Link href={`/event/${event.slug}`} target="_blank" className={buttonVariants({ size: 'sm', variant: 'ghost' })}>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Stato vuoto */
        <Card className="border-dashed border-2 border-tiffany-200">
          <CardContent className="py-16 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold mb-2">Crea il tuo primo evento</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Compleanno, matrimonio, laurea, battesimo — crea la tua pagina e condividi la wish list con gli invitati.
            </p>
            <Link href="/dashboard/events/new" className={cn(buttonVariants(), 'bg-tiffany-700 hover:bg-tiffany-800 text-white')}>
              <Plus className="w-4 h-4 mr-2" />
              Crea il tuo primo evento
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
