'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GreetingCardModal from '@/components/GreetingCardModal'

interface Props {
  eventType: string
  eventTitle: string
  senderName: string
  giftName: string
  defaultMessage: string
}

export default function GreetingCardTrigger({ eventType, eventTitle, senderName, giftName, defaultMessage }: Props) {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  function handleClose() {
    setOpen(false)
    // Rimuove i query params dall'URL senza ricaricare la pagina
    router.replace(window.location.pathname, { scroll: false })
  }

  if (!open) return null

  return (
    <GreetingCardModal
      open={open}
      onClose={handleClose}
      eventType={eventType}
      eventTitle={eventTitle}
      senderName={senderName || 'Anonimo'}
      giftName={giftName || undefined}
      defaultMessage={defaultMessage}
    />
  )
}
