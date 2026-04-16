'use client'

import { useState } from 'react'
import type { Event } from '@/lib/types'
import WishListManager from './WishListManager'
import ContributionsView from './ContributionsView'
import MessagesView from './MessagesView'
import SharePanel from './SharePanel'
import InviteEditor from './InviteEditor'
import EventForm from '../EventForm'
import EventDetailsCard from '../EventDetailsCard'

const TABS = [
  { value: 'wishlist',      label: 'Lista',   emoji: '🎁', bg: '#fef3c7', color: '#92400e', activeBg: '#fde68a', activeShadow: 'rgba(217,119,6,0.25)' },
  { value: 'invite',        label: 'Invito',  emoji: '🎨', bg: '#fce7f3', color: '#9d174d', activeBg: '#f9a8d4', activeShadow: 'rgba(236,72,153,0.25)' },
  { value: 'contributions', label: 'Fondi',   emoji: '💰', bg: '#dcfce7', color: '#166534', activeBg: '#86efac', activeShadow: 'rgba(22,163,74,0.25)' },
  { value: 'messages',      label: 'Auguri',  emoji: '💬', bg: '#dbeafe', color: '#1e40af', activeBg: '#93c5fd', activeShadow: 'rgba(59,130,246,0.25)' },
  { value: 'settings',      label: 'Config',  emoji: '⚙️', bg: '#ede9fe', color: '#5b21b6', activeBg: '#c4b5fd', activeShadow: 'rgba(124,58,237,0.25)' },
]

interface Props {
  event: Event
  userId: string
  userPlan?: string | null
}

export default function EventTabs({ event, userId, userPlan }: Props) {
  const [active, setActive] = useState('wishlist')

  return (
    <div>
      {/* Tab bar pastello */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => {
          const isActive = active === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActive(tab.value)}
              className="transition-all active:scale-95"
              style={{
                background: isActive ? tab.activeBg : tab.bg,
                color: tab.color,
                fontWeight: isActive ? 700 : 600,
                fontSize: 13,
                padding: '9px 16px',
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                boxShadow: isActive
                  ? `0 4px 12px ${tab.activeShadow}, 0 1px 3px rgba(0,0,0,0.08)`
                  : '0 1px 3px rgba(0,0,0,0.06)',
                transform: isActive ? 'translateY(-1px)' : 'none',
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          )
        })}
      </div>

      {/* Contenuto tab */}
      <div className="mt-6">
        {active === 'wishlist' && <WishListManager event={event} userId={userId} />}
        {active === 'invite' && (
          <div className="space-y-6">
            <EventDetailsCard event={event} />
            <InviteEditor event={event} userId={userId} />
          </div>
        )}
        {active === 'contributions' && <ContributionsView eventId={event.id} userId={userId} />}
        {active === 'messages' && <MessagesView eventId={event.id} />}
        {active === 'settings' && (
          <div className="space-y-6">
            <EventForm userId={userId} userPlan={userPlan ?? undefined} event={event} hideDetails />
            <SharePanel event={event} />
          </div>
        )}
      </div>
    </div>
  )
}
