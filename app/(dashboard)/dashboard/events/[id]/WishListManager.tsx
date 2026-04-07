'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { formatEuro, calculateProgress, wishItemStatusLabels } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus, Trash2, ExternalLink, GripVertical } from 'lucide-react'
import type { Event, WishItem, WishItemType, WishItemStatus } from '@/lib/types'

interface Props {
  event: Event
  userId: string
}

const STATUS_COLORS: Record<WishItemStatus, string> = {
  available: 'bg-green-100 text-green-700',
  partially_funded: 'bg-amber-100 text-amber-700',
  fully_funded: 'bg-blue-100 text-blue-700',
  purchased: 'bg-gray-100 text-gray-600',
  reserved: 'bg-red-100 text-red-700',
}

export default function WishListManager({ event, userId }: Props) {
  const [items, setItems] = useState<WishItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<WishItem | null>(null)

  // Campi del form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopUrl, setShopUrl] = useState('')
  const [itemType, setItemType] = useState<WishItemType>('single')
  const [suggestedContribution, setSuggestedContribution] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadItems()
    // Aggiornamenti in tempo reale
    const channel = supabase
      .channel('wish_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wish_items', filter: `event_id=eq.${event.id}` }, loadItems)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadItems() {
    const { data } = await supabase
      .from('wish_items')
      .select('*')
      .eq('event_id', event.id)
      .order('sort_order', { ascending: true })
    setItems(data ?? [])
    setLoading(false)
  }

  function openAddDialog() {
    setEditingItem(null)
    resetForm()
    setDialogOpen(true)
  }

  function openEditDialog(item: WishItem) {
    setEditingItem(item)
    setTitle(item.title)
    setDescription(item.description ?? '')
    setPrice(item.price.toString())
    setImageUrl(item.image_url ?? '')
    setShopName(item.shop_name ?? '')
    setShopUrl(item.shop_url ?? '')
    setItemType(item.type)
    setSuggestedContribution(item.suggested_contribution?.toString() ?? '')
    setDialogOpen(true)
  }

  function resetForm() {
    setTitle('')
    setDescription('')
    setPrice('')
    setImageUrl('')
    setShopName('')
    setShopUrl('')
    setItemType('single')
    setSuggestedContribution('')
  }

  async function handleSave() {
    if (!title || !price) { toast.error('Inserisci nome e prezzo'); return }
    setSaving(true)
    try {
      const payload = {
        event_id: event.id,
        title,
        description: description || null,
        price: parseFloat(price),
        image_url: imageUrl || null,
        shop_name: shopName || null,
        shop_url: shopUrl || null,
        type: itemType,
        suggested_contribution: suggestedContribution ? parseFloat(suggestedContribution) : null,
        sort_order: editingItem ? editingItem.sort_order : items.length,
      }
      if (editingItem) {
        const { error } = await supabase.from('wish_items').update(payload).eq('id', editingItem.id)
        if (error) throw error
        toast.success('Prodotto aggiornato!')
      } else {
        const { error } = await supabase.from('wish_items').insert(payload)
        if (error) throw error
        toast.success('Prodotto aggiunto!')
      }
      setDialogOpen(false)
      resetForm()
      await loadItems()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore salvataggio')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm('Eliminare questo prodotto?')) return
    const { error } = await supabase.from('wish_items').delete().eq('id', itemId)
    if (error) { toast.error('Errore eliminazione'); return }
    toast.success('Prodotto eliminato')
    await loadItems()
  }

  async function handleStatusChange(item: WishItem, status: WishItemStatus) {
    const { error } = await supabase.from('wish_items').update({ status }).eq('id', item.id)
    if (error) { toast.error('Errore aggiornamento'); return }
    await loadItems()
  }

  if (loading) return <div className="py-10 text-center text-gray-400">Caricamento...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} prodott{items.length === 1 ? 'o' : 'i'} in lista</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button onClick={openAddDialog} className="bg-purple-700 hover:bg-purple-800 text-white" size="sm" />}>
            <Plus className="w-4 h-4 mr-1" /> Aggiungi prodotto
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifica prodotto' : 'Nuovo prodotto'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-2">
                <Label>Nome prodotto *</Label>
                <Input placeholder="Es. AirPods Pro" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descrizione</Label>
                <Textarea placeholder="Dettagli sul prodotto..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Prezzo (€) *</Label>
                  <Input type="number" min="0" step="0.01" placeholder="249.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo regalo</Label>
                  <Select value={itemType} onValueChange={(v) => setItemType(v as WishItemType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">🎁 Regalo singolo</SelectItem>
                      <SelectItem value="collective">👥 Regalo collettivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {itemType === 'collective' && (
                <div className="space-y-2">
                  <Label>Quota suggerita (€)</Label>
                  <Input type="number" min="5" step="0.01" placeholder="25.00" value={suggestedContribution} onChange={(e) => setSuggestedContribution(e.target.value)} />
                  <p className="text-xs text-gray-400">Importo consigliato per ogni contributo</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Immagine (URL)</Label>
                <Input type="url" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Negozio</Label>
                  <Input placeholder="Amazon" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Link negozio</Label>
                  <Input type="url" placeholder="https://..." value={shopUrl} onChange={(e) => setShopUrl(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Annulla</Button>
                <Button className="flex-1 bg-purple-700 hover:bg-purple-800 text-white" onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvataggio...' : 'Salva'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-3">🎁</div>
            <p className="text-gray-500 mb-4">Nessun prodotto ancora. Aggiungi i tuoi desideri!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const progress = item.type === 'collective' ? calculateProgress(item.collected_amount, item.price) : 0
            return (
              <Card key={item.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0 cursor-grab" />
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-400">
                            {formatEuro(item.price)}
                            {item.shop_name && ` • ${item.shop_name}`}
                            {item.type === 'collective' && ' • 👥 Collettivo'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.shop_url && (
                            <a href={item.shop_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </a>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => openEditDialog(item)}>
                            Modifica
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {item.type === 'collective' && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{formatEuro(item.collected_amount)} raccolti</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.contributors_count} contributor{item.contributors_count !== 1 ? 'i' : 'e'}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${STATUS_COLORS[item.status]}`}>
                          {wishItemStatusLabels[item.status]}
                        </Badge>
                        <Select value={item.status} onValueChange={(v) => handleStatusChange(item, v as WishItemStatus)}>
                          <SelectTrigger className="h-6 text-xs w-auto border-none bg-transparent p-0 focus:ring-0">
                            <span className="text-xs text-gray-400 cursor-pointer hover:text-purple-600">cambia</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponibile</SelectItem>
                            <SelectItem value="partially_funded">Parzialmente finanziato</SelectItem>
                            <SelectItem value="fully_funded">Obiettivo raggiunto</SelectItem>
                            <SelectItem value="purchased">Acquistato</SelectItem>
                            <SelectItem value="reserved">Prenotato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
