export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatEuro } from '@/lib/utils'
import { getPlatformCommission } from '@/lib/stripe'

export default async function ContabilitaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()

  // Tutte le contribuzioni completate
  const { data: contributions } = await admin
    .from('contributions')
    .select('wish_item_id, amount')
    .eq('status', 'completed')

  // Tutti i payout con join
  const { data: payouts } = await admin
    .from('payouts')
    .select('*, events(title), wish_items(title), users(full_name, email, plan)')
    .order('created_at', { ascending: false })

  // Wish items in attesa di payout (non ancora riscossi)
  const { data: pendingItems } = await admin
    .from('wish_items')
    .select('*, events(title, users(full_name, email, plan))')
    .in('status', ['fully_funded', 'partially_funded'])
    .gt('collected_amount', 0)

  // Mappa gross per wish_item_id calcolata dai contributi
  const grossByItem = new Map<string, number>()
  for (const c of contributions ?? []) {
    if (c.wish_item_id) {
      grossByItem.set(c.wish_item_id, (grossByItem.get(c.wish_item_id) ?? 0) + Number(c.amount))
    }
  }

  // ── KPI ──────────────────────────────────────────────────────────────────
  const totalGross = contributions?.reduce((sum, c) => sum + Number(c.amount), 0) ?? 0

  const completedPayouts = payouts?.filter(p => p.status === 'completed') ?? []
  const totalNetPaid = completedPayouts.reduce((sum, p) => sum + Number(p.amount), 0)

  const grossOfCompleted = completedPayouts.reduce((sum, p) => {
    return sum + (p.wish_item_id ? (grossByItem.get(p.wish_item_id) ?? Number(p.amount)) : Number(p.amount))
  }, 0)
  const totalCommissions = grossOfCompleted - totalNetPaid

  const totalPending = pendingItems?.reduce((sum, item) => sum + Number(item.collected_amount), 0) ?? 0
  const pendingCommissions = pendingItems?.reduce((sum, item) => {
    const plan = ((item.events as { users?: { plan?: string } })?.users?.plan ?? 'free') as 'free' | 'premium'
    return sum + Number(item.collected_amount) * getPlatformCommission(plan)
  }, 0) ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilità</h1>
          <p className="text-gray-500 text-sm mt-1">Commissioni e payout — visibile solo a te</p>
        </div>
        <Link href="/dashboard/admin" className="text-sm text-tiffany-700 hover:underline">← Admin</Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-tiffany-700">{formatEuro(totalGross)}</div>
            <div className="text-sm text-gray-500 mt-1">Raccolto totale</div>
            <div className="text-xs text-gray-400 mt-0.5">{contributions?.length ?? 0} contributi</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{formatEuro(totalCommissions)}</div>
            <div className="text-sm text-gray-500 mt-1">Commissioni incassate</div>
            <div className="text-xs text-gray-400 mt-0.5">su payout completati</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-tiffany-700">{formatEuro(totalNetPaid)}</div>
            <div className="text-sm text-gray-500 mt-1">Pagato agli host</div>
            <div className="text-xs text-gray-400 mt-0.5">{completedPayouts.length} payout</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{formatEuro(totalPending)}</div>
            <div className="text-sm text-gray-500 mt-1">In attesa payout</div>
            <div className="text-xs text-amber-500 mt-0.5">~{formatEuro(pendingCommissions)} comm. potenziali</div>
          </CardContent>
        </Card>
      </div>

      {/* Fondi in attesa */}
      {pendingItems && pendingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Fondi in attesa di payout ({pendingItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 text-xs">
                    <th className="pb-3 pr-4 font-medium">Host</th>
                    <th className="pb-3 pr-4 font-medium">Evento</th>
                    <th className="pb-3 pr-4 font-medium">Regalo</th>
                    <th className="pb-3 pr-4 font-medium">Piano</th>
                    <th className="pb-3 pr-4 font-medium">Raccolto</th>
                    <th className="pb-3 pr-4 font-medium">Comm. %</th>
                    <th className="pb-3 pr-4 font-medium">Comm. €</th>
                    <th className="pb-3 font-medium">Netto host</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingItems.map((item) => {
                    const eventData = item.events as { title: string; users?: { full_name?: string; email?: string; plan?: string } } | null
                    const userData = eventData?.users
                    const plan = (userData?.plan ?? 'free') as 'free' | 'premium'
                    const rate = getPlatformCommission(plan)
                    const gross = Number(item.collected_amount)
                    const commission = gross * rate
                    const net = gross - commission
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 text-gray-700">{userData?.full_name ?? userData?.email ?? '—'}</td>
                        <td className="py-3 pr-4 text-gray-600 max-w-[140px] truncate">{eventData?.title ?? '—'}</td>
                        <td className="py-3 pr-4 font-medium text-gray-900 max-w-[140px] truncate">{item.title}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className={plan === 'premium' ? 'border-tiffany-400 text-tiffany-700 text-xs' : 'text-gray-500 text-xs'}>
                            {plan === 'premium' ? 'Premium' : 'Free'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-gray-900">{formatEuro(gross)}</td>
                        <td className="py-3 pr-4 text-gray-500">{(rate * 100).toFixed(0)}%</td>
                        <td className="py-3 pr-4 font-semibold text-green-600">{formatEuro(commission)}</td>
                        <td className="py-3 text-gray-700">{formatEuro(net)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {pendingItems?.length === 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 py-8 text-center text-sm text-gray-400">
          Nessun fondo in attesa di payout
        </div>
      )}

      {/* Storico payout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Storico payout ({payouts?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500 text-xs">
                  <th className="pb-3 pr-4 font-medium">Data</th>
                  <th className="pb-3 pr-4 font-medium">Host</th>
                  <th className="pb-3 pr-4 font-medium">Evento</th>
                  <th className="pb-3 pr-4 font-medium">Regalo</th>
                  <th className="pb-3 pr-4 font-medium">Lordo</th>
                  <th className="pb-3 pr-4 font-medium">Commissione</th>
                  <th className="pb-3 pr-4 font-medium">Netto</th>
                  <th className="pb-3 pr-4 font-medium">Stato</th>
                  <th className="pb-3 font-medium">Stripe ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts?.map((p) => {
                  const gross = p.wish_item_id ? (grossByItem.get(p.wish_item_id) ?? Number(p.amount)) : Number(p.amount)
                  const commission = gross - Number(p.amount)
                  const userData = p.users as { full_name?: string; email?: string } | null
                  const eventData = p.events as { title?: string } | null
                  const itemData = p.wish_items as { title?: string } | null
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(p.created_at)}</td>
                      <td className="py-3 pr-4 text-gray-700 max-w-[120px] truncate">{userData?.full_name ?? userData?.email ?? '—'}</td>
                      <td className="py-3 pr-4 text-gray-600 max-w-[120px] truncate">{eventData?.title ?? '—'}</td>
                      <td className="py-3 pr-4 font-medium text-gray-900 max-w-[120px] truncate">{itemData?.title ?? '—'}</td>
                      <td className="py-3 pr-4 text-gray-700">{formatEuro(gross)}</td>
                      <td className="py-3 pr-4 font-semibold text-green-600">{commission > 0 ? formatEuro(commission) : '—'}</td>
                      <td className="py-3 pr-4 font-bold text-gray-900">{formatEuro(Number(p.amount))}</td>
                      <td className="py-3 pr-4">
                        <Badge className={
                          p.status === 'completed' ? 'bg-green-100 text-green-700 border-0 text-xs' :
                          p.status === 'pending' ? 'bg-amber-100 text-amber-700 border-0 text-xs' :
                          'bg-red-100 text-red-700 border-0 text-xs'
                        }>
                          {p.status === 'completed' ? '✓ Completato' : p.status === 'pending' ? '⏳ In attesa' : '✗ Fallito'}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-400 text-xs font-mono">
                        {p.stripe_payout_id ? `${p.stripe_payout_id.slice(0, 14)}…` : '—'}
                      </td>
                    </tr>
                  )
                })}
                {(!payouts || payouts.length === 0) && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-400 text-sm">Nessun payout ancora</td>
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
