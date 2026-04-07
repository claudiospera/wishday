'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatEuro, calculateProgress } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import ContributeModal from '@/components/ContributeModal'
import ReserveModal from './ReserveModal'
import type { WishItem } from '@/lib/types'

interface Props {
  item: WishItem
  hostPlan: string
  isExpired?: boolean
}

export default function WishItemCard({ item, hostPlan, isExpired = false }: Props) {
  const [showContribute, setShowContribute] = useState(false)
  const [showReserve, setShowReserve] = useState(false)
  const [currentItem, setCurrentItem] = useState(item)

  const progress = currentItem.type === 'collective'
    ? calculateProgress(currentItem.collected_amount, currentItem.price)
    : 0
  const isReserved = currentItem.status === 'reserved' || currentItem.status === 'purchased'
  const isFullyFunded = currentItem.status === 'fully_funded'

  return (
    <>
      <Card className={`overflow-hidden border shadow-sm hover:shadow-md transition-shadow ${isReserved ? 'opacity-70' : ''}`}>
        <CardContent className="p-0">
          <div className="flex gap-4 p-4">
            {/* Immagine prodotto */}
            {currentItem.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.image_url}
                alt={currentItem.title}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🎁</span>
              </div>
            )}

            {/* Dettagli prodotto */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{currentItem.title}</h3>
                  {currentItem.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">{currentItem.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-purple-700">{formatEuro(currentItem.price)}</span>
                    {currentItem.shop_name && (
                      <span className="text-xs text-gray-400">{currentItem.shop_name}</span>
                    )}
                  </div>
                </div>

                {/* Badge stato */}
                {isReserved && (
                  <Badge className="bg-red-100 text-red-600 text-xs flex-shrink-0">
                    Già prenotato
                  </Badge>
                )}
                {isFullyFunded && (
                  <Badge className="bg-green-100 text-green-600 text-xs flex-shrink-0">
                    Obiettivo raggiunto
                  </Badge>
                )}
                {currentItem.type === 'collective' && !isFullyFunded && (
                  <Badge className="bg-purple-100 text-purple-600 text-xs flex-shrink-0">
                    Collettivo
                  </Badge>
                )}
              </div>

              {/* Barra progresso per regali collettivi */}
              {currentItem.type === 'collective' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{formatEuro(currentItem.collected_amount)} raccolti</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${isFullyFunded ? 'bg-green-500' : 'bg-purple-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {currentItem.contributors_count} contributor{currentItem.contributors_count !== 1 ? 'i' : 'e'}
                  </p>
                </div>
              )}

              {/* Azioni */}
              <div className="flex items-center gap-2 mt-3">
                {currentItem.type === 'single' && !isReserved && !isExpired && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs"
                    onClick={() => setShowReserve(true)}
                  >
                    Prenota questo regalo
                  </Button>
                )}
                {currentItem.type === 'collective' && !isFullyFunded && !isExpired && (
                  <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs"
                    onClick={() => setShowContribute(true)}
                  >
                    💝 Contribuisci
                  </Button>
                )}
                {currentItem.shop_url && (
                  <a href={currentItem.shop_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="text-xs text-gray-500">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Vai al negozio
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal contributo */}
      {showContribute && (
        <ContributeModal
          item={currentItem}
          hostPlan={hostPlan}
          onClose={() => setShowContribute(false)}
          onSuccess={(updatedItem) => {
            setCurrentItem(updatedItem)
            setShowContribute(false)
          }}
        />
      )}

      {/* Modal prenotazione */}
      {showReserve && (
        <ReserveModal
          item={currentItem}
          onClose={() => setShowReserve(false)}
          onSuccess={(updatedItem) => {
            setCurrentItem(updatedItem)
            setShowReserve(false)
          }}
        />
      )}
    </>
  )
}
