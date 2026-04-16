import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import EventTabs from './EventTabs'

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
            <Link href="/dashboard" className="hover:text-tiffany-600">Dashboard</Link>
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

      <EventTabs event={event} userId={user.id} userPlan={profile?.plan} />
    </div>
  )
}
