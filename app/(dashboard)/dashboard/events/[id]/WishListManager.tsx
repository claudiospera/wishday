'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Plus, Trash2, ExternalLink, GripVertical, Upload } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

interface SortableItemProps {
  item: WishItem
  onEdit: (item: WishItem) => void
  onDelete: (id: string) => void
  onStatusChange: (item: WishItem, status: WishItemStatus) => void
}

function SortableItem({ item, onEdit, onDelete, onStatusChange }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const progress = item.type === 'collective' ? calculateProgress(item.collected_amount, item.price) : 0

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-50' : ''}
    >
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              {...attributes}
              {...listeners}
              className="mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
              aria-label="Trascina per riordinare"
            >
              <GripVertical className="w-4 h-4 text-gray-300 hover:text-gray-500" />
            </button>
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
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onEdit(item)}>
                    Modifica
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => onDelete(item.id)}>
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
                      className="bg-tiffany-500 h-1.5 rounded-full transition-all"
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
                <Select value={item.status} onValueChange={(v) => onStatusChange(item, v as WishItemStatus)}>
                  <SelectTrigger className="h-6 text-xs w-auto border-none bg-transparent p-0 focus:ring-0">
                    <span className="text-xs text-gray-400 cursor-pointer hover:text-tiffany-600">cambia</span>
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
    </div>
  )
}

export default function WishListManager({ event, userId }: Props) {
  const [items, setItems] = useState<WishItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<WishItem | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopUrl, setShopUrl] = useState('')
  const [shopPhone, setShopPhone] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [itemType, setItemType] = useState<WishItemType>('single')
  const [suggestedContribution, setSuggestedContribution] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    loadItems()
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

  async function handleDragEnd(dndEvent: DragEndEvent) {
    const { active, over } = dndEvent
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)

    setItems(reordered)

    // Salva i nuovi sort_order nel DB
    await Promise.all(
      reordered.map((item, index) =>
        supabase.from('wish_items').update({ sort_order: index }).eq('id', item.id)
      )
    )
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
    setShopPhone(item.shop_phone ?? '')
    setShopAddress(item.shop_address ?? '')
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
    setShopPhone('')
    setShopAddress('')
    setItemType('single')
    setSuggestedContribution('')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Immagine troppo grande (max 5MB)'); return }
    setUploadingImage(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `wish-items/${userId}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('wishday').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('wishday').getPublicUrl(path)
      setImageUrl(publicUrl)
      toast.success('Immagine caricata!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Errore upload immagine')
    } finally {
      setUploadingImage(false)
    }
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
        shop_phone: shopPhone || null,
        shop_address: shopAddress || null,
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
          <DialogTrigger render={<Button onClick={openAddDialog} className="bg-tiffany-700 hover:bg-tiffany-800 text-white" size="sm" />}>
            <Plus className="w-4 h-4 mr-1" /> Aggiungi prodotto
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Modifica prodotto' : 'Nuovo prodotto'}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
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
                <Label>Immagine prodotto</Label>
                {imageUrl && (
                  <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center" style={{ minHeight: '8rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Anteprima" className="max-w-full max-h-48 object-contain" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >×</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    {uploadingImage ? 'Caricamento...' : 'Carica foto'}
                  </Button>
                </div>
                <Input type="url" placeholder="Oppure incolla URL https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Telefono negozio</Label>
                  <Input type="tel" placeholder="+39 02 1234567" value={shopPhone} onChange={(e) => setShopPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Indirizzo negozio</Label>
                  <Input placeholder="Via Roma 1, Milano" value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t mt-3">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Annulla</Button>
              <Button className="flex-1 bg-tiffany-700 hover:bg-tiffany-800 text-white" onClick={handleSave} disabled={saving}>
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
