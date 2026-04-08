import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink } from 'lucide-react'
import EventForm from '../EventForm'
import WishListManager from './WishListManager'
import ContributionsView from './ContributionsView'
import MessagesView from './MessagesView'
import SharePanel from './SharePanel'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: event }, { data: profile }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('users').select('plan').eq('id', user.id).single(),
  ])

  if (!event) notFound()

  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-purple-600">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-700">{event.title}</span>
          </div>
          <h1 className="text-2xl font-bold">{event.title}</h1>
        </div>
        {event.is_public && (
          <Link href={`/event/${event.slug}`} target="_blank" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            <ExternalLink className="w-3 h-3 mr-1" />
            Vedi pagina pubblica
          </Link>
        )}
      </div>

      {/* Tab navigazione */}
      <Tabs defaultValue="wishlist">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wishlist">🎁 Wish List</TabsTrigger>
          <TabsTrigger value="contributions">💰 Contributi</TabsTrigger>
          <TabsTrigger value="messages">💬 Auguri</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Impostazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="wishlist" className="mt-6">
          <WishListManager event={event} userId={user.id} />
        </TabsContent>

        <TabsContent value="contributions" className="mt-6">
          <ContributionsView eventId={event.id} userId={user.id} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <MessagesView eventId={event.id} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <EventForm userId={user.id} userPlan={profile?.plan} event={event} />
            <SharePanel event={event} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
