'use client'

import { useState, useEffect } from 'react'
import { getDaysUntilEvent } from '@/lib/utils'

interface Props { eventDate: string }

export default function CountdownTimer({ eventDate }: Props) {
  const [days, setDays] = useState(getDaysUntilEvent(eventDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(getDaysUntilEvent(eventDate))
    }, 1000 * 60 * 60) // Aggiorna ogni ora
    return () => clearInterval(timer)
  }, [eventDate])

  if (days === 0) {
    return (
      <div className="bg-gradient-to-r from-tiffany-600 to-amber-500 text-white rounded-xl p-4 text-center shadow-md">
        <p className="text-2xl font-bold">🎉 È oggi!</p>
        <p className="text-tiffany-100 text-sm">Auguri!</p>
      </div>
    )
  }

  if (days < 0) {
    return (
      <div className="bg-gray-100 rounded-xl p-4 text-center">
        <p className="text-gray-500 text-sm">L&apos;evento si è svolto {Math.abs(days)} giorni fa</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-tiffany-50 to-amber-50 border border-tiffany-100 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Mancano</p>
      <p className="text-4xl font-bold text-tiffany-700">{days}</p>
      <p className="text-gray-500 text-sm">giorn{days === 1 ? 'o' : 'i'}</p>
    </div>
  )
}
