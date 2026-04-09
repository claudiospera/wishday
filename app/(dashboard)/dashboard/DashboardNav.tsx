'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User as UserProfile } from '@/lib/types'

interface Props {
  user: User
  profile: UserProfile | null
}

export default function DashboardNav({ user, profile }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Disconnesso')
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="cursor-pointer ring-2 ring-tiffany-200 hover:ring-tiffany-400 transition-all">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback className="bg-tiffany-100 text-tiffany-700 font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-3 py-2">
          <p className="font-medium text-sm truncate">{profile?.full_name ?? 'Utente'}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          I miei eventi
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          Impostazioni
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/billing" />}>
          Abbonamento
        </DropdownMenuItem>
        {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/admin" />}>
              🛡️ Admin
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 focus:text-red-600 cursor-pointer"
        >
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
