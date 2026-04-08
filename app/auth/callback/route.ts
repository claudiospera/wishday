// Callback OAuth Supabase — gestisce redirect dopo Google login e conferma email
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  const supabase = await createClient()

  // Flusso conferma email (token_hash + type)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
    return NextResponse.redirect(`${origin}/login?error=link_expired`)
  }

  // Flusso OAuth / PKCE (code)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
