'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface Props {
  iban: string
  bankOwnerName: string | null
}

export default function IbanSection({ iban, bankOwnerName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Genera QR code SEPA per il bonifico
  useEffect(() => {
    if (!canvasRef.current) return
    // Formato EPC069-12 per bonifico SEPA
    const qrData = [
      'BCD',        // Service Tag
      '002',        // Version
      '1',          // Encoding (UTF-8)
      'SCT',        // Identification (SEPA Credit Transfer)
      '',           // BIC (opzionale)
      bankOwnerName ?? '',
      iban.replace(/\s/g, ''),
      '',           // Amount (vuoto = libero)
      '',           // Purpose (opzionale)
      '',           // Remittance Info strutturato
      '',           // Remittance Info non strutturato
    ].join('\n')

    QRCode.toCanvas(canvasRef.current, qrData, {
      width: 160,
      margin: 1,
      color: { dark: '#0abab5', light: '#ffffff' },
    })
  }, [iban, bankOwnerName])

  function copyIban() {
    navigator.clipboard.writeText(iban.replace(/\s/g, ''))
    toast.success('IBAN copiato!')
  }

  // Formatta IBAN con spazi ogni 4 caratteri
  const formattedIban = iban.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()

  return (
    <section>
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        🏦 Bonifico bancario
      </h2>
      <Card className="border-tiffany-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* QR Code */}
            <div className="flex-shrink-0 text-center">
              <canvas ref={canvasRef} className="rounded-lg mx-auto" />
              <p className="text-xs text-gray-400 mt-1">Scansiona con la tua app bancaria</p>
            </div>

            {/* Dati bonifico */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Intestatario</p>
                <p className="font-semibold">{bankOwnerName ?? 'Non specificato'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">IBAN</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm bg-gray-50 px-3 py-1.5 rounded border">
                    {formattedIban}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyIban}>
                    Copia
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Il bonifico diretto non prevede commissioni di piattaforma.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
