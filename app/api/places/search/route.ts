import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { query, city, category } = await request.json()

  if (!query?.trim() && !city?.trim()) {
    return NextResponse.json({ error: 'Inserisci almeno un termine di ricerca' }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key Google non configurata' }, { status: 500 })
  }

  const parts = [query?.trim(), category?.trim(), city?.trim()].filter(Boolean)
  const textQuery = parts.join(' ')

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri',
    },
    body: JSON.stringify({ textQuery, languageCode: 'it', maxResultCount: 10 }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json(
      { error: (err as { error?: { message?: string } }).error?.message ?? 'Errore Google Places API' },
      { status: res.status }
    )
  }

  const data = (await res.json()) as {
    places?: {
      displayName?: { text: string }
      formattedAddress?: string
      nationalPhoneNumber?: string
      internationalPhoneNumber?: string
      websiteUri?: string
    }[]
  }

  const results = (data.places ?? []).map((place) => ({
    name: place.displayName?.text ?? '',
    address: place.formattedAddress ?? '',
    phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
  }))

  return NextResponse.json({ results })
}
