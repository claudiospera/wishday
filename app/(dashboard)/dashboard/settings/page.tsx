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

      {/* Stripe Connect */}
      <Card>
        <CardHeader>
          <CardTitle>Conto bancario (Stripe Connect)</CardTitle>
          <CardDescription>
            Collega il tuo conto bancario per ricevere i pagamenti dei regali collettivi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile?.stripe_account_id ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={profile.stripe_account_verified ? 'bg-green-500' : 'bg-amber-500'}>
                  {profile.stripe_account_verified ? '✅ Account verificato' : '⏳ In attesa di verifica'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                ID account: <code className="text-xs bg-gray-100 px-1 rounded">{profile.stripe_account_id}</code>
              </p>
              {!profile.stripe_account_verified && (
                <Button onClick={handleStripeConnect} variant="outline" disabled={connectLoading}>
                  {connectLoading ? 'Caricamento...' : 'Completa la verifica'}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Collega il tuo conto bancario italiano per ricevere i contributi degli invitati direttamente.
                La piattaforma trattiene automaticamente la commissione prima del payout.
              </p>
              <Button
                onClick={handleStripeConnect}
                disabled={connectLoading}
                className="bg-tiffany-700 hover:bg-tiffany-800 text-white"
              >
                {connectLoading ? 'Caricamento...' : '🏦 Collega il tuo conto bancario'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
