export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from './DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Recupera profilo utente
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Wishday" width={32} height={32} className="rounded" />
              <span className="font-bold text-lg text-tiffany-700">Wishday</span>
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-tiffany-700 transition-colors font-medium">
              Home
            </Link>
          </div>
          <DashboardNav user={user} profile={profile} />
        </div>
      </header>

      {/* Contenuto principale */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
