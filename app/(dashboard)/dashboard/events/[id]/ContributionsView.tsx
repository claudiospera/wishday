'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatEuro, formatDate, calculateProgress } from '@/lib/utils'
import { toast } from 'sonner'
import type { WishItem, Contribution, Payout, User } from '@/lib/types'

interface Props {
  eventId: string
  userId: string
}

interface WishItemWithContributions extends WishItem {
  contributions: Contribution[]
}

export default function ContributionsView({ eventId, userId }: Props) {
  const [collectiveItems, setCollectiveItems] = useState<WishItemWithContributions[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [payingOut, setPayingOut] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [{ data: items }, { data: payoutsData }, { data: profileData }] = await Promise.all([
      supabase.from('wish_items').select('*, contributions(*)').eq('event_id', eventId).eq('type', 'collective').order('created_at', { ascending: false }),
      supabase.from('payouts').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
      supabase.from('users').select('payout_method, payout_iban, stripe_account_id, stripe_account_verified').eq('id', userId).single(),
    ])

    setCollectiveItems(items ?? [])
    setPayouts(payoutsData ?? [])
    setProfile(profileData as User | null)
    setLoading(false)
  }

  async function handlePayout(item: WishItemWithContributions) {
    if (item.collected_amount <= 0) { toast.error('Nessun importo da prelevare'); return }

    const method = profile?.payout_method ?? 'iban'

    if (method === 'iban') {
      if (!profile?.payout_iban) {
        toast.error('Inserisci il tuo IBAN nelle Impostazioni prima di richiedere il payout')
        return
      }
    } else {
      if (!profile?.stripe_account_id || !profile?.stripe_account_verified) {
        toast.error('Completa la configurazione Stripe Connect nelle Impostazioni')
        return
      }
    }

    setPayingOut(item.id)
    try {
      const endpoint = method === 'iban' ? '/api/stripe/payout-iban' : '/api/stripe/payout'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishItemId: item.id, eventId, userId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Errore payout')
      const msg = method === 'iban'
        ? `Richiesta inviata! Riceverai un bonifico di ${formatEuro(data.netAmount)} entro 2-3 giorni.`
        : `Payout di ${formatEuro(item.collected_amount)} richiesto!`
      toast.success(msg)
      await loadData()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore durante il payout')
    } finally {
      setPayingOut(null)
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Caricamento...</div>

  return (
    <div className="space-y-6">
      {/* Regali collettivi */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-4">Regali collettivi</h2>
        {collectiveItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-gray-400">
              Nessun regalo collettivo nella wish list
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {collectiveItems.map((item) => {
              const progress = calculateProgress(item.collected_amount, item.price)
              const isComplete = progress >= 100
              return (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge className={isComplete ? 'bg-green-500' : 'bg-amber-100 text-amber-700'}>
                        {isComplete ? '✅ Obiettivo raggiunto' : `${progress}%`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Barra progresso */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-tiffany-700">{formatEuro(item.collected_amount)}</span>
                        <span className="text-gray-400">di {formatEuro(item.price)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-tiffany-500'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{item.contributors_count} contribut{item.contributors_count !== 1 ? 'i' : 'o'}</p>
                    </div>

                    {/* Lista contributi */}
                    {item.contributions && item.contributions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Contributi ricevuti:</p>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {item.contributions
                            .filter((c: Contribution) => c.status === 'completed')
                            .map((c: Contribution) => (
                              <div key={c.id} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                                <div>
                                  <span className="font-medium">{c.contributor_name}</span>
                                  {c.message && <p className="text-xs text-gray-400 italic">&ldquo;{c.message}&rdquo;</p>}
                                </div>
                                <span className="font-medium text-green-600">{formatEuro(c.amount)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Pulsante payout */}
                    <Button
                      onClick={() => handlePayout(item)}
                      disabled={item.collected_amount <= 0 || payingOut === item.id}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {payingOut === item.id
                        ? 'Elaborazione...'
                        : `💰 Preleva ${formatEuro(item.collected_amount)}`}
                    </Button>
                    {!isComplete && item.collected_amount > 0 && (
                      <p className="text-xs text-center text-gray-400">
                        Puoi prelevare anche se l&apos;obiettivo non è stato raggiunto
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Storico prelievi */}
      {payouts.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">Storico prelievi</h2>
          <div className="space-y-2">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
                <div>
                  <p className="font-medium text-sm">{formatEuro(payout.amount)}</p>
                  <p className="text-xs text-gray-400">{formatDate(payout.created_at)}</p>
                  {payout.note && <p className="text-xs text-gray-400 italic">{payout.note}</p>}
                </div>
                <Badge className={
                  payout.status === 'completed' ? 'bg-green-100 text-green-700' :
                  payout.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }>
                  {payout.status === 'completed' ? 'Completato' :
                   payout.status === 'failed' ? 'Fallito' : 'In elaborazione'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
