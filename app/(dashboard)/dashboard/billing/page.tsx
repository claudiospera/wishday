'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { User, Subscription, BillingAddress } from '@/lib/types'

export default function BillingPage() {
  const [profile, setProfile] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [billingName, setBillingName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [billingLine1, setBillingLine1] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingPostalCode, setBillingPostalCode] = useState('')
  const [savingBilling, setSavingBilling] = useState(false)

  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: profileData }, { data: subData }] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
    ])
    setProfile(profileData)
    setSubscription(subData)
    if (profileData) {
      setBillingName(profileData.billing_name ?? '')
      setTaxId(profileData.tax_id ?? '')
      const addr = profileData.billing_address as BillingAddress | null
      setBillingLine1(addr?.line1 ?? '')
      setBillingCity(addr?.city ?? '')
      setBillingPostalCode(addr?.postal_code ?? '')
    }
    setLoading(false)
  }

  async function handleSaveBilling() {
    setSavingBilling(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('users').update({
        billing_name: billingName || null,
        tax_id: taxId || null,
        billing_address: (billingLine1 || billingCity || billingPostalCode) ? {
          line1: billingLine1 || null,
          line2: null,
          city: billingCity || null,
          postal_code: billingPostalCode || null,
          state: null,
          country: 'IT',
        } : null,
      }).eq('id', user.id)
      if (error) throw error
      toast.success('Dati di fatturazione salvati!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore salvataggio')
    } finally {
      setSavingBilling(false)
    }
  }

  async function handleCheckout(interval: 'monthly' | 'yearly') {
    setCheckoutLoading(interval)
    try {
      const res = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore checkout')
      setCheckoutLoading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore portale')
      setPortalLoading(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Caricamento...</div>

  const isPremium = profile?.plan === 'premium'

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Abbonamento</h1>
        <p className="text-gray-500">Gestisci il tuo piano Wishday</p>
      </div>

      {/* Piano corrente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Piano corrente</CardTitle>
            <Badge className={isPremium ? 'bg-amber-500' : 'bg-gray-200 text-gray-700'}>
              {isPremium ? '⭐ Premium' : 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isPremium && subscription ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Il tuo piano Premium è attivo fino al{' '}
                <strong>{formatDate(subscription.current_period_end)}</strong>
              </p>
              <Button variant="outline" onClick={handlePortal} disabled={portalLoading}>
                {portalLoading ? 'Caricamento...' : 'Gestisci abbonamento'}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Stai usando il piano Free. Passa a Premium per sbloccare tutte le funzionalità.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dati di fatturazione */}
      <Card>
        <CardHeader>
          <CardTitle>Dati di fatturazione</CardTitle>
          <CardDescription>
            Usati per il calcolo IVA e per le fatture. Salvali prima di abbonarti.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Nome / Ragione sociale</Label>
              <Input
                placeholder="Mario Rossi"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Codice fiscale / P.IVA</Label>
              <Input
                placeholder="RSSMRA80A01H501U oppure IT12345678901"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value.toUpperCase())}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Indirizzo</Label>
              <Input
                placeholder="Via Roma 1"
                value={billingLine1}
                onChange={(e) => setBillingLine1(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Città</Label>
              <Input
                placeholder="Milano"
                value={billingCity}
                onChange={(e) => setBillingCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>CAP</Label>
              <Input
                placeholder="20100"
                value={billingPostalCode}
                onChange={(e) => setBillingPostalCode(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleSaveBilling}
            disabled={savingBilling}
            className="bg-tiffany-700 hover:bg-tiffany-800 text-white"
          >
            {savingBilling ? 'Salvataggio...' : 'Salva dati di fatturazione'}
          </Button>
        </CardContent>
      </Card>

      {/* Confronto piani */}
      {!isPremium && (
        <div className="grid md:grid-cols-2 gap-4 pt-4">
          {/* Piano Free */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Per iniziare</CardDescription>
              <div className="text-3xl font-bold mt-2">€0<span className="text-lg font-normal text-gray-400">/mese</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[
                  '1 evento attivo',
                  'Max 10 prodotti',
                  'Commissione 5% sui contributi',
                  'Branding Wishday',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600">
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Badge className="mt-4 bg-gray-100 text-gray-600">Piano attuale</Badge>
            </CardContent>
          </Card>

          {/* Piano Premium */}
          <Card className="border-tiffany-400 ring-2 ring-tiffany-400 relative mt-4 overflow-visible">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <Badge className="bg-tiffany-700 text-white">Più popolare</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⭐</span> Premium
              </CardTitle>
              <CardDescription>Per chi festeggia spesso</CardDescription>
              <div className="mt-2 space-y-1">
                <div className="text-3xl font-bold text-tiffany-700">
                  €9,90<span className="text-lg font-normal text-gray-400">/mese</span>
                </div>
                <p className="text-sm text-gray-400">oppure €79/anno (risparmi 2 mesi)</p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                {[
                  'Eventi illimitati',
                  'Wish list illimitata',
                  'Commissione 3% (invece del 5%)',
                  'Nessun branding Wishday',
                  'Temi premium per la pagina',
                  'Supporto prioritario',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <span className="text-tiffany-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <Button
                  className="w-full bg-tiffany-700 hover:bg-tiffany-800 text-white"
                  onClick={() => handleCheckout('monthly')}
                  disabled={!!checkoutLoading}
                >
                  {checkoutLoading === 'monthly' ? 'Caricamento...' : '€9,90/mese — Inizia ora'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-tiffany-300 text-tiffany-700"
                  onClick={() => handleCheckout('yearly')}
                  disabled={!!checkoutLoading}
                >
                  {checkoutLoading === 'yearly' ? 'Caricamento...' : '€79/anno — Risparmia €39,80'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
