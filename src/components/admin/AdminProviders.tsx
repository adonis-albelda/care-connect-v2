'use client'

import type { ReactNode } from 'react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { convex } from '@/lib/convex-client'
import { AdminAuthProvider } from '@/lib/admin-auth-context'

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </ConvexAuthProvider>
  )
}
