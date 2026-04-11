'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { resetPasswordAction, confirmAccountAction, deleteUserAction } from './actions'

interface Props {
  userId: string
  email: string
  confirmed: boolean
}

export default function AdminActions({ userId, email, confirmed }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleReset() {
    setLoading('reset')
    try {
      await resetPasswordAction(email)
      toast.success(`Email reset password inviata a ${email}`)
    } catch {
      toast.error('Errore invio email reset')
    } finally {
      setLoading(null)
    }
  }

  async function handleConfirm() {
    setLoading('confirm')
    try {
      await confirmAccountAction(userId)
      toast.success('Account confermato manualmente')
    } catch {
      toast.error('Errore conferma account')
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete() {
    if (!confirm(`Eliminare definitivamente l'account ${email}?`)) return
    setLoading('delete')
    try {
      await deleteUserAction(userId)
      toast.success('Account eliminato')
    } catch {
      toast.error('Errore eliminazione account')
    } finally {
      setLoading(null)
    }
  }

  const busy = loading !== null

  return (
    <div className="flex gap-1 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-7 px-2"
        onClick={handleReset}
        disabled={busy}
        title="Invia email per reimpostare la password"
      >
        {loading === 'reset' ? '...' : '🔑 Reset pwd'}
      </Button>
      {!confirmed && (
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-2 text-tiffany-700 border-tiffany-300"
          onClick={handleConfirm}
          disabled={busy}
          title="Conferma manualmente l'account senza richiedere email"
        >
          {loading === 'confirm' ? '...' : '✅ Conferma'}
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-7 px-2 text-red-500 hover:text-red-600 hover:border-red-300"
        onClick={handleDelete}
        disabled={busy}
        title="Elimina account definitivamente"
      >
        {loading === 'delete' ? '...' : '🗑️ Elimina'}
      </Button>
    </div>
  )
}
