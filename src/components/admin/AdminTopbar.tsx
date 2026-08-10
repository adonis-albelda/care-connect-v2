'use client'

import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth-context'
import AdminUserMenu from '@/components/admin/AdminUserMenu'

export default function AdminTopbar() {
  const router = useRouter()
  const { user, signOut } = useAdminAuth()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/admin/login')
  }

  return (
    <header className="flex h-16 flex-none items-center justify-end gap-4 border-b border-border bg-white px-6">
      {user && <AdminUserMenu user={user} onSignOut={handleSignOut} />}
    </header>
  )
}
