'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)

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

      {/* Metodo di ricezione pagamenti — solo Stripe Connect */}
      <Card>
        <CardHeader>
          <CardTitle>Ricezione pagamenti</CardTitle>
          <CardDescription>
            Collega il tuo conto bancario tramite Stripe per ricevere i fondi raccolti automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile?.stripe_account_id ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={profile.stripe_account_verified ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}>
                  {profile.stripe_account_verified ? '✅ Conto verificato' : '⏳ Verifica in corso'}
                </Badge>
              </div>

              {profile.stripe_account_verified ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                  Il tuo conto Stripe è attivo. I fondi vengono trasferiti automaticamente alla chiusura di ogni regalo collettivo.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                    Completa la verifica del tuo account Stripe per iniziare a ricevere i pagamenti.
                  </div>
                  <Button onClick={handleStripeConnect} variant="outline" disabled={connectLoading}>
                    {connectLoading ? 'Caricamento...' : '→ Completa la verifica'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 space-y-1">
                <p className="font-medium">Come funziona Stripe Connect?</p>
                <p className="text-gray-500">Stripe collega direttamente il tuo conto bancario. I fondi vengono trasferiti automaticamente quando richiedi il payout, al netto della commissione di piattaforma.</p>
              </div>
              <Button onClick={handleStripeConnect} disabled={connectLoading} className="bg-tiffany-700 hover:bg-tiffany-800 text-white">
                {connectLoading ? 'Caricamento...' : '🏦 Collega il tuo conto bancario'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
