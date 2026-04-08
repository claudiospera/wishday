import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventForm from '../EventForm'

export default async function NewEventPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Controlla limite piano free
  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
  const { count } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('user_id', user.id)

  if (profile?.plan === 'free' && (count ?? 0) >= 1) {
    redirect('/dashboard/billing?reason=event_limit')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crea nuovo evento</h1>
        <p className="text-gray-500">Inserisci i dettagli del tuo evento speciale</p>
      </div>
      <EventForm userId={user.id} userPlan={profile?.plan} />
    </div>
  )
}
