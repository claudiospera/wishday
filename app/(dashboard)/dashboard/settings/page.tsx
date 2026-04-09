'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User, PayoutMethod } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('iban')
  const [payoutIban, setPayoutIban] = useState('')
  const [payoutBankOwner, setPayoutBankOwner] = useState('')
  const [savingPayout, setSavingPayout] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    setProfile(data)
    setFullName(data?.full_name ?? '')
    setPayoutMethod(data?.payout_method ?? 'iban')
    setPayoutIban(data?.payout_iban ?? '')
    setPayoutBankOwner(data?.payout_bank_owner ?? '')
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('users').update({ full_name: fullName }).eq('id', user.id)
      if (error) throw error
      toast.success('Profilo aggiornato!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore salvataggio')
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePayout() {
    setSavingPayout(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('users').update({
        payout_method: payoutMethod,
        payout_iban: payoutMethod === 'iban' ? payoutIban.replace(/\s/g, '').toUpperCase() || null : null,
        payout_bank_owner: payoutMethod === 'iban' ? payoutBankOwner || null : null,
      }).eq('id', user.id)
      if (error) throw error
      toast.success('Metodo di pagamento salvato!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore salvataggio')
    } finally {
      setSavingPayout(false)
    }
  }

  // Avvia onboarding Stripe Connect
  async function handleStripeConnect() {
    setConnectLoading(true)
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore Stripe Connect')
      setConnectLoading(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Caricamento...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Impostazioni</h1>
        <p className="text-gray-500">Gestisci il tuo profilo e le integrazioni</p>
      </div>

      {/* Profilo */}
      <Card>
        <CardHeader>
          <CardTitle>Profilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome completo</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? ''} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-400">L&apos;email non può essere modificata</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-tiffany-700 hover:bg-tiffany-800 text-white">
            {saving ? 'Salvataggio...' : 'Salva modifiche'}
          </Button>
        </CardContent>
      </Card>

      {/* Metodo di ricezione pagamenti */}
      <Card>
        <CardHeader>
          <CardTitle>Come vuoi ricevere i pagamenti?</CardTitle>
          <CardDescription>
            Scegli come ricevere i fondi raccolti dagli ospiti
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Scelta metodo */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPayoutMethod('iban')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                payoutMethod === 'iban'
                  ? 'border-tiffany-600 bg-tiffany-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-sm">🏦 Bonifico bancario</p>
              <p className="text-xs text-gray-500 mt-1">Inserisci il tuo IBAN. Il bonifico viene fatto manualmente entro 2-3 giorni.</p>
            </button>
            <button
              type="button"
              onClick={() => setPayoutMethod('stripe')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                payoutMethod === 'stripe'
                  ? 'border-tiffany-600 bg-tiffany-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-sm">⚡ Stripe Connect</p>
              <p className="text-xs text-gray-500 mt-1">Collega il tuo conto Stripe per ricevere i fondi automaticamente.</p>
            </button>
          </div>

          {/* Campi IBAN */}
          {payoutMethod === 'iban' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>IBAN</Label>
                <Input
                  placeholder="IT60 X054 2811 1010 0000 0123 456"
                  value={payoutIban}
                  onChange={(e) => setPayoutIban(e.target.value.replace(/\s/g, '').toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label>Intestatario del conto</Label>
                <Input
                  placeholder="Mario Rossi"
                  value={payoutBankOwner}
                  onChange={(e) => setPayoutBankOwner(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Stripe Connect */}
          {payoutMethod === 'stripe' && (
            <div className="space-y-3">
              {profile?.stripe_account_id ? (
                <div className="space-y-3">
                  <Badge className={profile.stripe_account_verified ? 'bg-green-500' : 'bg-amber-500'}>
                    {profile.stripe_account_verified ? '✅ Account verificato' : '⏳ In attesa di verifica'}
                  </Badge>
                  {!profile.stripe_account_verified && (
                    <Button onClick={handleStripeConnect} variant="outline" disabled={connectLoading}>
                      {connectLoading ? 'Caricamento...' : 'Completa la verifica'}
                    </Button>
                  )}
                </div>
              ) : (
                <Button onClick={handleStripeConnect} disabled={connectLoading} className="bg-tiffany-700 hover:bg-tiffany-800 text-white">
                  {connectLoading ? 'Caricamento...' : '🏦 Collega il tuo conto Stripe'}
                </Button>
              )}
            </div>
          )}

          <Button onClick={handleSavePayout} disabled={savingPayout} className="bg-tiffany-700 hover:bg-tiffany-800 text-white">
            {savingPayout ? 'Salvataggio...' : 'Salva metodo di pagamento'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
