'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  address: string
  tc: { border: string; muted: string; text: string }
}

export default function ShippingAddressBox({ address, tc }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-xl border px-5 py-4 flex items-start gap-4"
      style={{ borderColor: tc.border, background: tc.muted }}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">📦</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm mb-1" style={{ color: tc.text }}>
          Indirizzo di spedizione
        </p>
        <p className="text-sm text-gray-600 whitespace-pre-line">{address}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
        style={{ borderColor: tc.border, color: tc.text }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copiato!' : 'Copia'}
      </button>
    </div>
  )
}
