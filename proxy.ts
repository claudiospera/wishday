// Proxy Next.js per protezione route e aggiornamento sessione Supabase
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Modalità manutenzione (MAINTENANCE_MODE è server-only, non viene caricata in locale)
  if (process.env.MAINTENANCE_MODE === 'true') {
    if (pathname !== '/manutenzione') {
      return NextResponse.redirect(new URL('/manutenzione', request.url))
    }
    return NextResponse.next()
  }

  // Se manutenzione disattiva ma si visita /manutenzione, redirect alla home
  if (pathname === '/manutenzione') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Recupera la sessione utente
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Se Supabase non è raggiungibile, tratta come non autenticato
  }

  // Route protette: richiedono autenticazione
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Route auth: redirect se già loggato
  const authPaths = ['/login', '/register']
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
