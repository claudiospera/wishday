'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }
}

export async function resetPasswordAction(email: string) {
  await verifyAdmin()
  const admin = createAdminClient()
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://www.wishday.it/auth/callback',
  })
  if (error) throw new Error(error.message)
}

export async function confirmAccountAction(userId: string) {
  await verifyAdmin()
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin')
}

export async function deleteUserAction(userId: string) {
  await verifyAdmin()
  const admin = createAdminClient()
  await admin.from('users').delete().eq('id', userId)
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin')
}
