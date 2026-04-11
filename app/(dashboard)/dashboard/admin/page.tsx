export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import AdminActions from './AdminActions'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const admin = createAdminClient()

  // Fetch utenti da tabella custom
  const { data: users } = await admin
    .from('users')
    .select('*, events(count)')
    .order('created_at', { ascending: false })

  // Fetch utenti auth per stato conferma
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const authMap = new Map(authUsers.map((u) => [u.id, u]))

  // Statistiche
  const { count: totalUsers } = await admin.from('users').select('*', { count: 'exact', head: true })
  const { count: totalEvents } = await admin.from('events').select('*', { count: 'exact', head: true })
  const { count: premiumUsers } = await admin.from('users').select('*', { count: 'exact', head: true }).eq('plan', 'premium')
  const { data: contributions } = await admin.from('contributions').select('amount').eq('status', 'completed')
  const totalRevenue = contributions?.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pannello Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Visibile solo a te</p>
        </div>
        <Link href="/dashboard/admin/contabilita" className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors">
          💰 Contabilità
        </Link>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-tiffany-700">{totalUsers ?? 0}</div>
            <div className="text-sm text-gray-500 mt-1">Utenti totali</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-tiffany-700">{premiumUsers ?? 0}</div>
            <div className="text-sm text-gray-500 mt-1">Utenti Premium</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-tiffany-700">{totalEvents ?? 0}</div>
            <div className="text-sm text-gray-500 mt-1">Eventi creati</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-tiffany-700">€{(totalRevenue / 100).toFixed(0)}</div>
            <div className="text-sm text-gray-500 mt-1">Volume raccolto</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista utenti */}
      <Card>
        <CardHeader>
          <CardTitle>Utenti registrati ({totalUsers ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Nome</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Piano</th>
                  <th className="pb-3 pr-4 font-medium">Stato</th>
                  <th className="pb-3 pr-4 font-medium">Eventi</th>
                  <th className="pb-3 pr-4 font-medium">Registrato</th>
                  <th className="pb-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map((u) => {
                  const authUser = authMap.get(u.id)
                  const confirmed = !!authUser?.email_confirmed_at
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">
                        {u.full_name ?? '—'}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                      <td className="py-3 pr-4">
                        {u.plan === 'premium' ? (
                          <Badge className="bg-tiffany-100 text-tiffany-700 border-tiffany-200">Premium</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Free</Badge>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {confirmed ? (
                          <span className="text-green-600 text-xs font-medium">✓ Confermato</span>
                        ) : (
                          <span className="text-amber-500 text-xs font-medium">⏳ In attesa</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {(u.events as { count: number }[])?.[0]?.count ?? 0}
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{formatDate(u.created_at)}</td>
                      <td className="py-3">
                        <AdminActions userId={u.id} email={u.email} confirmed={confirmed} />
                      </td>
                    </tr>
                  )
                })}
                {(!users || users.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      Nessun utente registrato
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
