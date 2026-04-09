import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { Message } from '@/lib/types'

interface Props { messages: Message[] }

export default function MessagesDisplay({ messages }: Props) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        💬 Auguri ricevuti
      </h2>
      <div className="space-y-3">
        {messages.map((msg) => (
          <Card key={msg.id} className="border-tiffany-50 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tiffany-200 to-amber-200 flex items-center justify-center text-sm font-bold text-tiffany-700 flex-shrink-0">
                  {msg.sender_name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.sender_name}</span>
                    <span className="text-xs text-gray-400">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
