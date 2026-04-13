'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore invio email'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tiffany-50 to-amber-50 px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="text-6xl">📬</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Controlla la tua email</h1>
            <p className="text-gray-500 mt-2">
              Abbiamo inviato un link a <strong>{email}</strong> per reimpostare la password.
            </p>
          </div>
          <p className="text-sm text-gray-400">
            Non hai ricevuto nulla? Controlla la cartella spam o{' '}
            <button className="text-tiffany-700 underline" onClick={() => setSent(false)}>
              riprova
            </button>
            .
          </p>
          <Link href="/login" className="text-sm text-tiffany-700 font-medium hover:underline block">
            Torna al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tiffany-50 to-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="Wishday" width={44} height={44} className="rounded" />
            <span className="font-bold text-2xl text-tiffany-700">Wishday</span>
          </Link>
        </div>

        <Card className="shadow-lg border-tiffany-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Password dimenticata?</CardTitle>
            <CardDescription>Inserisci la tua email per ricevere il link di reset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mario@esempio.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-tiffany-700 hover:bg-tiffany-800 text-white"
                disabled={loading}
              >
                {loading ? 'Invio in corso...' : 'Invia link di reset'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Ricordi la password?{' '}
              <Link href="/login" className="text-tiffany-700 font-medium hover:underline">
                Accedi
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
