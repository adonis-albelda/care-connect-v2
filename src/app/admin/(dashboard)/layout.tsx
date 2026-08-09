'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth-context'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import PageTransition from '@/components/admin/PageTransition'

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAdminAuth()

  const isAdmin = user?.profile?.isAdmin === true

  useEffect(() => {
    if (!loading && !isAdmin) router.replace('/admin/login')
  }, [loading, isAdmin, router])

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-body-lg text-slate">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
