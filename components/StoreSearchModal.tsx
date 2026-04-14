'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Phone, Globe } from 'lucide-react'

export interface StoreResult {
  name: string
  address: string
  phone: string | null
  website: string | null
}

const CATEGORIES = [
  { value: 'all', label: 'Tutte le categorie' },
  { value: 'elettronica', label: 'Elettronica' },
  { value: 'sport', label: 'Sport' },
  { value: 'abbigliamento moda', label: 'Abbigliamento' },
  { value: 'libri musica', label: 'Libri e musica' },
  { value: 'casa arredamento', label: 'Casa e arredamento' },
  { value: 'supermercato alimentari', label: 'Alimentari' },
  { value: 'profumeria benessere', label: 'Profumeria e benessere' },
  { value: 'gioielleria orologeria', label: 'Gioielleria' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'giocattoli', label: 'Giocattoli' },
  { value: 'bricolage ferramenta', label: 'Bricolage' },
  { value: 'auto moto', label: 'Auto e moto' },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (store: StoreResult) => void
  /** Label del pulsante di selezione: "Seleziona" per l'organizzatore, "Apri" per gli ospiti */
  selectLabel?: string
  /** Query pre-compilata (es. titolo del prodotto) */
  initialQuery?: string
}

export default function StoreSearchModal({
  open,
  onClose,
  onSelect,
  selectLabel = 'Seleziona',
  initialQuery = '',
}: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('all')
  const [results, setResults] = useState<StoreResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    const q = query.trim()
    const c = city.trim()
    if (!q && !c) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          city: c,
          category: category === 'all' ? '' : category,
        }),
      })
      const data = (await res.json()) as { results?: StoreResult[]; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Errore ricerca')
      setResults(data.results ?? [])
      setSearched(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di rete')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cerca negozio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo ricerca */}
          <div className="space-y-1">
            <Label>Nome negozio o prodotto</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Es. Apple Store, Decathlon, Zara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                autoFocus
              />
              <Button
                onClick={handleSearch}
                disabled={loading || (!query.trim() && !city.trim())}
                size="sm"
                className="bg-tiffany-700 hover:bg-tiffany-800 text-white px-3"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filtri */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Città / Provincia</Label>
              <Input
                placeholder="Es. Milano, Roma..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Risultati */}
          <div className="max-h-64 overflow-y-auto space-y-2 -mx-1 px-1">
            {loading && (
              <p className="text-center text-sm text-gray-400 py-8">Ricerca in corso...</p>
            )}
            {error && (
              <p className="text-center text-sm text-red-500 py-4">{error}</p>
            )}
            {!loading && searched && results.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">
                Nessun negozio trovato. Prova con termini diversi o cambia città.
              </p>
            )}
            {!loading && results.map((store, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 p-3 hover:border-tiffany-300 hover:bg-tiffany-50/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-medium text-sm text-gray-900 truncate">{store.name}</p>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 line-clamp-2">{store.address}</p>
                    </div>
                    {store.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <p className="text-xs text-gray-500">{store.phone}</p>
                      </div>
                    )}
                    {store.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-tiffany-600 truncate max-w-[180px] block">
                          {store.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex-shrink-0 border-tiffany-300 text-tiffany-700 hover:bg-tiffany-50"
                    onClick={() => onSelect(store)}
                  >
                    {selectLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {!searched && !loading && (
            <p className="text-center text-xs text-gray-400">
              Powered by Google Places · dati aggiornati in tempo reale
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
